const { Pool } = require('pg');
const questionsData = require('./db.json').questions;
require('dotenv').config();

async function seed() {
  console.log('Opening database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();

  try {
    console.log('Clearing existing questions...');
    await client.query('DELETE FROM questions');

    console.log('Seeding new questions...');
    let count = 0;
    for (const categoryId in questionsData) {
      for (const difficulty in questionsData[categoryId]) {
        for (const q of questionsData[categoryId][difficulty]) {
          await client.query(
            'INSERT INTO questions (category_id, difficulty, question, correct_answer, incorrect_answers) VALUES ($1, $2, $3, $4, $5)',
            [
              categoryId,
              difficulty,
              q.question,
              q.correct_answer,
              JSON.stringify(q.incorrect_answers),
            ]
          );
          count++;
        }
      }
    }
    console.log(`Seeding complete. Inserted ${count} questions.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch(console.error);