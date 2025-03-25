import mongoose from "mongoose";
import * as dotenv from "dotenv";
// Load environment variables
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/recipeApp";
/**
 * Establishes connection to MongoDB
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    }
    catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1); // Exit process with failure
    }
};
export default connectDB;
