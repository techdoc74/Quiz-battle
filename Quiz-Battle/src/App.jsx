import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Quiz from "./page/Quiz";
import Leaderboard from "./page/Leaderboard";
import StartQuiz from "./page/Start";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./page/HomePage"; // Add this import
import './App.css'

export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} /> {/* Show HomePage first */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/login" />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/start" element={user ? <StartQuiz /> : <Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
