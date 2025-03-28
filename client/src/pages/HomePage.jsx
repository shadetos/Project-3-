import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUtensils,
  FaBookmark,
  FaHeart,
  FaClock,
} from "react-icons/fa";
import { GiCookingPot, GiFruitBowl, GiKnifeFork } from "react-icons/gi";
import { BiDish } from "react-icons/bi";
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
        setFeaturedRecipes(data?.slice(0, 6) || []); // Limit to 6 featured recipes
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
          setRecipes(data || []);
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
      className="page"
    >
      {/* Hero Section */}
      <div className="featured-recipe">
        <div className="container">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center fade-in"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-white p-4 rounded-full shadow-lg">
                <GiCookingPot className="text-5xl text-carrot" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
              Recipe Generator App
            </h1>
            <p className="text-lg md:text-xl text-cream/90 mb-8 max-w-2xl mx-auto">
              Discover delicious recipes using ingredients you already have in
              your kitchen
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="search-wrapper max-w-xl mx-auto"
            >
              <input
                type="text"
                placeholder="Enter ingredients (e.g., chicken, tomatoes, basil...)"
                className="pl-12 pr-4 py-4 w-full rounded-full"
                value={query}
                onChange={handleSearch}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Search
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative food icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="absolute left-5 bottom-5"
        >
          <GiFruitBowl className="text-8xl text-cream opacity-30" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="absolute right-5 bottom-5"
        >
          <GiKnifeFork className="text-7xl text-cream opacity-30" />
        </motion.div>
      </div>

      <div className="container">
        {/* Category Pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 fade-in"
        >
          {[
            { name: "Breakfast", class: "tag appetizer" },
            { name: "Lunch", class: "tag main-course" },
            { name: "Dinner", class: "tag main-course" },
            { name: "Desserts", class: "tag dessert" },
            { name: "Vegetarian", class: "tag quick" },
            { name: "Quick Meals", class: "tag quick" },
          ].map((category) => (
            <motion.button
              key={category.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={category.class}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-12">
            <LoadingSpinner />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-tomato-red/10 border-l-4 border-tomato-red text-tomato-red p-4 mb-8 rounded shadow-md"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-tomato-red"
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
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Results */}
        {query.length > 2 && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 fade-in"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cinnamon flex items-center">
                <FaSearch className="mr-2 text-paprika" />
                Search Results
              </h2>
              <span className="text-cinnamon font-medium">
                {recipes.length} recipes found
              </span>
            </div>

            <div className="recipe-grid">
              {recipes.map((recipe, index) => (
                <motion.div
                  key={recipe._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="recipe-card"
                >
                  <RecipeCard recipe={recipe} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Results Message */}
        {query.length > 2 && recipes.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-mango/10 border-l-4 border-mango p-6 rounded-lg shadow-md inline-block"
            >
              <BiDish className="text-5xl text-mango mx-auto mb-3" />
              <p className="text-cinnamon font-medium">
                No recipes found with those ingredients.
              </p>
              <p className="text-cinnamon/70 mt-2">
                Try different ingredients or check our featured recipes!
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
            className="mb-16 fade-in"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-cinnamon flex items-center">
                <FaUtensils className="mr-3 text-paprika" />
                Featured Recipes
              </h2>
              <motion.a
                href="/recipes"
                whileHover={{ x: 3 }}
                className="text-carrot hover:text-paprika font-medium flex items-center"
              >
                View all recipes
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
            </div>

            {featuredRecipes.length > 0 ? (
              <div className="recipe-grid">
                {featuredRecipes.map((recipe, index) => (
                  <motion.div
                    key={recipe._id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="recipe-card"
                  >
                    <div className="new-recipe-badge">Featured</div>
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="recipe-card">
                  <p className="text-cinnamon">
                    No featured recipes available at the moment
                  </p>
                </div>
              )
            )}
          </motion.div>
        )}

        {/* Quick Start Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 mb-12 bg-cream rounded-xl p-8 shadow-md fade-in"
        >
          <h3 className="text-2xl font-bold text-cinnamon mb-6 flex items-center">
            <GiCookingPot className="mr-2 text-paprika" />
            Recipe Inspiration
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="recipe-card">
              <div className="w-12 h-12 bg-mango/20 rounded-full flex items-center justify-center text-mango mb-4">
                <FaSearch className="text-xl" />
              </div>
              <h4 className="font-semibold text-cinnamon text-lg mb-2">
                Find Recipes
              </h4>
              <p className="ingredients">
                Search by ingredients you already have in your kitchen pantry
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="recipe-card">
              <div className="w-12 h-12 bg-tomato-red/20 rounded-full flex items-center justify-center text-tomato-red mb-4">
                <FaClock className="text-xl" />
              </div>
              <h4 className="font-semibold text-cinnamon text-lg mb-2">
                Quick & Easy
              </h4>
              <p className="ingredients">
                Discover recipes that take 30 minutes or less to prepare
              </p>
              <span className="time">30 min or less</span>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="recipe-card">
              <div className="w-12 h-12 bg-honey/20 rounded-full flex items-center justify-center text-honey mb-4">
                <FaBookmark className="text-xl" />
              </div>
              <h4 className="font-semibold text-cinnamon text-lg mb-2">
                Save Favorites
              </h4>
              <p className="ingredients">
                Bookmark your favorite recipes for quick access anytime
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="featured-recipe text-center mb-12 fade-in"
        >
          <h3 className="text-2xl font-bold mb-4">
            Ready to create your own recipe?
          </h3>
          <p className="mb-6 max-w-2xl mx-auto">
            Let our AI-powered recipe generator create custom recipes based on
            your ingredients and preferences!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="button secondary"
          >
            Generate Recipe Now
          </motion.button>
        </motion.div>

        {/* Food Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 fade-in"
        >
          <div className="recipe-card text-center">
            <div className="text-3xl mb-2">🍳</div>
            <h4 className="font-bold">Breakfast</h4>
          </div>
          <div className="recipe-card text-center">
            <div className="text-3xl mb-2">🥪</div>
            <h4 className="font-bold">Lunch</h4>
          </div>
          <div className="recipe-card text-center">
            <div className="text-3xl mb-2">🍲</div>
            <h4 className="font-bold">Dinner</h4>
          </div>
          <div className="recipe-card text-center">
            <div className="text-3xl mb-2">🍰</div>
            <h4 className="font-bold">Desserts</h4>
          </div>
        </motion.div>
      </div>

      {/* Newsletter */}
      <footer>
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Get weekly recipe inspiration
            </h3>
            <p className="mb-6">
              Subscribe to our newsletter and never miss a delicious recipe
              again!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-3 rounded-md focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
};

export default HomePage;
