const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
  // Use the DATABASE_URL from the environment variables
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Render's free tier
    },
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    // Read and execute the initial schema SQL file
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations', '001-initial-schema.sql'),
      'utf8'
    );
    // Split the SQL file into individual statements and execute them
    const statements = sql.split(';').filter(s => s.trim());
    for (const statement of statements) {
      // The "Down" part of the migration is for local dev, we don't want to run it on deploy
      if (statement.trim().toUpperCase().startsWith('DROP')) continue;
      await client.query(statement);
    }
    console.log('Database setup complete.');
  } catch (err) {
    console.error('Error setting up database:', err);
  } finally {
    await client.end();
  }
}

module.exports = { setup };