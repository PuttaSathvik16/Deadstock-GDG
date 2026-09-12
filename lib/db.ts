import pg from 'pg';
import { Lab, Material, Constraint, Concept, Decision } from '@/types';
import { PRIMARY_ATELIER_WORKSPACE, AUTHENTIC_ATELIER_MATERIALS, ACTIVE_CAPSULE_CONCEPTS, CO_DESIGN_DECISION_LOG } from './atelier-inventory';
import { generateDefaultConstraints, validateCollectionConstraints } from './constraint-engine';

const { Pool } = pg;

const connectionString = 
  process.env.DATABASE_URL || 
  'postgresql://postgres.olrjxshxxfbtfwuxcbhj:m*yg7VuVJ%24a%25jgW@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('[Supabase DB Pool Error]:', err);
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getPool();
  const res = await p.query(text, params);
  return res.rows as T[];
}

/**
 * Initializes tables and seeds default authentic atelier data into Supabase if empty.
 */
export async function initDatabase(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS labs (
        id VARCHAR(64) PRIMARY KEY,
        name TEXT NOT NULL,
        brief TEXT NOT NULL,
        audience TEXT,
        occasion TEXT,
        target_looks INT DEFAULT 3,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        owner_id TEXT NOT NULL,
        status VARCHAR(32) DEFAULT 'active_studio'
      );

      CREATE TABLE IF NOT EXISTS materials (
        id VARCHAR(64) PRIMARY KEY,
        lab_id VARCHAR(64) REFERENCES labs(id) ON DELETE CASCADE,
        label TEXT NOT NULL,
        category VARCHAR(64) NOT NULL,
        form VARCHAR(32) NOT NULL,
        visual JSONB NOT NULL DEFAULT '{}',
        estimate JSONB NOT NULL DEFAULT '{}',
        properties JSONB NOT NULL DEFAULT '{}',
        provenance JSONB NOT NULL DEFAULT '{}',
        confidence NUMERIC DEFAULT 1.0,
        verification VARCHAR(32) DEFAULT 'verified',
        approved BOOLEAN DEFAULT true,
        locked BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS constraints (
        id VARCHAR(64) PRIMARY KEY,
        lab_id VARCHAR(64) REFERENCES labs(id) ON DELETE CASCADE,
        type VARCHAR(16) NOT NULL,
        source VARCHAR(32) NOT NULL,
        title TEXT NOT NULL,
        rule TEXT NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(16) NOT NULL,
        active BOOLEAN DEFAULT true,
        target_material_id VARCHAR(64),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS concepts (
        id VARCHAR(64) PRIMARY KEY,
        lab_id VARCHAR(64) REFERENCES labs(id) ON DELETE CASCADE,
        look_number INT NOT NULL,
        title TEXT NOT NULL,
        silhouette TEXT NOT NULL,
        description TEXT NOT NULL,
        visual_uri TEXT,
        uses JSONB NOT NULL DEFAULT '[]',
        material_map JSONB NOT NULL DEFAULT '[]',
        feasibility VARCHAR(32) NOT NULL,
        warnings JSONB NOT NULL DEFAULT '[]',
        version INT DEFAULT 1,
        affected BOOLEAN DEFAULT false,
        change_reason TEXT,
        approved BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS decisions (
        id VARCHAR(64) PRIMARY KEY,
        lab_id VARCHAR(64) REFERENCES labs(id) ON DELETE CASCADE,
        speaker_id VARCHAR(64) NOT NULL,
        speaker_name TEXT NOT NULL,
        speaker_role TEXT,
        speaker_avatar TEXT,
        timestamp VARCHAR(64) NOT NULL,
        event_type VARCHAR(64) NOT NULL,
        payload JSONB NOT NULL DEFAULT '{}',
        resulting_changes TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_materials_lab ON materials(lab_id);
      CREATE INDEX IF NOT EXISTS idx_constraints_lab ON constraints(lab_id);
      CREATE INDEX IF NOT EXISTS idx_concepts_lab ON concepts(lab_id);
      CREATE INDEX IF NOT EXISTS idx_decisions_lab ON decisions(lab_id);
    `);

    // Check if labs table has data
    const existing = await client.query('SELECT count(*) FROM labs;');
    if (parseInt(existing.rows[0].count, 10) === 0) {
      console.log('Seeding initial authentic Atelier data into Supabase...');
      await seedBaselineData(client);
    }
  } finally {
    client.release();
  }
}

async function seedBaselineData(client: pg.PoolClient, labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<void> {
  const lab = PRIMARY_ATELIER_WORKSPACE;

  // Insert Lab
  await client.query(`
    INSERT INTO labs (id, name, brief, audience, occasion, target_looks, created_at, owner_id, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      brief = EXCLUDED.brief,
      audience = EXCLUDED.audience,
      occasion = EXCLUDED.occasion,
      target_looks = EXCLUDED.target_looks,
      owner_id = EXCLUDED.owner_id,
      status = EXCLUDED.status;
  `, [
    lab.id,
    lab.name,
    lab.brief,
    lab.audience,
    lab.occasion,
    lab.target_looks,
    lab.created_at,
    lab.owner_id,
    lab.status,
  ]);

  // Clear existing child records for this lab to ensure clean baseline
  await client.query('DELETE FROM materials WHERE lab_id = $1;', [labId]);
  await client.query('DELETE FROM constraints WHERE lab_id = $1;', [labId]);
  await client.query('DELETE FROM concepts WHERE lab_id = $1;', [labId]);
  await client.query('DELETE FROM decisions WHERE lab_id = $1;', [labId]);

  // Insert Materials
  for (const m of AUTHENTIC_ATELIER_MATERIALS) {
    await client.query(`
      INSERT INTO materials (
        id, lab_id, label, category, form, visual, estimate, properties, provenance, 
        confidence, verification, approved, locked
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
    `, [
      m.id,
      lab.id,
      m.label,
      m.category,
      m.form,
      JSON.stringify(m.visual),
      JSON.stringify(m.estimate),
      JSON.stringify(m.properties),
      JSON.stringify(m.provenance),
      m.confidence,
      m.verification,
      m.approved,
      m.locked,
    ]);
  }

  // Insert Constraints
  const constraints = generateDefaultConstraints(lab.brief, lab.target_looks);
  for (const c of constraints) {
    await client.query(`
      INSERT INTO constraints (
        id, lab_id, type, source, title, rule, description, severity, active, target_material_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `, [
      c.id,
      lab.id,
      c.type,
      c.source,
      c.title,
      c.rule,
      c.description,
      c.severity,
      c.active,
      c.target_material_id || null,
    ]);
  }

  // Insert Concepts
  for (const cp of ACTIVE_CAPSULE_CONCEPTS) {
    await client.query(`
      INSERT INTO concepts (
        id, lab_id, look_number, title, silhouette, description, visual_uri, 
        uses, material_map, feasibility, warnings, version, affected, change_reason, approved
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `, [
      cp.id,
      lab.id,
      cp.look_number,
      cp.title,
      cp.silhouette,
      cp.description,
      cp.visual_uri || null,
      JSON.stringify(cp.uses),
      JSON.stringify(cp.material_map),
      cp.feasibility,
      JSON.stringify(cp.warnings),
      cp.version,
      cp.affected || false,
      cp.change_reason || null,
      cp.approved || false,
    ]);
  }

  // Insert Decisions
  for (const d of CO_DESIGN_DECISION_LOG) {
    await client.query(`
      INSERT INTO decisions (
        id, lab_id, speaker_id, speaker_name, speaker_role, speaker_avatar, 
        timestamp, event_type, payload, resulting_changes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `, [
      d.id,
      lab.id,
      d.speaker_id,
      d.speaker_name,
      d.speaker_role || null,
      d.speaker_avatar || null,
      d.timestamp,
      d.event_type,
      JSON.stringify(d.payload),
      d.resulting_changes,
    ]);
  }
}

/**
 * Retrieves a complete Lab entity with its relational materials, constraints, concepts, and decisions.
 */
export async function getLab(labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<Lab | null> {
  await initDatabase();

  const labRows = await query<any>('SELECT * FROM labs WHERE id = $1 LIMIT 1;', [labId]);
  if (labRows.length === 0) {
    return null;
  }
  const labRow = labRows[0];

  const materialRows = await query<any>(
    'SELECT * FROM materials WHERE lab_id = $1 ORDER BY id ASC;',
    [labId]
  );
  const constraintRows = await query<any>(
    'SELECT * FROM constraints WHERE lab_id = $1 ORDER BY id ASC;',
    [labId]
  );
  const conceptRows = await query<any>(
    'SELECT * FROM concepts WHERE lab_id = $1 ORDER BY look_number ASC;',
    [labId]
  );
  const decisionRows = await query<any>(
    'SELECT * FROM decisions WHERE lab_id = $1 ORDER BY created_at ASC;',
    [labId]
  );

  const materials: Material[] = materialRows.map((r) => ({
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

  const constraints: Constraint[] = constraintRows.map((r) => ({
    id: r.id,
    lab_id: r.lab_id,
    type: r.type,
    source: r.source,
    title: r.title,
    rule: r.rule,
    description: r.description,
    severity: r.severity,
    active: Boolean(r.active),
    target_material_id: r.target_material_id || undefined,
  }));

  const concepts: Concept[] = conceptRows.map((r) => ({
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

  const decisions: Decision[] = decisionRows.map((r) => ({
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

  return {
    id: labRow.id,
    name: labRow.name,
    brief: labRow.brief,
    audience: labRow.audience || '',
    occasion: labRow.occasion || '',
    target_looks: labRow.target_looks || 3,
    created_at: labRow.created_at,
    owner_id: labRow.owner_id,
    status: labRow.status,
    materials,
    constraints,
    concepts,
    decisions,
  };
}

/**
 * Retrieves the default active studio lab, creating/seeding it if needed.
 */
export async function getOrCreateDefaultLab(): Promise<Lab> {
  let lab = await getLab(PRIMARY_ATELIER_WORKSPACE.id);
  if (!lab) {
    const client = await getPool().connect();
    try {
      await seedBaselineData(client, PRIMARY_ATELIER_WORKSPACE.id);
    } finally {
      client.release();
    }
    lab = await getLab(PRIMARY_ATELIER_WORKSPACE.id);
  }
  return lab!;
}

/**
 * Inserts or updates a Material in Supabase.
 */
export async function upsertMaterial(material: Material, labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<Material> {
  await initDatabase();
  await query(`
    INSERT INTO materials (
      id, lab_id, label, category, form, visual, estimate, properties, provenance,
      confidence, verification, approved, locked, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
    ON CONFLICT (id) DO UPDATE SET
      label = EXCLUDED.label,
      category = EXCLUDED.category,
      form = EXCLUDED.form,
      visual = EXCLUDED.visual,
      estimate = EXCLUDED.estimate,
      properties = EXCLUDED.properties,
      provenance = EXCLUDED.provenance,
      confidence = EXCLUDED.confidence,
      verification = EXCLUDED.verification,
      approved = EXCLUDED.approved,
      locked = EXCLUDED.locked,
      updated_at = NOW();
  `, [
    material.id,
    labId,
    material.label,
    material.category,
    material.form,
    JSON.stringify(material.visual),
    JSON.stringify(material.estimate),
    JSON.stringify(material.properties),
    JSON.stringify(material.provenance),
    material.confidence,
    material.verification,
    material.approved,
    material.locked,
  ]);
  return material;
}

/**
 * Updates a material property (e.g. approval, quantity, lock state).
 */
export async function updateMaterial(id: string, updates: Partial<Material>): Promise<void> {
  await initDatabase();
  const current = await query<any>('SELECT * FROM materials WHERE id = $1;', [id]);
  if (current.length === 0) return;

  const row = current[0];
  const approved = updates.approved !== undefined ? updates.approved : row.approved;
  const locked = updates.locked !== undefined ? updates.locked : row.locked;
  const verification = updates.verification !== undefined ? updates.verification : row.verification;
  const label = updates.label !== undefined ? updates.label : row.label;
  const estimate = updates.estimate !== undefined ? JSON.stringify(updates.estimate) : row.estimate;

  await query(`
    UPDATE materials SET 
      approved = $1, 
      locked = $2, 
      verification = $3, 
      label = $4,
      estimate = $5,
      updated_at = NOW() 
    WHERE id = $6;
  `, [approved, locked, verification, label, estimate, id]);
}

/**
 * Inserts an immutable decision event into Supabase ledger.
 */
export async function insertDecision(decision: Decision, labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<Decision> {
  await initDatabase();
  await query(`
    INSERT INTO decisions (
      id, lab_id, speaker_id, speaker_name, speaker_role, speaker_avatar,
      timestamp, event_type, payload, resulting_changes, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW());
  `, [
    decision.id,
    labId,
    decision.speaker_id,
    decision.speaker_name,
    decision.speaker_role || null,
    decision.speaker_avatar || null,
    decision.timestamp,
    decision.event_type,
    JSON.stringify(decision.payload || {}),
    decision.resulting_changes,
  ]);
  return decision;
}

/**
 * Saves or updates capsule concepts in Supabase.
 */
export async function saveConcepts(concepts: Concept[], labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<Concept[]> {
  await initDatabase();
  for (const cp of concepts) {
    await query(`
      INSERT INTO concepts (
        id, lab_id, look_number, title, silhouette, description, visual_uri,
        uses, material_map, feasibility, warnings, version, affected, change_reason, approved, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        silhouette = EXCLUDED.silhouette,
        description = EXCLUDED.description,
        visual_uri = EXCLUDED.visual_uri,
        uses = EXCLUDED.uses,
        material_map = EXCLUDED.material_map,
        feasibility = EXCLUDED.feasibility,
        warnings = EXCLUDED.warnings,
        version = EXCLUDED.version,
        affected = EXCLUDED.affected,
        change_reason = EXCLUDED.change_reason,
        approved = EXCLUDED.approved,
        updated_at = NOW();
    `, [
      cp.id,
      labId,
      cp.look_number,
      cp.title,
      cp.silhouette,
      cp.description,
      cp.visual_uri || null,
      JSON.stringify(cp.uses),
      JSON.stringify(cp.material_map),
      cp.feasibility,
      JSON.stringify(cp.warnings),
      cp.version,
      cp.affected || false,
      cp.change_reason || null,
      cp.approved || false,
    ]);
  }
  return concepts;
}

/**
 * The Signature Live Physical Disruption:
 * Purges Burgundy Silk Duchesse Satin (MAT-004) from approved atelier inventory in Supabase,
 * appends an immutable decision by Sathvik (Lead Upcycler) to the ledger,
 * runs the causal constraint engine to flag affected downstream garments,
 * persists the changes to Supabase, and returns the real-time lab state.
 */
export async function purgeSatinDisruption(labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<Lab> {
  const lab = await getOrCreateDefaultLab();

  // 1. Quash / quarantine MAT-004 in Supabase
  await updateMaterial('MAT-004', { approved: false });

  // 2. Append causal decision to immutable ledger
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const decision: Decision = {
    id: `DEC-${Date.now()}`,
    speaker_id: 'USR-SATHVIK',
    speaker_name: 'Sathvik (Lead Upcycler)',
    speaker_role: 'Atelier Lead',
    speaker_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: timeStr,
    event_type: 'material_removed',
    payload: {
      material_id: 'MAT-004',
      material_label: 'Burgundy Silk Duchesse Satin Scrap',
      reason: 'Physical roll inspection revealed machine oil spot contamination across the bias.',
    },
    resulting_changes: 'Purged Silk Duchesse Satin (MAT-004) from approved inventory in Supabase. Look 03 bodice facing invalidated; flagged for immediate co-design regeneration.',
  };
  await insertDecision(decision, labId);

  // 3. Re-evaluate collection constraints
  const updatedMaterials = lab.materials.map((m) =>
    m.id === 'MAT-004' ? { ...m, approved: false } : m
  );
  const { validatedConcepts } = validateCollectionConstraints(
    updatedMaterials,
    lab.constraints,
    lab.concepts
  );

  // 4. Save updated concept flags in Supabase
  await saveConcepts(validatedConcepts, labId);

  // 5. Return latest real-time lab state
  return (await getLab(labId))!;
}

/**
 * Resets the atelier workspace in Supabase PostgreSQL to the pristine baseline.
 */
export async function resetAtelierLedger(labId: string = PRIMARY_ATELIER_WORKSPACE.id): Promise<Lab> {
  const client = await getPool().connect();
  try {
    await seedBaselineData(client, labId);
  } finally {
    client.release();
  }
  return (await getLab(labId))!;
}
