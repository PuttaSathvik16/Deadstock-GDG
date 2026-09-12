import { NextRequest, NextResponse } from 'next/server';
import { getLab, getOrCreateDefaultLab, query } from '@/lib/db';
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
    keyPrefix: 'api_labs',
  });

  if (!limitResult.success) {
    return rateLimitResponse(limitResult);
  }

  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get('id') || PRIMARY_ATELIER_WORKSPACE.id;

    let lab = await getLab(labId);
    if (!lab) {
      lab = await getOrCreateDefaultLab();
    }

    return applyRateLimitHeaders(NextResponse.json({ lab }), limitResult);
  } catch (error: any) {
    console.error('API /labs GET error:', error);
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
    keyPrefix: 'api_labs',
  });

  if (!limitResult.success) {
    return rateLimitResponse(limitResult);
  }

  try {
    const body = await req.json();
    const lab = body.lab;

    if (!lab || !lab.id) {
      return applyRateLimitHeaders(
        NextResponse.json({ error: 'Invalid lab data' }, { status: 400 }),
        limitResult
      );
    }

    await query(`
      INSERT INTO labs (id, name, brief, audience, occasion, target_looks, created_at, owner_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        brief = EXCLUDED.brief,
        audience = EXCLUDED.audience,
        occasion = EXCLUDED.occasion,
        target_looks = EXCLUDED.target_looks,
        status = EXCLUDED.status;
    `, [
      lab.id,
      lab.name,
      lab.brief,
      lab.audience || '',
      lab.occasion || '',
      lab.target_looks || 3,
      lab.owner_id || 'designer-sathvik',
      lab.status || 'active_studio',
    ]);

    const saved = await getLab(lab.id);
    return applyRateLimitHeaders(
      NextResponse.json({ success: true, lab: saved || lab }),
      limitResult
    );
  } catch (error: any) {
    console.error('API /labs POST error:', error);
    return applyRateLimitHeaders(
      NextResponse.json({ error: error.message }, { status: 500 }),
      limitResult
    );
  }
}
