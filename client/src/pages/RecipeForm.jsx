// RecipeForm.jsx
import React, { useState } from "react";
import { generateRecipe } from "../services/api";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await generateRecipe(ingredients);
    setRecipe(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Generate a Recipe</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter ingredients..."
          className="border p-2 w-full"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white p-2">
          Generate Recipe
        </button>
      </form>
      {recipe && (
        <div className="mt-4 p-4 border">
          <h2 className="text-xl font-bold">{recipe.name}</h2>
          <p>{recipe.instructions}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeForm;
