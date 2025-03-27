// HomePage.jsx
import React, { useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { fetchRecipes } from "../services/api";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const handleSearch = async (e) => {
    setQuery(e.target.value);
    if (e.target.value.length > 1) {
      const data = await fetchRecipes(e.target.value);
      setRecipes(data);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Recipe Generator</h1>
      <input
        type="text"
        placeholder="Search for recipes..."
        className="border p-2 w-full"
        value={query}
        onChange={handleSearch}
      />
      <div className="grid grid-cols-3 gap-4 mt-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
