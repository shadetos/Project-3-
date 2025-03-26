import express from "express";
import recipeRoutes from "./recipe";
import userRoutes from "./user";
import authRoutes from "./auth";
const router = express.Router();
// Mount all routes
router.use("/recipes", recipeRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
// Health check route with optional DB check
router.get("/health", async (_req, res) => {
    try {
        // Optional: Add a DB check here if needed
        res
            .status(200)
            .json({ status: "ok", message: "API is running", dbStatus: "connected" });
    }
    catch (error) {
        res
            .status(500)
            .json({
            status: "error",
            message: "API is down",
            dbStatus: "disconnected",
        });
    }
});
// Handle 404 for undefined routes
router.use((_req, res) => {
    res
        .status(404)
        .json({
        error: "Route not found",
        message: "The requested route does not exist.",
    });
});
router.use((err, _req, res, _next) => {
    console.error(err); // Log the error for internal tracking
    res
        .status(500)
        .json({
        success: false,
        message: "Something went wrong",
        error: err.message,
    });
});
export default router;
