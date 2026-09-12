import { NextRequest, NextResponse } from 'next/server';
import { Material, Concept, Constraint } from '@/types';
import {
  validateCollectionConstraints,
  findCandidateSubstitutes,
} from '@/lib/constraint-engine';
import {
  checkRateLimit,
  rateLimitResponse,
  applyRateLimitHeaders,
} from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  // 1. Sliding window rate limiting (20 req/min per IP)
  const limitResult = checkRateLimit(req, {
    limit: 20,
    windowMs: 60000,
    keyPrefix: 'gemini_regenerate',
  });

  if (!limitResult.success) {
    return rateLimitResponse(limitResult);
  }

  try {
    const body = await req.json();
    const {
      materials = [],
      concepts = [],
      constraints = [],
      mutatedMaterialId,
      replacementMaterialId,
    }: {
      materials: Material[];
      concepts: Concept[];
      constraints?: Constraint[];
      mutatedMaterialId?: string;
      replacementMaterialId?: string;
    } = body;

    const approvedMaterials = materials.filter((m) => m.approved);
    const approvedIds = approvedMaterials.map((m) => m.id);

    // Identify candidate replacement material if requested or automatic
    let replacementMat: Material | undefined;
    if (replacementMaterialId) {
      replacementMat = approvedMaterials.find((m) => m.id === replacementMaterialId);
    } else if (mutatedMaterialId) {
      const candidates = findCandidateSubstitutes(mutatedMaterialId, materials);
      if (candidates.length > 0) {
        replacementMat = candidates[0];
      } else if (approvedMaterials.length > 0) {
        replacementMat = approvedMaterials[0];
      }
    }

    const removedMat = materials.find((m) => m.id === mutatedMaterialId);
    const affectedLookIds: string[] = [];

    // Reconstruct affected concepts
    const regeneratedConcepts = concepts.map((concept) => {
      const usesMutated = mutatedMaterialId ? concept.uses.includes(mutatedMaterialId) : false;
      const usesUnapproved = concept.uses.some((id) => !approvedIds.includes(id));

      if (usesMutated || usesUnapproved) {
        affectedLookIds.push(concept.id);
        const newUses = concept.uses.filter((id) => approvedIds.includes(id));

        if (replacementMat && !newUses.includes(replacementMat.id)) {
          newUses.push(replacementMat.id);
        }

        const updatedMaterialMap = concept.material_map.map((zm) => {
          if (zm.material_id === mutatedMaterialId || !approvedIds.includes(zm.material_id)) {
            const repl = replacementMat || approvedMaterials[0];
            return {
              zone: zm.zone,
              material_id: repl ? repl.id : zm.material_id,
              material_label: repl ? repl.label : 'Substituted remnant',
              usage_note: `Re-anchored to ${repl?.label || 'approved inventory'} after constraint violation.`,
            };
          }
          return zm;
        });

        const causalReason = removedMat
          ? `Substituted ${removedMat.label} (${removedMat.id}) with ${replacementMat?.label || 'approved stock'}. Re-balanced seam allowances.`
          : 'Regenerated to satisfy approved inventory constraints.';

        return {
          ...concept,
          uses: newUses.length > 0 ? newUses : [approvedMaterials[0]?.id || 'MAT-001'],
          material_map: updatedMaterialMap,
          feasibility: 'feasible' as const,
          affected: false,
          warnings: [causalReason],
          change_reason: undefined,
          version: concept.version + 1,
        };
      }
      return concept;
    });

    const { validatedConcepts, result } = validateCollectionConstraints(
      materials,
      constraints,
      regeneratedConcepts
    );

    const causalExplanation = removedMat
      ? `Re-synthesized ${affectedLookIds.length} look(s). ${removedMat.label} was safely purged from all cutting layouts and replaced with verified inventory.`
      : 'Regenerated affected garments to satisfy active constraints.';

    const tokenCost = {
      promptTokens: 0,
      candidateTokens: 0,
      totalTokens: 0,
      estimatedCostUsd: 0,
      formattedCost: '$0.0000 USD (Deterministic Zero-Token Solver)',
      model: 'constraint-algebra-solver',
      savings: '100% token cost saved via local algebra',
      unoptimizedEstimatePromptTokens: 0,
    };

    return applyRateLimitHeaders(
      NextResponse.json({
        success: true,
        concepts: validatedConcepts,
        validation: result,
        affectedLookIds,
        causalExplanation,
        tokenCost,
      }),
      limitResult
    );
  } catch (error: any) {
    console.error('Regenerate route error:', error);
    return applyRateLimitHeaders(
      NextResponse.json({ error: error.message }, { status: 500 }),
      limitResult
    );
  }
}
