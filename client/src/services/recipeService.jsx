import apiClient from '../utils/apiClient';

export const getRecipes = async () => {
  try {
    const response = await apiClient.get('/recipes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch recipes");
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await apiClient.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch the recipe");
  }
};

export const createRecipe = async (recipeData) => {
  try {
    const response = await apiClient.post('/recipes', recipeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create recipe");
  }
};

export const updateRecipe = async (id, recipeData) => {
  try {
    const response = await apiClient.put(`/recipes/${id}`, recipeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update recipe");
  }
};

export const deleteRecipe = async (id) => {
  try {
    const response = await apiClient.delete(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete recipe");
  }
};

export default { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
