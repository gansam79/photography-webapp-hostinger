import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        whatsapp_no: { type: String, required: true },
        email: { type: String },
        event_name: { type: String },
        photography_type: { type: String },
        location: { type: String },
        event_date: { type: Date },
        event_end_date: { type: Date },
        serviceConfig: { type: mongoose.Schema.Types.Mixed },
        start_time: { type: String },
        end_time: { type: String },
        service: { type: String }, // Storing as comma-separated string as per frontend logic
        album_pages: { type: String },
        amount: { type: Number },
        amount_paid: { type: Number },
        remaining_amount: { type: Number },
        deliverables: { type: String },
        delivery_date: { type: Date },
        order_status: { type: String, enum: ["Pending", "In Progress", "Delivered", "Cancelled"], default: "Pending" },
        notes: { type: String },
        relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
