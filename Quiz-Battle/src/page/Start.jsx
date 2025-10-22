import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// A silent audio file to unlock the audio context on user interaction
const unlockAudio = new Audio('/sounds/unlock.mp3');

const categories = [
  { id: "9", name: "General Knowledge" },
  { id: "17", name: "Science & Nature" },
  { id: "18", name: "Science: Computers" },
  { id: "21", name: "Sports" },
  { id: "22", name: "Geography" },
  { id: "23", name: "History" },
];

const difficulties = ["easy", "medium", "hard"];

export default function Start() {
  const [category, setCategory] = useState(categories[0].id);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    // Play and immediately pause the silent audio. This "unlocks" the browser's
    // audio context, allowing subsequent sounds in the Quiz component to play
    // without being blocked by autoplay policies.
    unlockAudio.play().then(() => {
      unlockAudio.pause();
      unlockAudio.currentTime = 0;
      navigate(`/quiz?category=${category}&difficulty=${difficulty}`);
    }).catch(error => {
      // Even if it fails, navigate. The sounds might still work on some browsers.
      navigate(`/quiz?category=${category}&difficulty=${difficulty}`);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 text-white">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6">Quiz Battle</h1>
        <div className="w-full mb-4">
          <label htmlFor="category" className="block mb-2 text-lg font-semibold">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded bg-white/30 text-black"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="text-black">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full mb-6">
          <label htmlFor="difficulty" className="block mb-2 text-lg font-semibold">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2 rounded bg-white/30 text-black"
          >
            {difficulties.map((diff) => (
              <option key={diff} value={diff} className="text-black capitalize">
                {diff}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleStartQuiz} className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition text-lg">
          Start Quiz
        </button>
      </div>
    </div>
  );
}