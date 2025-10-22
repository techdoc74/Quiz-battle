const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  // Use the DATABASE_URL from the environment variables
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    // Read and execute the initial schema SQL file
    const sql = fs.readFileSync(path.join(__dirname, 'migrations', '001-initial-schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

setup();