import { NextRequest, NextResponse } from 'next/server';
import { Material, Concept, Constraint } from '@/types';
import { validateCollectionConstraints, generateDefaultConstraints } from '@/lib/constraint-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      materials = [],
      brief = '3 directional looks, unisex utility, zero new fabric',
      target_looks = 3,
      constraints = [],
      apiKey: clientKey,
    }: {
      materials: Material[];
      brief: string;
      target_looks: number;
      constraints?: Constraint[];
      apiKey?: string;
    } = body;

    const approvedMaterials = materials.filter((m) => m.approved);
    const approvedIds = approvedMaterials.map((m) => m.id);

    if (approvedMaterials.length === 0) {
      return NextResponse.json(
        { error: 'No approved materials available in inventory to generate from.' },
        { status: 400 }
      );
    }

    const apiKey =
      clientKey ||
      req.headers.get('x-gemini-key') ||
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    let generatedConcepts: Concept[] = [];

    if (apiKey) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are a world-class circular fashion co-designer for Deadstock Live Lab.
Your core task is to design a manufacturable capsule collection of ${target_looks} looks based STRICTLY on the approved physical deadstock inventory.

BRIEF:
${brief}

APPROVED MATERIAL LEDGER (You CANNOT use any material outside this list):
${JSON.stringify(
  approvedMaterials.map((m) => ({
    id: m.id,
    label: m.label,
    category: m.category,
    form: m.form,
    color: m.visual.dominant_color,
    texture: m.visual.texture_cues,
    properties: m.properties,
    quantity: m.estimate.quantity_estimate,
  })),
  null,
  2
)}

HARD RULES:
1. Every look must only use material IDs from the approved list (${approvedIds.join(', ')}).
2. Every garment zone must cite an approved material ID.
3. Obey textile realities: do not use light organza for heavy trousers without backing; do not use rigid twill for stretch cuffs.
4. Output strict JSON conforming to schema.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'object',
              properties: {
                concepts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: { type: 'string' },
                      silhouette: { type: 'string' },
                      description: { type: 'string' },
                      uses: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                      material_map: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            zone: { type: 'string' },
                            material_id: { type: 'string' },
                            usage_note: { type: 'string' },
                          },
                          required: ['zone', 'material_id'],
                        },
                      },
                      warnings: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                    },
                    required: ['title', 'silhouette', 'description', 'uses', 'material_map'],
                  },
                },
              },
              required: ['concepts'],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed.concepts && Array.isArray(parsed.concepts) && parsed.concepts.length > 0) {
          generatedConcepts = parsed.concepts.map((c: any, index: number) => {
            return {
              id: `LOOK-0${index + 1}`,
              look_number: index + 1,
              title: c.title,
              silhouette: c.silhouette,
              description: c.description,
              visual_uri: `https://images.unsplash.com/photo-${
                index === 0
                  ? '1551488831-00ddcb6c6bd3'
                  : index === 1
                  ? '1515886657613-9f3515b0c78f'
                  : '1539109136881-3be0616acf4b'
              }?auto=format&fit=crop&w=1000&q=80`,
              uses: c.uses.filter((u: string) => approvedIds.includes(u)),
              material_map: c.material_map.map((zm: any) => {
                const mat = approvedMaterials.find((m) => m.id === zm.material_id);
                return {
                  zone: zm.zone,
                  material_id: zm.material_id,
                  material_label: mat ? mat.label : zm.material_id,
                  usage_note: zm.usage_note || 'Mapped by Gemini constrained co-design.',
                };
              }),
              feasibility: 'feasible',
              warnings: c.warnings || [],
              version: 1,
              affected: false,
              approved: false,
            };
          });
        }
      } catch (err: any) {
        console.warn('Gemini generation error, utilizing deterministic constraint engine:', err.message);
      }
    }

    // High-fidelity deterministic concept synthesizer
    if (generatedConcepts.length === 0) {
      generatedConcepts = generateDeterministicConcepts(approvedMaterials, brief, target_looks);
    }

    // Always run through the deterministic server-side constraint engine!
    const activeConstraints =
      constraints.length > 0 ? constraints : generateDefaultConstraints(brief, target_looks);

    const { validatedConcepts, result } = validateCollectionConstraints(
      materials,
      activeConstraints,
      generatedConcepts
    );

    return NextResponse.json({
      success: true,
      concepts: validatedConcepts,
      validation: result,
      source: apiKey ? 'gemini-constrained-intelligence' : 'deterministic-constraint-engine',
    });
  } catch (error: any) {
    console.error('Generate route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function generateDeterministicConcepts(
  materials: Material[],
  brief: string,
  targetCount: number = 3
): Concept[] {
  const isUtility = brief.toLowerCase().includes('utility') || brief.toLowerCase().includes('street');
  const isEvening = brief.toLowerCase().includes('evening') || brief.toLowerCase().includes('gown');

  const concepts: Concept[] = [];
  const primaryRoll = materials.find((m) => m.form === 'roll') || materials[0];
  const panels = materials.filter((m) => m.form === 'panel');
  const trims = materials.filter((m) => m.form === 'trim' || m.form === 'accessory');
  const scraps = materials.filter((m) => m.form === 'scrap');

  // Look 1: Architectural Foundation Look
  const look1Uses: string[] = [primaryRoll.id];
  const look1Map = [
    {
      zone: 'Main Structural Bodice & Shell',
      material_id: primaryRoll.id,
      material_label: primaryRoll.label,
      usage_note: 'Primary yardage cut on warp grain.',
    },
  ];

  if (trims.length > 0) {
    look1Uses.push(trims[0].id);
    look1Map.push({
      zone: 'Banded Collar & Ergonomic Hem',
      material_id: trims[0].id,
      material_label: trims[0].label,
      usage_note: 'Contrast finish providing structural anchor.',
    });
  }
  if (trims.length > 1) {
    look1Uses.push(trims[1].id);
    look1Map.push({
      zone: 'Hardware Fastening System',
      material_id: trims[1].id,
      material_label: trims[1].label,
      usage_note: 'Functional closure salvaged from deadstock lot.',
    });
  }

  concepts.push({
    id: 'LOOK-01',
    look_number: 1,
    title: isEvening
      ? `The ${primaryRoll.visual.dominant_color} Architectural Column Overcoat`
      : `The ${primaryRoll.visual.dominant_color} Modular Studio Kimono`,
    silhouette: isEvening
      ? 'Floor-length streamlined column coat with structured lapel'
      : 'Relaxed drop-shoulder oversized worker jacket with clean selvedge bands',
    description: `Engineered primarily from ${primaryRoll.label}. Focuses on material conservation by utilizing rectilinear pattern blocks to eliminate cutting waste.`,
    visual_uri: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=80',
    uses: look1Uses,
    material_map: look1Map,
    feasibility: 'feasible',
    warnings: [],
    version: 1,
    affected: false,
    approved: true,
  });

  // Look 2: Mixed-Texture Contrast Blouson (utilizes scraps / panels)
  if (targetCount >= 2) {
    const p1 = panels[0] || primaryRoll;
    const s1 = scraps[0] || panels[1] || primaryRoll;
    const look2Uses = [p1.id];
    const look2Map = [
      {
        zone: 'Fitted Bodice & Structured Raglan Sleeves',
        material_id: p1.id,
        material_label: p1.label,
        usage_note: 'Textural anchor matching material weave direction.',
      },
    ];

    if (s1.id !== p1.id) {
      look2Uses.push(s1.id);
      look2Map.push({
        zone: 'Articulated Lantern Sleeve Panels & Insets',
        material_id: s1.id,
        material_label: s1.label,
        usage_note: 'Fluid contrast insert utilizing remnant contours.',
      });
    }

    if (trims.length > 0) {
      look2Uses.push(trims[trims.length - 1].id);
      look2Map.push({
        zone: 'Exposed Asymmetric Center Closure',
        material_id: trims[trims.length - 1].id,
        material_label: trims[trims.length - 1].label,
        usage_note: 'Industrial closure accentuating vertical line.',
      });
    }

    concepts.push({
      id: 'LOOK-02',
      look_number: 2,
      title: `Sculpted Asymmetric ${p1.visual.dominant_color} Blouson`,
      silhouette: 'Cropped high-collar sculptural blouson with gathered contrast volume',
      description: `Tactile contrast study balancing the matte structure of ${p1.label} with accent panels of ${s1.label}.`,
      visual_uri: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
      uses: look2Uses,
      material_map: look2Map,
      feasibility: 'feasible',
      warnings: [],
      version: 1,
      affected: false,
      approved: false,
    });
  }

  // Look 3: Longline Spliced Duster / Trench
  if (targetCount >= 3) {
    const p2 = panels[1] || materials[materials.length - 1];
    const p3 = panels[0] || primaryRoll;
    const look3Uses = [p2.id];
    const look3Map = [
      {
        zone: 'Outer Trench Body & Storm Shield',
        material_id: p2.id,
        material_label: p2.label,
        usage_note: 'Engineered for weatherproof drape and longevity.',
      },
    ];

    if (p3.id !== p2.id) {
      look3Map.push({
        zone: 'Back Yoke Breathability Vent & Facing',
        material_id: p3.id,
        material_label: p3.label,
        usage_note: 'Breathable panel inserted along shoulder blades.',
      });
    }

    concepts.push({
      id: 'LOOK-03',
      look_number: 3,
      title: `Deconstructed ${p2.visual.dominant_color} Spliced Duster`,
      silhouette: 'Architectural full-length duster with modular storm flaps',
      description: `Combines ${p2.label} and ${p3.label} into an all-weather circular statement coat with zero virgin fabric required.`,
      visual_uri: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=80',
      uses: look3Uses,
      material_map: look3Map,
      feasibility: 'feasible',
      warnings: [],
      version: 1,
      affected: false,
      approved: true,
    });
  }

  return concepts;
}
