import mongoose, { Schema, Document, Types } from "mongoose";

interface CalorieLogEntry {
  date: Date;
  caloriesConsumed: number;
  caloriesBurned: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  savedRecipes: Types.ObjectId[]; // Only store ObjectId references
  calorieLog: CalorieLogEntry[];
  role: "user" | "admin";
}

const CalorieLogSchema = new Schema<CalorieLogEntry>(
  {
    date: { type: Date, default: Date.now },
    caloriesConsumed: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
  },
  { _id: false } // Prevents extra object IDs for each log entry
);

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }, // Removed `sparse: true`
    passwordHash: { type: String, required: true },
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
    calorieLog: { type: [CalorieLogSchema], default: [] },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Role validation
  },
  { strict: true, timestamps: true } // Enforce schema validation & auto timestamps
);

// Indexing for performance
UserSchema.index({ email: 1 }); // Optimized for user lookup

export default mongoose.model<IUser>("User", UserSchema);
