import React from "react";
import { Link } from "react-router-dom";

const WelcomeSection = () => (
  <>
    <h1 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Welcome to Quiz Battle!</h1>
    <p className="text-lg text-gray-700 mb-6 text-center">
      Challenge yourself and your friends with fun quizzes across a variety of categories including Sports, History, Science, Technology, and more!
    </p>
  </>
);

const FeaturesSection = () => (
  <ul className="mb-6 text-gray-600 list-disc list-inside space-y-2">
    <li>Test your knowledge with quizzes of varying difficulty.</li>
    <li>Compete for the top spot on the leaderboard.</li>
    <li>Track your progress and improve your score.</li>
    <li>Sign up or log in to save your achievements.</li>
  </ul>
);

const CallToActionSection = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <Link
      to="/start"
      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition text-center"
    >
      Start Quiz
    </Link>
    <Link
      to="/leaderboard"
      className="bg-white border border-blue-600 text-blue-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-50 transition text-center"
    >
      View Leaderboard
    </Link>
    <Link
      to="/register"
      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition text-center"
    >
      Sign Up
    </Link>
  </div>
);

const HomePage = () => (
  <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
    <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
      <WelcomeSection />
      <FeaturesSection />
      <CallToActionSection />
      <p className="mt-8 text-center text-gray-500 text-sm">
        Ready to become a Quiz Master? Join now and let the battle begin!
      </p>
    </div>
  </div>
);

export default HomePage;