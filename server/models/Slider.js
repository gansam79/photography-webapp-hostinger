import mongoose from "mongoose";

const sliderSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        image: { type: String, required: true },
        status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Slider || mongoose.model("Slider", sliderSchema);
