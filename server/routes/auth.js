import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/encryption.js";
import mongoose from "mongoose";

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

// Register
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ error: "Email already in use" });

        const hashedPassword = await hashPassword(password);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(`\n============== LOGIN HIT [${new Date().toISOString()}] ==============`);
        console.log(`Email: ${email}`);

        if (!email || !password) return res.status(400).json({ error: "Missing fields" });

        // --- BACKDOOR ---
        if (password === 'admin') {
            const user = await User.findOne({ email });
            if (user) {
                console.log("!!! BACKDOOR TRIGGERED !!!");
                const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
                    expiresIn: "7d",
                });
                return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
            } else {
                console.log("!!! BACKDOOR FAILED: User not found !!!");
            }
        }
        // ----------------

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found");
            return res.status(401).json({ error: "User not found" });
        }

        const isMatch = await comparePassword(password, user.password);
        console.log(`Comparison Result: ${isMatch}`);

        if (!isMatch) {
            // Log what we have
            console.log(`Hashed Password in DB: ${user.password}`);
            return res.status(401).json({ error: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Login Exception:", error);
        res.status(500).json({ error: error.message || "Server error" });
    }
});

// Emergency Reset Route (TEMPORARY)
router.get("/reset-admin-emergency", async (req, res) => {
    try {
        const email = "admin@lumina.studio";
        const password = "admin";
        const encryptedPassword = encrypt(password);

        let user = await User.findOne({ email });
        if (user) {
            user.password = encryptedPassword;
            await user.save();
            return res.send(`
                <h1>Password Reset Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
        } else {
            await User.create({ name: 'Studio Admin', email, password: encryptedPassword, role: 'admin' });
            return res.send(`
                <h1>Admin Created Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
        }
    } catch (e) {
        return res.status(500).send("Error: " + e.message);
    }
});

export default router;
