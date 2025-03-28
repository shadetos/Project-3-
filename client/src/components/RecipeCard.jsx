import React from "react";
import { Link } from "react-router-dom";
import { FaClock, FaUtensils, FaBookmark } from "react-icons/fa";

const RecipeCard = ({ recipe }) => {
  // Ensure recipe has _id property
  const recipeId = recipe._id || recipe.id;

  return (
    <div className="h-full flex flex-col">
      {/* Recipe Image */}
      {recipe.image && (
        <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      {/* Recipe Title */}
      <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>

      {/* Recipe Info */}
      <div className="flex items-center text-sm text-cinnamon mb-3">
        {recipe.estimatedTime && (
          <div className="flex items-center mr-3">
            <FaClock className="mr-1" />
            <span>{recipe.estimatedTime}</span>
          </div>
        )}

        {recipe.servings && (
          <div className="flex items-center">
            <FaUtensils className="mr-1" />
            <span>Serves {recipe.servings}</span>
          </div>
        )}
      </div>

      {/* Ingredients Preview */}
      <div className="ingredients mb-4 flex-grow">
        <strong>Ingredients:</strong>
        <p className="text-sm">
          {recipe.ingredients?.slice(0, 4).join(", ")}
          {recipe.ingredients?.length > 4 ? "..." : ""}
        </p>
      </div>

      {/* Action Button */}
      {recipeId && (
        <Link
          to={`/recipe/${recipeId}`}
          className="button w-full text-center mt-auto"
        >
          View Recipe
        </Link>
      )}
    </div>
  );
};

export default RecipeCard;
