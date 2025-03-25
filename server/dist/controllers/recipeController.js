import { Recipe } from "../models";
import mongoose from "mongoose";
// Get all recipes (public recipes or user's saved recipes)
export const getAllRecipes = async (req, res) => {
    try {
        const userId = String(req.user?.id);
        const recipes = await Recipe.find({
            $or: [{ createdBy: userId }, { public: true }],
        })
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json({ success: true, data: recipes });
    }
    catch (error) {
        console.error("Error fetching recipes:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while fetching recipes" });
    }
};
// Get a single recipe by ID
export const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid recipe ID format" });
            return;
        }
        const recipe = await Recipe.findById(id).lean();
        if (!recipe) {
            res
                .status(404)
                .json({ success: false, message: "Recipe not found" });
            return;
        }
        const userId = String(req.user?.id);
        if (String(recipe.createdBy) !== userId && !recipe.public) {
            res
                .status(403)
                .json({ success: false, message: "Access denied to this recipe" });
        }
        res.status(200).json({ success: true, data: recipe });
    }
    catch (error) {
        console.error("Error fetching recipe:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while fetching recipe" });
    }
};
// Create a new recipe
export const createRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions, estimatedCalories, public: isPublic = false, } = req.body;
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
    }
    catch (error) {
        console.error("Error creating recipe:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while creating recipe" });
    }
};
// Update a recipe
export const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = String(req.user?.id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid recipe ID format" });
            return;
        }
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            res
                .status(404)
                .json({ success: false, message: "Recipe not found" });
        }
        if (!recipe || String(recipe.createdBy) !== userId) {
            res.status(403).json({
                success: false,
                message: "Unauthorized to update this recipe",
            });
        }
        if (!recipe) {
            res.status(404).json({ success: false, message: "Recipe not found" });
            return;
        }
        const updateData = {
            name: req.body.name || recipe.name,
            ingredients: req.body.ingredients || recipe.ingredients,
            instructions: req.body.instructions || recipe.instructions,
            estimatedCalories: req.body.estimatedCalories || recipe.estimatedCalories,
            public: req.body.public !== undefined ? req.body.public : recipe.public,
        };
        const updatedRecipe = await Recipe.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true }).lean();
        res.status(200).json({ success: true, data: updatedRecipe });
    }
    catch (error) {
        console.error("Error updating recipe:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while updating recipe" });
    }
};
// Delete a recipe
export const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = String(req.user?.id);
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res
                .status(400)
                .json({ success: false, message: "Invalid recipe ID format" });
        }
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            res
                .status(404)
                .json({ success: false, message: "Recipe not found" });
        }
        if (!recipe || String(recipe.createdBy) !== userId) {
            res.status(403).json({
                success: false,
                message: "Unauthorized to delete this recipe",
            });
        }
        await Recipe.findByIdAndDelete(id);
        res
            .status(200)
            .json({ success: true, message: "Recipe deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting recipe:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error while deleting recipe" });
    }
};
// Generate recipe using AI
export const generateRecipe = async (req, res) => {
    try {
        const { ingredients } = req.body;
        if (!ingredients ||
            !Array.isArray(ingredients) ||
            ingredients.length === 0) {
            res.status(400).json({
                success: false,
                message: "Please provide a non-empty array of ingredients",
            });
        }
        const generatedRecipe = {
            name: `${ingredients[0]} Special`,
            ingredients,
            instructions: `This is a placeholder for AI-generated instructions using: ${ingredients.join(", ")}`,
            estimatedCalories: 500,
            createdBy: "AI",
            isGenerated: true,
            public: false,
        };
        res.status(200).json({ success: true, data: generatedRecipe });
    }
    catch (error) {
        console.error("Error generating recipe:", error);
        res.status(500).json({
            success: false,
            message: "Server error while generating recipe",
        });
    }
};
// Save generated recipe to user's collection
export const saveGeneratedRecipe = async (req, res) => {
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
            public: false,
        });
        const savedRecipe = await newRecipe.save();
        res.status(201).json({ success: true, data: savedRecipe });
    }
    catch (error) {
        console.error("Error saving generated recipe:", error);
        res.status(500).json({
            success: false,
            message: "Server error while saving generated recipe",
        });
    }
};
