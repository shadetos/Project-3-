import mongoose from "mongoose";
import Recipe from "./recipe";
import User from "./user";

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/recipeApp";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// Handle connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Reconnecting...");
  connectDB();
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected.");
});

// Graceful shutdown handling
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔻 MongoDB connection closed due to app termination.");
  process.exit(0);
});

export { connectDB, Recipe, User };

/*
Question 1: Is this file correct? (Ask about line 6 localhost)
Question 2: process, on is red underlined? Focus on other red underlined code from other files.
Question 3: What does requirements.txt file do in a Python project?
Question 4: is tsconfig.json file correct? why red underline in beginning?
Question 5: Quick oveview of MongoDB Atlas and mongoose
Question 6: Can I add .gitignore for each frontend and backend folders?
*/