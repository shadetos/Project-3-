import express from "express";
import recipeRoutes from "./recipe";
import userRoutes from "./user";
import authRoutes from "./auth";

const router = express.Router();

// Mount all routes
router.use("/recipes", recipeRoutes);
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// Health check route
router.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Handle 404 for undefined routes
router.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default router;
