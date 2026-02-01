import User from "../models/User.js";
import { hashPassword, comparePassword, decrypt } from "../utils/encryption.js";
import { sendEmail } from "../utils/emailService.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, status } = req.body;

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await hashPassword(password);
        if (!hashedPassword) {
            return res.status(500).json({ message: "Hashing failed" });
        }

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            status
        });
        await user.save();

        // Send Welcome Email
        const htmlContent = `
            <h2>Welcome to The Patil Photography</h2>
            <p>Hello ${name},</p>
            <p>Your account has been created successfully.</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>Please login to your dashboard.</p>
            <br>
            <p>Best Regards,</p>
            <p>The Patil Photography Team</p>
        `;

        await sendEmail({
            to: email,
            cc: "pixelproitsolutions@gmail.com",
            subject: "Welcome - Account Created",
            html: htmlContent
        });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(400).json({ message: error.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const updateData = { ...rest };

        if (password && password.trim() !== "") {
            updateData.password = await hashPassword(password);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const revealPassword = async (req, res) => {
    try {
        const { adminPassword, targetUserId } = req.body;
        const adminId = req.user.id;

        if (!adminPassword || !targetUserId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Verify Admin
        const admin = await User.findById(adminId);
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Verify admin password
        const isMatch = await comparePassword(adminPassword, admin.password);
        if (!isMatch) {
            console.warn(`[Reveal] Password mismatch for admin: ${admin.email}`);
            return res.status(401).json({ message: "Incorrect admin password" });
        }

        // Fetch Target User
        const targetUser = await User.findById(targetUserId);
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Bcrypt hashes cannot be reversed
        return res.json({ password: "Encrypted (Cannot Reveal)" });

    } catch (error) {
        console.error("Reveal Error:", error);
        res.status(500).json({ message: error.message });
    }
};
