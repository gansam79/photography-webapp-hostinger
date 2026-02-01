import mongoose from 'mongoose';

const eventTypeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Event type name is required'],
            unique: true,
            trim: true,
        },
        label: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.models.EventType || mongoose.model('EventType', eventTypeSchema);
