import React, { createContext, useState, useEffect } from "react";
import { fetchRecipes, generateRecipe, getSavedRecipes } from "../services/api";

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch saved recipes on mount
  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        setLoading(true);
        const data = await getSavedRecipes();
        setSavedRecipes(data);
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSavedRecipes();
  }, []);

  // Search for recipes dynamically as user types
  const searchRecipes = async (query) => {
    if (!query) {
      setRecipes([]);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchRecipes(query);
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate a recipe using AI
  const createRecipe = async (ingredients) => {
    try {
      setLoading(true);
      const newRecipe = await generateRecipe(ingredients);
      setRecipes((prev) => [newRecipe, ...prev]);
      return newRecipe;
    } catch (error) {
      console.error("Error generating recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecipeContext.Provider
      value={{ recipes, savedRecipes, loading, searchRecipes, createRecipe }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
