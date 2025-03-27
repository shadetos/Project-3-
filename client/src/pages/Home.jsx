import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { getRecipes } from "../services/recipeService";

export default function HomePage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const data = await getRecipes();
        setRecipes(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setError("Failed to load recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients?.some((ingredient) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to Recipe Haven
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl">
            Discover delicious recipes made with ingredients you already have
          </p>
          <div className="mt-5 mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/create-recipes"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10"
              >
                Create Recipe
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/saved-recipes"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Saved Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-10 py-3 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search recipes by name or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="mt-3 text-gray-500">Loading recipes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-md bg-red-50 p-4 mb-8 max-w-md mx-auto">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => window.location.reload()}
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No recipes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? `No recipes match "${searchQuery}"`
                : "Get started by creating a new recipe."}
            </p>
            <div className="mt-6">
              <Link
                to="/create-recipes"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Recipe
              </Link>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {searchQuery
                ? `Search Results (${filteredRecipes.length})`
                : "Discover Recipes"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe._id || index} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-12 sm:px-12 lg:flex lg:items-center lg:py-16">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                  Ready to create your own recipe?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-indigo-100">
                  Use our AI-powered recipe generator to create custom recipes
                  with ingredients you have on hand.
                </p>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="sm:flex">
                  <Link
                    to="/create-recipes"
                    className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
