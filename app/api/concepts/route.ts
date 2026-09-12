import { NextRequest, NextResponse } from 'next/server';
import { query, saveConcepts } from '@/lib/db';
import { Concept } from '@/types';
import { PRIMARY_ATELIER_WORKSPACE } from '@/lib/atelier-inventory';
import {
  checkRateLimit,
  rateLimitResponse,
  applyRateLimitHeaders,
} from '@/lib/rate-limiter';

export async function GET(req: NextRequest) {
  const limitResult = checkRateLimit(req, {
    limit: 60,
    windowMs: 60000,
    keyPrefix: 'api_concepts',
  });

  if (!limitResult.success) {
    return rateLimitResponse(limitResult);
  }

  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get('labId') || PRIMARY_ATELIER_WORKSPACE.id;

    const rows = await query<any>(
      'SELECT * FROM concepts WHERE lab_id = $1 ORDER BY look_number ASC;',
      [labId]
    );

    const concepts: Concept[] = rows.map((r) => ({
      id: r.id,
      lab_id: r.lab_id,
      look_number: r.look_number,
      title: r.title,
      silhouette: r.silhouette,
      description: r.description,
      visual_uri: r.visual_uri,
      uses: typeof r.uses === 'string' ? JSON.parse(r.uses) : r.uses,
      material_map: typeof r.material_map === 'string' ? JSON.parse(r.material_map) : r.material_map,
      feasibility: r.feasibility,
      warnings: typeof r.warnings === 'string' ? JSON.parse(r.warnings) : r.warnings,
      version: r.version,
      affected: Boolean(r.affected),
      change_reason: r.change_reason,
      approved: Boolean(r.approved),
    }));

    return applyRateLimitHeaders(NextResponse.json({ concepts }), limitResult);
  } catch (error: any) {
    console.error('API /concepts GET error:', error);
    return applyRateLimitHeaders(
      NextResponse.json({ error: error.message }, { status: 500 }),
      limitResult
    );
  }
}

export async function POST(req: NextRequest) {
  const limitResult = checkRateLimit(req, {
    limit: 60,
    windowMs: 60000,
    keyPrefix: 'api_concepts',
  });

  if (!limitResult.success) {
    return rateLimitResponse(limitResult);
  }

  try {
    const body = await req.json();
    const concepts: Concept[] = body.concepts;
    const labId = body.labId || PRIMARY_ATELIER_WORKSPACE.id;

    if (!Array.isArray(concepts)) {
      return applyRateLimitHeaders(
        NextResponse.json({ error: 'Expected concepts array' }, { status: 400 }),
        limitResult
      );
    }

    const saved = await saveConcepts(concepts, labId);
    return applyRateLimitHeaders(
      NextResponse.json({ success: true, concepts: saved }),
      limitResult
    );
  } catch (error: any) {
    console.error('API /concepts POST error:', error);
    return applyRateLimitHeaders(
      NextResponse.json({ error: error.message }, { status: 500 }),
      limitResult
    );
  }
}
