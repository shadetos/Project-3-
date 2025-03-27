// api.js
export const fetchRecipes = async (query) => {
  const response = await fetch(`/api/recipes?search=${query}`);
  return response.json();
};

export const generateRecipe = async (ingredients) => {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ingredients }),
  });
  return response.json();
};

export const getSavedRecipes = async () => {
  const response = await fetch("/api/saved");
  return response.json();
};
