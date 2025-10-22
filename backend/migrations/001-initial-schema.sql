-- Up
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  score INTEGER,
  date TEXT
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  incorrect_answers TEXT NOT NULL -- Stored as a JSON string
);

-- Down
DROP TABLE users;
DROP TABLE leaderboard;
DROP TABLE questions;