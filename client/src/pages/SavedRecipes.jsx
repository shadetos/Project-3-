import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      setLoading(true);
      try {
        // Try to get saved recipes from API
        const response = await axios.get("/api/recipes/saved");
        setRecipes(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);

        // For demo purposes, set sample data
        setRecipes([
          {
            _id: "1",
            name: "Spaghetti Carbonara",
            description:
              "Classic Italian pasta dish with eggs, cheese, pancetta, and pepper.",
            ingredients: [
              "Spaghetti",
              "Eggs",
              "Pancetta",
              "Parmesan",
              "Black Pepper",
            ],
            instructions:
              "Cook pasta, fry pancetta, mix eggs and cheese, combine all ingredients.",
            estimatedTime: "25 minutes",
            difficulty: "Medium",
          },
          {
            _id: "2",
            name: "Chicken Tikka Masala",
            description:
              "Creamy and flavorful Indian curry with marinated chicken pieces.",
            ingredients: [
              "Chicken Breast",
              "Yogurt",
              "Tomato Sauce",
              "Cream",
              "Spices",
            ],
            instructions:
              "Marinate chicken, cook in tandoor or oven, simmer in sauce.",
            estimatedTime: "45 minutes",
            difficulty: "Hard",
          },
          {
            _id: "3",
            name: "Avocado Toast",
            description:
              "Simple and nutritious breakfast with mashed avocado on toasted bread.",
            ingredients: [
              "Bread",
              "Avocado",
              "Lemon Juice",
              "Salt",
              "Red Pepper Flakes",
            ],
            instructions:
              "Toast bread, mash avocado with lemon juice and salt, spread on toast.",
            estimatedTime: "10 minutes",
            difficulty: "Easy",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedRecipes();
  }, []);

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // Try to delete from API
      await axios.delete(`/api/recipes/${recipeId}`);
      // Remove from state
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
      // Even if API fails, remove from UI for demo
      setRecipes(recipes.filter((recipe) => recipe._id !== recipeId));
      alert("Recipe deleted from view (Demo mode)");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Saved Recipes</h1>

      {recipes.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-lg text-gray-600">
            You haven't saved any recipes yet.
          </p>
          <Link
            to="/create"
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Create a Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{recipe.name}</h2>
                <p className="text-gray-600 mb-4">{recipe.description}</p>

                <div className="mb-4">
                  <h3 className="font-semibold mb-1">Ingredients:</h3>
                  <ul className="list-disc pl-5">
                    {recipe.ingredients &&
                      recipe.ingredients
                        .slice(0, 3)
                        .map((ingredient, index) => (
                          <li key={index} className="text-sm">
                            {ingredient}
                          </li>
                        ))}
                    {recipe.ingredients && recipe.ingredients.length > 3 && (
                      <li className="text-sm text-gray-500">
                        + {recipe.ingredients.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Time: {recipe.estimatedTime || "N/A"}</span>
                  <span>Difficulty: {recipe.difficulty || "N/A"}</span>
                </div>

                <div className="flex justify-between">
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteRecipe(recipe._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
