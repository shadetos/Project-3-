import express, { Request, Response } from "express";
import { User, Recipe } from "../models";
import { authenticateJWT } from "../middleware/auth";
import mongoose from "mongoose";

const router = express.Router();

/**
 * Get user profile
 */
router.get("/profile", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password_hash");

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Update user profile (excluding password)
 */
router.put("/profile", authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password_hash");

    if (!updatedUser)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    return res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * Get saved recipes
 */
router.get(
  "/saved-recipes",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.user?.id).populate("savedRecipes");

      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      return res.json({ success: true, data: user.savedRecipes });
    } catch (error) {
      console.error("Error fetching saved recipes:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * Save a recipe to user's collection
 */
router.post(
  "/save-recipe/:recipeId",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { recipeId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(recipeId))
        return res
          .status(400)
          .json({ success: false, message: "Invalid recipe ID" });

      const recipe = await Recipe.findById(recipeId);
      if (!recipe)
        return res
          .status(404)
          .json({ success: false, message: "Recipe not found" });

      const user = await User.findById(req.user?.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      if (user.savedRecipes.includes(recipe._id))
        return res
          .status(400)
          .json({ success: false, message: "Recipe already saved" });

      user.savedRecipes.push(recipe._id);
      await user.save();

      return res.json({ success: true, message: "Recipe saved successfully" });
    } catch (error) {
      console.error("Error saving recipe:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * Remove a saved recipe
 */
router.delete(
  "/saved-recipe/:recipeId",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { recipeId } = req.params;
      if (!mongoose.Types.ObjectId.isValid(recipeId))
        return res
          .status(400)
          .json({ success: false, message: "Invalid recipe ID" });

      const user = await User.findById(req.user?.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      user.savedRecipes = user.savedRecipes.filter(
        (savedRecipe): savedRecipe is mongoose.Types.ObjectId =>
          savedRecipe instanceof mongoose.Types.ObjectId &&
          savedRecipe.toString() !== recipeId
      ); // Optimized removal
      await user.save();

      return res.json({
        success: true,
        message: "Recipe removed successfully",
      });
    } catch (error) {
      console.error("Error removing recipe:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * Add a calorie log entry
 */
router.post(
  "/calorie-log",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { date, caloriesConsumed, caloriesBurned } = req.body;
      if (
        !date ||
        (caloriesConsumed === undefined && caloriesBurned === undefined)
      )
        return res
          .status(400)
          .json({ success: false, message: "Date and calorie data required" });

      const user = await User.findById(req.user?.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      user.calorieLog.push({
        date: new Date(date),
        caloriesConsumed: caloriesConsumed || 0,
        caloriesBurned: caloriesBurned || 0,
      });

      await user.save();

      return res
        .status(201)
        .json({ success: true, message: "Calorie log added" });
    } catch (error) {
      console.error("Error adding calorie log:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

/**
 * Get calorie log entries (with optional date filtering)
 */
router.get(
  "/calorie-log",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;

      const user = await User.findById(req.user?.id);
      if (!user)
        return res
          .status(404)
          .json({ success: false, message: "User not found" });

      let calorieLog = user.calorieLog;
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate as string).getTime() : 0;
        const end = endDate ? new Date(endDate as string).getTime() : Infinity;
        calorieLog = calorieLog.filter((entry) => {
          const entryDate = new Date(entry.date).getTime();
          return entryDate >= start && entryDate <= end;
        });
      }

      return res.json({ success: true, data: calorieLog });
    } catch (error) {
      console.error("Error fetching calorie log:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;
