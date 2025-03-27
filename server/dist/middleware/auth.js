import jwt from "jsonwebtoken";
import { User } from "../models";
// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// Generate JWT token
export const generateToken = (userId, username, email) => {
    return jwt.sign({ id: userId, username, email }, JWT_SECRET, { expiresIn: "24h" } // Token expires in 24 hours
    );
};
// Middleware to authenticate JWT token
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({
            success: false,
            message: "Access denied. No token provided.",
        });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Access denied. Invalid token format.",
        });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};
// Helper function to fetch user
const findUserById = async (userId) => {
    if (!userId)
        return null;
    return await User.findById(userId).lean();
};
// Middleware to validate authenticated user
export const validateUser = async (req, res, next) => {
    try {
        const user = await findUserById(req.user?.id ?? "");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        next();
    }
    catch (error) {
        console.error("User validation error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
// Middleware to enforce admin privileges
export const requireAdmin = async (req, res, next) => {
    try {
        const user = await findUserById(req.user?.id ?? "");
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }
        next();
    }
    catch (error) {
        console.error("Admin privilege check error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
