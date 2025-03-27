import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-extrabold text-indigo-600">
              Feastly
            </span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:flex md:items-center md:justify-between">
        <div className="md:w-1/2 md:pr-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Create delicious recipes with{" "}
            <span className="text-indigo-600">AI</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl">
            Discover, create, and share amazing recipes with ingredients you
            already have at home.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-4 rounded-md text-lg font-medium shadow-lg transform transition hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-md text-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0">
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
              alt="Delicious Food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why choose Feastly?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform makes cooking simple, delicious, and fun.
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-600 rounded-md text-white flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI-Powered Recipes
              </h3>
              <p className="text-gray-600">
                Generate custom recipes based on ingredients you already have in
                your kitchen.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-600 rounded-md text-white flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Meal Planning
              </h3>
              <p className="text-gray-600">
                Plan your meals for the week and track your nutrition goals
                effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-600 rounded-md text-white flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Community Recipes
              </h3>
              <p className="text-gray-600">
                Share your culinary creations and discover recipes from others
                around the world.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to start cooking?
          </h2>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
            Join thousands of food lovers who are creating amazing recipes every
            day.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-md text-lg font-medium shadow-lg"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-2xl font-bold text-white">Feastly</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-400">
                &copy; 2025 Feastly. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
