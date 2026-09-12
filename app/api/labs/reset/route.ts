import { NextRequest, NextResponse } from 'next/server';
import { resetAtelierLedger } from '@/lib/db';
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

    const resetLab = await resetAtelierLedger(labId);
    return NextResponse.json({
      success: true,
      message: 'Supabase atelier ledger reset to authentic baseline state.',
      lab: resetLab,
    });
  } catch (error: any) {
    console.error('API /labs/reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
