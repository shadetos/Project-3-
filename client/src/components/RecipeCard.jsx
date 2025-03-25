// TODO: Display individual recipe info (name, ingredients, instructions, etc.) in a card layout.
import React from 'react';

/* Example usage of RecipeCard component
import React from 'react';
import RecipeCard from '../components/RecipeCard';

function SomeRecipePage() {
  const dummyRecipe = {
    name: 'Spaghetti Bolognese',
    image: 'https://example.com/spaghetti.jpg',
    ingredients: ['Pasta', 'Tomato Sauce', 'Ground Beef', 'Onions', 'Garlic'],
    instructions: 'Cook pasta, brown beef with onions, add sauce. Combine.',
  };
  return (
    <div>
      <h1>My Recipes</h1>
      <RecipeCard recipe={dummyRecipe} />
    </div>
  );
}
export default SomeRecipePage;
*/

function RecipeCard({ recipe }) {
    const {
      name,
      image,
      ingredients = [],
      instructions,
    } = recipe;
  
    return (
      <div className="border border-gray-300 rounded-md m-md max-w-sm shadow-sm overflow-hidden">
        {/* IMAGE (optional) */}
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full object-cover"
          />
        )}
  
        <div className="p-md">
          {/* RECIPE NAME */}
          <h2 className="text-xl font-bold text-primary mt-0 mb-sm">
            {name}
          </h2>
  
          {/* INGREDIENTS */}
          <p className="font-semibold mt-md mb-sm text-orange-brand">Ingredients:</p>
          <ul className="list-disc list-inside pl-md text-gray-dark">
            {ingredients.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
  
          {/* INSTRUCTIONS */}
          {instructions && (
            <>
              <p className="font-semibold mt-md mb-sm text-orange-brand">Instructions:</p>
              <p className="text-gray-dark">{instructions}</p>
            </>
          )}
  
          {/* SAVE RECIPE BUTTON */}
          <button className="mt-md px-md py-sm rounded bg-primary text-white hover:bg-red-600 font-semibold">
            Save Recipe
          </button>
        </div>
      </div>
    );
  }
  
  export default RecipeCard;