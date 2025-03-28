import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaUtensils,
  FaBookmark,
  FaHeart,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { GiCookingPot, GiFruitBowl, GiKnifeFork } from "react-icons/gi";
import { BiDish } from "react-icons/bi";
import RecipeCard from "../components/RecipeCard";
import { fetchRecipes, generateRecipeWithAI } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [activeFilter, setActiveFilter] = useState("");

  // AI Recipe Generator states
  const [aiIngredients, setAiIngredients] = useState("");
  const [generatingRecipe, setGeneratingRecipe] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);
  const [showGeneratedRecipe, setShowGeneratedRecipe] = useState(false);

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
          setActiveFilter(""); // Clear any active category filter
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

  // Execute search when button is clicked or Enter is pressed
  const executeSearch = () => {
    if (query.trim().length > 0) {
      // This will trigger the useEffect that performs the search
      setQuery(query.trim());
    }
  };

  // Handle category filter button clicks
  const handleFilterClick = async (category) => {
    try {
      setLoading(true);

      // Toggle filter off if clicking the same category
      if (activeFilter === category) {
        setActiveFilter("");
        // Show featured recipes when clearing filter
        setRecipes([]);
        return;
      }

      setActiveFilter(category);
      setQuery(""); // Clear search query when filtering by category

      // Fetch recipes filtered by the selected category
      const data = await fetchRecipes(category);
      setRecipes(data || []);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${category} recipes:`, err);
      setError(`Failed to load ${category} recipes. Please try again.`);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle AI recipe generation
  const handleGenerateRecipe = async () => {
    if (!aiIngredients.trim()) {
      setError("Please enter ingredients first");
      return;
    }

    try {
      setGeneratingRecipe(true);
      setError(null);

      // Parse ingredients from comma-separated string to array
      const ingredientsArray = aiIngredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      console.log("Generating recipe with ingredients:", ingredientsArray);

      // Use Spoonacular for now since we have issues with OpenAI
      const recipe = await generateRecipeWithAI(ingredientsArray);

      console.log("Generated recipe:", recipe);
      setGeneratedRecipe(recipe);
      setShowGeneratedRecipe(true);
    } catch (err) {
      console.error("Error generating AI recipe:", err);
      setError("Failed to generate recipe. Please try again.");
    } finally {
      setGeneratingRecipe(false);
    }
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
                className="pl-12 pr-4 py-4 w-full rounded-full text-cinnamon"
                value={query}
                onChange={handleSearch}
                onKeyPress={(e) => e.key === "Enter" && executeSearch()}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={executeSearch}
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
              className={`${category.class} ${
                activeFilter === category.name
                  ? "ring-2 ring-offset-2 ring-carrot"
                  : ""
              }`}
              onClick={() => handleFilterClick(category.name)}
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

        {/* Search/Filter Results Section */}
        {(query.length > 2 || activeFilter) && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 fade-in"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cinnamon flex items-center">
                <FaSearch className="mr-2 text-paprika" />
                {activeFilter ? `${activeFilter} Recipes` : "Search Results"}
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
        {(query.length > 2 || activeFilter) &&
          recipes.length === 0 &&
          !loading &&
          !error && (
            <div className="text-center py-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-mango/10 border-l-4 border-mango p-6 rounded-lg shadow-md inline-block"
              >
                <BiDish className="text-5xl text-mango mx-auto mb-3" />
                <p className="text-cinnamon font-medium">
                  No recipes found
                  {activeFilter
                    ? ` for ${activeFilter}`
                    : " with those ingredients"}
                  .
                </p>
                <p className="text-cinnamon/70 mt-2">
                  Try{" "}
                  {activeFilter
                    ? "a different category"
                    : "different ingredients"}{" "}
                  or check our featured recipes!
                </p>
              </motion.div>
            </div>
          )}

        {/* Featured Recipes Section - Show only when no search/filter is active */}
        {!query && !activeFilter && recipes.length === 0 && (
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

        {/* AI Recipe Generator Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="featured-recipe mb-12 fade-in"
        >
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">
              Ready to create your own recipe?
            </h3>
            <p className="mb-6 max-w-2xl mx-auto">
              Let our AI-powered recipe generator create custom recipes based on
              your ingredients!
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="search-wrapper mb-4">
              <input
                type="text"
                placeholder="Enter ingredients you have (e.g., chicken, rice, broccoli)..."
                className="pl-12 pr-4 py-4 w-full rounded-full text-cinnamon"
                value={aiIngredients}
                onChange={(e) => setAiIngredients(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleGenerateRecipe()}
              />
            </div>

            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="button secondary"
                onClick={handleGenerateRecipe}
                disabled={generatingRecipe}
              >
                {generatingRecipe ? (
                  <>
                    <div className="spinner-sm spinner-white mr-2"></div>
                    Generating Recipe...
                  </>
                ) : (
                  "Generate Recipe Now"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Recipe Inspiration Section */}
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
                className="px-4 py-3 rounded-md focus:outline-none text-cinnamon"
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

      {/* Generated Recipe Modal */}
      {showGeneratedRecipe && generatedRecipe && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-paprika">
                {generatedRecipe.name}
              </h2>
              <button
                onClick={() => setShowGeneratedRecipe(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {generatedRecipe.image && (
              <img
                src={generatedRecipe.image}
                alt={generatedRecipe.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}

            <div className="mb-4">
              {generatedRecipe.estimatedTime && (
                <div className="inline-block bg-honey/20 text-honey px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                  <FaClock className="inline mr-1" />{" "}
                  {generatedRecipe.estimatedTime}
                </div>
              )}

              {generatedRecipe.servings && (
                <div className="inline-block bg-carrot/20 text-carrot px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                  <FaUtensils className="inline mr-1" /> Serves{" "}
                  {generatedRecipe.servings}
                </div>
              )}

              {generatedRecipe.ai_generated && (
                <div className="inline-block bg-paprika/20 text-paprika px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                  AI Generated
                </div>
              )}
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 text-cinnamon">
                Ingredients:
              </h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                {generatedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-cinnamon">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-lg mb-2 text-cinnamon">
                Instructions:
              </h3>
              <div
                className="text-cinnamon"
                dangerouslySetInnerHTML={{
                  __html: generatedRecipe.instructions.replace(/\n/g, "<br>"),
                }}
              />
            </div>

            {generatedRecipe.estimatedCalories && (
              <div className="mt-4 mb-4">
                <div className="bg-cream rounded-lg p-3 inline-block">
                  <span className="font-semibold">Estimated Calories:</span>{" "}
                  {generatedRecipe.estimatedCalories}
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-6">
              {generatedRecipe._id && (
                <Link
                  to={`/recipe/${generatedRecipe._id}`}
                  className="button flex-1 text-center"
                >
                  View Full Recipe
                </Link>
              )}
              <button
                onClick={() => setShowGeneratedRecipe(false)}
                className="button secondary flex-1"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default HomePage;
