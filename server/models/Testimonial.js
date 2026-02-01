import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        coupleName: { type: String, required: true },
        location: { type: String, trim: true },
        thumbnail: { type: String }, // URL or Base64
        shortDescription: { type: String, required: true, maxlength: 1000 },
        fullDescription: { type: String },
        rating: { type: Number, default: 5, min: 1, max: 5 },
        displayOrder: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["Active", "Inactive", "Pending"],
            default: "Active"
        }
    },
    { timestamps: true }
);

// Index for sorting by display order
testimonialSchema.index({ displayOrder: 1 });

// Force recompilation of model if it exists (for HMR/Dev environment)
if (mongoose.models.Testimonial) {
    delete mongoose.models.Testimonial;
}

export default mongoose.model("Testimonial", testimonialSchema);
