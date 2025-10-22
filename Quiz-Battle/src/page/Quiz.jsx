import React, { useEffect, useState, useContext, useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";

// Pre-create audio elements for performance
const correctSound = new Audio("/sounds/correct.mp3");
const incorrectSound = new Audio("/sounds/incorrect.mp3");
const tickSound = new Audio("/sounds/timer-tick.mp3");

// Helper function to safely play audio and handle browser restrictions
const playSound = async (audio) => {
  try {
    await audio.play();
  } catch (error) {
    // Autoplay was prevented. This is common and can be safely ignored.
    // console.error("Audio play failed:", error);
  }
};

export default function Quiz() {
  const { user, setUser } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(15); // 15 seconds per question
  const navigate = useNavigate();
  const location = useLocation();

  // Preload sounds
  useEffect(() => {
    correctSound.preload = "auto";
    incorrectSound.preload = "auto";
    tickSound.preload = "auto";
  }, []);

  // Get category and difficulty from URL
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "9";
  const difficulty = params.get("difficulty") || "easy";

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/questions?category=${category}&difficulty=${difficulty}`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, difficulty]);

  useEffect(() => {
    if (showResult && user) {
      const postScore = async () => {
        try {
          const apiUrl = import.meta.env.VITE_API_URL;
          await fetch(`${apiUrl}/api/leaderboard`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user.username, score }),
          });
        } catch (error) {
          console.error('Failed to submit score', error);
        }
      };
      postScore();
    }
  }, [showResult, score, user]);

  useEffect(() => {
    if (showResult || loading) return;

    setTimer(15); // Reset timer for new question
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 6 && prev > 1) {
          tickSound.currentTime = 0;
          playSound(tickSound);
        }
        if (prev === 1) {
          handleNextQuestion(); // Move to next question when timer hits 0
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [current, showResult, loading]);

  const handleAnswer = (answer) => {
    setSelected(answer);
    if (answer === questions[current].correct_answer) {
      playSound(correctSound);
      setScore(score + 1);
    } else {
      playSound(incorrectSound);
    }
    setTimeout(() => {
      setSelected(null);
      handleNextQuestion();
    }, 900);
  };

  const handleNextQuestion = () => {
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      setShowResult(true);
    }
  }

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
      <div className="text-white text-xl font-semibold animate-pulse">Loading...</div>
    </div>
  );

  if (!questions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700 text-white">
        <h2 className="text-2xl mb-4 font-bold">No questions found for this category/difficulty.</h2>
        <Link
          to="/start"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
        >
          Choose Again
        </Link>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
        <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md flex flex-col items-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-4">Quiz Complete!</h2>
          <p className="mb-4 text-lg text-gray-800 dark:text-gray-100">
            Your score: <span className="font-bold text-purple-700 text-2xl">{score}</span>
          </p>
          <Link to="/leaderboard" className="w-full mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition text-center">
            View Leaderboard
          </Link>
          <Link
            to="/start"
            className="w-full mb-2 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 rounded-lg shadow hover:from-green-600 hover:to-blue-600 transition text-center"
          >
            Start New Quiz
          </Link>
          <button className="w-full mb-2 bg-gray-500 text-white py-2 rounded-lg shadow hover:bg-gray-600 transition" onClick={() => navigate('/start')}>
            Play Again
          </button>
          <button className="w-full text-red-500 font-semibold mt-2 hover:underline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <span className="text-blue-700 font-semibold">Question {current + 1}/{questions.length}</span>
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full font-bold shadow">
            Score: {score}
          </span>
          <span
            className={`text-lg font-mono rounded-full px-3 py-1 transition-colors duration-300 ${
              timer <= 5
                ? "bg-red-200 text-red-700 font-bold animate-pulse"
                : "bg-gray-700 text-white"
            }`}
          >
            {timer}s
          </span>
        </div>
        <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-100" dangerouslySetInnerHTML={{ __html: questions[current].question }} />
        <div className="flex flex-col gap-4">
          {questions[current].answers.map((ans, idx) => (
            <button
              key={idx}
              className={`border-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm
                ${
                  selected
                    ? ans === questions[current].correct_answer
                      ? "bg-green-400 border-green-600 text-white"
                      : selected === ans
                        ? "bg-red-400 border-red-600 text-white"
                        : "bg-gray-200 border-gray-300 text-gray-500"
                    : "bg-blue-100 border-blue-400 text-blue-900 hover:bg-blue-200 hover:border-blue-600"
                }
              `}
              onClick={() => handleAnswer(ans)}
              disabled={!!selected}
              dangerouslySetInnerHTML={{ __html: ans }}
            />
          ))}
        </div>
        <button
          className="mt-8 w-full text-red-500 font-semibold hover:underline"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}