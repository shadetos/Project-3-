import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { validationResult } from "express-validator";
import { promisify } from "util";
const signJwt = promisify(jwt.sign);
// Register a new user
export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }
        const { name, email, password } = req.body;
        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
            return;
        }
        let user = (await User.findOne({ email }));
        if (user) {
            res.status(400).json({ success: false, message: "User already exists" });
            return;
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create user - use passwordHash field based on your model
        user = new User({
            name,
            email,
            passwordHash: hashedPassword,
        });
        await user.save();
        // Create JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET ?? "defaultsecret", {
            expiresIn: "1d",
        });
        res.status(201).json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        console.error("Error during registration:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error during registration" });
    }
};
// Login user
export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ success: false, errors: errors.array() });
            return;
        }
        const { email, password } = req.body;
        const user = (await User.findOne({ email }));
        if (!user) {
            res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });
            return;
        }
        // Use passwordHash instead of password for comparison
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res
                .status(400)
                .json({ success: false, message: "Invalid email or password" });
            return;
        }
        // Create JWT
        const payload = { user: { id: user.id } };
        const secret = process.env.JWT_SECRET ?? "defaultsecret"; // Ensure a valid secret
        const token = await signJwt(payload, secret, {
            expiresIn: "1d",
            algorithm: "HS256",
        });
        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.name, email: user.email },
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error during login" });
    }
};
// Get current user
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user?.id).select("-passwordHash");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error fetching user data" });
    }
};
// Change password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword || newPassword.length < 6) {
            res.status(400).json({
                success: false,
                message: "Invalid password data. Ensure password is at least 6 characters.",
            });
            return;
        }
        const user = (await User.findById(req.user?.id));
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            res
                .status(400)
                .json({ success: false, message: "Current password is incorrect" });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ success: true, message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error changing password" });
    }
};
