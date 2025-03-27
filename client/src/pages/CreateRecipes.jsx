import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    ingredients: "",
    preferences: "",
  });
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateRecipe = async (e) => {
    e.preventDefault();

    if (!formData.ingredients.trim()) {
      setError("Please enter at least one ingredient");
      return;
    }

    setLoading(true);
    setError(null);
    setRecipe(null);

    // Parse ingredients into an array
    const ingredientsList = formData.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    try {
      // Use your actual API endpoint here
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add JWT if authenticated
        },
        body: JSON.stringify({
          ingredients: ingredientsList,
          preferences: formData.preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate recipe");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setRecipe(data.data);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Error generating recipe:", error);
      setError(error.message || "Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!recipe) return;

    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(recipe),
      });

      if (!response.ok) {
        throw new Error("Failed to save recipe");
      }

      const data = await response.json();
      alert("Recipe saved successfully!");

      // Optionally navigate to the saved recipe
      navigate(`/recipes/${data.data._id}`);
    } catch (error) {
      console.error("Error saving recipe:", error);
      alert("Failed to save recipe. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        AI-Powered Recipe Generator
      </h2>

      <form onSubmit={generateRecipe} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="ingredients"
            className="block text-gray-700 font-medium mb-2"
          >
            Ingredients
          </label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            placeholder="Enter ingredients separated by commas (e.g., chicken, rice, broccoli)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="preferences"
            className="block text-gray-700 font-medium mb-2"
          >
            Dietary Preferences (Optional)
          </label>
          <input
            type="text"
            id="preferences"
            name="preferences"
            value={formData.preferences}
            onChange={handleChange}
            placeholder="E.g., vegetarian, gluten-free, low-carb, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating Recipe...
            </span>
          ) : (
            "Generate Recipe"
          )}
        </button>
      </form>

      {recipe && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Generated Recipe</h3>
            <button
              onClick={saveRecipe}
              className="bg-green-600 text-white py-1 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200"
            >
              Save Recipe
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">{recipe.name}</h4>

            <div className="mb-4">
              <h5 className="font-medium text-gray-700 mb-1">Ingredients:</h5>
              <ul className="list-disc list-inside pl-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-600">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-1">Instructions:</h5>
              <p className="text-gray-600 whitespace-pre-line">
                {recipe.instructions}
              </p>
            </div>

            {recipe.estimatedCalories && (
              <div className="mt-4 text-gray-700">
                <span className="font-medium">Estimated Calories:</span>{" "}
                {recipe.estimatedCalories}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeForm;
