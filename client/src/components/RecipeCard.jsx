import React, { useState } from "react";

function RecipeCard({ recipe, onSave }) {
  const [isSaved, setIsSaved] = useState(recipe.saved || false);
  const [isImageError, setIsImageError] = useState(false);

  const { name, image, ingredients = [], instructions } = recipe;

  const handleSave = () => {
    if (onSave) {
      onSave(recipe);
    }
    setIsSaved(true);
  };

  const handleImageError = () => {
    setIsImageError(true);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white max-w-sm mx-auto">
      {/* IMAGE (optional) */}
      {image && !isImageError ? (
        <div className="w-full h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={handleImageError}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
        </div>
      )}

      <div className="p-4">
        {/* RECIPE NAME */}
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {name || "Untitled Recipe"}
        </h2>

        {/* INGREDIENTS */}
        <div className="mb-4">
          <p className="font-semibold text-orange-600 mb-1">Ingredients:</p>
          {ingredients.length > 0 ? (
            <ul className="list-disc list-inside pl-2 text-gray-700 space-y-1">
              {ingredients.map((item, idx) => (
                <li key={idx} className="line-clamp-1">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No ingredients listed</p>
          )}
        </div>

        {/* INSTRUCTIONS */}
        {instructions && (
          <div className="mb-4">
            <p className="font-semibold text-orange-600 mb-1">Instructions:</p>
            <p className="text-gray-700 line-clamp-3">{instructions}</p>
            {instructions.length > 150 && (
              <button className="text-blue-600 hover:text-blue-800 text-sm mt-1">
                Read more
              </button>
            )}
          </div>
        )}

        {/* SAVE RECIPE BUTTON */}
        <button
          className={`w-full mt-2 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isSaved
              ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500"
              : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          }`}
          onClick={handleSave}
          disabled={isSaved}
        >
          {isSaved ? "Recipe Saved" : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}

export default RecipeCard;
