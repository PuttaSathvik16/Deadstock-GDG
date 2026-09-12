import { NextRequest, NextResponse } from 'next/server';
import { purgeSatinDisruption } from '@/lib/db';
import { PRIMARY_ATELIER_WORKSPACE } from '@/lib/atelier-inventory';

export async function POST(req: NextRequest) {
  try {
    let labId = PRIMARY_ATELIER_WORKSPACE.id;
    try {
      const body = await req.json();
      if (body?.labId) labId = body.labId;
    } catch (e) {
      // Body is optional
    }

    const updatedLab = await purgeSatinDisruption(labId);
    return NextResponse.json({
      success: true,
      message: 'Silk Duchesse Satin quarantined in Supabase. Causal re-generation flagged.',
      lab: updatedLab,
    });
  } catch (error: any) {
    console.error('API /materials/purge-satin error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
