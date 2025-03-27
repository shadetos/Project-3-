import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  instructions: string;
  estimatedCalories?: number; // Optional calorie estimate
  createdBy: mongoose.Types.ObjectId | string;
  createdAt: Date;
  public: boolean;
}

const RecipeSchema: Schema = new Schema<IRecipe>(
  {
    name: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    estimatedCalories: { type: Number, default: null }, // Optional calorie estimate
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    public: { type: Boolean, default: false },
  },
  { strict: true } // Prevents storing unrecognized fields
);

// Indexing for performance
RecipeSchema.index({ createdBy: 1 });
RecipeSchema.index(
  { name: "text", ingredients: "text" },
  { weights: { name: 2, ingredients: 1 } }
);

export default mongoose.model<IRecipe>("Recipe", RecipeSchema);
