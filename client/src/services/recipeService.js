// TODO: Manages recipe-related API calls (fetching, creating, updating, deleting recipes).
const API_URL = 'https://api.example.com/recipes';

export const fetchRecipes = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching recipes:', error);
        throw error;
    }
};

export const createRecipe = async (recipe) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });
        if (!response.ok) {
            throw new Error('Failed to create recipe');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating recipe:', error);
        throw error;
    }
};

export const updateRecipe = async (id, recipe) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(recipe),
        });
        if (!response.ok) {
            throw new Error('Failed to update recipe');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating recipe:', error);
        throw error;
    }
};

export const deleteRecipe = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete recipe');
        }
        return true;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        throw error;
    }
};