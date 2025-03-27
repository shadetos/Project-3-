import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Function to check if a link is active
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-gray-800 font-bold text-xl hover:text-gray-600 transition-colors"
            >
              Recipe Generator
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Home
            </Link>
            <Link
              to="/create-recipes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/create-recipes")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Create Recipe
            </Link>
            <Link
              to="/saved-recipes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/saved-recipes")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Saved Recipes
            </Link>
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/dashboard")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/create-recipes"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/create-recipes")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Create Recipe
          </Link>
          <Link
            to="/saved-recipes"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/saved-recipes")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Saved Recipes
          </Link>
          <Link
            to="/dashboard"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive("/dashboard")
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
