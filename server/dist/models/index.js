import mongoose from "mongoose";
import Recipe from "./recipe";
import User from "./user";
const mongoURI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/recipeApp";
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s if no connection
        });
        console.log("✅ MongoDB connected successfully");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        if (retries > 0) {
            console.log(`🔄 Retrying MongoDB connection... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        }
        else {
            console.error("🚨 MongoDB connection failed after multiple attempts.");
            process.exit(1);
        }
    }
};
// Graceful shutdown handling
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔻 MongoDB connection closed due to app termination.");
    process.exit(0);
});
export { connectDB, Recipe, User };
