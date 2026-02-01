import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
    {
        groomName: { type: String, required: true },
        brideName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        eventStartDate: { type: Date, required: true },
        eventEndDate: { type: Date, required: true },
        events: [{ type: String }], // Array of event names
        budget: { type: Number },
        location: { type: String, required: true },
        services: [{ type: String }], // Array of services (Photography/Films/Both)
        message: { type: String },
        status: { type: String, enum: ["New", "Contacted", "Booked", "Closed"], default: "New" },
    },
    { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
