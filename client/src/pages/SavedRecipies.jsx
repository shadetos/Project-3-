// TODO: Displays all the user's bookmarked or saved recipes with options to view/edit/delete.
import React, { useState, useEffect } from 'react';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    // Fetch saved recipes from the server
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/saved-recipes');
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/saved-recipes/${id}`, {
        method: 'DELETE',
      });
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  return (
    <div className="saved-recipes-container">
      <h2>Saved Recipes</h2>
      {recipes.length === 0 ? (
        <p>No saved recipes found.</p>
      ) : (
        <ul>
          {recipes.map(recipe => (
            <li key={recipe.id} className="recipe-item">
              <h3>{recipe.title}</h3>
              <p>{recipe.description}</p>
              <div className="recipe-actions">
                <button onClick={() => alert('View recipe')}>View</button>
                <button onClick={() => alert('Edit recipe')}>Edit</button>
                <button onClick={() => handleDelete(recipe.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedRecipes;