import Payment from '../models/Payment.js';
import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';

// Record payment
export const recordPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, transactionId, notes } = req.body;
    const invoiceId = req.params.invoiceId;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const payment = new Payment({
      invoiceId,
      clientId: invoice.clientId,
      amount,
      paymentMethod,
      transactionId,
      notes,
    });

    const savedPayment = await payment.save();

    // Get all payments for this invoice
    const allPayments = await Payment.find({ invoiceId });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // Update invoice payment status
    let paymentStatus = 'Unpaid';
    if (totalPaid >= invoice.grandTotal) {
      paymentStatus = 'Paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'Partially Paid';
    }

    await Invoice.findByIdAndUpdate(invoiceId, {
      paymentStatus,
    });

    // Update client totals
    const pendingAmount = Math.max(0, invoice.grandTotal - totalPaid);
    await Client.findByIdAndUpdate(invoice.clientId, {
      totalPaid,
      pendingAmount,
    });

    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get payments for invoice
export const getPaymentsByInvoice = async (req, res) => {
  try {
    const payments = await Payment.find({ invoiceId: req.params.invoiceId }).sort({
      paymentDate: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payments for client
export const getPaymentsByClient = async (req, res) => {
  try {
    const payments = await Payment.find({ clientId: req.params.clientId }).sort({
      paymentDate: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Recalculate invoice payment status
    const invoice = await Invoice.findById(payment.invoiceId);
    const allPayments = await Payment.find({ invoiceId: payment.invoiceId });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    let paymentStatus = 'Unpaid';
    if (totalPaid >= invoice.grandTotal) {
      paymentStatus = 'Paid';
    } else if (totalPaid > 0) {
      paymentStatus = 'Partially Paid';
    }

    await Invoice.findByIdAndUpdate(payment.invoiceId, { paymentStatus });

    // Update client totals
    const pendingAmount = Math.max(0, invoice.grandTotal - totalPaid);
    await Client.findByIdAndUpdate(invoice.clientId, {
      totalPaid,
      pendingAmount,
    });

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('invoiceId')
      .populate('clientId')
      .sort({ paymentDate: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('invoiceId')
      .populate('clientId');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get payment summary for dashboard
export const getPaymentSummary = async (req, res) => {
  try {
    const payments = await Payment.find();
    const invoices = await Invoice.find();

    const totalBilled = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
    const totalReceived = payments.reduce((sum, p) => sum + p.amount, 0);
    const pendingPayments = totalBilled - totalReceived;

    res.json({
      totalBilled,
      totalReceived,
      pendingPayments,
      totalInvoices: invoices.length,
      totalPayments: payments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
