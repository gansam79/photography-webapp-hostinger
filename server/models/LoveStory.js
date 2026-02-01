import mongoose from "mongoose";

const loveStorySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        location: { type: String, required: true },
        description: { type: String, required: true }, // Full Description
        thumbnail: { type: String, required: true }, // Base64 or URL
        gallery: [{ type: String }], // Array of Base64 or URLs
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    },
    { timestamps: true }
);

export default mongoose.models.LoveStory || mongoose.model("LoveStory", loveStorySchema);
