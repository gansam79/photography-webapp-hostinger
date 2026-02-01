import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: {
      type: String,
      unique: true,
      required: [true, 'Quotation number is required'],
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false, // Optional if just using clientName
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
    },
    quotationDate: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    validityDate: {
      type: Date,
      required: [true, 'Validity date is required'],
    },
    services: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Service',
          required: false,
        },
        serviceName: String,
        quantity: {
          type: Number,
          default: 1,
          min: [1, 'Quantity must be at least 1'],
        },
        days: {
          type: Number,
          default: 1,
          min: [1, 'Days must be at least 1'],
        },
        ratePerDay: {
          type: Number,
          required: true,
          min: [0, 'Rate cannot be negative'],
        },
        total: {
          type: Number,
          required: true,
          min: [0, 'Total cannot be negative'],
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'fixed',
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
      max: [100, 'Tax cannot exceed 100%'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, 'Grand total cannot be negative'],
    },
    paymentTerms: {
      type: String,
      default: '50% advance, 50% on event date',
    },
    notes: {
      type: String,
      trim: true,
    },
    thankYouMessage: {
      type: String,
      default:
        "Thank you for choosing The Patil Photography & Film's. We look forward to capturing your special moments!",
    },
    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Negotiation'],
      default: 'Draft',
    },
    // Enhanced CRM Fields
    clientName: { type: String, trim: true }, // Snapshot of client name
    email: { type: String, trim: true },
    whatsapp_no: { type: String, trim: true },
    location: { type: String, trim: true },
    retainerAmount: { type: Number, default: 0 },
    stage: { type: String, default: 'Concept' },
    deliverables: [{ type: String }], // Simple list of deliverables
    moodboard: { type: String, trim: true },
    channel: { type: String, enum: ['Email', 'WhatsApp', 'Call', 'Other'], default: 'Email' },
    followUpDate: { type: Date },
    convertedToInvoice: {
      type: Boolean,
      default: false,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
  },
  { timestamps: true }
);

// Index for faster queries
quotationSchema.index({ clientId: 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ eventDate: 1 });

export default mongoose.models.Quotation || mongoose.model('Quotation', quotationSchema);
