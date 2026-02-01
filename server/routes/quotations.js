import express from "express";
import Quotation from "../models/Quotation.js";
import Client from "../models/Client.js";

const router = express.Router();

// Generate unique quotation number
const generateQuotationNumber = async () => {
  const count = await Quotation.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `QT-${year}${month}-${String(count + 1).padStart(5, "0")}`;
};

// Get all quotations
router.get("/", async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("clientId")
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single quotation
router.get("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate(
      "clientId",
    );
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create quotation
router.post("/", async (req, res) => {
  try {
    const quotationNumber = await generateQuotationNumber();
    const quotationData = {
      ...req.body,
      quotationNumber,
    };

    const quotation = new Quotation(quotationData);
    const savedQuotation = await quotation.save();
    await savedQuotation.populate("clientId");
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update quotation
router.put("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("clientId");

    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete quotation
router.delete("/:id", async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json({ message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Duplicate quotation
router.post("/:id/duplicate", async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const quotationNumber = await generateQuotationNumber();
    const newQuotation = new Quotation({
      ...quotation.toObject(),
      _id: undefined,
      quotationNumber,
      quotationDate: new Date(),
      status: "Draft",
      convertedToInvoice: false,
      invoiceId: null,
    });

    const savedQuotation = await newQuotation.save();
    await savedQuotation.populate("clientId");
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
