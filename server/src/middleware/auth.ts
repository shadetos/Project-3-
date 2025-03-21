import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Generate JWT token
export const generateToken = (
  userId: string,
  username: string,
  email: string
): string => {
  return jwt.sign(
    { id: userId, username, email },
    JWT_SECRET,
    { expiresIn: "24h" } // Token expires in 24 hours
  );
};

// Middleware to authenticate JWT token
export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get token from header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }

  // Format should be "Bearer [token]"
  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token format.",
    });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      email: string;
    };

    // Add user data to request
    req.user = decoded;

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};

// Optional middleware to check if user exists in database
export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if user exists in database
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error validating user:", error);
    res.status(500).json({
      success: false,
      message: "Server error while validating user",
    });
  }
};

// Middleware for admin-only routes
export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    // Check if user is admin
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while checking admin status",
    });
  }
};
