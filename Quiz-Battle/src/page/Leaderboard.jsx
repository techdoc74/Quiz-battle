import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/api/leaderboard`);
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const rankColors = [
    "bg-gradient-to-r from-yellow-400 to-yellow-200 text-yellow-900 font-bold",
    "bg-gradient-to-r from-gray-400 to-gray-200 text-gray-900 font-bold",
    "bg-gradient-to-r from-orange-400 to-orange-200 text-orange-900 font-bold"
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
      <div className="backdrop-blur-lg bg-white/20 border border-white/30 shadow-2xl rounded-2xl p-10 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center tracking-wide">Leaderboard</h2>
        {loading ? (
          <div className="text-center text-white p-4">Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-white p-4">No scores yet. Be the first!</div>
        ) : (
          <table className="w-full mb-6 rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-blue-100/80">
                <th className="py-2 px-3 text-left">#</th>
                <th className="py-2 px-3 text-left">User</th>
                <th className="py-2 px-3 text-left">Score</th>
                <th className="py-2 px-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 10).map((entry, idx) => (
                <tr
                  key={idx}
                  className={`${
                    idx < 3 ? rankColors[idx] : "bg-white/80"
                  } border-b border-blue-100 last:border-0`}
                >
                  <td className="py-2 px-3">{idx + 1}</td>
                  <td className="py-2 px-3">{entry.username}</td>
                  <td className="py-2 px-3">{entry.score}</td>
                  <td className="py-2 px-3">{new Date(entry.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Link
          to="/start"
          className="block w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold py-2 rounded-lg shadow hover:from-green-600 hover:to-blue-600 transition text-center mb-3"
        >
          Start New Quiz
        </Link>
        <Link
          to="/quiz"
          className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition text-center"
        >
          Back to Quiz
        </Link>
      </div>
    </div>
  );
}