import express from "express";
import "../types/express"; // Ensure request typing
import { authenticateJWT } from "../middleware/auth"
import {
  getUserProfile,
  updateUserProfile,
  getSavedRecipes,
  saveRecipe,
  removeSavedRecipe,
  addCalorieLog,
  getCalorieLog,
} from "../controllers/userController";

const router = express.Router();

/**
 * User profile routes
 */
router.get("/profile", authenticateJWT, getUserProfile);
router.put("/profile", authenticateJWT, updateUserProfile);

/**
 * Saved recipes routes
 */
router.get("/saved-recipes", authenticateJWT, getSavedRecipes);
router.post("/saved-recipes/:recipeId", authenticateJWT, saveRecipe);
router.delete("/saved-recipes/:recipeId", authenticateJWT, removeSavedRecipe);

/**
 * Calorie log routes
 */
router.post("/calorie-log", authenticateJWT, addCalorieLog);
router.get("/calorie-log", authenticateJWT, getCalorieLog);

export default router;
