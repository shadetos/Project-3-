import express from "express";
import { check } from "express-validator";
import "../types/express"; // Import the extended Request type
import { authenticateJWT } from "../middleware/auth";
import { registerUser, loginUser, getCurrentUser, changePassword, } from "../controllers/authController";
const router = express.Router();
// Register user
router.post("/register", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
        min: 6,
    }),
], registerUser);
// Login user
router.post("/login", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
], loginUser);
// Get current user profile
router.get("/me", authenticateJWT, getCurrentUser);
// Change password
router.put("/change-password", authenticateJWT, changePassword);
export default router;
