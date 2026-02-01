import Invoice from '../models/Invoice.js';
import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `INV-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

// Get all invoices
export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('clientId')
      .populate('quotationId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('clientId')
      .populate('quotationId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create invoice
export const createInvoice = async (req, res) => {
  try {
    console.log("Create Invoice Body:", req.body); // Debug log

    let { clientId, clientName, client, amount, paid, amountPaid, dueDate, invoiceDate, issueDate } = req.body;

    // Handle "Client" string
    const nameToSearch = clientName || client;

    if (!clientId && nameToSearch) {
      let existingClient = await Client.findOne({ name: nameToSearch });
      if (existingClient) {
        clientId = existingClient._id;
      } else {
        const newClient = await Client.create({
          name: nameToSearch,
          email: `invoice-${Date.now()}@example.com`, // Avoid duplicate key error
          phone: "0000000000",
          status: 'Active'
        });
        clientId = newClient._id;
      }
    }

    const invoiceNumber = await generateInvoiceNumber();

    // Robust date handling
    const validInvoiceDate = invoiceDate || issueDate || new Date();
    const validDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default +7 days

    const invoiceData = {
      ...req.body,
      invoiceNumber,
      clientId: clientId, // Explicitly use the variable we resolved above
      clientName: nameToSearch,
      grandTotal: Number(amount) || Number(req.body.grandTotal) || 0,
      subtotal: Number(amount) || Number(req.body.grandTotal) || 0, // Ensure strictly numeric
      amountPaid: Number(paid) || Number(amountPaid) || 0,
      invoiceDate: validInvoiceDate,
      eventDate: req.body.eventDate || validInvoiceDate,
      dueDate: validDueDate,
      eventType: req.body.eventType || req.body.event || 'Wedding',
      paymentStatus: req.body.paymentStatus || req.body.status || 'Unpaid',
      services: req.body.services && Array.isArray(req.body.services) ? req.body.services : [],
    };

    const invoice = new Invoice(invoiceData);
    const savedInvoice = await invoice.save();

    // Update quotation if created from quotation
    if (req.body.quotationId) {
      await Quotation.findByIdAndUpdate(req.body.quotationId, {
        convertedToInvoice: true,
        invoiceId: savedInvoice._id,
        status: 'Accepted',
      });
    }

    // Update client totals if we have a real client
    if (clientId) {
      await Client.findByIdAndUpdate(clientId, {
        $inc: { totalBilled: savedInvoice.grandTotal },
        pendingAmount: savedInvoice.grandTotal - (savedInvoice.amountPaid || 0),
      });
    }

    if (clientId) await savedInvoice.populate('clientId');
    if (savedInvoice.quotationId) await savedInvoice.populate('quotationId');

    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('clientId')
      .populate('quotationId');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update quotation if it exists
    if (invoice.quotationId) {
      await Quotation.findByIdAndUpdate(invoice.quotationId, {
        convertedToInvoice: false,
        invoiceId: null,
      });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invoices by client
export const getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await Invoice.find({ clientId: req.params.clientId })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get invoices by payment status
export const getInvoicesByPaymentStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const invoices = await Invoice.find({ paymentStatus: status })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update invoice payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get overdue invoices
export const getOverdueInvoices = async (req, res) => {
  try {
    const today = new Date();
    const invoices = await Invoice.find({
      dueDate: { $lt: today },
      paymentStatus: { $ne: 'Paid' },
    })
      .populate('clientId')
      .sort({ dueDate: 1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
