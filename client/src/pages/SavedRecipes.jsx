// SavedRecipes.jsx
import React, { useEffect, useState } from "react";
import { getSavedRecipes } from "../services/api";

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchSaved = async () => {
      const data = await getSavedRecipes();
      setRecipes(data);
    };
    fetchSaved();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Saved Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id} className="border p-2 mb-2">
            {recipe.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedRecipes;
