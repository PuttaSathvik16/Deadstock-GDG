import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function checkConnection() {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not set.');
    return;
  }
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });

  try {
    await client.connect();
    console.log('Connected successfully via pooler.');
    await client.end();
  } catch (err) {
    console.error('Connection test failed:', err.message);
    try { await client.end(); } catch (e) {}
  }
}

checkConnection();
