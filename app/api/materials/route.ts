import { NextRequest, NextResponse } from 'next/server';
import { query, upsertMaterial, updateMaterial, getOrCreateDefaultLab } from '@/lib/db';
import { Material } from '@/types';
import { PRIMARY_ATELIER_WORKSPACE } from '@/lib/atelier-inventory';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const labId = searchParams.get('labId') || PRIMARY_ATELIER_WORKSPACE.id;

    const rows = await query<any>(
      'SELECT * FROM materials WHERE lab_id = $1 ORDER BY id ASC;',
      [labId]
    );

    const materials: Material[] = rows.map((r) => ({
      id: r.id,
      lab_id: r.lab_id,
      label: r.label,
      category: r.category,
      form: r.form,
      visual: typeof r.visual === 'string' ? JSON.parse(r.visual) : r.visual,
      estimate: typeof r.estimate === 'string' ? JSON.parse(r.estimate) : r.estimate,
      properties: typeof r.properties === 'string' ? JSON.parse(r.properties) : r.properties,
      provenance: typeof r.provenance === 'string' ? JSON.parse(r.provenance) : r.provenance,
      confidence: parseFloat(r.confidence),
      verification: r.verification,
      approved: Boolean(r.approved),
      locked: Boolean(r.locked),
    }));

    return NextResponse.json({ materials });
  } catch (error: any) {
    console.error('API /materials GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const material: Material = body.material;
    const labId = body.labId || PRIMARY_ATELIER_WORKSPACE.id;

    if (!material || !material.id || !material.label) {
      return NextResponse.json({ error: 'Invalid material data' }, { status: 400 });
    }

    const saved = await upsertMaterial(material, labId);
    return NextResponse.json({ success: true, material: saved });
  } catch (error: any) {
    console.error('API /materials POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });
    }

    await updateMaterial(id, updates);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('API /materials PATCH error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
