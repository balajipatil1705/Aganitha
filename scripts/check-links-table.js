require('dotenv').config();
const { Client } = require('@neondatabase/serverless');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error('DATABASE_URL not set'); process.exit(1); }
  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    const res = await client.query('SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_name = $2', ['public','links']);
    console.log('table exists rows:', res.rowCount);
    if (res.rowCount) console.log(res.rows[0]);
  } catch (e) { console.error(e); process.exitCode = 1; } finally { try { await client.end(); } catch{} }
}

main();
