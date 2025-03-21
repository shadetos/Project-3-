import { Request, Response, NextFunction } from "express";
import { User, Recipe } from "../models";
import mongoose from "mongoose";

/**
 * Get user profile
 */
export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select("-password_hash");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error); // Pass error to Express error handler
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email } = req.body; // Ensure consistency with your User model

    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password_hash");

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error); // Pass error to Express error handler
  }
};

/**
 * Get saved recipes
 */
export const getSavedRecipes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).populate("savedRecipes");

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.json({ success: true, data: user.savedRecipes });
  } catch (error) {
    console.error("Error fetching saved recipes:", error);
    next(error); // Pass error to Express error handler
  }
};

/**
 * Save a recipe
 */
export const saveRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      res.status(400).json({ success: false, message: "Invalid recipe ID" });
      return;
    }

    const recipe = (await Recipe.findById(recipeId)) as mongoose.Document & {
      _id: mongoose.Types.ObjectId;
    };
    if (!recipe) {
      res.status(404).json({ success: false, message: "Recipe not found" });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (
      user.savedRecipes.some(
        (saved) => saved.toString() === recipe._id.toString()
      )
    ) {
      res.status(400).json({ success: false, message: "Recipe already saved" });
      return;
    }

    user.savedRecipes.push(new mongoose.Types.ObjectId(recipe._id));
    await user.save();

    res.json({ success: true, message: "Recipe saved successfully" });
  } catch (error) {
    console.error("Error saving recipe:", error);
    next(error); // Pass error to Express error handler
  }
};

/**
 * Remove a saved recipe
 */
export const removeSavedRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      res.status(400).json({ success: false, message: "Invalid recipe ID" });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    user.savedRecipes = user.savedRecipes.filter((saved) => {
      if (saved instanceof mongoose.Types.ObjectId) {
        return !saved.equals(new mongoose.Types.ObjectId(recipeId));
      }
      return true; // Keep entries that are not ObjectIds
    }) as mongoose.Types.ObjectId[];

    await user.save();

    res.json({ success: true, message: "Recipe removed successfully" });
  } catch (error) {
    console.error("Error removing recipe:", error);
    next(error); // Pass error to Express error handler
  }
};

/**
 * Add a calorie log entry
 */
export const addCalorieLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { date, caloriesConsumed, caloriesBurned } = req.body;

    if (!date || isNaN(new Date(date).getTime())) {
      res.status(400).json({ success: false, message: "Invalid date format" });
      return;
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    user.calorieLog.push({
      date: new Date(date),
      caloriesConsumed: caloriesConsumed || 0,
      caloriesBurned: caloriesBurned || 0,
    });

    await user.save();

    res.status(201).json({ success: true, message: "Calorie log added" });
  } catch (error) {
    console.error("Error adding calorie log:", error);
    next(error); // Pass error to Express error handler
  }
};

/**
 * Get calorie log
 */
export const getCalorieLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    let calorieLog = user.calorieLog;

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate as string).getTime() : 0;
      const end = endDate ? new Date(endDate as string).getTime() : Infinity;

      if (isNaN(start) || isNaN(end)) {
        res
          .status(400)
          .json({ success: false, message: "Invalid date format" });
        return;
      }

      calorieLog = calorieLog.filter((entry) => {
        const entryDate = new Date(entry.date).getTime();
        return entryDate >= start && entryDate <= end;
      });
    }

    res.json({ success: true, data: calorieLog });
  } catch (error) {
    console.error("Error fetching calorie log:", error);
    next(error); // Pass error to Express error handler
  }
};
