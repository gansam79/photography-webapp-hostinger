import mongoose from "mongoose";

const filmSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        youtubeUrl: { type: String, required: true },
        category: { type: String, default: "Wedding" },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    },
    { timestamps: true }
);

export default mongoose.models.Film || mongoose.model("Film", filmSchema);
