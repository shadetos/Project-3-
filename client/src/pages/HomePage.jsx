import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaUtensils } from "react-icons/fa";
import RecipeCard from "../components/RecipeCard";
import { fetchRecipes } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  // Fetch featured recipes on component mount
  useEffect(() => {
    const getFeaturedRecipes = async () => {
      try {
        setLoading(true);
        const data = await fetchRecipes("featured");
        setFeaturedRecipes(data.slice(0, 6)); // Limit to 6 featured recipes
      } catch (err) {
        console.error("Error fetching featured recipes:", err);
        setError("Failed to load featured recipes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getFeaturedRecipes();
  }, []);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 2) {
        try {
          setLoading(true);
          const data = await fetchRecipes(query);
          setRecipes(data);
          setError(null);
        } catch (err) {
          console.error("Error searching recipes:", err);
          setError("An error occurred while searching. Please try again.");
          setRecipes([]);
        } finally {
          setLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="px-6 py-12 md:py-20 md:px-12 text-center">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Recipe Generator App
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover delicious recipes using ingredients you already have
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Enter ingredients or recipe name..."
                className="pl-10 pr-4 py-3 w-full rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
                value={query}
                onChange={handleSearch}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Search Results */}
      {query.length > 2 && recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaSearch className="mr-2" />
            Search Results
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {recipes.map((recipe, index) => (
              <motion.div
                key={recipe._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* No Results Message */}
      {query.length > 2 && recipes.length === 0 && !loading && !error && (
        <div className="text-center py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
          >
            <p className="text-yellow-700">
              No recipes found. Try different ingredients!
            </p>
          </motion.div>
        </div>
      )}

      {/* Featured Recipes Section */}
      {(!query || query.length <= 2) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaUtensils className="mr-2" />
            Featured Recipes
          </h2>
          {featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-gray-500 text-center py-8">
                No featured recipes available
              </p>
            )
          )}
        </motion.div>
      )}

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 bg-gray-50 rounded-lg p-6 shadow-sm"
      >
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Start Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
              1
            </div>
            <h4 className="font-medium text-gray-800">Enter Ingredients</h4>
            <p className="text-gray-600 mt-2">
              Type what you have on hand and get instant suggestions
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
              2
            </div>
            <h4 className="font-medium text-gray-800">Browse Recipes</h4>
            <p className="text-gray-600 mt-2">
              Find the perfect recipe that matches your ingredients
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
              3
            </div>
            <h4 className="font-medium text-gray-800">Save Favorites</h4>
            <p className="text-gray-600 mt-2">
              Bookmark recipes you love for easy access later
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
