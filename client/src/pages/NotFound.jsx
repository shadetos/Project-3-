import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";

const NotFound = () => {
  // Theme color variables
  const colors = {
    primary: "#FF6B35", // Orange
    secondary: "#F7B267", // Gold/Yellow
    accent: "#ED213A", // Red
    background: "#FFFAF2", // Light background
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="text-center max-w-md animate-fade-in-up">
          {/* Visual indicator */}
          <div
            className="w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary}, ${colors.primary})`,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <span className="text-white text-6xl font-bold">404</span>
          </div>

          {/* Main message */}
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: colors.primary }}
          >
            Page Not Found
          </h1>

          <p className="text-gray-600 mb-8 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Navigation options */}
          <div className="space-y-4">
            <Link
              to="/"
              className="block w-full py-3 px-6 rounded-lg font-medium text-white transition-transform hover:transform hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                boxShadow:
                  "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
            >
              Return to Home
            </Link>

            <Link
              to="/saved-recipes"
              className="block w-full py-3 px-6 rounded-lg font-medium transition-transform hover:transform hover:scale-105"
              style={{
                backgroundColor: "white",
                border: `2px solid ${colors.primary}`,
                color: colors.primary,
              }}
            >
              My Saved Recipes
            </Link>

            <div className="pt-4 text-center text-gray-500">
              <p>Looking for recipe inspiration?</p>
              <Link
                to="/create-recipes"
                className="font-medium hover:underline inline-block mt-1"
                style={{ color: colors.primary }}
              >
                Try our AI Recipe Generator
              </Link>
            </div>
          </div>

          {/* Fun food-related illustration */}
          <div className="mt-12 text-4xl">🍳 🥗 🍕 🍰</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
