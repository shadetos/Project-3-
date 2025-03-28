import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaClock,
  FaUtensils,
  FaArrowLeft,
  FaBookmark,
  FaPrint,
} from "react-icons/fa";
import { getRecipeById } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        setLoading(true);
        const data = await getRecipeById(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        setError("Failed to load recipe details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleSaveRecipe = () => {
    // Implement saving functionality here
    setSaved(!saved);
  };

  const handlePrintRecipe = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-tomato-red/10 border-l-4 border-tomato-red text-tomato-red p-4 rounded">
          <p>{error}</p>
          <Link
            to="/"
            className="mt-4 inline-block text-paprika hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-mango/10 border-l-4 border-mango p-4 rounded">
          <p className="text-cinnamon">Recipe not found.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-paprika hover:underline"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container max-w-4xl mx-auto px-4 py-8"
    >
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-paprika hover:text-carrot transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Recipes
        </Link>
      </div>

      <div className="recipe-card p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-paprika">{recipe.name}</h1>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveRecipe}
            className={`p-2 rounded-full ${
              saved ? "bg-carrot text-white" : "bg-cream text-carrot"
            }`}
          >
            <FaBookmark />
          </motion.button>
        </div>

        {recipe.image && (
          <div className="mb-6">
            <img
              src={recipe.image}
              alt={recipe.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          {recipe.estimatedTime && (
            <div className="bg-honey/20 text-honey px-3 py-1 rounded-full text-sm font-medium">
              <FaClock className="inline mr-1" /> {recipe.estimatedTime}
            </div>
          )}

          {recipe.servings && (
            <div className="bg-carrot/20 text-carrot px-3 py-1 rounded-full text-sm font-medium">
              <FaUtensils className="inline mr-1" /> Serves {recipe.servings}
            </div>
          )}

          {recipe.diets &&
            recipe.diets.map((diet) => (
              <div
                key={diet}
                className="bg-olive/20 text-olive px-3 py-1 rounded-full text-sm font-medium"
              >
                {diet}
              </div>
            ))}
        </div>

        {recipe.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-cinnamon mb-2">Summary</h2>
            <div
              className="text-cinnamon"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-cinnamon mb-2">Ingredients</h2>
          <ul className="list-disc pl-5 space-y-1">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-cinnamon">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-cinnamon mb-2">Instructions</h2>
          <div
            className="text-cinnamon"
            dangerouslySetInnerHTML={{
              __html: recipe.instructions.replace(/\n/g, "<br>"),
            }}
          />
        </div>

        {recipe.estimatedCalories && (
          <div className="mb-6">
            <div className="bg-cream rounded-lg p-3 inline-block">
              <span className="font-semibold">Estimated Calories:</span>{" "}
              {recipe.estimatedCalories}
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8 print:hidden">
          <button onClick={handlePrintRecipe} className="button flex-1">
            <FaPrint className="mr-2" /> Print Recipe
          </button>
          <button
            onClick={handleSaveRecipe}
            className="button secondary flex-1"
          >
            {saved ? "Saved" : "Save Recipe"}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetailPage;
