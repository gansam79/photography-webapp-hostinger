import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['photography', 'video', 'drone', 'product', 'other'],
      default: 'photography',
    },
    ratePerDay: {
      type: Number,
      required: [true, 'Rate per day is required'],
      min: [0, 'Rate cannot be negative'],
    },
    ratePerUnit: {
      type: Number,
      default: 0,
      min: [0, 'Rate cannot be negative'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Index for active services
serviceSchema.index({ isActive: 1 });

export default mongoose.models.Service || mongoose.model('Service', serviceSchema);
