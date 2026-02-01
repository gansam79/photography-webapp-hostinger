import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load env vars immediately
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '../../.env');
console.log(`Loading .env from: ${envPath}`);
const dotenvResult = dotenv.config({ path: envPath });

if (dotenvResult.error) {
    console.warn("⚠️  Warning: .env file not found or failed to load:", dotenvResult.error.message);
}

const resetAdmin = async () => {
    try {
        console.log('Environment loaded.');
        console.log('JWT_SECRET present?:', !!process.env.JWT_SECRET);

        // Dynamically import modules AFTER env is loaded
        const { default: User } = await import('../models/User.js');
        const { encrypt } = await import('../utils/encryption.js');
        const { connectDB } = await import('../db.js');

        // Force connection logic if connectDB fails to pick up env
        if (!process.env.MONGODB_URI) {
            console.log("⚠️ MONGODB_URI missing in process.env, attempting manual set...");
            process.env.MONGODB_URI = "mongodb+srv://photograper:photograper@cluster0.sy94kcl.mongodb.net/?appName=Cluster0";
        }

        console.log('Connecting to MongoDB at:', process.env.MONGODB_URI.split('@')[1]); // Log host only for safety
        await connectDB();

        const email = 'admin@lumina.studio';
        const newPassword = 'admin';

        console.log(`Encrypting password for ${email}...`);
        const encryptedPassword = encrypt(newPassword);

        if (!encryptedPassword) {
            throw new Error("Encryption failed! Check SECRET_KEY/JWT_SECRET.");
        }

        let user = await User.findOne({ email });

        if (user) {
            console.log("User found, updating...");
            user.password = encryptedPassword;
            user.encryptedPassword = undefined;
            user.role = 'admin'; // Ensure role is admin
            await user.save();
            console.log(`✅ Success! Password for '${email}' has been updated.`);
        } else {
            console.log("User not found, creating...");
            user = await User.create({
                name: 'Studio Admin',
                email,
                password: encryptedPassword,
                role: 'admin',
                status: 'Active'
            });
            console.log(`✅ Success! Created new admin user '${email}'.`);
        }

        console.log(`\n👉 Login credentials:\nEmail: ${email} (or 'admin')\nPassword: ${newPassword}\n`);

        await mongoose.disconnect();
        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

resetAdmin();
