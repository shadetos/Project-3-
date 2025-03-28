// src/services/api.js

// Your Spoonacular API key
const SPOONACULAR_API_KEY = "cc277278ff084e62ad8eb05b0f2ca15d"; // Replace with your actual API key
const SPOONACULAR_BASE_URL = "https://api.spoonacular.com";

// Mock data for fallback
const mockRecipes = [
  {
    _id: "1",
    name: "Pasta with Tomato Sauce",
    image: "https://spoonacular.com/recipeImages/654959-556x370.jpg",
    ingredients: ["pasta", "tomato sauce", "garlic", "olive oil"],
    instructions:
      "Cook pasta according to package. Heat sauce. Combine and serve.",
    estimatedTime: "20 mins",
    servings: 4,
  },
  {
    _id: "2",
    name: "Chicken Stir Fry",
    image: "https://spoonacular.com/recipeImages/654812-556x370.jpg",
    ingredients: ["chicken breast", "bell peppers", "soy sauce", "rice"],
    instructions: "Cook chicken. Add vegetables. Serve over rice.",
    estimatedTime: "30 mins",
    servings: 2,
  },
  {
    _id: "3",
    name: "Vegetable Soup",
    image: "https://spoonacular.com/recipeImages/715447-556x370.jpg",
    ingredients: ["carrot", "celery", "onion", "vegetable broth", "herbs"],
    instructions:
      "Sauté vegetables. Add broth. Simmer until vegetables are tender.",
    estimatedTime: "45 mins",
    servings: 6,
  },
  {
    _id: "4",
    name: "Berry Smoothie",
    image: "https://spoonacular.com/recipeImages/659135-556x370.jpg",
    ingredients: ["mixed berries", "banana", "yogurt", "milk", "honey"],
    instructions: "Blend all ingredients until smooth. Serve chilled.",
    estimatedTime: "5 mins",
    servings: 1,
  },
  {
    _id: "5",
    name: "Grilled Cheese Sandwich",
    image: "https://spoonacular.com/recipeImages/640166-556x370.jpg",
    ingredients: ["bread", "cheddar cheese", "butter"],
    instructions:
      "Butter bread. Add cheese between slices. Grill until golden and cheese is melted.",
    estimatedTime: "10 mins",
    servings: 1,
  },
  {
    _id: "6",
    name: "Chocolate Chip Cookies",
    image: "https://spoonacular.com/recipeImages/655270-556x370.jpg",
    ingredients: [
      "flour",
      "butter",
      "sugar",
      "chocolate chips",
      "eggs",
      "vanilla",
    ],
    instructions:
      "Mix ingredients. Form cookies. Bake at 350°F for 12 minutes.",
    estimatedTime: "25 mins",
    servings: 24,
  },
];

// API helper with error handling and fallback
const callSpoonacularAPI = async (url, mockResponse) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("API Error:", errorData);

      if (response.status === 402) {
        console.warn("Daily API limit reached, using mock data");
        return mockResponse;
      }

      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error calling Spoonacular API:", error);
    console.warn("Using mock data instead");
    return mockResponse;
  }
};

// Fetch recipes by search query
export const fetchRecipes = async (query) => {
  try {
    // If it's a featured request, get random recipes
    if (query === "featured") {
      return fetchFeaturedRecipes();
    }

    // Search for recipes by query
    const url = `${SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&query=${encodeURIComponent(
      query
    )}&number=9&addRecipeInformation=true&fillIngredients=true`;

    const data = await callSpoonacularAPI(url, {
      results: mockRecipes.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.ingredients.some((i) =>
            i.toLowerCase().includes(query.toLowerCase())
          )
      ),
    });

    // Transform Spoonacular response to match your app's expected format
    return (data.results || []).map((recipe) => ({
      _id: recipe.id?.toString() || recipe._id,
      name: recipe.title || recipe.name,
      image: recipe.image,
      ingredients:
        recipe.extendedIngredients?.map((ing) => ing.original) ||
        recipe.ingredients,
      instructions: recipe.instructions || "Instructions not available",
      estimatedTime: recipe.readyInMinutes
        ? `${recipe.readyInMinutes} mins`
        : recipe.estimatedTime,
      servings: recipe.servings,
    }));
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Return filtered mock recipes as fallback
    return mockRecipes.filter(
      (r) =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.ingredients.some((i) => i.toLowerCase().includes(query.toLowerCase()))
    );
  }
};

// Fetch featured recipes (random recipes from Spoonacular)
export const fetchFeaturedRecipes = async () => {
  try {
    const url = `${SPOONACULAR_BASE_URL}/recipes/random?apiKey=${SPOONACULAR_API_KEY}&number=6&tags=main course`;

    const data = await callSpoonacularAPI(url, { recipes: mockRecipes });

    // Transform Spoonacular response to match your app's expected format
    return (data.recipes || []).map((recipe) => ({
      _id: recipe.id?.toString() || recipe._id,
      name: recipe.title || recipe.name,
      image: recipe.image,
      ingredients:
        recipe.extendedIngredients?.map((ing) => ing.original) ||
        recipe.ingredients,
      instructions: recipe.instructions || "Instructions not available",
      estimatedTime: recipe.readyInMinutes
        ? `${recipe.readyInMinutes} mins`
        : recipe.estimatedTime,
      servings: recipe.servings,
    }));
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    return mockRecipes; // Return mock recipes as fallback
  }
};

// Fetch recipes by ingredients
export const fetchRecipesByIngredients = async (ingredients) => {
  try {
    const ingredientsParam = Array.isArray(ingredients)
      ? ingredients.join(",")
      : ingredients;

    const url = `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(
      ingredientsParam
    )}&number=9&ranking=1&ignorePantry=false`;

    const data = await callSpoonacularAPI(
      url,
      mockRecipes.filter((r) =>
        ingredients.some((ing) =>
          r.ingredients.some((i) => i.toLowerCase().includes(ing.toLowerCase()))
        )
      )
    );

    // If using mock data, return it directly
    if (!Array.isArray(data)) {
      return data;
    }

    // Fetch additional details for each recipe
    const detailedRecipes = await Promise.all(
      data.map(async (recipe) => {
        const detailUrl = `${SPOONACULAR_BASE_URL}/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`;

        const mockDetailedRecipe = mockRecipes.find(
          (r) => r._id === recipe.id?.toString()
        ) || {
          _id: recipe.id?.toString(),
          name: recipe.title,
          image: recipe.image,
          ingredients:
            recipe.usedIngredients
              ?.concat(recipe.missedIngredients)
              .map((ing) => ing.original) || [],
          instructions: "Instructions not available",
          estimatedTime: "N/A",
          servings: 4,
        };

        const detailData = await callSpoonacularAPI(
          detailUrl,
          mockDetailedRecipe
        );

        return {
          _id: recipe.id?.toString() || recipe._id,
          name: detailData.title || recipe.title || recipe.name,
          image: recipe.image,
          ingredients:
            detailData.extendedIngredients?.map((ing) => ing.original) ||
            recipe.usedIngredients
              ?.concat(recipe.missedIngredients)
              .map((ing) => ing.original) ||
            recipe.ingredients ||
            [],
          instructions: detailData.instructions || "Instructions not available",
          estimatedTime: detailData.readyInMinutes
            ? `${detailData.readyInMinutes} mins`
            : "N/A",
          servings: detailData.servings || 4,
        };
      })
    );

    return detailedRecipes;
  } catch (error) {
    console.error("Error fetching recipes by ingredients:", error);
    // Return filtered mock recipes as fallback
    return mockRecipes.filter((r) =>
      ingredients.some((ing) =>
        r.ingredients.some((i) => i.toLowerCase().includes(ing.toLowerCase()))
      )
    );
  }
};

// Get recipe details by ID
export const getRecipeById = async (recipeId) => {
  try {
    const url = `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`;

    // Find mock recipe for fallback
    const mockRecipe =
      mockRecipes.find((r) => r._id === recipeId) || mockRecipes[0];

    const recipe = await callSpoonacularAPI(url, mockRecipe);

    return {
      _id: recipe.id?.toString() || recipe._id,
      name: recipe.title || recipe.name,
      image: recipe.image,
      ingredients:
        recipe.extendedIngredients?.map((ing) => ing.original) ||
        recipe.ingredients,
      instructions: recipe.instructions || "Instructions not available",
      summary: recipe.summary,
      estimatedTime: recipe.readyInMinutes
        ? `${recipe.readyInMinutes} mins`
        : recipe.estimatedTime,
      servings: recipe.servings,
      sourceUrl: recipe.sourceUrl,
    };
  } catch (error) {
    console.error(`Error fetching recipe details for ID ${recipeId}:`, error);
    // Return a mock recipe as fallback
    const mockRecipe =
      mockRecipes.find((r) => r._id === recipeId) || mockRecipes[0];
    return mockRecipe;
  }
};

// Generate a recipe based on ingredients using Spoonacular API
export const generateRecipe = async (ingredients, preferences = null) => {
  try {
    // Make sure ingredients is properly formatted
    const ingredientsParam = Array.isArray(ingredients)
      ? ingredients.join(",")
      : ingredients;

    // Build the API URL with parameters
    let url = `${SPOONACULAR_BASE_URL}/recipes/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${encodeURIComponent(
      ingredientsParam
    )}&number=1&ranking=1&ignorePantry=false`;

    // Add dietary preferences if provided
    if (preferences) {
      url = `${SPOONACULAR_BASE_URL}/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&includeIngredients=${encodeURIComponent(
        ingredientsParam
      )}&diet=${encodeURIComponent(
        preferences
      )}&number=1&addRecipeInformation=true&fillIngredients=true`;
    }

    // Create filter function for mock data
    const mockFilter = () => {
      const filteredRecipes = mockRecipes.filter((r) =>
        ingredients.some((ing) =>
          r.ingredients.some((i) => i.toLowerCase().includes(ing.toLowerCase()))
        )
      );
      return filteredRecipes.length > 0 ? filteredRecipes[0] : mockRecipes[0];
    };

    // Search for recipes that match the ingredients
    let data;
    let recipeId;

    if (preferences) {
      data = await callSpoonacularAPI(url, { results: [mockFilter()] });

      if (!data.results || data.results.length === 0) {
        throw new Error(
          "No recipes found with those ingredients and preferences"
        );
      }
      recipeId = data.results[0].id || mockFilter()._id;
    } else {
      data = await callSpoonacularAPI(url, [mockFilter()]);

      if (!data || data.length === 0) {
        throw new Error("No recipes found with those ingredients");
      }
      recipeId = data[0].id || mockFilter()._id;
    }

    // Get detailed recipe information
    const detailUrl = `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`;
    const recipeDetail = await callSpoonacularAPI(detailUrl, mockFilter());

    // Transform the data to match your app's expected format
    return {
      _id: recipeDetail.id?.toString() || recipeDetail._id,
      name: recipeDetail.title || recipeDetail.name,
      image: recipeDetail.image,
      ingredients:
        recipeDetail.extendedIngredients?.map((ing) => ing.original) ||
        recipeDetail.ingredients,
      instructions: recipeDetail.instructions || "Instructions not available",
      summary: recipeDetail.summary,
      estimatedTime: recipeDetail.readyInMinutes
        ? `${recipeDetail.readyInMinutes} mins`
        : recipeDetail.estimatedTime,
      servings: recipeDetail.servings,
      estimatedCalories:
        Math.round(
          recipeDetail.nutrition?.nutrients?.find((n) => n.name === "Calories")
            ?.amount
        ) || 500,
      diets: recipeDetail.diets || [],
      sourceUrl: recipeDetail.sourceUrl,
    };
  } catch (error) {
    console.error("Error generating recipe:", error);

    // Return a mock recipe as fallback
    const mockRecipe =
      mockRecipes.find((r) =>
        ingredients.some((ing) =>
          r.ingredients.some((i) => i.toLowerCase().includes(ing.toLowerCase()))
        )
      ) || mockRecipes[0];

    return {
      ...mockRecipe,
      estimatedCalories: 500,
      diets: ["mockDiet"],
      summary: `A delicious recipe featuring ${ingredients.join(", ")}.`,
    };
  }
};

// Save a recipe to user favorites (mock implementation)
export const saveRecipe = async (recipe) => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return success response
    return {
      success: true,
      message: "Recipe saved successfully",
    };
  } catch (error) {
    console.error("Error saving recipe:", error);
    throw error;
  }
};

// Get saved recipes (mock implementation)
export const getSavedRecipes = async () => {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return mock saved recipes
    return mockRecipes.slice(0, 3);
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    throw error;
  }
};
