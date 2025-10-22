const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

// Create a PostgreSQL connection pool
// It will automatically use the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Render's free tier
  }
});

const app = express();
const port = 3001; // We'll use port 3001 for the backend

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Your local frontend dev server
  'https://quizzbattle.netlify.app' // Your deployed frontend
];

const corsOptions = {
  origin: allowedOrigins
};

app.use(cors(corsOptions)); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow the server to accept JSON data

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from the Quiz Battle Backend!');
});

// User registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUserResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUserResult.rows[0]) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Registration error:', error); // Add this line
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// User login endpoint
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.status(200).json({ message: 'Login successful', user: { username: user.username } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error); // And this one
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// --- Quiz Questions Endpoint ---
function shuffle(arr) {
  // Fisher-Yates (aka Knuth) Shuffle Algorithm.
  // A more robust and truly random way to shuffle an array.
  let currentIndex = arr.length;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
}

app.get('/api/questions', async (req, res) => {
  const { category = '9', difficulty = 'easy' } = req.query;

  const questionsResult = await pool.query('SELECT * FROM questions WHERE category_id = $1 AND difficulty = $2', [category, difficulty]);
  const questions = questionsResult.rows;

  const questionsWithShuffledAnswers = questions.map((q) => {
    let incorrect = [];
    try {
      // Safely parse the incorrect_answers, defaulting to an empty array on failure
      incorrect = q.incorrect_answers ? JSON.parse(q.incorrect_answers) : [];
    } catch (e) {
      console.error('Failed to parse incorrect_answers:', q.incorrect_answers);
    }
    return { ...q, answers: shuffle([...incorrect, q.correct_answer]) };
  });
  res.json(questionsWithShuffledAnswers);
});

// --- Leaderboard Endpoints ---

app.get('/api/leaderboard', async (req, res) => {
  const result = await pool.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 10');
  res.json(result.rows);
});

app.post('/api/leaderboard', async (req, res) => {
  const { username, score } = req.body;
  if (typeof username !== 'string' || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid username or score' });
  }
  await pool.query('INSERT INTO leaderboard (username, score, date) VALUES ($1, $2, $3)', [username, score, new Date().toISOString()]);
  res.status(201).json({ message: 'Score added' });
});

// --- Google OAuth Placeholder Endpoints ---

// This endpoint would be the entry point for Google sign-in.
// It would redirect the user to Google's consent screen.
app.get('/auth/google', (req, res) => {
  // In a real app, you would use a library like Passport.js to redirect:
  // passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  res.status(501).json({ message: 'Google OAuth not implemented. This would redirect to Google.' });
});

// Google would redirect the user back to this endpoint after they consent.
app.get('/auth/google/callback', (req, res) => {
  // Here you would handle the callback, exchange the code for a token,
  // get user info, and then create/login the user and redirect to the frontend.
  res.status(501).json({ message: 'Google OAuth callback not implemented.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
