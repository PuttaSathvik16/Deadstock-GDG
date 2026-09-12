import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is not set in environment or .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export const DDL_SCHEMA = `
-- 1. Labs table
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

-- 2. Materials table
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

-- 3. Constraints table
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

-- 4. Concepts table
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

-- 5. Decisions table (Immutable audit ledger)
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

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_materials_lab ON materials(lab_id);
CREATE INDEX IF NOT EXISTS idx_constraints_lab ON constraints(lab_id);
CREATE INDEX IF NOT EXISTS idx_concepts_lab ON concepts(lab_id);
CREATE INDEX IF NOT EXISTS idx_decisions_lab ON decisions(lab_id);
`;

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL at aws-0-us-east-2.pooler.supabase.com...');
  const client = await pool.connect();
  try {
    console.log('Executing DDL Schema Migration...');
    await client.query(DDL_SCHEMA);
    console.log('✅ Tables and indexes created successfully in Supabase!');

    // Verify tables
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('labs', 'materials', 'constraints', 'concepts', 'decisions');
    `);
    console.log('Verified Supabase tables:', res.rows.map(r => r.table_name));

  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
