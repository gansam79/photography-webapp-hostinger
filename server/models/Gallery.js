import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
    {
        title: { type: String },
        image: { type: String, required: true },
        category: { type: String, default: "General" },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    },
    { timestamps: true }
);

export default mongoose.models.Gallery || mongoose.model("Gallery", gallerySchema);
