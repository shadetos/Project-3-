import express, { Request, Response } from "express";
import { Recipe } from "../models";
import { authenticateJWT } from "../middleware/auth";
import mongoose from "mongoose";

const router = express.Router();

// Get all recipes (public recipes or user's saved recipes)
router.get("/", authenticateJWT, (req: Request, res: Response, next) => {
  (async () => {
    try {
      const userId = String(req.user?.id);

      // Find recipes where createdBy is userId or recipes are public
      const recipes = await Recipe.find({
        $or: [{ createdBy: userId }, { public: true }],
      })
        .sort({ createdAt: -1 })
        .lean();

      res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching recipes",
      });
    }
  })().catch(next);
});

// Get a single recipe by ID
router.get(
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({
          success: false,
          message: "Invalid recipe ID format",
        });
        return;
      }

      const recipe = await Recipe.findById(id).lean();

      if (!recipe) {
        res.status(404).json({
          success: false,
          message: "Recipe not found",
        });
        return;
      }

      const userId = String(req.user?.id);
      if (String(recipe.createdBy) !== userId && !recipe.public) {
        res.status(403).json({
          success: false,
          message: "Access denied to this recipe",
        });
        return;
      }

      res.status(200).json({ success: true, data: recipe });
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching recipe",
      });
    }
  }
);

// Create a new recipe
router.post(
  "/",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        name,
        ingredients,
        instructions,
        estimatedCalories,
        public: isPublic = false,
      } = req.body;

      if (!name || !ingredients || !instructions) {
        res.status(400).json({
          success: false,
          message: "Name, ingredients, and instructions are required",
        });
        return;
      }

      const newRecipe = new Recipe({
        name,
        ingredients,
        instructions,
        estimatedCalories,
        public: isPublic,
        createdBy: req.user?.id,
      });

      const savedRecipe = await newRecipe.save();
      res.status(201).json({ success: true, data: savedRecipe });
    } catch (error) {
      console.error("Error creating recipe:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating recipe",
      });
    }
  }
);

// Update a recipe
router.put(
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = String(req.user?.id);

      const recipe = await Recipe.findById(id);

      if (!recipe) {
        res.status(404).json({
          success: false,
          message: "Recipe not found",
        });
      }

      if (!recipe || String(recipe.createdBy) !== userId) {
        res.status(403).json({
          success: false,
          message: "You can only update your own recipes",
        });
        return;
      }

      const {
        name,
        ingredients,
        instructions,
        estimatedCalories,
        public: isPublic,
      } = req.body;

      const updatedRecipe = await Recipe.findByIdAndUpdate(
        id,
        {
          $set: {
            name,
            ingredients,
            instructions,
            estimatedCalories,
            public: isPublic,
          },
        },
        { new: true, runValidators: true }
      ).lean();

      res.status(200).json({ success: true, data: updatedRecipe });
    } catch (error) {
      console.error("Error updating recipe:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating recipe",
      });
    }
  }
);

// Delete a recipe
router.delete(
  "/:id",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = String(req.user?.id);

      const recipe = await Recipe.findById(id);

      if (!recipe) {
        res.status(404).json({
          success: false,
          message: "Recipe not found",
        });
        return;
      }

      if (String(recipe.createdBy) !== userId) {
        res.status(403).json({
          success: false,
          message: "You can only delete your own recipes",
        });
        return;
      }

      await Recipe.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: "Recipe deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting recipe",
      });
    }
  }
);

// Generate recipe using AI
router.post(
  "/generate",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { ingredients } = req.body;

      if (
        !ingredients ||
        !Array.isArray(ingredients) ||
        ingredients.length === 0
      ) {
        res.status(400).json({
          success: false,
          message: "Please provide a non-empty array of ingredients",
        });
        return;
      }

      const generatedRecipe = {
        name: `${ingredients[0]} Special`,
        ingredients: ingredients,
        instructions: `This is a placeholder for AI-generated instructions using: ${ingredients.join(
          ", "
        )}`,
        estimatedCalories: 500,
        createdBy: "AI",
        isGenerated: true,
        public: false, // Default AI-generated recipes to private
      };

      res.status(200).json({
        success: true,
        data: generatedRecipe,
      });
    } catch (error) {
      console.error("Error generating recipe:", error);
      res.status(500).json({
        success: false,
        message: "Server error while generating recipe",
      });
    }
  }
);

// Save generated recipe to user's collection
router.post(
  "/save-generated",
  authenticateJWT,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, ingredients, instructions, estimatedCalories } = req.body;

      if (!name || !ingredients || !instructions) {
        res.status(400).json({
          success: false,
          message: "Name, ingredients, and instructions are required",
        });
      }

      const newRecipe = new Recipe({
        name,
        ingredients,
        instructions,
        estimatedCalories,
        createdBy: req.user?.id,
        source: "AI Generated",
        public: false, // Default to private
      });

      const savedRecipe = await newRecipe.save();
      res.status(201).json({ success: true, data: savedRecipe });
    } catch (error) {
      console.error("Error saving generated recipe:", error);
      res.status(500).json({
        success: false,
        message: "Server error while saving generated recipe",
      });
    }
  }
);

export default router;
