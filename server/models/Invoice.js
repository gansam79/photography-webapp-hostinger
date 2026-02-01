import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: [true, 'Invoice number is required'],
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: false,
    },
    quotationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quotation',
      default: null,
    },
    eventType: {
      type: String,
      required: [true, 'Event type is required'],
    },
    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    services: {
      type: [
        {
          serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true,
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
      default: [], // Allow empty services for quick invoices
    },
    subtotal: {
      type: Number,
      default: 0,
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
      default: 0,
      min: [0, 'Grand total cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Partially Paid', 'Partial', 'Unpaid', 'Overdue', 'Draft', 'Sent'],
      default: 'Unpaid',
    },
    // Enhanced CRM Fields
    amountPaid: { type: Number, default: 0, min: 0 },
    workflowStage: { type: String, default: 'Planning' },
    paymentMethod: { type: String, default: 'UPI' },
    clientName: { type: String, trim: true },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      upiId: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    thankYouMessage: {
      type: String,
      default: 'Thank you for your business. We appreciate your support!',
    },
  },
  { timestamps: true }
);

// Index for faster queries
invoiceSchema.index({ clientId: 1 });
invoiceSchema.index({ paymentStatus: 1 });
invoiceSchema.index({ dueDate: 1 });

export default mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);
