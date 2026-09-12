import { NextRequest, NextResponse } from 'next/server';
import { query, insertDecision } from '@/lib/db';
import { Decision } from '@/types';
import { PRIMARY_ATELIER_WORKSPACE } from '@/lib/atelier-inventory';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get('labId') || PRIMARY_ATELIER_WORKSPACE.id;

    const rows = await query<any>(
      'SELECT * FROM decisions WHERE lab_id = $1 ORDER BY created_at ASC;',
      [labId]
    );

    const decisions: Decision[] = rows.map((r) => ({
      id: r.id,
      lab_id: r.lab_id,
      speaker_id: r.speaker_id,
      speaker_name: r.speaker_name,
      speaker_role: r.speaker_role,
      speaker_avatar: r.speaker_avatar,
      timestamp: r.timestamp,
      event_type: r.event_type,
      payload: typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload,
      resulting_changes: r.resulting_changes,
    }));

    return NextResponse.json({ decisions });
  } catch (error: any) {
    console.error('API /decisions GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const decision: Decision = body.decision;
    const labId = body.labId || PRIMARY_ATELIER_WORKSPACE.id;

    if (!decision || !decision.id || !decision.speaker_name) {
      return NextResponse.json({ error: 'Invalid decision payload' }, { status: 400 });
    }

    const saved = await insertDecision(decision, labId);
    return NextResponse.json({ success: true, decision: saved });
  } catch (error: any) {
    console.error('API /decisions POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
