// Run this script with: node ./scripts/apply-sql.js
// It will execute the SQL file at ./drizzle/20251119_create_links_table.sql
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('@neondatabase/serverless');

async function main() {
  const sqlFile = path.resolve(__dirname, '..', 'drizzle', '20251119_create_links_table.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not set in environment');
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  try {
    await client.connect();
    console.log('Connected to DB, running SQL...');
    await client.query(sql);
    console.log('SQL executed successfully');
  } catch (err) {
    console.error('Error running SQL:', err);
    process.exitCode = 1;
  } finally {
    try { await client.end(); } catch (e) {}
  }
}

main();
