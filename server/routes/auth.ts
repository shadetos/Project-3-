import express, { Request, Response } from "express";
import { Recipe } from "../models";
import { authenticateJWT } from "../middleware/auth";
import mongoose from "mongoose";

const router = express.Router();

// Get all recipes (public recipes or user's saved recipes)
router.get("/", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const userId = String(req.user?.id);

    // Find recipes where createdBy is userId or recipes are public
    const recipes = await Recipe.find({
      $or: [{ createdBy: userId }, { public: true }],
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, data: recipes });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching recipes",
    });
  }
});

// Get a single recipe by ID
router.get("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recipe ID format",
      });
    }

    const recipe = await Recipe.findById(id).lean();

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const userId = String(req.user?.id);
    if (String(recipe.createdBy) !== userId && !recipe.public) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this recipe",
      });
    }

    return res.status(200).json({ success: true, data: recipe });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching recipe",
    });
  }
});

// Create a new recipe
router.post("/", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const {
      name,
      ingredients,
      instructions,
      estimatedCalories,
      public: isPublic = false,
    } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({
        success: false,
        message: "Name, ingredients, and instructions are required",
      });
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
    return res.status(201).json({ success: true, data: savedRecipe });
  } catch (error) {
    console.error("Error creating recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating recipe",
    });
  }
});

// Update a recipe
router.put("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = String(req.user?.id);

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    if (String(recipe.createdBy) !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own recipes",
      });
    }

    const { name, ingredients, instructions, estimatedCalories, public: isPublic } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { $set: { name, ingredients, instructions, estimatedCalories, public: isPublic } },
      { new: true, runValidators: true }
    ).lean();

    return res.status(200).json({ success: true, data: updatedRecipe });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating recipe",
    });
  }
});

// Delete a recipe
router.delete("/:id", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = String(req.user?.id);

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    if (String(recipe.createdBy) !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own recipes",
      });
    }

    await Recipe.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting recipe",
    });
  }
});

// Generate recipe using AI
router.post("/generate", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a non-empty array of ingredients",
      });
    }

    const generatedRecipe = {
      name: `${ingredients[0]} Special`,
      ingredients: ingredients,
      instructions: `This is a placeholder for AI-generated instructions using: ${ingredients.join(", ")}`,
      estimatedCalories: 500,
      createdBy: "AI",
      isGenerated: true,
      public: false, // Default AI-generated recipes to private
    };

    return res.status(200).json({
      success: true,
      data: generatedRecipe,
    });
  } catch (error) {
    console.error("Error generating recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while generating recipe",
    });
  }
});

// Save generated recipe to user's collection
router.post("/save-generated", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { name, ingredients, instructions, estimatedCalories } = req.body;

    if (!name || !ingredients || !instructions) {
      return res.status(400).json({
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
    return res.status(201).json({ success: true, data: savedRecipe });
  } catch (error) {
    console.error("Error saving generated recipe:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while saving generated recipe",
    });
  }
});

export default router;
