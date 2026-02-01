import mongoose from "mongoose";

const popupSchema = new mongoose.Schema(
    {
        title: { type: String }, // Optional
        description: { type: String }, // Optional
        image: { type: String }, // Optional URL
        isActive: { type: Boolean, default: false },
        type: { type: String, default: "tribute" }, // Just in case we need other types later
    },
    { timestamps: true }
);

export default mongoose.models?.Popup || mongoose.model("Popup", popupSchema);
