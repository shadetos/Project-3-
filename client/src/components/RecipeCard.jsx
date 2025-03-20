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
    <div style={styles.card}>
      {image && (
        <img
          src={image}
          alt={name}
          style={styles.image}
        />
      )}
      <div style={styles.content}>
        <h2 style={styles.title}>{name}</h2>
        <p style={styles.sectionTitle}>Ingredients:</p>
        <ul>
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        {instructions && (
          <>
            <p style={styles.sectionTitle}>Instructions:</p>
            <p>{instructions}</p>
          </>
        )}
        <button style={styles.button}>Save Recipe</button>
      </div>
    </div>
  );
}

// Basic inline styles (Subject to Change)
const styles = {
  card: {
    border: '1px solid #ccc',
    borderRadius: '6px',
    margin: '1rem',
    maxWidth: '400px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    objectFit: 'cover',
  },
  content: {
    padding: '1rem',
  },
  title: {
    marginTop: 0,
    marginBottom: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  sectionTitle: {
    marginBottom: '0.25rem',
    fontWeight: 'bold',
    marginTop: '0.75rem',
  },
  button: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#ff9800',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default RecipeCard;
