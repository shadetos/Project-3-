import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import readline from "readline";
import User from "../models/user";
import Recipe from "../models/recipe";

dotenv.config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/recipeApp";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Hash password for users
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Create users
    const users = await User.insertMany([
      {
        username: "admin",
        email: "admin@example.com",
        passwordHash: hashedPassword,
        role: "admin",
      },
      {
        username: "testuser",
        email: "test@example.com",
        passwordHash: hashedPassword,
        role: "user",
      },
    ]);

    console.log("You can add sample recipes manually.");
    let addMore = true;
    while (addMore) {
      const name = await askQuestion("Enter recipe name: ");
      const ingredients = (
        await askQuestion("Enter ingredients (comma-separated): ")
      ).split(",");
      const instructions = await askQuestion("Enter instructions: ");

      const recipe = new Recipe({
        name,
        ingredients,
        instructions,
        createdBy: users[1]._id,
        createdAt: new Date(),
        public: false,
      });

      // Save the recipe using the model's save method
      await recipe.save();

      console.log(`Added recipe: ${recipe.name}`);

      const more = await askQuestion("Add another recipe? (yes/no): ");
      addMore = more.toLowerCase() === "yes";
    }

    rl.close();
    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
