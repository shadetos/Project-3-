// TODO: Form page that gathers recipe details and sends them to the server or AI for generation.

import React, { useState } from "react";

const RecipeForm = () => {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setIngredients(event.target.value);
  };

  const generateRecipe = async () => {
    if (!ingredients.trim()) {
      alert("Please enter some ingredients.");
      return;
    }

    setLoading(true);
    setRecipe(null);

    try {
      const response = await fetch("https://api.example.com/generate-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
      });

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      alert("Failed to generate recipe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>AI-Powered Recipe Generator</h2>
      <textarea
        style={styles.textarea}
        value={ingredients}
        onChange={handleChange}
        placeholder="Enter ingredients, separated by commas..."
      />
      <button style={styles.button} onClick={generateRecipe} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipe"}
      </button>
      {recipe && (
        <div style={styles.recipeContainer}>
          <h3>Generated Recipe:</h3>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "400px",
    margin: "20px auto",
    textAlign: "center",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  textarea: {
    width: "100%",
    height: "80px",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    marginTop: "10px",
    padding: "10px 15px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
  },
  recipeContainer: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#fff",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.1)",
  },
};

export default RecipeForm;