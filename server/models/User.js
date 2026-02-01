import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, default: "user", enum: ["user", "admin", "editor"] },
        phone: { type: String },
        status: { type: String, default: "Active", enum: ["Active", "Inactive"] },
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
