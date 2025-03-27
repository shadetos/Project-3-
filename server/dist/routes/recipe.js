import express from "express";
import "../types/express"; // Import the extended Request type
import { authenticateJWT } from "../middleware/auth";
import { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, generateRecipe, saveGeneratedRecipe, } from "../controllers/recipeController";
const router = express.Router();
// Get all recipes (public recipes or user's saved recipes)
router.get("/", authenticateJWT, getAllRecipes);
// Get a single recipe by ID
router.get("/:id", authenticateJWT, getRecipeById);
// Create a new recipe
router.post("/", authenticateJWT, createRecipe);
// Update a recipe
router.put("/:id", authenticateJWT, updateRecipe);
// Delete a recipe
router.delete("/:id", authenticateJWT, deleteRecipe);
// Generate recipe using AI
router.post("/generate", authenticateJWT, generateRecipe);
// Save generated recipe to user's collection
router.post("/save-generated", authenticateJWT, saveGeneratedRecipe);
export default router;
