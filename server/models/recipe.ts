import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  instructions: string;
  estimatedCalories: number;
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
}

const RecipeSchema: Schema = new Schema<IRecipe>({
  name: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  estimatedCalories: { type: Number, required: true }, // Ensure every recipe has a calorie estimate
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

// Indexing for performance
RecipeSchema.index({ createdBy: 1 });
RecipeSchema.index({ name: "text", ingredients: "text" }); // Enables text search

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);

// Is this file correct?