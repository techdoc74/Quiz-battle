import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      // On successful registration, log the user in and navigate to the start page
      setUser({ username });
      navigate("/start");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = () => {
    // In a real application, this would redirect to your backend's
    // Google OAuth endpoint, e.g., '/auth/google', which would then
    // redirect to Google's consent screen.
    alert("The Google Sign-Up feature is not fully implemented yet.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-pink-700">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-blue-300">
        <div className="flex flex-col items-center mb-6">
          <img src="https://img.icons8.com/color/96/add-user-male.png" alt="Register Icon" className="mb-2" />
          <h2 className="text-3xl font-bold text-blue-700 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm">Join Quiz Battle today!</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
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
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              className="border border-blue-200 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              placeholder="Confirm your password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-2 rounded-lg shadow hover:from-green-600 hover:to-teal-600 transition"
            type="submit"
          >
          Register
          </button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        <button
          onClick={handleGoogleSignUp}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow-sm hover:bg-gray-50 transition"
        >
          <img src="https://img.icons8.com/color/24/000000/google-logo.png" alt="Google icon" />
          Sign up with Google
        </button>
        <div className="mt-6 text-center">
          <span className="text-gray-500 text-sm">Already have an account? </span>
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
}