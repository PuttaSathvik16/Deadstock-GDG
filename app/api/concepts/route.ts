import { NextRequest, NextResponse } from 'next/server';
import { query, saveConcepts } from '@/lib/db';
import { Concept } from '@/types';
import { PRIMARY_ATELIER_WORKSPACE } from '@/lib/atelier-inventory';

export async function GET(req: NextRequest) {
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

    return NextResponse.json({ concepts });
  } catch (error: any) {
    console.error('API /concepts GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const concepts: Concept[] = body.concepts;
    const labId = body.labId || PRIMARY_ATELIER_WORKSPACE.id;

    if (!Array.isArray(concepts)) {
      return NextResponse.json({ error: 'Expected concepts array' }, { status: 400 });
    }

    const saved = await saveConcepts(concepts, labId);
    return NextResponse.json({ success: true, concepts: saved });
  } catch (error: any) {
    console.error('API /concepts POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
