import { Material, Constraint, Concept, GarmentZoneMap } from '@/types';

export interface ValidationResult {
  isValid: boolean;
  violations: {
    lookId: string;
    lookTitle: string;
    severity: 'critical' | 'warning';
    reason: string;
    affectedZones: string[];
    missingMaterialIds: string[];
  }[];
  materialUtilizationPct: number;
  approvedCount: number;
  usedApprovedCount: number;
  unapprovedUsedCount: number;
}

/**
 * Validates a set of concepts against the active constraints and approved materials.
 * Deterministic rule engine running independently of AI.
 */
export function validateCollectionConstraints(
  materials: Material[],
  constraints: Constraint[],
  concepts: Concept[]
): { validatedConcepts: Concept[]; result: ValidationResult } {
  const approvedMaterialMap = new Map<string, Material>();
  const allMaterialMap = new Map<string, Material>();
  
  materials.forEach((m) => {
    allMaterialMap.set(m.id, m);
    if (m.approved) {
      approvedMaterialMap.set(m.id, m);
    }
  });

  const activeHardConstraints = constraints.filter((c) => c.active && c.type === 'HARD');
  const pieceLimitConstraint = activeHardConstraints.find((c) => c.id.includes('piece-count'));
  const maxPieceLimit = pieceLimitConstraint ? 4 : 8;

  const violations: ValidationResult['violations'] = [];
  const usedApprovedIds = new Set<string>();
  const unapprovedUsedIds = new Set<string>();

  const validatedConcepts = concepts.map((concept) => {
    const conceptWarnings: string[] = [];
    const missingMaterialIds: string[] = [];
    const affectedZones: string[] = [];

    // Check 1: Enforce Approved Inventory Only (Hard rule)
    concept.uses.forEach((matId) => {
      if (approvedMaterialMap.has(matId)) {
        usedApprovedIds.add(matId);
      } else {
        missingMaterialIds.push(matId);
        unapprovedUsedIds.add(matId);
        const mat = allMaterialMap.get(matId);
        const label = mat ? mat.label : matId;
        conceptWarnings.push(`Unapproved material dependency: ${label} (${matId})`);
      }
    });

    // Check 2: Garment Zone mapping consistency
    concept.material_map.forEach((zoneMap) => {
      if (!approvedMaterialMap.has(zoneMap.material_id)) {
        affectedZones.push(zoneMap.zone);
      }
    });

    // Check 3: Piece count / complexity constraint
    if (concept.uses.length > maxPieceLimit) {
      conceptWarnings.push(`Exceeds maximum piece complexity limit (${maxPieceLimit} pieces max).`);
    }

    const isInvalid = missingMaterialIds.length > 0;
    const hasWarnings = conceptWarnings.length > 0;

    let feasibility: Concept['feasibility'] = 'feasible';
    let changeReason: string | undefined = undefined;

    if (isInvalid) {
      feasibility = 'invalid';
      const missingLabels = missingMaterialIds.map(
        (id) => allMaterialMap.get(id)?.label || id
      );
      changeReason = `${missingLabels.join(', ')} was removed or unapproved; ${affectedZones.length > 0 ? affectedZones.join(' & ') + ' depended on it.' : 'look requires this stock.'}`;
      
      violations.push({
        lookId: concept.id,
        lookTitle: concept.title,
        severity: 'critical',
        reason: changeReason,
        affectedZones,
        missingMaterialIds,
      });
    } else if (hasWarnings) {
      feasibility = 'warning';
    }

    return {
      ...concept,
      affected: isInvalid,
      feasibility,
      warnings: conceptWarnings,
      change_reason: changeReason,
    };
  });

  const totalApproved = approvedMaterialMap.size;
  const utilizationPct =
    totalApproved > 0
      ? Math.round((usedApprovedIds.size / totalApproved) * 100)
      : 0;

  const result: ValidationResult = {
    isValid: violations.length === 0,
    violations,
    materialUtilizationPct: Math.min(100, utilizationPct),
    approvedCount: totalApproved,
    usedApprovedCount: usedApprovedIds.size,
    unapprovedUsedCount: unapprovedUsedIds.size,
  };

  return { validatedConcepts, result };
}

/**
 * Propagates a material removal or toggle event across the design collection.
 * Identifies which concepts need regeneration and what zones are impacted.
 */
export function propagateMaterialMutation(
  materialId: string,
  newApprovedState: boolean,
  materials: Material[],
  constraints: Constraint[],
  concepts: Concept[]
): {
  updatedMaterials: Material[];
  updatedConcepts: Concept[];
  affectedConcepts: Concept[];
  causalSummary: string;
} {
  const targetMat = materials.find((m) => m.id === materialId);
  const updatedMaterials = materials.map((m) =>
    m.id === materialId ? { ...m, approved: newApprovedState } : m
  );

  const { validatedConcepts } = validateCollectionConstraints(
    updatedMaterials,
    constraints,
    concepts
  );

  const affectedConcepts = validatedConcepts.filter((c) => c.affected);

  let causalSummary = '';
  if (!newApprovedState && targetMat) {
    if (affectedConcepts.length > 0) {
      const titles = affectedConcepts.map((c) => c.title).join(', ');
      causalSummary = `Removed ${targetMat.label} (${targetMat.id}). Causal conflict detected in: ${titles}. Requires zone regeneration.`;
    } else {
      causalSummary = `Removed ${targetMat.label} (${targetMat.id}). No active looks depended on this material.`;
    }
  } else if (targetMat) {
    causalSummary = `Restored ${targetMat.label} (${targetMat.id}) to approved inventory.`;
  }

  return {
    updatedMaterials,
    updatedConcepts: validatedConcepts,
    affectedConcepts,
    causalSummary,
  };
}

/**
 * Identifies candidate approved materials that can substitute for a removed material
 * based on category, weight, or form factor similarity.
 */
export function findCandidateSubstitutes(
  removedMaterialId: string,
  materials: Material[]
): Material[] {
  const removedMat = materials.find((m) => m.id === removedMaterialId);
  if (!removedMat) return [];

  return materials.filter(
    (m) =>
      m.approved &&
      m.id !== removedMaterialId &&
      (m.category === removedMat.category ||
        m.form === removedMat.form ||
        m.visual.texture_cues === removedMat.visual.texture_cues)
  );
}

/**
 * Generates default system constraints based on the lab brief and materials.
 */
export function generateDefaultConstraints(
  brief: string,
  targetLooks: number = 3
): Constraint[] {
  return [
    {
      id: 'hard-inventory-lock',
      type: 'HARD',
      source: 'system_default',
      title: 'Approved Inventory Only',
      rule: 'Concepts cannot reference unapproved or external materials',
      description: 'Strict circularity barrier: zero virgin or external fabric may be hallucinated or added.',
      severity: 'critical',
      active: true,
    },
    {
      id: 'hard-no-new-fabric',
      type: 'HARD',
      source: 'brief',
      title: 'Zero Virgin Yardage',
      rule: 'All yardage must trace 100% to visible deadstock remnant rolls',
      description: 'Mandated by circular upcycling parameters.',
      severity: 'critical',
      active: true,
    },
    {
      id: 'hard-piece-count',
      type: 'HARD',
      source: 'inventory_limit',
      title: 'Remnant Piece Budget',
      rule: `Maximum 4 distinct material patches per look`,
      description: 'Guarantees structural seam balance without fragmenting remnants.',
      severity: 'warning',
      active: true,
    },
    {
      id: 'soft-color-harmony',
      type: 'SOFT',
      source: 'user',
      title: 'Tonal Cohesion',
      rule: 'Pair dark twills with warm secondary accent trims',
      description: 'Maintains cohesive collection editorial aesthetics.',
      severity: 'info',
      active: true,
    },
    {
      id: 'soft-accent-trim',
      type: 'SOFT',
      source: 'inventory_limit',
      title: 'Salvage Accent Trims',
      rule: 'Prioritize smaller scrap trims (ribbed knit, brass zips) for closures',
      description: 'Maximizes total scrap bin utilization toward 90%+.',
      severity: 'info',
      active: true,
    },
  ];
}
