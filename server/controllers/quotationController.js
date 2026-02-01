import Quotation from '../models/Quotation.js';
import Client from '../models/Client.js';
import { sendEmail } from '../utils/emailService.js';
import { generateEmailHtml } from "../utils/emailTemplates.js";

// Generate unique quotation number
const generateQuotationNumber = async () => {
  const count = await Quotation.countDocuments();
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `QT-${year}${month}-${String(count + 1).padStart(5, '0')}`;
};

// Get all quotations
export const getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single quotation
export const getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate('clientId');
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create quotation
export const createQuotation = async (req, res) => {
  try {
    // Only use provided clientId if it exists, otherwise leave it null
    // We do NOT automatically create or lookup clients here anymore per user request
    const { clientId, clientName, client, email } = req.body;
    const nameToSearch = clientName || client;

    const quotationNumber = await generateQuotationNumber();
    const quotationData = {
      ...req.body,
      quotationNumber,
      clientId: clientId || null, // Explicitly null if not provided
      clientName: nameToSearch
    };

    const quotation = new Quotation(quotationData);
    const savedQuotation = await quotation.save();

    // Try populating if we have an ID
    if (savedQuotation.clientId) {
      await savedQuotation.populate('clientId');
    }

    // Send Email to Client
    if (email) {
      const htmlContent = generateEmailHtml({
        title: "Quotation Received",
        greeting: `Hello ${nameToSearch || 'Valued Customer'},`,
        intro: "You have received a new quotation from The Patil Photography. We look forward to capturing your special moments.",
        details: {
          "Quotation No": quotationNumber,
          "Event Type": req.body.eventType || 'N/A',
          "Event Date": req.body.eventDate ? new Date(req.body.eventDate).toDateString() : 'N/A',
          "Location": req.body.location || 'N/A',
          "Services": Array.isArray(req.body.services) ? req.body.services.map(s => s.name).join(", ") : (req.body.services || 'N/A'),
          "Total Amount": req.body.grandTotal ? `₹${Number(req.body.grandTotal).toLocaleString('en-IN')}` : 'N/A',
          "Terms & Conditions": req.body.termsAndConditions || 'As per standard policy',
          "Valid Until": req.body.validityDate ? new Date(req.body.validityDate).toDateString() : 'N/A'
        },
        actionText: "Contact Us to Book",
        actionUrl: process.env.CLIENT_URL || "#"
      });

      await sendEmail({
        to: email,
        cc: "pixelproitsolutions@gmail.com",
        subject: `Quotation ${quotationNumber} - The Patil Photography`,
        html: htmlContent
      });
    }

    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update quotation
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;

    // Check if we are converting to Accepted
    if (updateData.status === 'Accepted') {
      const existingQuotation = await Quotation.findById(id);

      if (!existingQuotation) {
        return res.status(404).json({ message: 'Quotation not found' });
      }

      // Logic: If status is becoming Accepted and we don't have a linked Client yet, create one
      if (!existingQuotation.clientId && !updateData.clientId) {
        const clientName = updateData.clientName || existingQuotation.clientName;
        const email = updateData.email || existingQuotation.email;
        const phone = updateData.whatsapp_no || existingQuotation.whatsapp_no;

        if (clientName) {
          // Check if client exists by name to avoid duplicates (optional, but good practice)
          let clientObj = await Client.findOne({ name: clientName });

          if (!clientObj) {
            clientObj = await Client.create({
              name: clientName,
              email: email || "",
              phone: phone || "",
              status: 'Client' // Promoted directly to Client on acceptance
            });
          }

          updateData.clientId = clientObj._id;
        }
      }
    }

    const quotation = await Quotation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('clientId');

    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }
    res.json({ message: 'Quotation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Duplicate quotation
export const duplicateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: 'Quotation not found' });
    }

    const quotationNumber = await generateQuotationNumber();
    const newQuotation = new Quotation({
      ...quotation.toObject(),
      _id: undefined,
      quotationNumber,
      quotationDate: new Date(),
      status: 'Draft',
      convertedToInvoice: false,
      invoiceId: null,
    });

    const savedQuotation = await newQuotation.save();
    await savedQuotation.populate('clientId');
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get quotations by client
export const getQuotationsByClient = async (req, res) => {
  try {
    const quotations = await Quotation.find({ clientId: req.params.clientId })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quotations by status
export const getQuotationsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const quotations = await Quotation.find({ status })
      .populate('clientId')
      .sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
