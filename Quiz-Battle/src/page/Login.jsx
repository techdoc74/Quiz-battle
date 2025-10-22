import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      setUser({ username: data.user.username });
      navigate("/start");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-300">
        <div className="flex flex-col items-center mb-6">
          <img src="https://img.icons8.com/color/96/quiz.png" alt="Quiz Icon" className="mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 mb-1">Quiz Battle Login</h2>
          <p className="text-gray-500 text-sm">Welcome back! Please login to continue.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="text-red-600 bg-red-100 border border-red-200 rounded px-3 py-2 text-sm">{error}</div>}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="username">Username</label>
            <input
              id="username"
              className="border border-blue-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              className="border border-blue-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-purple-600 transition"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">Don't have an account? </span>
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register</Link>
        </div>
      </div>
    </div>
  );
}