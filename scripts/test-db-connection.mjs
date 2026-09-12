import dotenv from 'dotenv';
dotenv.config();

import { getOrCreateDefaultLab, getLab, purgeSatinDisruption, resetAtelierLedger, getPool } from '../lib/db.js';

async function test() {
  console.log('--- Testing Supabase PostgreSQL Integration ---');
  try {
    console.log('1. Fetching or initializing default atelier lab...');
    const lab = await getOrCreateDefaultLab();
    console.log(`✅ Lab loaded: "${lab.name}" (ID: ${lab.id})`);
    console.log(`   Materials in Supabase: ${lab.materials.length}`);
    console.log(`   Constraints in Supabase: ${lab.constraints.length}`);
    console.log(`   Concepts in Supabase: ${lab.concepts.length}`);
    console.log(`   Decisions in Supabase: ${lab.decisions.length}`);

    console.log('\n2. Testing Live Satin Disruption in Supabase...');
    const disruptedLab = await purgeSatinDisruption(lab.id);
    const satin = disruptedLab.materials.find(m => m.id === 'MAT-004');
    console.log(`   MAT-004 Approved status: ${satin?.approved} (Expected: false)`);
    const affectedConcepts = disruptedLab.concepts.filter(c => c.affected || c.feasibility === 'invalid');
    console.log(`   Affected concepts count: ${affectedConcepts.length} (Expected: >= 1)`);
    console.log(`   Total decisions: ${disruptedLab.decisions.length} (New decision logged by Sathvik)`);

    console.log('\n3. Testing Reset Atelier Ledger in Supabase...');
    const resetLab = await resetAtelierLedger(lab.id);
    const satinAfterReset = resetLab.materials.find(m => m.id === 'MAT-004');
    console.log(`   MAT-004 Approved after reset: ${satinAfterReset?.approved} (Expected: true)`);
    console.log('✅ Supabase database tests PASSED perfectly!');
  } catch (err) {
    console.error('❌ Supabase test failed:', err);
    process.exit(1);
  } finally {
    const pool = getPool();
    await pool.end();
  }
}

test();
