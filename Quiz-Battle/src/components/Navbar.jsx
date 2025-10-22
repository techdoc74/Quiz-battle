import React from "react";

const Navbar = () => (
  <nav className="bg-blue-700 text-white shadow">
    <div className="container mx-auto flex items-center justify-between px-4 py-3">
      <div className="text-xl font-bold tracking-wide">Quiz Battle</div>
      <div className="space-x-4">
        <a href="/" className="hover:underline hover:text-blue-200 transition">Home</a>
        <a href="/quiz" className="hover:underline hover:text-blue-200 transition">Quiz</a>
        <a href="/about" className="hover:underline hover:text-blue-200 transition">About</a>
      </div>
    </div>
  </nav>
);

export default Navbar;