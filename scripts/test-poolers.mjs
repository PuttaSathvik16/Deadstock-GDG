import pg from 'pg';
const { Client } = pg;

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'ap-south-1',
  'ap-southeast-1',
  'eu-central-1',
  'eu-west-1',
];

async function checkRegion(region) {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const client = new Client({
    host,
    port: 6543,
    database: 'postgres',
    user: 'postgres.olrjxshxxfbtfwuxcbhj',
    password: 'm*yg7VuVJ$a%jgW',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log(`🎉 SUCCESS: Connected via ${host} on port 6543!`);
    const res = await client.query('SELECT NOW() as now, current_database();');
    console.log('Query result:', res.rows[0]);
    await client.end();
    return host;
  } catch (err) {
    // console.log(`Failed on ${region}:`, err.message);
    try { await client.end(); } catch (e) {}
    return null;
  }
}

async function run() {
  console.log('Testing Supabase poolers...');
  for (const r of regions) {
    const ok = await checkRegion(r);
    if (ok) {
      console.log(`\n=> MATCH FOUND! Host: ${ok}`);
      process.exit(0);
    }
  }
  console.log('No pooler matched.');
}

run();
