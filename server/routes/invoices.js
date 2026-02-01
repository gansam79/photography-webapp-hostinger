import express from "express";
import Invoice from "../models/Invoice.js";
import Quotation from "../models/Quotation.js";
import Payment from "../models/Payment.js";
import Client from "../models/Client.js";

const router = express.Router();

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const count = await Invoice.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `INV-${year}${month}-${String(count + 1).padStart(5, "0")}`;
};

// Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("clientId")
      .populate("quotationId")
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single invoice
router.get("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("clientId")
      .populate("quotationId");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create invoice (from quotation or standalone)
router.post("/", async (req, res) => {
  try {
    const invoiceNumber = await generateInvoiceNumber();
    const invoiceData = {
      ...req.body,
      invoiceNumber,
    };

    const invoice = new Invoice(invoiceData);
    const savedInvoice = await invoice.save();

    // Update quotation if created from quotation
    if (req.body.quotationId) {
      await Quotation.findByIdAndUpdate(req.body.quotationId, {
        convertedToInvoice: true,
        invoiceId: savedInvoice._id,
        status: "Accepted",
      });
    }

    // Update client totals
    await Client.findByIdAndUpdate(req.body.clientId, {
      $inc: { totalBilled: savedInvoice.grandTotal },
      pendingAmount: savedInvoice.grandTotal,
    });

    await savedInvoice.populate("clientId");
    await savedInvoice.populate("quotationId");
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("clientId")
      .populate("quotationId");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Delete associated payments
    await Payment.deleteMany({ invoiceId: req.params.id });

    // Update quotation if it exists
    if (invoice.quotationId) {
      await Quotation.findByIdAndUpdate(invoice.quotationId, {
        convertedToInvoice: false,
        invoiceId: null,
      });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Record payment for invoice
router.post("/:id/payments", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const payment = new Payment({
      invoiceId: req.params.id,
      clientId: invoice.clientId,
      ...req.body,
    });

    const savedPayment = await payment.save();

    // Get all payments for this invoice
    const allPayments = await Payment.find({ invoiceId: req.params.id });
    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);

    // Update invoice payment status
    let paymentStatus = "Unpaid";
    if (totalPaid >= invoice.grandTotal) {
      paymentStatus = "Paid";
    } else if (totalPaid > 0) {
      paymentStatus = "Partially Paid";
    }

    await Invoice.findByIdAndUpdate(req.params.id, {
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
});

// Get payments for invoice
router.get("/:id/payments", async (req, res) => {
  try {
    const payments = await Payment.find({ invoiceId: req.params.id }).sort({
      paymentDate: -1,
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
