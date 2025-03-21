import mongoose, { Schema, Document } from "mongoose";
import { IRecipe } from "./recipe";

interface CalorieLogEntry {
  date: Date;
  caloriesConsumed: number;
  caloriesBurned: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  savedRecipes: mongoose.Types.ObjectId[] | IRecipe[];
  calorieLog: CalorieLogEntry[];
  role: string;
}

const CalorieLogSchema = new Schema<CalorieLogEntry>({
  date: { type: Date, default: Date.now },
  caloriesConsumed: { type: Number, default: 0 },
  caloriesBurned: { type: Number, default: 0 },
});

const UserSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  calorieLog: [CalorieLogSchema],
  role: { type: String, default: "user" },
});

export default mongoose.model<IUser>("User", UserSchema);

// Is this file correct?
