// RecipeCard.jsx
import React from "react";

const RecipeCard = ({ recipe }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-bold">{recipe.name}</h2>
      <p>{recipe.ingredients.join(", ")}</p>
    </div>
  );
};

export default RecipeCard;
