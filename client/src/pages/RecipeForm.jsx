import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUtensils, FaSpinner } from "react-icons/fa";
import { GiCookingPot } from "react-icons/gi";
import { generateRecipe } from "../services/api";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState("");
  const [preferences, setPreferences] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Parse ingredients from comma-separated string to array
      const ingredientsArray = ingredients
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const data = await generateRecipe(ingredientsArray, preferences);
      setRecipe(data);
    } catch (err) {
      console.error("Error generating recipe:", err);
      setError("Failed to generate recipe. Please try again.");
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <div className="text-center mb-8">
          <GiCookingPot className="text-5xl text-carrot mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-cinnamon mb-2">
            Generate a Custom Recipe
          </h1>
          <p className="text-cinnamon/80">
            Enter ingredients you have on hand and we'll create a delicious
            recipe just for you!
          </p>
        </div>

        <div className="recipe-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="ingredients"
                className="block text-cinnamon font-medium mb-2"
              >
                Ingredients
              </label>
              <div className="search-wrapper">
                <input
                  id="ingredients"
                  type="text"
                  placeholder="Enter ingredients separated by commas (e.g., chicken, rice, broccoli)"
                  className="text-cinnamon"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="preferences"
                className="block text-cinnamon font-medium mb-2"
              >
                Dietary Preferences (Optional)
              </label>
              <input
                id="preferences"
                type="text"
                placeholder="E.g., vegetarian, gluten-free, low-carb"
                className="border p-3 w-full rounded-lg text-cinnamon"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-tomato-red/10 border-l-4 border-tomato-red p-3 rounded">
                <p className="text-tomato-red">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="button w-full flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Generating
                  Recipe...
                </>
              ) : (
                <>
                  <FaUtensils className="mr-2" /> Generate Recipe
                </>
              )}
            </button>
          </form>
        </div>

        {recipe && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 recipe-card"
          >
            <h2 className="text-2xl font-bold">{recipe.name}</h2>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Ingredients:</h3>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-cinnamon">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-lg mb-2">Instructions:</h3>
              <div className="text-cinnamon whitespace-pre-line">
                {recipe.instructions}
              </div>
            </div>

            {recipe.estimatedCalories && (
              <div className="mt-4 bg-cream rounded-lg p-3 inline-block">
                <span className="font-semibold">Estimated Calories:</span>{" "}
                {recipe.estimatedCalories}
              </div>
            )}

            <button
              onClick={() => window.print()}
              className="button secondary mt-6"
            >
              Print Recipe
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default RecipeForm;
