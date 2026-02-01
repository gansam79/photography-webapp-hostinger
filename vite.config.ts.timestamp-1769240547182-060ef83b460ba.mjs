var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/models/Client.js
var Client_exports = {};
__export(Client_exports, {
  default: () => Client_default
});
import mongoose2 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var clientSchema, Client_default;
var init_Client = __esm({
  "server/models/Client.js"() {
    clientSchema = new mongoose2.Schema(
      {
        name: {
          type: String,
          required: [true, "Client name is required"],
          trim: true,
          minlength: [2, "Name must be at least 2 characters"]
        },
        email: {
          type: String,
          required: [true, "Email is required"],
          lowercase: true,
          trim: true,
          match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email"]
        },
        phone: {
          type: String,
          required: [true, "Phone number is required"],
          trim: true
        },
        address: {
          type: String,
          trim: true
        },
        city: {
          type: String,
          trim: true
        },
        state: {
          type: String,
          trim: true
        },
        zipCode: {
          type: String,
          trim: true
        },
        category: {
          type: String,
          enum: ["Regular", "VIP", "New Inquiry"],
          default: "New Inquiry"
        },
        tags: [
          {
            type: String,
            trim: true
          }
        ],
        notes: {
          type: String,
          trim: true
        },
        totalBilled: {
          type: Number,
          default: 0,
          min: 0
        },
        totalPaid: {
          type: Number,
          default: 0,
          min: 0
        },
        pendingAmount: {
          type: Number,
          default: 0,
          min: 0
        },
        // New fields for CRM
        event: { type: String, trim: true },
        budget: { type: Number, default: 0 },
        status: {
          type: String,
          enum: ["Lead", "Active", "Archived"],
          default: "Lead"
        }
      },
      { timestamps: true }
    );
    Client_default = mongoose2.models.Client || mongoose2.model("Client", clientSchema);
  }
});

// vite.config.ts
import { defineConfig } from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";

// server/index.js
import "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/dotenv/config.js";
import express17 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";
import cors from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/cors/lib/index.js";

// server/db.js
import mongoose from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var DEFAULT_HOST = "cluster0.ds2nlug.mongodb.net";
var DEFAULT_APP_NAME = "Cluster0";
var buildMongoUri = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const host = process.env.MONGODB_HOST || DEFAULT_HOST;
  if (!username || !password) return null;
  const encodedUser = encodeURIComponent(username);
  const encodedPass = encodeURIComponent(password);
  return `mongodb+srv://${encodedUser}:${encodedPass}@${host}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_APP_NAME || DEFAULT_APP_NAME}`;
};
var connectDB = async () => {
  try {
    const mongoUri = buildMongoUri();
    if (!mongoUri) {
      throw new Error(
        "MongoDB connection settings are missing. Provide MONGODB_URI or MONGODB_USERNAME/MONGODB_PASSWORD in your environment."
      );
    }
    if (process.env.MONGO_DEBUG === "true") {
      mongoose.set("debug", true);
    }
    mongoose.connection.on("connected", () => {
      console.log("\u2705 Mongoose connected to database", mongoose.connection.name || process.env.DATABASE_NAME || "(unknown)");
    });
    mongoose.connection.on("error", (err) => {
      console.error("\u274C Mongoose connection error:", err && err.message ? err.message : err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("\u26A0\uFE0F Mongoose disconnected");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("\u{1F501} Mongoose reconnected");
    });
    await mongoose.connect(mongoUri, {
      // Hardcoded to "photograper" to match the actual MongoDB database name
      dbName: "photograper",
      retryWrites: true,
      w: "majority"
    });
    console.log("\u2705 MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("\u274C MongoDB connection error:", error && error.message ? error.message : error);
    if (process.env.EXIT_ON_DB_FAIL === "true") {
      process.exit(1);
    }
    return null;
  }
};
var getDbStatus = () => {
  return mongoose.connection.readyState;
};

// server/routes/demo.js
var handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};

// server/routes/clientRoutes.js
import express from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/controllers/clientController.js
init_Client();
var getAllClients = async (req, res) => {
  try {
    const clients = await Client_default.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getClientById = async (req, res) => {
  try {
    const client = await Client_default.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createClient = async (req, res) => {
  const { name, email, phone, whatsapp, address, city, state, zipCode, category, tags, notes, event, budget, status } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "Name, email, and phone are required" });
  }
  try {
    const client = new Client_default({
      name,
      email,
      phone: phone || whatsapp,
      // Accept phone or whatsapp
      address,
      city,
      state,
      zipCode,
      category,
      tags,
      notes,
      event,
      budget,
      status
    });
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    if (error.code === 11e3) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};
var updateClient = async (req, res) => {
  try {
    const client = await Client_default.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    if (error.code === 11e3) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};
var deleteClient = async (req, res) => {
  try {
    const client = await Client_default.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var searchClients = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }
    const clients = await Client_default.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/clientRoutes.js
var router = express.Router();
router.get("/", getAllClients);
router.get("/search", searchClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);
var clientRoutes_default = router;

// server/routes/serviceRoutes.js
import express2 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Service.js
import mongoose3 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var serviceSchema = new mongoose3.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"]
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      enum: ["photography", "video", "drone", "product", "other"],
      default: "photography"
    },
    ratePerDay: {
      type: Number,
      required: [true, "Rate per day is required"],
      min: [0, "Rate cannot be negative"]
    },
    ratePerUnit: {
      type: Number,
      default: 0,
      min: [0, "Rate cannot be negative"]
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
serviceSchema.index({ isActive: 1 });
var Service_default = mongoose3.models.Service || mongoose3.model("Service", serviceSchema);

// server/controllers/serviceController.js
var DEFAULT_SERVICES = [
  { name: "Traditional Photography", category: "photography", ratePerDay: 25e3 },
  { name: "Candid Photography", category: "photography", ratePerDay: 2e4 },
  { name: "Cinematic Wedding Film", category: "video", ratePerDay: 4e4 },
  { name: "Traditional Video", category: "video", ratePerDay: 3e4 },
  { name: "Drone Shoot", category: "drone", ratePerDay: 15e3 },
  { name: "Wedding Albums", category: "product", ratePerUnit: 5e3 },
  { name: "Frames", category: "product", ratePerUnit: 2e3 }
];
var getAllServices = async (req, res) => {
  try {
    let services = await Service_default.find({ isActive: true }).sort({ name: 1 });
    if (services.length === 0) {
      const createdServices = await Service_default.insertMany(DEFAULT_SERVICES);
      services = createdServices;
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getServiceById = async (req, res) => {
  try {
    const service = await Service_default.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createService = async (req, res) => {
  const { name, description, category, ratePerDay, ratePerUnit } = req.body;
  if (!name || !ratePerDay && !ratePerUnit) {
    return res.status(400).json({ message: "Name and rate are required" });
  }
  try {
    const service = new Service_default({
      name,
      description,
      category,
      ratePerDay,
      ratePerUnit
    });
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateService = async (req, res) => {
  try {
    const service = await Service_default.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteService = async (req, res) => {
  try {
    const service = await Service_default.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/serviceRoutes.js
var router2 = express2.Router();
router2.get("/", getAllServices);
router2.get("/:id", getServiceById);
router2.post("/", createService);
router2.put("/:id", updateService);
router2.delete("/:id", deleteService);
var serviceRoutes_default = router2;

// server/routes/quotationRoutes.js
import express3 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Quotation.js
import mongoose4 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var quotationSchema = new mongoose4.Schema(
  {
    quotationNumber: {
      type: String,
      unique: true,
      required: [true, "Quotation number is required"]
    },
    clientId: {
      type: mongoose4.Schema.Types.ObjectId,
      ref: "Client",
      required: false
      // Optional if just using clientName
    },
    eventType: {
      type: String,
      enum: ["Wedding", "Pre-wedding", "Other"],
      required: [true, "Event type is required"]
    },
    quotationDate: {
      type: Date,
      default: Date.now
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"]
    },
    validityDate: {
      type: Date,
      required: [true, "Validity date is required"]
    },
    services: [
      {
        serviceId: {
          type: mongoose4.Schema.Types.ObjectId,
          ref: "Service",
          required: false
        },
        serviceName: String,
        quantity: {
          type: Number,
          default: 1,
          min: [1, "Quantity must be at least 1"]
        },
        days: {
          type: Number,
          default: 1,
          min: [1, "Days must be at least 1"]
        },
        ratePerDay: {
          type: Number,
          required: true,
          min: [0, "Rate cannot be negative"]
        },
        total: {
          type: Number,
          required: true,
          min: [0, "Total cannot be negative"]
        }
      }
    ],
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"]
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed"
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
      max: [100, "Tax cannot exceed 100%"]
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"]
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, "Grand total cannot be negative"]
    },
    paymentTerms: {
      type: String,
      default: "50% advance, 50% on event date"
    },
    notes: {
      type: String,
      trim: true
    },
    thankYouMessage: {
      type: String,
      default: "Thank you for choosing The Patil Photography & Film's. We look forward to capturing your special moments!"
    },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Accepted", "Rejected", "Expired", "Negotiation"],
      default: "Draft"
    },
    // Enhanced CRM Fields
    clientName: { type: String, trim: true },
    // Snapshot of client name
    email: { type: String, trim: true },
    whatsapp_no: { type: String, trim: true },
    location: { type: String, trim: true },
    retainerAmount: { type: Number, default: 0 },
    stage: { type: String, default: "Concept" },
    deliverables: [{ type: String }],
    // Simple list of deliverables
    moodboard: { type: String, trim: true },
    channel: { type: String, enum: ["Email", "WhatsApp", "Call", "Other"], default: "Email" },
    followUpDate: { type: Date },
    convertedToInvoice: {
      type: Boolean,
      default: false
    },
    invoiceId: {
      type: mongoose4.Schema.Types.ObjectId,
      ref: "Invoice",
      default: null
    }
  },
  { timestamps: true }
);
quotationSchema.index({ clientId: 1 });
quotationSchema.index({ status: 1 });
quotationSchema.index({ eventDate: 1 });
var Quotation_default = mongoose4.models.Quotation || mongoose4.model("Quotation", quotationSchema);

// server/controllers/quotationController.js
init_Client();
var generateQuotationNumber = async () => {
  const count = await Quotation_default.countDocuments();
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `QT-${year}${month}-${String(count + 1).padStart(5, "0")}`;
};
var getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation_default.find().populate("clientId").sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation_default.findById(req.params.id).populate("clientId");
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createQuotation = async (req, res) => {
  try {
    let { clientId, clientName, client } = req.body;
    const nameToSearch = clientName || client;
    if (!clientId && nameToSearch) {
      let existingClient = await Client_default.findOne({ name: nameToSearch });
      if (existingClient) {
        clientId = existingClient._id;
      } else {
        const newClient = await Client_default.create({
          name: nameToSearch,
          email: req.body.email || `pending-${Date.now()}@example.com`,
          phone: req.body.whatsapp_no || "0000000000",
          status: "Lead"
        });
        clientId = newClient._id;
      }
    }
    const quotationNumber = await generateQuotationNumber();
    const quotationData = {
      ...req.body,
      quotationNumber,
      clientId,
      clientName: nameToSearch
      // Snapshot
    };
    const quotation = new Quotation_default(quotationData);
    const savedQuotation = await quotation.save();
    if (clientId) {
      await savedQuotation.populate("clientId");
    }
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation_default.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("clientId");
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json(quotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteQuotation = async (req, res) => {
  try {
    const quotation = await Quotation_default.findByIdAndDelete(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.json({ message: "Quotation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var duplicateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation_default.findById(req.params.id);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    const quotationNumber = await generateQuotationNumber();
    const newQuotation = new Quotation_default({
      ...quotation.toObject(),
      _id: void 0,
      quotationNumber,
      quotationDate: /* @__PURE__ */ new Date(),
      status: "Draft",
      convertedToInvoice: false,
      invoiceId: null
    });
    const savedQuotation = await newQuotation.save();
    await savedQuotation.populate("clientId");
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var getQuotationsByClient = async (req, res) => {
  try {
    const quotations = await Quotation_default.find({ clientId: req.params.clientId }).populate("clientId").sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getQuotationsByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const quotations = await Quotation_default.find({ status }).populate("clientId").sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/quotationRoutes.js
var router3 = express3.Router();
router3.get("/", getAllQuotations);
router3.get("/client/:clientId", getQuotationsByClient);
router3.get("/status", getQuotationsByStatus);
router3.get("/:id", getQuotationById);
router3.post("/", createQuotation);
router3.post("/:id/duplicate", duplicateQuotation);
router3.put("/:id", updateQuotation);
router3.delete("/:id", deleteQuotation);
var quotationRoutes_default = router3;

// server/routes/invoiceRoutes.js
import express4 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Invoice.js
import mongoose5 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var invoiceSchema = new mongoose5.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      required: [true, "Invoice number is required"]
    },
    clientId: {
      type: mongoose5.Schema.Types.ObjectId,
      ref: "Client",
      required: false
    },
    quotationId: {
      type: mongoose5.Schema.Types.ObjectId,
      ref: "Quotation",
      default: null
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"]
    },
    invoiceDate: {
      type: Date,
      default: Date.now
    },
    eventDate: {
      type: Date,
      required: [true, "Event date is required"]
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"]
    },
    services: {
      type: [
        {
          serviceId: {
            type: mongoose5.Schema.Types.ObjectId,
            ref: "Service",
            required: true
          },
          serviceName: String,
          quantity: {
            type: Number,
            default: 1,
            min: [1, "Quantity must be at least 1"]
          },
          days: {
            type: Number,
            default: 1,
            min: [1, "Days must be at least 1"]
          },
          ratePerDay: {
            type: Number,
            required: true,
            min: [0, "Rate cannot be negative"]
          },
          total: {
            type: Number,
            required: true,
            min: [0, "Total cannot be negative"]
          }
        }
      ],
      default: []
      // Allow empty services for quick invoices
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal cannot be negative"]
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"]
    },
    discountType: {
      type: String,
      enum: ["fixed", "percentage"],
      default: "fixed"
    },
    taxPercentage: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
      max: [100, "Tax cannot exceed 100%"]
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"]
    },
    grandTotal: {
      type: Number,
      default: 0,
      min: [0, "Grand total cannot be negative"]
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Partially Paid", "Partial", "Unpaid", "Overdue", "Draft", "Sent"],
      default: "Unpaid"
    },
    // Enhanced CRM Fields
    amountPaid: { type: Number, default: 0, min: 0 },
    workflowStage: { type: String, default: "Planning" },
    paymentMethod: { type: String, default: "UPI" },
    clientName: { type: String, trim: true },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      upiId: String
    },
    notes: {
      type: String,
      trim: true
    },
    thankYouMessage: {
      type: String,
      default: "Thank you for your business. We appreciate your support!"
    }
  },
  { timestamps: true }
);
invoiceSchema.index({ clientId: 1 });
invoiceSchema.index({ paymentStatus: 1 });
invoiceSchema.index({ dueDate: 1 });
var Invoice_default = mongoose5.models.Invoice || mongoose5.model("Invoice", invoiceSchema);

// server/controllers/invoiceController.js
init_Client();
var generateInvoiceNumber = async () => {
  const count = await Invoice_default.countDocuments();
  const date = /* @__PURE__ */ new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `INV-${year}${month}-${String(count + 1).padStart(5, "0")}`;
};
var getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice_default.find().populate("clientId").populate("quotationId").sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice_default.findById(req.params.id).populate("clientId").populate("quotationId");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createInvoice = async (req, res) => {
  try {
    console.log("Create Invoice Body:", req.body);
    let { clientId, clientName, client, amount, paid, amountPaid, dueDate, invoiceDate, issueDate } = req.body;
    const nameToSearch = clientName || client;
    if (!clientId && nameToSearch) {
      let existingClient = await Client_default.findOne({ name: nameToSearch });
      if (existingClient) {
        clientId = existingClient._id;
      } else {
        const newClient = await Client_default.create({
          name: nameToSearch,
          email: `invoice-${Date.now()}@example.com`,
          // Avoid duplicate key error
          phone: "0000000000",
          status: "Active"
        });
        clientId = newClient._id;
      }
    }
    const invoiceNumber = await generateInvoiceNumber();
    const validInvoiceDate = invoiceDate || issueDate || /* @__PURE__ */ new Date();
    const validDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1e3);
    const invoiceData = {
      ...req.body,
      invoiceNumber,
      clientId,
      // Explicitly use the variable we resolved above
      clientName: nameToSearch,
      grandTotal: Number(amount) || Number(req.body.grandTotal) || 0,
      subtotal: Number(amount) || Number(req.body.grandTotal) || 0,
      // Ensure strictly numeric
      amountPaid: Number(paid) || Number(amountPaid) || 0,
      invoiceDate: validInvoiceDate,
      eventDate: req.body.eventDate || validInvoiceDate,
      dueDate: validDueDate,
      eventType: req.body.eventType || req.body.event || "Wedding",
      paymentStatus: req.body.paymentStatus || req.body.status || "Unpaid",
      services: req.body.services && Array.isArray(req.body.services) ? req.body.services : []
    };
    const invoice = new Invoice_default(invoiceData);
    const savedInvoice = await invoice.save();
    if (req.body.quotationId) {
      await Quotation_default.findByIdAndUpdate(req.body.quotationId, {
        convertedToInvoice: true,
        invoiceId: savedInvoice._id,
        status: "Accepted"
      });
    }
    if (clientId) {
      await Client_default.findByIdAndUpdate(clientId, {
        $inc: { totalBilled: savedInvoice.grandTotal },
        pendingAmount: savedInvoice.grandTotal - (savedInvoice.amountPaid || 0)
      });
    }
    if (clientId) await savedInvoice.populate("clientId");
    if (savedInvoice.quotationId) await savedInvoice.populate("quotationId");
    res.status(201).json(savedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice_default.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate("clientId").populate("quotationId");
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice_default.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    if (invoice.quotationId) {
      await Quotation_default.findByIdAndUpdate(invoice.quotationId, {
        convertedToInvoice: false,
        invoiceId: null
      });
    }
    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getInvoicesByClient = async (req, res) => {
  try {
    const invoices = await Invoice_default.find({ clientId: req.params.clientId }).populate("clientId").sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getInvoicesByPaymentStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const invoices = await Invoice_default.find({ paymentStatus: status }).populate("clientId").sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const invoice = await Invoice_default.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var getOverdueInvoices = async (req, res) => {
  try {
    const today = /* @__PURE__ */ new Date();
    const invoices = await Invoice_default.find({
      dueDate: { $lt: today },
      paymentStatus: { $ne: "Paid" }
    }).populate("clientId").sort({ dueDate: 1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/invoiceRoutes.js
var router4 = express4.Router();
router4.get("/", getAllInvoices);
router4.get("/overdue", getOverdueInvoices);
router4.get("/client/:clientId", getInvoicesByClient);
router4.get("/status", getInvoicesByPaymentStatus);
router4.get("/:id", getInvoiceById);
router4.post("/", createInvoice);
router4.put("/:id", updateInvoice);
router4.patch("/:id/payment-status", updatePaymentStatus);
router4.delete("/:id", deleteInvoice);
var invoiceRoutes_default = router4;

// server/routes/auth.js
import express5 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";
import bcrypt from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/bcryptjs/index.js";
import jwt from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/jsonwebtoken/index.js";

// server/models/User.js
import mongoose6 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var userSchema = new mongoose6.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin", "editor"] },
    phone: { type: String },
    status: { type: String, default: "Active", enum: ["Active", "Inactive"] }
  },
  { timestamps: true }
);
var User_default = mongoose6.models.User || mongoose6.model("User", userSchema);

// server/routes/auth.js
var router5 = express5.Router();
var JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";
router5.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const existing = await User_default.findOne({ email });
    if (existing) return res.status(409).json({ error: "Email already in use" });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User_default.create({ name, email, password: hash });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router5.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    const user = await User_default.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
var auth_default = router5;

// server/routes/sliderRoutes.js
import express6 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Slider.js
import mongoose7 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var sliderSchema = new mongoose7.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);
var Slider_default = mongoose7.models.Slider || mongoose7.model("Slider", sliderSchema);

// server/controllers/sliderController.js
var getAllSliders = async (req, res) => {
  try {
    const sliders = await Slider_default.find().sort({ order: 1 });
    res.json(sliders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createSlider = async (req, res) => {
  try {
    const slider = new Slider_default(req.body);
    await slider.save();
    res.status(201).json(slider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateSlider = async (req, res) => {
  try {
    const slider = await Slider_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.json(slider);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteSlider = async (req, res) => {
  try {
    const slider = await Slider_default.findByIdAndDelete(req.params.id);
    if (!slider) return res.status(404).json({ message: "Slider not found" });
    res.json({ message: "Slider deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/sliderRoutes.js
var router6 = express6.Router();
router6.get("/", getAllSliders);
router6.post("/", createSlider);
router6.put("/:id", updateSlider);
router6.delete("/:id", deleteSlider);
var sliderRoutes_default = router6;

// server/routes/galleryRoutes.js
import express7 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Gallery.js
import mongoose8 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var gallerySchema = new mongoose8.Schema(
  {
    title: { type: String },
    image: { type: String, required: true },
    category: { type: String, default: "General" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);
var Gallery_default = mongoose8.models.Gallery || mongoose8.model("Gallery", gallerySchema);

// server/controllers/galleryController.js
var getAllGalleryItems = async (req, res) => {
  try {
    const items = await Gallery_default.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createGalleryItem = async (req, res) => {
  try {
    const item = new Gallery_default(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery_default.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/galleryRoutes.js
var router7 = express7.Router();
router7.get("/", getAllGalleryItems);
router7.post("/", createGalleryItem);
router7.put("/:id", updateGalleryItem);
router7.delete("/:id", deleteGalleryItem);
var galleryRoutes_default = router7;

// server/routes/orderRoutes.js
import express8 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Order.js
import mongoose9 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var orderSchema = new mongoose9.Schema(
  {
    name: { type: String, required: true },
    whatsapp_no: { type: String, required: true },
    email: { type: String },
    event_name: { type: String },
    photography_type: { type: String },
    location: { type: String },
    event_date: { type: Date },
    event_end_date: { type: Date },
    serviceConfig: { type: mongoose9.Schema.Types.Mixed },
    start_time: { type: String },
    end_time: { type: String },
    service: { type: String },
    // Storing as comma-separated string as per frontend logic
    album_pages: { type: String },
    amount: { type: Number },
    amount_paid: { type: Number },
    remaining_amount: { type: Number },
    deliverables: { type: String },
    delivery_date: { type: Date },
    order_status: { type: String, enum: ["Pending", "In Progress", "Delivered", "Cancelled"], default: "Pending" },
    notes: { type: String },
    relatedUser: { type: mongoose9.Schema.Types.ObjectId, ref: "User" },
    client: { type: mongoose9.Schema.Types.ObjectId, ref: "Client" }
  },
  { timestamps: true }
);
var Order_default = mongoose9.models.Order || mongoose9.model("Order", orderSchema);

// server/controllers/orderController.js
var getAllOrders = async (req, res) => {
  try {
    const orders = await Order_default.find().populate("relatedUser", "name email").sort({ delivery_date: -1, createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body };
    const { name, email, whatsapp_no } = orderData;
    if (name || email || whatsapp_no) {
      const Client = (await Promise.resolve().then(() => (init_Client(), Client_exports))).default;
      let client = null;
      if (email) client = await Client.findOne({ email });
      if (!client && whatsapp_no) client = await Client.findOne({ phone: whatsapp_no });
      if (!client && name) client = await Client.findOne({ name });
      if (client) {
        orderData.client = client._id;
      } else {
        try {
          client = new Client({
            name: name || "Unknown",
            email: email || `temp_${Date.now()}@example.com`,
            phone: whatsapp_no || "0000000000",
            type: "Regular",
            // Default
            source: "Order"
          });
          await client.save();
          orderData.client = client._id;
        } catch (clientErr) {
          console.error("Auto-create client failed:", clientErr);
        }
      }
    }
    const order = new Order_default(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateOrder = async (req, res) => {
  try {
    const order = await Order_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteOrder = async (req, res) => {
  try {
    const order = await Order_default.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/orderRoutes.js
var router8 = express8.Router();
router8.get("/", getAllOrders);
router8.post("/", createOrder);
router8.put("/:id", updateOrder);
router8.delete("/:id", deleteOrder);
var orderRoutes_default = router8;

// server/routes/userRoutes.js
import express9 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/controllers/userController.js
import bcrypt2 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/bcryptjs/index.js";
var getAllUsers = async (req, res) => {
  try {
    const users = await User_default.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createUser = async (req, res) => {
  try {
    const { name, email, password, role, phone, status } = req.body;
    const existing = await User_default.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt2.hash(password, 10);
    const user = new User_default({ name, email, password: hashedPassword, role, phone, status });
    await user.save();
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt2.hash(password, 10);
    }
    const user = await User_default.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteUser = async (req, res) => {
  try {
    const user = await User_default.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/userRoutes.js
var router9 = express9.Router();
router9.get("/", getAllUsers);
router9.post("/", createUser);
router9.put("/:id", updateUser);
router9.delete("/:id", deleteUser);
var userRoutes_default = router9;

// server/routes/filmRoutes.js
import express10 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Film.js
import mongoose10 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var filmSchema = new mongoose10.Schema(
  {
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    category: { type: String, default: "Wedding" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);
var Film_default = mongoose10.models.Film || mongoose10.model("Film", filmSchema);

// server/controllers/filmController.js
var getAllFilms = async (req, res) => {
  try {
    const films = await Film_default.find().sort({ createdAt: -1 });
    res.json(films);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createFilm = async (req, res) => {
  try {
    const film = new Film_default(req.body);
    await film.save();
    res.status(201).json(film);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateFilm = async (req, res) => {
  try {
    const film = await Film_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!film) return res.status(404).json({ message: "Film not found" });
    res.json(film);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteFilm = async (req, res) => {
  try {
    const film = await Film_default.findByIdAndDelete(req.params.id);
    if (!film) return res.status(404).json({ message: "Film not found" });
    res.json({ message: "Film deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/filmRoutes.js
var router10 = express10.Router();
router10.get("/", getAllFilms);
router10.post("/", createFilm);
router10.put("/:id", updateFilm);
router10.delete("/:id", deleteFilm);
var filmRoutes_default = router10;

// server/routes/loveStoryRoutes.js
import express11 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/LoveStory.js
import mongoose11 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var loveStorySchema = new mongoose11.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    // Full Description
    thumbnail: { type: String, required: true },
    // Base64 or URL
    gallery: [{ type: String }],
    // Array of Base64 or URLs
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);
var LoveStory_default = mongoose11.models.LoveStory || mongoose11.model("LoveStory", loveStorySchema);

// server/controllers/loveStoryController.js
var getAllLoveStories = async (req, res) => {
  try {
    const stories = await LoveStory_default.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getLoveStoryById = async (req, res) => {
  try {
    const story = await LoveStory_default.findById(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createLoveStory = async (req, res) => {
  try {
    const story = new LoveStory_default(req.body);
    await story.save();
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateLoveStory = async (req, res) => {
  try {
    const story = await LoveStory_default.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json(story);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteLoveStory = async (req, res) => {
  try {
    const story = await LoveStory_default.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: "Story not found" });
    res.json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/loveStoryRoutes.js
var router11 = express11.Router();
router11.get("/", getAllLoveStories);
router11.get("/:id", getLoveStoryById);
router11.post("/", createLoveStory);
router11.put("/:id", updateLoveStory);
router11.delete("/:id", deleteLoveStory);
var loveStoryRoutes_default = router11;

// server/routes/enquiryRoutes.js
import express12 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Enquiry.js
import mongoose12 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var enquirySchema = new mongoose12.Schema(
  {
    groomName: { type: String, required: true },
    brideName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    eventStartDate: { type: Date, required: true },
    eventEndDate: { type: Date, required: true },
    events: [{ type: String }],
    // Array of event names
    budget: { type: Number },
    location: { type: String, required: true },
    services: [{ type: String }],
    // Array of services (Photography/Films/Both)
    message: { type: String },
    status: { type: String, enum: ["New", "Contacted", "Booked", "Closed"], default: "New" }
  },
  { timestamps: true }
);
var Enquiry_default = mongoose12.models.Enquiry || mongoose12.model("Enquiry", enquirySchema);

// server/utils/emailService.js
import nodemailer from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/nodemailer/lib/nodemailer.js";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var sendEmail = async ({ to, subject, html, replyTo }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Potography Webapp"}" <${process.env.EMAIL_USER}>`,
      to,
      replyTo,
      subject,
      html
    });
    console.log("Message sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    return null;
  }
};

// server/controllers/enquiryController.js
var createEnquiry = async (req, res) => {
  try {
    const enquiry = new Enquiry_default(req.body);
    await enquiry.save();
    const adminEmail = "pixelproitsolutions@gmail.com";
    if (adminEmail) {
      const htmlContent = `
                <h2>New "Book Us" Enquiry Received</h2>
                <p><strong>Couple:</strong> ${enquiry.groomName} & ${enquiry.brideName}</p>
                <p><strong>Phone:</strong> ${enquiry.phoneNumber}</p>
                <p><strong>Date:</strong> ${new Date(enquiry.eventStartDate).toDateString()} - ${new Date(enquiry.eventEndDate).toDateString()}</p>
                <p><strong>Location:</strong> ${enquiry.location}</p>
                <p><strong>Budget:</strong> ${enquiry.budget}</p>
                <p><strong>Message:</strong> ${enquiry.message}</p>
                <br>
                <a href="${process.env.CLIENT_URL || "http://localhost:8080"}/enquiries">View in Admin Panel</a>
            `;
      await sendEmail({
        to: adminEmail,
        subject: `New Enquiry: ${enquiry.groomName} & ${enquiry.brideName}`,
        html: htmlContent,
        replyTo: ""
      });
    }
    res.status(201).json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry_default.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry_default.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json(enquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry_default.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/enquiryRoutes.js
var router12 = express12.Router();
router12.post("/", createEnquiry);
router12.get("/", getAllEnquiries);
router12.put("/:id/status", updateEnquiryStatus);
router12.delete("/:id", deleteEnquiry);
var enquiryRoutes_default = router12;

// server/routes/contactRoutes.js
import express13 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Contact.js
import mongoose13 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var contactSchema = new mongoose13.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["New", "Read", "Replied"], default: "New" }
  },
  { timestamps: true }
);
var Contact_default = mongoose13.models.Contact || mongoose13.model("Contact", contactSchema);

// server/controllers/contactController.js
var createContact = async (req, res) => {
  try {
    const contact = new Contact_default(req.body);
    await contact.save();
    const adminEmail = "pixelproitsolutions@gmail.com";
    if (adminEmail) {
      const htmlContent = `
                <h2>New Contact Message Received</h2>
                <p><strong>Name:</strong> ${contact.name}</p>
                <p><strong>Email:</strong> ${contact.email}</p>
                <p><strong>Subject:</strong> ${contact.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${contact.message}</p>
                <br>
                <a href="${process.env.CLIENT_URL || "http://localhost:8080"}/contact-messages">View in Admin Panel</a>
            `;
      await sendEmail({
        to: adminEmail,
        subject: `New Message: ${contact.subject}`,
        html: htmlContent,
        replyTo: contact.email
      });
    }
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact_default.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact_default.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteContact = async (req, res) => {
  try {
    const contact = await Contact_default.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/contactRoutes.js
var router13 = express13.Router();
router13.post("/", createContact);
router13.get("/", getAllContacts);
router13.put("/:id/status", updateContactStatus);
router13.delete("/:id", deleteContact);
var contactRoutes_default = router13;

// server/routes/dashboardRoutes.js
import express14 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/controllers/dashboardController.js
init_Client();

// server/models/Testimonial.js
import mongoose14 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var testimonialSchema = new mongoose14.Schema(
  {
    coupleName: { type: String, required: true },
    location: { type: String, trim: true },
    thumbnail: { type: String },
    // URL or Base64
    shortDescription: { type: String, required: true, maxlength: 1e3 },
    fullDescription: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    displayOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Pending"],
      default: "Active"
    }
  },
  { timestamps: true }
);
testimonialSchema.index({ displayOrder: 1 });
if (mongoose14.models.Testimonial) {
  delete mongoose14.models.Testimonial;
}
var Testimonial_default = mongoose14.model("Testimonial", testimonialSchema);

// server/controllers/dashboardController.js
var getDashboardStats = async (req, res) => {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 7);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const newEnquiriesToday = await Enquiry_default.countDocuments({ createdAt: { $gte: today } });
    const newEnquiriesWeek = await Enquiry_default.countDocuments({ createdAt: { $gte: startOfWeek } });
    const newOrdersCount = await Order_default.countDocuments({ createdAt: { $gte: startOfMonth } });
    const pendingQuotations = await Quotation_default.countDocuments({
      status: { $in: ["Draft", "Sent", "Awaiting Approval"] }
    });
    const unpaidInvoicesAgg = await Invoice_default.aggregate([
      { $match: { paymentStatus: { $ne: "Paid" } } },
      { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: { $subtract: ["$grandTotal", "$amountPaid"] } } } }
    ]);
    const unpaidInvoicesCount = unpaidInvoicesAgg[0]?.count || 0;
    const unpaidInvoicesAmount = unpaidInvoicesAgg[0]?.totalAmount || 0;
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const upcomingShootsCount = await Order_default.countDocuments({
      event_date: { $gte: today, $lte: nextWeek }
    });
    const galleryQueue = await Order_default.countDocuments({ order_status: "In Progress" });
    const galleryStats = {
      total: await Gallery_default.countDocuments()
      // uploaded: await Gallery.countDocuments({ status: 'Published' }) // If Status exists
    };
    const unreadMessages = await Contact_default.countDocuments({ status: "New" });
    const activeClients = await Client_default.countDocuments({ status: "Active" });
    const pendingTestimonials = await Testimonial_default.countDocuments({ status: "Pending" });
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const enquiriesNoReply = await Enquiry_default.find({
      createdAt: { $lt: yesterday },
      status: "New"
    }).select("_id names groomName brideName createdAt").limit(5);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const oldQuotations = await Quotation_default.find({
      updatedAt: { $lt: threeDaysAgo },
      status: "Sent"
    }).select("_id quoteNumber clientName updatedAt").limit(5);
    const pendingOrders = await Order_default.find({ order_status: "Pending" }).select("_id name createdAt").limit(5);
    const overdueInvoices = await Invoice_default.find({
      dueDate: { $lt: today },
      paymentStatus: { $ne: "Paid" }
    }).select("_id invoiceNumber clientName dueDate grandTotal amountPaid").limit(5);
    const pendingTestimonialsList = await Testimonial_default.find({ status: "Pending" }).select("_id coupleName createdAt shortDescription fullDescription rating location thumbnail").limit(4);
    const pipelineStats = await Order_default.aggregate([
      { $group: { _id: "$order_status", count: { $sum: 1 } } }
    ]);
    const ordersByType = await Order_default.aggregate([
      { $group: { _id: "$photography_type", count: { $sum: 1 } } }
    ]);
    const upcomingShoots = await Order_default.find({
      event_date: { $gte: today }
    }).sort({ event_date: 1 }).limit(5).select("_id name event_name event_date location photography_type order_status");
    const revenueStats = await Invoice_default.aggregate([
      {
        $match: {
          invoiceDate: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          billed: { $sum: "$grandTotal" },
          collected: { $sum: "$amountPaid" }
        }
      }
    ]);
    const thisMonthBilled = revenueStats[0]?.billed || 0;
    const thisMonthCollected = revenueStats[0]?.collected || 0;
    const totalOutstandingAgg = await Invoice_default.aggregate([
      { $match: { paymentStatus: { $ne: "Paid" } } },
      { $group: { _id: null, total: { $sum: { $subtract: ["$grandTotal", "$amountPaid"] } } } }
    ]);
    const totalOutstanding = totalOutstandingAgg[0]?.total || 0;
    const recentEnquiries = await Enquiry_default.find().sort({ createdAt: -1 }).limit(3).lean();
    const recentOrders = await Order_default.find().sort({ createdAt: -1 }).limit(3).lean();
    const recentInvoices = await Invoice_default.find().sort({ createdAt: -1 }).limit(3).lean();
    const activityFeed = [
      ...recentEnquiries.map((e) => ({ type: "Enquiry", date: e.createdAt, text: `New enquiry: ${e.groomName} & ${e.brideName}`, id: e._id })),
      ...recentOrders.map((o) => ({ type: "Order", date: o.createdAt, text: `Order created: ${o.name}`, id: o._id })),
      ...recentInvoices.map((i) => ({ type: "Invoice", date: i.createdAt, text: `Invoice ${i.invoiceNumber}`, id: i._id }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    const sliderActive = await Slider_default.countDocuments({ active: true });
    const storiesPublished = await LoveStory_default.countDocuments({ status: "Published" });
    const testimonialsPublished = await Testimonial_default.countDocuments({ status: "Published" });
    const userStats = {
      total: await User_default.countDocuments()
    };
    res.status(200).json({
      kpi: {
        newEnquiriesToday,
        newEnquiriesWeek,
        newOrdersCount,
        // Month
        pendingQuotations,
        unpaidInvoicesCount,
        unpaidInvoicesAmount,
        upcomingShootsCount,
        galleryQueue,
        unreadMessages,
        activeClients,
        pendingTestimonials
      },
      actionRequired: {
        enquiriesNoReply,
        oldQuotations,
        pendingOrders,
        overdueInvoices,
        pendingTestimonialsList
      },
      pipeline: pipelineStats,
      ordersByType,
      schedule: upcomingShoots,
      revenue: {
        thisMonthBilled,
        thisMonthCollected,
        totalOutstanding
      },
      activityFeed,
      contentHealth: {
        sliderActive,
        storiesPublished,
        testimonialsPublished
      },
      galleryStats,
      userStats
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};

// server/routes/dashboardRoutes.js
var router14 = express14.Router();
router14.get("/stats", getDashboardStats);
var dashboardRoutes_default = router14;

// server/routes/testimonialRoutes.js
import express15 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/controllers/testimonialController.js
var createTestimonial = async (req, res) => {
  try {
    const testimonial = new Testimonial_default(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var getAllTestimonials = async (req, res) => {
  try {
    const { type } = req.query;
    let query = {};
    if (type === "active") {
      query.status = "Active";
      const testimonials2 = await Testimonial_default.find(query).sort({ displayOrder: 1, createdAt: -1 });
      return res.json(testimonials2);
    }
    const testimonials = await Testimonial_default.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial_default.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial_default.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial_default.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
    res.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/testimonialRoutes.js
var router15 = express15.Router();
router15.post("/", createTestimonial);
router15.get("/", getAllTestimonials);
router15.get("/:id", getTestimonialById);
router15.put("/:id", updateTestimonial);
router15.delete("/:id", deleteTestimonial);
var testimonialRoutes_default = router15;

// server/routes/eventTypeRoutes.js
import express16 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/EventType.js
import mongoose15 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var eventTypeSchema = new mongoose15.Schema(
  {
    name: {
      type: String,
      required: [true, "Event type name is required"],
      unique: true,
      trim: true
    },
    label: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);
var EventType_default = mongoose15.models.EventType || mongoose15.model("EventType", eventTypeSchema);

// server/controllers/eventTypeController.js
var getAllEventTypes = async (req, res) => {
  try {
    const eventTypes = await EventType_default.find({ isActive: true }).sort({ name: 1 });
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createEventType = async (req, res) => {
  try {
    const { name, label } = req.body;
    const eventType = new EventType_default({
      name,
      label: label || name
    });
    const savedEventType = await eventType.save();
    res.status(201).json(savedEventType);
  } catch (error) {
    if (error.code === 11e3) {
      return res.status(400).json({ message: "Event type already exists" });
    }
    res.status(400).json({ message: error.message });
  }
};
var updateEventType = async (req, res) => {
  try {
    const { name, label, isActive } = req.body;
    const updatedEventType = await EventType_default.findByIdAndUpdate(
      req.params.id,
      { name, label, isActive },
      { new: true, runValidators: true }
    );
    if (!updatedEventType) return res.status(404).json({ message: "Event Type not found" });
    res.json(updatedEventType);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteEventType = async (req, res) => {
  try {
    await EventType_default.findByIdAndDelete(req.params.id);
    res.json({ message: "Event type deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/eventTypeRoutes.js
var router16 = express16.Router();
router16.get("/", getAllEventTypes);
router16.post("/", createEventType);
router16.put("/:id", updateEventType);
router16.delete("/:id", deleteEventType);
var eventTypeRoutes_default = router16;

// server/middleware/errorHandler.js
var errorHandler = (err, req, res, next) => {
  console.error("Error:", err);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validation error",
      errors: messages
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format"
    });
  }
  if (err.code === 11e3) {
    const key = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${key} already exists`
    });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired"
    });
  }
  res.status(err.statusCode || 500).json({
    message: err.message || "Server error"
  });
};
var notFoundHandler = (req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found`
  });
};

// server/index.js
var defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://localhost:8080",
  "https://potography-webapp.vercel.app",
  "https://potography-webapp-website.vercel.app"
];
var buildAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ALLOWLIST || process.env.CORS_ORIGIN || "";
  const parsed = envOrigins.split(",").map((entry) => entry.trim()).filter(Boolean);
  return Array.from(/* @__PURE__ */ new Set([...defaultAllowedOrigins, ...parsed]));
};
var allowedOrigins = buildAllowedOrigins();
var corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    console.warn(`\u26A0\uFE0F  Blocked CORS origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200
};
var dbConnectionPromise;
var ensureDbConnection = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      console.error("\u274C MongoDB connection failed", error);
      dbConnectionPromise = void 0;
      throw error;
    });
  }
  return dbConnectionPromise;
};
function createServer(config = {}) {
  const app = express17();
  app.use(cors(corsOptions));
  app.use(express17.json({ limit: "50mb" }));
  app.use(express17.urlencoded({ extended: true, limit: "50mb" }));
  ensureDbConnection();
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app.get("/api/demo", handleDemo);
  app.get("/api/db-status", (_req, res) => {
    const state = getDbStatus();
    const map = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };
    res.json({ state, status: map[state] ?? "unknown" });
  });
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      dbState: getDbStatus(),
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      allowedOrigins
    });
  });
  app.use("/api/auth", auth_default);
  app.use("/api/clients", clientRoutes_default);
  app.use("/api/services", serviceRoutes_default);
  app.use("/api/quotations", quotationRoutes_default);
  app.use("/api/invoices", invoiceRoutes_default);
  app.use("/api/slider", sliderRoutes_default);
  app.use("/api/gallery", galleryRoutes_default);
  app.use("/api/orders", orderRoutes_default);
  app.use("/api/users", userRoutes_default);
  app.use("/api/films", filmRoutes_default);
  app.use("/api/love-stories", loveStoryRoutes_default);
  app.use("/api/enquiries", enquiryRoutes_default);
  app.use("/api/contact", contactRoutes_default);
  app.use("/api/dashboard", dashboardRoutes_default);
  app.use("/api/testimonials", testimonialRoutes_default);
  app.use("/api/event-types", eventTypeRoutes_default);
  console.log("\u2705 Contact, Dashboard & Testimonial routes registered " + Date.now() + " - Dashboard Pending Actions Added");
  if (!config.middlewareMode) {
    app.get("/", (req, res) => {
      res.json({ message: "Photography API is running \u{1F680}", status: "active" });
    });
  }
  if (!config.middlewareMode) {
    app.use(notFoundHandler);
  }
  app.use(errorHandler);
  return app;
}

// vite.config.ts
var __vite_injected_original_dirname = "C:\\Users\\amit1\\Data\\AppData\\App\\ganesh\\Personal\\github\\potography-webapp";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__vite_injected_original_dirname, "."),
        path.resolve(__vite_injected_original_dirname, "./client"),
        path.resolve(__vite_injected_original_dirname, "./shared"),
        path.resolve(__vite_injected_original_dirname, "./website"),
        path.resolve(__vite_injected_original_dirname, "./node_modules")
      ],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**", "website/node_modules_backup/**"]
    }
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      input: {
        main: path.resolve(__vite_injected_original_dirname, "index.html"),
        admin: path.resolve(__vite_injected_original_dirname, "admin/index.html")
      }
    }
  },
  plugins: [react(), expressPlugin()],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./client"),
      "@shared": path.resolve(__vite_injected_original_dirname, "./shared"),
      "@website": path.resolve(__vite_injected_original_dirname, "./website")
    }
  }
}));
console.log("Vite config loaded - triggering restart " + Date.now() + " second retry");
function expressPlugin() {
  return {
    name: "express-plugin",
    apply: "serve",
    // Only apply during development (serve mode)
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || "";
        if (url.startsWith("/admin") && !url.startsWith("/api") && !url.includes(".")) {
          req.url = "/admin/index.html";
        }
        next();
      });
      const app = createServer({ middlewareMode: true });
      server.middlewares.use(app);
    }
  };
}
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VydmVyL21vZGVscy9DbGllbnQuanMiLCAidml0ZS5jb25maWcudHMiLCAic2VydmVyL2luZGV4LmpzIiwgInNlcnZlci9kYi5qcyIsICJzZXJ2ZXIvcm91dGVzL2RlbW8uanMiLCAic2VydmVyL3JvdXRlcy9jbGllbnRSb3V0ZXMuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL2NsaWVudENvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9zZXJ2aWNlUm91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvU2VydmljZS5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvc2VydmljZUNvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9xdW90YXRpb25Sb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9RdW90YXRpb24uanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL3F1b3RhdGlvbkNvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9pbnZvaWNlUm91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvSW52b2ljZS5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvaW52b2ljZUNvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9hdXRoLmpzIiwgInNlcnZlci9tb2RlbHMvVXNlci5qcyIsICJzZXJ2ZXIvcm91dGVzL3NsaWRlclJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL1NsaWRlci5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvc2xpZGVyQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2dhbGxlcnlSb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9HYWxsZXJ5LmpzIiwgInNlcnZlci9jb250cm9sbGVycy9nYWxsZXJ5Q29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL29yZGVyUm91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvT3JkZXIuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL29yZGVyQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL3VzZXJSb3V0ZXMuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL3VzZXJDb250cm9sbGVyLmpzIiwgInNlcnZlci9yb3V0ZXMvZmlsbVJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL0ZpbG0uanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL2ZpbG1Db250cm9sbGVyLmpzIiwgInNlcnZlci9yb3V0ZXMvbG92ZVN0b3J5Um91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvTG92ZVN0b3J5LmpzIiwgInNlcnZlci9jb250cm9sbGVycy9sb3ZlU3RvcnlDb250cm9sbGVyLmpzIiwgInNlcnZlci9yb3V0ZXMvZW5xdWlyeVJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL0VucXVpcnkuanMiLCAic2VydmVyL3V0aWxzL2VtYWlsU2VydmljZS5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvZW5xdWlyeUNvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9jb250YWN0Um91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvQ29udGFjdC5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvY29udGFjdENvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9kYXNoYm9hcmRSb3V0ZXMuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL2Rhc2hib2FyZENvbnRyb2xsZXIuanMiLCAic2VydmVyL21vZGVscy9UZXN0aW1vbmlhbC5qcyIsICJzZXJ2ZXIvcm91dGVzL3Rlc3RpbW9uaWFsUm91dGVzLmpzIiwgInNlcnZlci9jb250cm9sbGVycy90ZXN0aW1vbmlhbENvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9ldmVudFR5cGVSb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9FdmVudFR5cGUuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL2V2ZW50VHlwZUNvbnRyb2xsZXIuanMiLCAic2VydmVyL21pZGRsZXdhcmUvZXJyb3JIYW5kbGVyLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXENsaWVudC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvQ2xpZW50LmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGNsaWVudFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAge1xyXG4gICAgbmFtZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ0NsaWVudCBuYW1lIGlzIHJlcXVpcmVkJ10sXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICAgIG1pbmxlbmd0aDogWzIsICdOYW1lIG11c3QgYmUgYXQgbGVhc3QgMiBjaGFyYWN0ZXJzJ10sXHJcbiAgICB9LFxyXG4gICAgZW1haWw6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdFbWFpbCBpcyByZXF1aXJlZCddLFxyXG4gICAgICBsb3dlcmNhc2U6IHRydWUsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICAgIG1hdGNoOiBbL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLywgJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgZW1haWwnXSxcclxuICAgIH0sXHJcbiAgICBwaG9uZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1Bob25lIG51bWJlciBpcyByZXF1aXJlZCddLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGFkZHJlc3M6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGNpdHk6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHN0YXRlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICB6aXBDb2RlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBjYXRlZ29yeToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnUmVndWxhcicsICdWSVAnLCAnTmV3IElucXVpcnknXSxcclxuICAgICAgZGVmYXVsdDogJ05ldyBJbnF1aXJ5JyxcclxuICAgIH0sXHJcbiAgICB0YWdzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBub3Rlczoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICB9LFxyXG4gICAgdG90YWxCaWxsZWQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IDAsXHJcbiAgICB9LFxyXG4gICAgdG90YWxQYWlkOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiAwLFxyXG4gICAgfSxcclxuICAgIHBlbmRpbmdBbW91bnQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IDAsXHJcbiAgICB9LFxyXG4gICAgLy8gTmV3IGZpZWxkcyBmb3IgQ1JNXHJcbiAgICBldmVudDogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIGJ1ZGdldDogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcclxuICAgIHN0YXR1czoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnTGVhZCcsICdBY3RpdmUnLCAnQXJjaGl2ZWQnXSxcclxuICAgICAgZGVmYXVsdDogJ0xlYWQnXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5DbGllbnQgfHwgbW9uZ29vc2UubW9kZWwoJ0NsaWVudCcsIGNsaWVudFNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuLy8gSW1wb3J0IHRoZSBleHBsaWNpdCBzZXJ2ZXIgZW50cnkgc28gVml0ZSByZXNvbHZlcyB0aGUgY29ycmVjdCBtb2R1bGVcclxuaW1wb3J0IHsgY3JlYXRlU2VydmVyIH0gZnJvbSBcIi4vc2VydmVyL2luZGV4LmpzXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIGZzOiB7XHJcbiAgICAgIGFsbG93OiBbXHJcbiAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuXCIpLFxyXG4gICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9jbGllbnRcIiksXHJcbiAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NoYXJlZFwiKSxcclxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vd2Vic2l0ZVwiKSxcclxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vbm9kZV9tb2R1bGVzXCIpLFxyXG4gICAgICBdLFxyXG4gICAgICBkZW55OiBbXCIuZW52XCIsIFwiLmVudi4qXCIsIFwiKi57Y3J0LHBlbX1cIiwgXCIqKi8uZ2l0LyoqXCIsIFwic2VydmVyLyoqXCIsIFwid2Vic2l0ZS9ub2RlX21vZHVsZXNfYmFja3VwLyoqXCJdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IFwiZGlzdC9zcGFcIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBtYWluOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImluZGV4Lmh0bWxcIiksXHJcbiAgICAgICAgYWRtaW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiYWRtaW4vaW5kZXguaHRtbFwiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgZXhwcmVzc1BsdWdpbigpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9jbGllbnRcIiksXHJcbiAgICAgIFwiQHNoYXJlZFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc2hhcmVkXCIpLFxyXG4gICAgICBcIkB3ZWJzaXRlXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi93ZWJzaXRlXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KSk7XHJcblxyXG5jb25zb2xlLmxvZygnVml0ZSBjb25maWcgbG9hZGVkIC0gdHJpZ2dlcmluZyByZXN0YXJ0ICcgKyBEYXRlLm5vdygpICsgJyBzZWNvbmQgcmV0cnknKTtcclxuZnVuY3Rpb24gZXhwcmVzc1BsdWdpbigpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImV4cHJlc3MtcGx1Z2luXCIsXHJcbiAgICBhcHBseTogXCJzZXJ2ZVwiLCAvLyBPbmx5IGFwcGx5IGR1cmluZyBkZXZlbG9wbWVudCAoc2VydmUgbW9kZSlcclxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcclxuICAgICAgLy8gU1BBIEZhbGxiYWNrIGZvciAvYWRtaW5cclxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8IFwiXCI7XHJcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKFwiL2FkbWluXCIpICYmICF1cmwuc3RhcnRzV2l0aChcIi9hcGlcIikgJiYgIXVybC5pbmNsdWRlcyhcIi5cIikpIHtcclxuICAgICAgICAgIHJlcS51cmwgPSBcIi9hZG1pbi9pbmRleC5odG1sXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBhcHAgPSBjcmVhdGVTZXJ2ZXIoeyBtaWRkbGV3YXJlTW9kZTogdHJ1ZSB9KTtcclxuXHJcbiAgICAgIC8vIEFkZCBFeHByZXNzIGFwcCBhcyBtaWRkbGV3YXJlIHRvIFZpdGUgZGV2IHNlcnZlclxyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFwcCk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGluZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2luZGV4LmpzXCI7aW1wb3J0IFwiZG90ZW52L2NvbmZpZ1wiO1xyXG5pbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xyXG5pbXBvcnQgeyBjb25uZWN0REIsIGdldERiU3RhdHVzIH0gZnJvbSBcIi4vZGIuanNcIjtcclxuaW1wb3J0IHsgaGFuZGxlRGVtbyB9IGZyb20gXCIuL3JvdXRlcy9kZW1vLmpzXCI7XHJcbmltcG9ydCBjbGllbnRSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2NsaWVudFJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgc2VydmljZVJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvc2VydmljZVJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgcXVvdGF0aW9uUm91dGVzIGZyb20gXCIuL3JvdXRlcy9xdW90YXRpb25Sb3V0ZXMuanNcIjtcclxuaW1wb3J0IGludm9pY2VSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2ludm9pY2VSb3V0ZXMuanNcIjtcclxuaW1wb3J0IGF1dGhSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2F1dGguanNcIjtcclxuaW1wb3J0IHNsaWRlclJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvc2xpZGVyUm91dGVzLmpzXCI7XHJcbmltcG9ydCBnYWxsZXJ5Um91dGVzIGZyb20gXCIuL3JvdXRlcy9nYWxsZXJ5Um91dGVzLmpzXCI7XHJcbmltcG9ydCBvcmRlclJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvb3JkZXJSb3V0ZXMuanNcIjtcclxuaW1wb3J0IHVzZXJSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL3VzZXJSb3V0ZXMuanNcIjtcclxuaW1wb3J0IGZpbG1Sb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2ZpbG1Sb3V0ZXMuanNcIjtcclxuaW1wb3J0IGxvdmVTdG9yeVJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvbG92ZVN0b3J5Um91dGVzLmpzXCI7XHJcbmltcG9ydCBlbnF1aXJ5Um91dGVzIGZyb20gXCIuL3JvdXRlcy9lbnF1aXJ5Um91dGVzLmpzXCI7XHJcbmltcG9ydCBjb250YWN0Um91dGVzIGZyb20gXCIuL3JvdXRlcy9jb250YWN0Um91dGVzLmpzXCI7XHJcbmltcG9ydCBkYXNoYm9hcmRSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2Rhc2hib2FyZFJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgdGVzdGltb25pYWxSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL3Rlc3RpbW9uaWFsUm91dGVzLmpzXCI7XHJcbmltcG9ydCBldmVudFR5cGVSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2V2ZW50VHlwZVJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgeyBlcnJvckhhbmRsZXIsIG5vdEZvdW5kSGFuZGxlciB9IGZyb20gXCIuL21pZGRsZXdhcmUvZXJyb3JIYW5kbGVyLmpzXCI7XHJcblxyXG4vLyBSb290IHJvdXRlIC0gT25seSBmb3IgcHJvZHVjdGlvbi9zdGFuZGFsb25lXHJcblxyXG5jb25zdCBkZWZhdWx0QWxsb3dlZE9yaWdpbnMgPSBbXHJcbiAgXCJodHRwOi8vbG9jYWxob3N0OjUxNzNcIixcclxuICBcImh0dHA6Ly8xMjcuMC4wLjE6NTE3M1wiLFxyXG4gIFwiaHR0cDovL2xvY2FsaG9zdDo0MTczXCIsXHJcbiAgXCJodHRwOi8vbG9jYWxob3N0OjgwODBcIixcclxuICBcImh0dHBzOi8vcG90b2dyYXBoeS13ZWJhcHAudmVyY2VsLmFwcFwiLFxyXG4gIFwiaHR0cHM6Ly9wb3RvZ3JhcGh5LXdlYmFwcC13ZWJzaXRlLnZlcmNlbC5hcHBcIixcclxuXTtcclxuXHJcbmNvbnN0IGJ1aWxkQWxsb3dlZE9yaWdpbnMgPSAoKSA9PiB7XHJcbiAgY29uc3QgZW52T3JpZ2lucyA9IHByb2Nlc3MuZW52LkNPUlNfQUxMT1dMSVNUIHx8IHByb2Nlc3MuZW52LkNPUlNfT1JJR0lOIHx8IFwiXCI7XHJcbiAgY29uc3QgcGFyc2VkID0gZW52T3JpZ2luc1xyXG4gICAgLnNwbGl0KFwiLFwiKVxyXG4gICAgLm1hcCgoZW50cnkpID0+IGVudHJ5LnRyaW0oKSlcclxuICAgIC5maWx0ZXIoQm9vbGVhbik7XHJcbiAgcmV0dXJuIEFycmF5LmZyb20obmV3IFNldChbLi4uZGVmYXVsdEFsbG93ZWRPcmlnaW5zLCAuLi5wYXJzZWRdKSk7XHJcbn07XHJcblxyXG5jb25zdCBhbGxvd2VkT3JpZ2lucyA9IGJ1aWxkQWxsb3dlZE9yaWdpbnMoKTtcclxuXHJcbmNvbnN0IGNvcnNPcHRpb25zID0ge1xyXG4gIG9yaWdpbihvcmlnaW4sIGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoIW9yaWdpbikgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gICAgaWYgKGFsbG93ZWRPcmlnaW5zLmluY2x1ZGVzKG9yaWdpbikpIHtcclxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgLy8gQWxsb3cgdmVyY2VsIHByZXZpZXcgYXBwc1xyXG4gICAgaWYgKG9yaWdpbi5lbmRzV2l0aChcIi52ZXJjZWwuYXBwXCIpKSB7XHJcbiAgICAgIHJldHVybiBjYWxsYmFjayhudWxsLCB0cnVlKTtcclxuICAgIH1cclxuICAgIGNvbnNvbGUud2FybihgXHUyNkEwXHVGRTBGICBCbG9ja2VkIENPUlMgb3JpZ2luOiAke29yaWdpbn1gKTtcclxuICAgIHJldHVybiBjYWxsYmFjayhudWxsLCBmYWxzZSk7XHJcbiAgfSxcclxuICBjcmVkZW50aWFsczogdHJ1ZSxcclxuICBvcHRpb25zU3VjY2Vzc1N0YXR1czogMjAwLFxyXG59O1xyXG5cclxubGV0IGRiQ29ubmVjdGlvblByb21pc2U7XHJcbmNvbnN0IGVuc3VyZURiQ29ubmVjdGlvbiA9ICgpID0+IHtcclxuICBpZiAoIWRiQ29ubmVjdGlvblByb21pc2UpIHtcclxuICAgIGRiQ29ubmVjdGlvblByb21pc2UgPSBjb25uZWN0REIoKS5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgY29uc29sZS5lcnJvcihcIlx1Mjc0QyBNb25nb0RCIGNvbm5lY3Rpb24gZmFpbGVkXCIsIGVycm9yKTtcclxuICAgICAgZGJDb25uZWN0aW9uUHJvbWlzZSA9IHVuZGVmaW5lZDtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcmV0dXJuIGRiQ29ubmVjdGlvblByb21pc2U7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU2VydmVyKGNvbmZpZyA9IHt9KSB7XHJcbiAgY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5cclxuICAvLyBNaWRkbGV3YXJlXHJcbiAgYXBwLnVzZShjb3JzKGNvcnNPcHRpb25zKSk7XHJcbiAgYXBwLnVzZShleHByZXNzLmpzb24oeyBsaW1pdDogXCI1MG1iXCIgfSkpO1xyXG4gIGFwcC51c2UoZXhwcmVzcy51cmxlbmNvZGVkKHsgZXh0ZW5kZWQ6IHRydWUsIGxpbWl0OiBcIjUwbWJcIiB9KSk7XHJcblxyXG4gIC8vIEVuc3VyZSBNb25nb0RCIGNvbm5lY3Rpb24gc3RhcnRzIGFzIHNvb24gYXMgdGhlIHNlcnZlciBib290c1xyXG4gIGVuc3VyZURiQ29ubmVjdGlvbigpO1xyXG5cclxuICAvLyBFeGFtcGxlIEFQSSByb3V0ZXNcclxuICBhcHAuZ2V0KFwiL2FwaS9waW5nXCIsIChfcmVxLCByZXMpID0+IHtcclxuICAgIGNvbnN0IHBpbmcgPSBwcm9jZXNzLmVudi5QSU5HX01FU1NBR0UgPz8gXCJwaW5nXCI7XHJcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6IHBpbmcgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGFwcC5nZXQoXCIvYXBpL2RlbW9cIiwgaGFuZGxlRGVtbyk7XHJcbiAgYXBwLmdldChcIi9hcGkvZGItc3RhdHVzXCIsIChfcmVxLCByZXMpID0+IHtcclxuICAgIGNvbnN0IHN0YXRlID0gZ2V0RGJTdGF0dXMoKTtcclxuICAgIC8vIE1hcCBtb25nb29zZSByZWFkeVN0YXRlIHRvIGh1bWFuLXJlYWRhYmxlXHJcbiAgICBjb25zdCBtYXAgPSB7XHJcbiAgICAgIDA6IFwiZGlzY29ubmVjdGVkXCIsXHJcbiAgICAgIDE6IFwiY29ubmVjdGVkXCIsXHJcbiAgICAgIDI6IFwiY29ubmVjdGluZ1wiLFxyXG4gICAgICAzOiBcImRpc2Nvbm5lY3RpbmdcIixcclxuICAgIH07XHJcbiAgICByZXMuanNvbih7IHN0YXRlLCBzdGF0dXM6IG1hcFtzdGF0ZV0gPz8gXCJ1bmtub3duXCIgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGFwcC5nZXQoXCIvYXBpL2hlYWx0aFwiLCAoX3JlcSwgcmVzKSA9PiB7XHJcbiAgICByZXMuanNvbih7XHJcbiAgICAgIHN0YXR1czogXCJva1wiLFxyXG4gICAgICBkYlN0YXRlOiBnZXREYlN0YXR1cygpLFxyXG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcclxuICAgICAgYWxsb3dlZE9yaWdpbnMsXHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgLy8gQXV0aCByb3V0ZXNcclxuICBhcHAudXNlKFwiL2FwaS9hdXRoXCIsIGF1dGhSb3V0ZXMpO1xyXG5cclxuICAvLyBBUEkgUm91dGVzXHJcbiAgYXBwLnVzZShcIi9hcGkvY2xpZW50c1wiLCBjbGllbnRSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL3NlcnZpY2VzXCIsIHNlcnZpY2VSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL3F1b3RhdGlvbnNcIiwgcXVvdGF0aW9uUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9pbnZvaWNlc1wiLCBpbnZvaWNlUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9zbGlkZXJcIiwgc2xpZGVyUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9nYWxsZXJ5XCIsIGdhbGxlcnlSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL29yZGVyc1wiLCBvcmRlclJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvdXNlcnNcIiwgdXNlclJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvZmlsbXNcIiwgZmlsbVJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvbG92ZS1zdG9yaWVzXCIsIGxvdmVTdG9yeVJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvZW5xdWlyaWVzXCIsIGVucXVpcnlSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL2NvbnRhY3RcIiwgY29udGFjdFJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvZGFzaGJvYXJkXCIsIGRhc2hib2FyZFJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvdGVzdGltb25pYWxzXCIsIHRlc3RpbW9uaWFsUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9ldmVudC10eXBlc1wiLCBldmVudFR5cGVSb3V0ZXMpO1xyXG4gIGNvbnNvbGUubG9nKFwiXHUyNzA1IENvbnRhY3QsIERhc2hib2FyZCAmIFRlc3RpbW9uaWFsIHJvdXRlcyByZWdpc3RlcmVkIFwiICsgRGF0ZS5ub3coKSArIFwiIC0gRGFzaGJvYXJkIFBlbmRpbmcgQWN0aW9ucyBBZGRlZFwiKTtcclxuXHJcbiAgLy8gUm9vdCByb3V0ZSAtIE9ubHkgZm9yIHByb2R1Y3Rpb24vc3RhbmRhbG9uZVxyXG4gIGlmICghY29uZmlnLm1pZGRsZXdhcmVNb2RlKSB7XHJcbiAgICBhcHAuZ2V0KFwiL1wiLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIlBob3RvZ3JhcGh5IEFQSSBpcyBydW5uaW5nIFx1RDgzRFx1REU4MFwiLCBzdGF0dXM6IFwiYWN0aXZlXCIgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIDQwNCArIGVycm9yIGhhbmRsaW5nXHJcbiAgaWYgKCFjb25maWcubWlkZGxld2FyZU1vZGUpIHtcclxuICAgIGFwcC51c2Uobm90Rm91bmRIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIGFwcC51c2UoZXJyb3JIYW5kbGVyKTtcclxuXHJcbiAgcmV0dXJuIGFwcDtcclxufVxyXG5cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGRiLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2RiLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgREVGQVVMVF9IT1NUID0gXCJjbHVzdGVyMC5kczJubHVnLm1vbmdvZGIubmV0XCI7XHJcbmNvbnN0IERFRkFVTFRfQVBQX05BTUUgPSBcIkNsdXN0ZXIwXCI7XHJcblxyXG5jb25zdCBidWlsZE1vbmdvVXJpID0gKCkgPT4ge1xyXG4gIGlmIChwcm9jZXNzLmVudi5NT05HT0RCX1VSSSkgcmV0dXJuIHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJO1xyXG5cclxuICBjb25zdCB1c2VybmFtZSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVNFUk5BTUU7XHJcbiAgY29uc3QgcGFzc3dvcmQgPSBwcm9jZXNzLmVudi5NT05HT0RCX1BBU1NXT1JEO1xyXG4gIGNvbnN0IGhvc3QgPSBwcm9jZXNzLmVudi5NT05HT0RCX0hPU1QgfHwgREVGQVVMVF9IT1NUO1xyXG4gIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgY29uc3QgZW5jb2RlZFVzZXIgPSBlbmNvZGVVUklDb21wb25lbnQodXNlcm5hbWUpO1xyXG4gIGNvbnN0IGVuY29kZWRQYXNzID0gZW5jb2RlVVJJQ29tcG9uZW50KHBhc3N3b3JkKTtcclxuICByZXR1cm4gYG1vbmdvZGIrc3J2Oi8vJHtlbmNvZGVkVXNlcn06JHtlbmNvZGVkUGFzc31AJHtob3N0fS8/cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5JmFwcE5hbWU9JHtwcm9jZXNzLmVudi5NT05HT0RCX0FQUF9OQU1FIHx8IERFRkFVTFRfQVBQX05BTUV9YDtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjb25uZWN0REIgPSBhc3luYyAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IG1vbmdvVXJpID0gYnVpbGRNb25nb1VyaSgpO1xyXG4gICAgaWYgKCFtb25nb1VyaSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgXCJNb25nb0RCIGNvbm5lY3Rpb24gc2V0dGluZ3MgYXJlIG1pc3NpbmcuIFByb3ZpZGUgTU9OR09EQl9VUkkgb3IgTU9OR09EQl9VU0VSTkFNRS9NT05HT0RCX1BBU1NXT1JEIGluIHlvdXIgZW52aXJvbm1lbnQuXCJcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBPcHRpb25hbCBkZWJ1ZyBsb2dnaW5nIGNvbnRyb2xsZWQgYnkgZW52XHJcbiAgICBpZiAocHJvY2Vzcy5lbnYuTU9OR09fREVCVUcgPT09IFwidHJ1ZVwiKSB7XHJcbiAgICAgIG1vbmdvb3NlLnNldChcImRlYnVnXCIsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFdpcmUgdXAgY29ubmVjdGlvbiBldmVudCBsaXN0ZW5lcnMgdG8gbWFrZSBjb25uZWN0aW9uIHN0YXRlIHZpc2libGUgaW4gbG9nc1xyXG4gICAgbW9uZ29vc2UuY29ubmVjdGlvbi5vbihcImNvbm5lY3RlZFwiLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiXHUyNzA1IE1vbmdvb3NlIGNvbm5lY3RlZCB0byBkYXRhYmFzZVwiLCBtb25nb29zZS5jb25uZWN0aW9uLm5hbWUgfHwgcHJvY2Vzcy5lbnYuREFUQUJBU0VfTkFNRSB8fCBcIih1bmtub3duKVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1vbmdvb3NlLmNvbm5lY3Rpb24ub24oXCJlcnJvclwiLCAoZXJyKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJcdTI3NEMgTW9uZ29vc2UgY29ubmVjdGlvbiBlcnJvcjpcIiwgZXJyICYmIGVyci5tZXNzYWdlID8gZXJyLm1lc3NhZ2UgOiBlcnIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbW9uZ29vc2UuY29ubmVjdGlvbi5vbihcImRpc2Nvbm5lY3RlZFwiLCAoKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUud2FybihcIlx1MjZBMFx1RkUwRiBNb25nb29zZSBkaXNjb25uZWN0ZWRcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBtb25nb29zZS5jb25uZWN0aW9uLm9uKFwicmVjb25uZWN0ZWRcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlx1RDgzRFx1REQwMSBNb25nb29zZSByZWNvbm5lY3RlZFwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGF3YWl0IG1vbmdvb3NlLmNvbm5lY3QobW9uZ29VcmksIHtcclxuICAgICAgLy8gSGFyZGNvZGVkIHRvIFwicGhvdG9ncmFwZXJcIiB0byBtYXRjaCB0aGUgYWN0dWFsIE1vbmdvREIgZGF0YWJhc2UgbmFtZVxyXG4gICAgICBkYk5hbWU6IFwicGhvdG9ncmFwZXJcIixcclxuICAgICAgcmV0cnlXcml0ZXM6IHRydWUsXHJcbiAgICAgIHc6IFwibWFqb3JpdHlcIixcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKFwiXHUyNzA1IE1vbmdvREIgY29ubmVjdGVkIHN1Y2Nlc3NmdWxseVwiKTtcclxuICAgIHJldHVybiBtb25nb29zZS5jb25uZWN0aW9uO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwiXHUyNzRDIE1vbmdvREIgY29ubmVjdGlvbiBlcnJvcjpcIiwgZXJyb3IgJiYgZXJyb3IubWVzc2FnZSA/IGVycm9yLm1lc3NhZ2UgOiBlcnJvcik7XHJcbiAgICAvLyBJbiBkZXZlbG9wbWVudCB3ZSBkb24ndCB3YW50IHRoZSB3aG9sZSBkZXYgc2VydmVyIHRvIGV4aXQgaWYgdGhlIERCIGlzIHVucmVhY2hhYmxlLlxyXG4gICAgLy8gU2V0IEVYSVRfT05fREJfRkFJTD10cnVlIGluIHRoZSBlbnZpcm9ubWVudCB0byBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgYmVoYXZpb3IuXHJcbiAgICBpZiAocHJvY2Vzcy5lbnYuRVhJVF9PTl9EQl9GQUlMID09PSBcInRydWVcIikge1xyXG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGlzY29ubmVjdERCID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBhd2FpdCBtb25nb29zZS5kaXNjb25uZWN0KCk7XHJcbiAgICBjb25zb2xlLmxvZyhcIlx1MjcwNSBNb25nb0RCIGRpc2Nvbm5lY3RlZFwiKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlx1Mjc0QyBNb25nb0RCIGRpc2Nvbm5lY3Rpb24gZXJyb3I6XCIsIGVycm9yKTtcclxuICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RGJTdGF0dXMgPSAoKSA9PiB7XHJcbiAgLy8gbW9uZ29vc2UuY29ubmVjdGlvbi5yZWFkeVN0YXRlOiAwID0gZGlzY29ubmVjdGVkLCAxID0gY29ubmVjdGVkLCAyID0gY29ubmVjdGluZywgMyA9IGRpc2Nvbm5lY3RpbmdcclxuICByZXR1cm4gbW9uZ29vc2UuY29ubmVjdGlvbi5yZWFkeVN0YXRlO1xyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFxkZW1vLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9kZW1vLmpzXCI7ZXhwb3J0IGNvbnN0IGhhbmRsZURlbW8gPSAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCByZXNwb25zZSA9IHtcclxuICAgIG1lc3NhZ2U6IFwiSGVsbG8gZnJvbSBFeHByZXNzIHNlcnZlclwiLFxyXG4gIH07XHJcbiAgcmVzLnN0YXR1cygyMDApLmpzb24ocmVzcG9uc2UpO1xyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFxjbGllbnRSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL2NsaWVudFJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge1xyXG4gIGdldEFsbENsaWVudHMsXHJcbiAgZ2V0Q2xpZW50QnlJZCxcclxuICBjcmVhdGVDbGllbnQsXHJcbiAgdXBkYXRlQ2xpZW50LFxyXG4gIGRlbGV0ZUNsaWVudCxcclxuICBzZWFyY2hDbGllbnRzLFxyXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL2NsaWVudENvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbi8vIFJvdXRlc1xyXG5yb3V0ZXIuZ2V0KCcvJywgZ2V0QWxsQ2xpZW50cyk7XHJcbnJvdXRlci5nZXQoJy9zZWFyY2gnLCBzZWFyY2hDbGllbnRzKTtcclxucm91dGVyLmdldCgnLzppZCcsIGdldENsaWVudEJ5SWQpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZUNsaWVudCk7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVDbGllbnQpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlQ2xpZW50KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGNsaWVudENvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvY2xpZW50Q29udHJvbGxlci5qc1wiO2ltcG9ydCBDbGllbnQgZnJvbSAnLi4vbW9kZWxzL0NsaWVudC5qcyc7XHJcblxyXG4vLyBHZXQgYWxsIGNsaWVudHNcclxuZXhwb3J0IGNvbnN0IGdldEFsbENsaWVudHMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgY2xpZW50cyA9IGF3YWl0IENsaWVudC5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICByZXMuanNvbihjbGllbnRzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEdldCBzaW5nbGUgY2xpZW50XHJcbmV4cG9ydCBjb25zdCBnZXRDbGllbnRCeUlkID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IENsaWVudC5maW5kQnlJZChyZXEucGFyYW1zLmlkKTtcclxuICAgIGlmICghY2xpZW50KSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdDbGllbnQgbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuICAgIHJlcy5qc29uKGNsaWVudCk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGUgY2xpZW50XHJcbmV4cG9ydCBjb25zdCBjcmVhdGVDbGllbnQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICBjb25zdCB7IG5hbWUsIGVtYWlsLCBwaG9uZSwgd2hhdHNhcHAsIGFkZHJlc3MsIGNpdHksIHN0YXRlLCB6aXBDb2RlLCBjYXRlZ29yeSwgdGFncywgbm90ZXMsIGV2ZW50LCBidWRnZXQsIHN0YXR1cyB9ID0gcmVxLmJvZHk7XHJcblxyXG4gIC8vIFZhbGlkYXRpb25cclxuICBpZiAoIW5hbWUgfHwgIWVtYWlsIHx8ICFwaG9uZSkge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogJ05hbWUsIGVtYWlsLCBhbmQgcGhvbmUgYXJlIHJlcXVpcmVkJyB9KTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBuZXcgQ2xpZW50KHtcclxuICAgICAgbmFtZSxcclxuICAgICAgZW1haWwsXHJcbiAgICAgIHBob25lOiBwaG9uZSB8fCB3aGF0c2FwcCwgLy8gQWNjZXB0IHBob25lIG9yIHdoYXRzYXBwXHJcbiAgICAgIGFkZHJlc3MsXHJcbiAgICAgIGNpdHksXHJcbiAgICAgIHN0YXRlLFxyXG4gICAgICB6aXBDb2RlLFxyXG4gICAgICBjYXRlZ29yeSxcclxuICAgICAgdGFncyxcclxuICAgICAgbm90ZXMsXHJcbiAgICAgIGV2ZW50LFxyXG4gICAgICBidWRnZXQsXHJcbiAgICAgIHN0YXR1cyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNhdmVkQ2xpZW50ID0gYXdhaXQgY2xpZW50LnNhdmUoKTtcclxuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHNhdmVkQ2xpZW50KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgaWYgKGVycm9yLmNvZGUgPT09IDExMDAwKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdFbWFpbCBhbHJlYWR5IGV4aXN0cycgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIGNsaWVudFxyXG5leHBvcnQgY29uc3QgdXBkYXRlQ2xpZW50ID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IENsaWVudC5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwge1xyXG4gICAgICBuZXc6IHRydWUsXHJcbiAgICAgIHJ1blZhbGlkYXRvcnM6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIWNsaWVudCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnQ2xpZW50IG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24oY2xpZW50KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgaWYgKGVycm9yLmNvZGUgPT09IDExMDAwKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdFbWFpbCBhbHJlYWR5IGV4aXN0cycgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRGVsZXRlIGNsaWVudFxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ2xpZW50ID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNsaWVudCA9IGF3YWl0IENsaWVudC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgIGlmICghY2xpZW50KSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdDbGllbnQgbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuICAgIHJlcy5qc29uKHsgbWVzc2FnZTogJ0NsaWVudCBkZWxldGVkIHN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBTZWFyY2ggY2xpZW50c1xyXG5leHBvcnQgY29uc3Qgc2VhcmNoQ2xpZW50cyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IHF1ZXJ5IH0gPSByZXEucXVlcnk7XHJcbiAgICBpZiAoIXF1ZXJ5KSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdTZWFyY2ggcXVlcnkgaXMgcmVxdWlyZWQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNsaWVudHMgPSBhd2FpdCBDbGllbnQuZmluZCh7XHJcbiAgICAgICRvcjogW1xyXG4gICAgICAgIHsgbmFtZTogeyAkcmVnZXg6IHF1ZXJ5LCAkb3B0aW9uczogJ2knIH0gfSxcclxuICAgICAgICB7IGVtYWlsOiB7ICRyZWdleDogcXVlcnksICRvcHRpb25zOiAnaScgfSB9LFxyXG4gICAgICAgIHsgcGhvbmU6IHsgJHJlZ2V4OiBxdWVyeSwgJG9wdGlvbnM6ICdpJyB9IH0sXHJcbiAgICAgIF0sXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXMuanNvbihjbGllbnRzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcc2VydmljZVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvc2VydmljZVJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge1xyXG4gIGdldEFsbFNlcnZpY2VzLFxyXG4gIGdldFNlcnZpY2VCeUlkLFxyXG4gIGNyZWF0ZVNlcnZpY2UsXHJcbiAgdXBkYXRlU2VydmljZSxcclxuICBkZWxldGVTZXJ2aWNlLFxyXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL3NlcnZpY2VDb250cm9sbGVyLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG4vLyBSb3V0ZXNcclxucm91dGVyLmdldCgnLycsIGdldEFsbFNlcnZpY2VzKTtcclxucm91dGVyLmdldCgnLzppZCcsIGdldFNlcnZpY2VCeUlkKTtcclxucm91dGVyLnBvc3QoJy8nLCBjcmVhdGVTZXJ2aWNlKTtcclxucm91dGVyLnB1dCgnLzppZCcsIHVwZGF0ZVNlcnZpY2UpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlU2VydmljZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXFNlcnZpY2UuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL1NlcnZpY2UuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3Qgc2VydmljZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAge1xyXG4gICAgbmFtZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1NlcnZpY2UgbmFtZSBpcyByZXF1aXJlZCddLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgICBtaW5sZW5ndGg6IFsyLCAnTmFtZSBtdXN0IGJlIGF0IGxlYXN0IDIgY2hhcmFjdGVycyddLFxyXG4gICAgfSxcclxuICAgIGRlc2NyaXB0aW9uOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBjYXRlZ29yeToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsncGhvdG9ncmFwaHknLCAndmlkZW8nLCAnZHJvbmUnLCAncHJvZHVjdCcsICdvdGhlciddLFxyXG4gICAgICBkZWZhdWx0OiAncGhvdG9ncmFwaHknLFxyXG4gICAgfSxcclxuICAgIHJhdGVQZXJEYXk6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdSYXRlIHBlciBkYXkgaXMgcmVxdWlyZWQnXSxcclxuICAgICAgbWluOiBbMCwgJ1JhdGUgY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICB9LFxyXG4gICAgcmF0ZVBlclVuaXQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnUmF0ZSBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgIH0sXHJcbiAgICBpc0FjdGl2ZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiB0cnVlLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG4vLyBJbmRleCBmb3IgYWN0aXZlIHNlcnZpY2VzXHJcbnNlcnZpY2VTY2hlbWEuaW5kZXgoeyBpc0FjdGl2ZTogMSB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5TZXJ2aWNlIHx8IG1vbmdvb3NlLm1vZGVsKCdTZXJ2aWNlJywgc2VydmljZVNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxzZXJ2aWNlQ29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9zZXJ2aWNlQ29udHJvbGxlci5qc1wiO2ltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL21vZGVscy9TZXJ2aWNlLmpzJztcclxuXHJcbi8vIERlZmF1bHQgc2VydmljZXNcclxuY29uc3QgREVGQVVMVF9TRVJWSUNFUyA9IFtcclxuICB7IG5hbWU6ICdUcmFkaXRpb25hbCBQaG90b2dyYXBoeScsIGNhdGVnb3J5OiAncGhvdG9ncmFwaHknLCByYXRlUGVyRGF5OiAyNTAwMCB9LFxyXG4gIHsgbmFtZTogJ0NhbmRpZCBQaG90b2dyYXBoeScsIGNhdGVnb3J5OiAncGhvdG9ncmFwaHknLCByYXRlUGVyRGF5OiAyMDAwMCB9LFxyXG4gIHsgbmFtZTogJ0NpbmVtYXRpYyBXZWRkaW5nIEZpbG0nLCBjYXRlZ29yeTogJ3ZpZGVvJywgcmF0ZVBlckRheTogNDAwMDAgfSxcclxuICB7IG5hbWU6ICdUcmFkaXRpb25hbCBWaWRlbycsIGNhdGVnb3J5OiAndmlkZW8nLCByYXRlUGVyRGF5OiAzMDAwMCB9LFxyXG4gIHsgbmFtZTogJ0Ryb25lIFNob290JywgY2F0ZWdvcnk6ICdkcm9uZScsIHJhdGVQZXJEYXk6IDE1MDAwIH0sXHJcbiAgeyBuYW1lOiAnV2VkZGluZyBBbGJ1bXMnLCBjYXRlZ29yeTogJ3Byb2R1Y3QnLCByYXRlUGVyVW5pdDogNTAwMCB9LFxyXG4gIHsgbmFtZTogJ0ZyYW1lcycsIGNhdGVnb3J5OiAncHJvZHVjdCcsIHJhdGVQZXJVbml0OiAyMDAwIH0sXHJcbl07XHJcblxyXG4vLyBHZXQgYWxsIGFjdGl2ZSBzZXJ2aWNlc1xyXG5leHBvcnQgY29uc3QgZ2V0QWxsU2VydmljZXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgbGV0IHNlcnZpY2VzID0gYXdhaXQgU2VydmljZS5maW5kKHsgaXNBY3RpdmU6IHRydWUgfSkuc29ydCh7IG5hbWU6IDEgfSk7XHJcblxyXG4gICAgLy8gSW5pdGlhbGl6ZSBkZWZhdWx0IHNlcnZpY2VzIGlmIG5vbmUgZXhpc3RcclxuICAgIGlmIChzZXJ2aWNlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgY29uc3QgY3JlYXRlZFNlcnZpY2VzID0gYXdhaXQgU2VydmljZS5pbnNlcnRNYW55KERFRkFVTFRfU0VSVklDRVMpO1xyXG4gICAgICBzZXJ2aWNlcyA9IGNyZWF0ZWRTZXJ2aWNlcztcclxuICAgIH1cclxuXHJcbiAgICByZXMuanNvbihzZXJ2aWNlcyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBHZXQgc2luZ2xlIHNlcnZpY2VcclxuZXhwb3J0IGNvbnN0IGdldFNlcnZpY2VCeUlkID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHNlcnZpY2UgPSBhd2FpdCBTZXJ2aWNlLmZpbmRCeUlkKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgaWYgKCFzZXJ2aWNlKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdTZXJ2aWNlIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuanNvbihzZXJ2aWNlKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENyZWF0ZSBzZXJ2aWNlXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVTZXJ2aWNlID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgeyBuYW1lLCBkZXNjcmlwdGlvbiwgY2F0ZWdvcnksIHJhdGVQZXJEYXksIHJhdGVQZXJVbml0IH0gPSByZXEuYm9keTtcclxuXHJcbiAgaWYgKCFuYW1lIHx8ICghcmF0ZVBlckRheSAmJiAhcmF0ZVBlclVuaXQpKSB7XHJcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnTmFtZSBhbmQgcmF0ZSBhcmUgcmVxdWlyZWQnIH0pO1xyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHNlcnZpY2UgPSBuZXcgU2VydmljZSh7XHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIGRlc2NyaXB0aW9uLFxyXG4gICAgICBjYXRlZ29yeSxcclxuICAgICAgcmF0ZVBlckRheSxcclxuICAgICAgcmF0ZVBlclVuaXQsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzYXZlZFNlcnZpY2UgPSBhd2FpdCBzZXJ2aWNlLnNhdmUoKTtcclxuICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHNhdmVkU2VydmljZSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBVcGRhdGUgc2VydmljZVxyXG5leHBvcnQgY29uc3QgdXBkYXRlU2VydmljZSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzZXJ2aWNlID0gYXdhaXQgU2VydmljZS5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwge1xyXG4gICAgICBuZXc6IHRydWUsXHJcbiAgICAgIHJ1blZhbGlkYXRvcnM6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXNlcnZpY2UpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ1NlcnZpY2Ugbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuanNvbihzZXJ2aWNlKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBzZXJ2aWNlIChzb2Z0IGRlbGV0ZSBieSBtYXJraW5nIGluYWN0aXZlKVxyXG5leHBvcnQgY29uc3QgZGVsZXRlU2VydmljZSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzZXJ2aWNlID0gYXdhaXQgU2VydmljZS5maW5kQnlJZEFuZFVwZGF0ZShcclxuICAgICAgcmVxLnBhcmFtcy5pZCxcclxuICAgICAgeyBpc0FjdGl2ZTogZmFsc2UgfSxcclxuICAgICAgeyBuZXc6IHRydWUgfVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIXNlcnZpY2UpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ1NlcnZpY2Ugbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6ICdTZXJ2aWNlIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5JyB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxccXVvdGF0aW9uUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9xdW90YXRpb25Sb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICBnZXRBbGxRdW90YXRpb25zLFxyXG4gIGdldFF1b3RhdGlvbkJ5SWQsXHJcbiAgY3JlYXRlUXVvdGF0aW9uLFxyXG4gIHVwZGF0ZVF1b3RhdGlvbixcclxuICBkZWxldGVRdW90YXRpb24sXHJcbiAgZHVwbGljYXRlUXVvdGF0aW9uLFxyXG4gIGdldFF1b3RhdGlvbnNCeUNsaWVudCxcclxuICBnZXRRdW90YXRpb25zQnlTdGF0dXMsXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvcXVvdGF0aW9uQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuLy8gUm91dGVzXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRBbGxRdW90YXRpb25zKTtcclxucm91dGVyLmdldCgnL2NsaWVudC86Y2xpZW50SWQnLCBnZXRRdW90YXRpb25zQnlDbGllbnQpO1xyXG5yb3V0ZXIuZ2V0KCcvc3RhdHVzJywgZ2V0UXVvdGF0aW9uc0J5U3RhdHVzKTtcclxucm91dGVyLmdldCgnLzppZCcsIGdldFF1b3RhdGlvbkJ5SWQpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZVF1b3RhdGlvbik7XHJcbnJvdXRlci5wb3N0KCcvOmlkL2R1cGxpY2F0ZScsIGR1cGxpY2F0ZVF1b3RhdGlvbik7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVRdW90YXRpb24pO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlUXVvdGF0aW9uKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcUXVvdGF0aW9uLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9RdW90YXRpb24uanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgcXVvdGF0aW9uU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICB7XHJcbiAgICBxdW90YXRpb25OdW1iZXI6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB1bmlxdWU6IHRydWUsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1F1b3RhdGlvbiBudW1iZXIgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBjbGllbnRJZDoge1xyXG4gICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgIHJlZjogJ0NsaWVudCcsXHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSwgLy8gT3B0aW9uYWwgaWYganVzdCB1c2luZyBjbGllbnROYW1lXHJcbiAgICB9LFxyXG4gICAgZXZlbnRUeXBlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZW51bTogWydXZWRkaW5nJywgJ1ByZS13ZWRkaW5nJywgJ090aGVyJ10sXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ0V2ZW50IHR5cGUgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBxdW90YXRpb25EYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIGRlZmF1bHQ6IERhdGUubm93LFxyXG4gICAgfSxcclxuICAgIGV2ZW50RGF0ZToge1xyXG4gICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdFdmVudCBkYXRlIGlzIHJlcXVpcmVkJ10sXHJcbiAgICB9LFxyXG4gICAgdmFsaWRpdHlEYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1ZhbGlkaXR5IGRhdGUgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBzZXJ2aWNlczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgc2VydmljZUlkOiB7XHJcbiAgICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgICByZWY6ICdTZXJ2aWNlJyxcclxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcnZpY2VOYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgcXVhbnRpdHk6IHtcclxuICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgIGRlZmF1bHQ6IDEsXHJcbiAgICAgICAgICBtaW46IFsxLCAnUXVhbnRpdHkgbXVzdCBiZSBhdCBsZWFzdCAxJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlzOiB7XHJcbiAgICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgICBkZWZhdWx0OiAxLFxyXG4gICAgICAgICAgbWluOiBbMSwgJ0RheXMgbXVzdCBiZSBhdCBsZWFzdCAxJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICByYXRlUGVyRGF5OiB7XHJcbiAgICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1pbjogWzAsICdSYXRlIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWluOiBbMCwgJ1RvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgc3VidG90YWw6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluOiBbMCwgJ1N1YnRvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGRpc2NvdW50OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ0Rpc2NvdW50IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGRpc2NvdW50VHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnZml4ZWQnLCAncGVyY2VudGFnZSddLFxyXG4gICAgICBkZWZhdWx0OiAnZml4ZWQnLFxyXG4gICAgfSxcclxuICAgIHRheFBlcmNlbnRhZ2U6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnVGF4IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICBtYXg6IFsxMDAsICdUYXggY2Fubm90IGV4Y2VlZCAxMDAlJ10sXHJcbiAgICB9LFxyXG4gICAgdGF4OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ1RheCBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgIH0sXHJcbiAgICBncmFuZFRvdGFsOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pbjogWzAsICdHcmFuZCB0b3RhbCBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgIH0sXHJcbiAgICBwYXltZW50VGVybXM6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnNTAlIGFkdmFuY2UsIDUwJSBvbiBldmVudCBkYXRlJyxcclxuICAgIH0sXHJcbiAgICBub3Rlczoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICB9LFxyXG4gICAgdGhhbmtZb3VNZXNzYWdlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBcIlRoYW5rIHlvdSBmb3IgY2hvb3NpbmcgVGhlIFBhdGlsIFBob3RvZ3JhcGh5ICYgRmlsbSdzLiBXZSBsb29rIGZvcndhcmQgdG8gY2FwdHVyaW5nIHlvdXIgc3BlY2lhbCBtb21lbnRzIVwiLFxyXG4gICAgfSxcclxuICAgIHN0YXR1czoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnRHJhZnQnLCAnU2VudCcsICdBY2NlcHRlZCcsICdSZWplY3RlZCcsICdFeHBpcmVkJywgJ05lZ290aWF0aW9uJ10sXHJcbiAgICAgIGRlZmF1bHQ6ICdEcmFmdCcsXHJcbiAgICB9LFxyXG4gICAgLy8gRW5oYW5jZWQgQ1JNIEZpZWxkc1xyXG4gICAgY2xpZW50TmFtZTogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSwgLy8gU25hcHNob3Qgb2YgY2xpZW50IG5hbWVcclxuICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgdHJpbTogdHJ1ZSB9LFxyXG4gICAgd2hhdHNhcHBfbm86IHsgdHlwZTogU3RyaW5nLCB0cmltOiB0cnVlIH0sXHJcbiAgICBsb2NhdGlvbjogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIHJldGFpbmVyQW1vdW50OiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxyXG4gICAgc3RhZ2U6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnQ29uY2VwdCcgfSxcclxuICAgIGRlbGl2ZXJhYmxlczogW3sgdHlwZTogU3RyaW5nIH1dLCAvLyBTaW1wbGUgbGlzdCBvZiBkZWxpdmVyYWJsZXNcclxuICAgIG1vb2Rib2FyZDogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIGNoYW5uZWw6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbJ0VtYWlsJywgJ1doYXRzQXBwJywgJ0NhbGwnLCAnT3RoZXInXSwgZGVmYXVsdDogJ0VtYWlsJyB9LFxyXG4gICAgZm9sbG93VXBEYXRlOiB7IHR5cGU6IERhdGUgfSxcclxuICAgIGNvbnZlcnRlZFRvSW52b2ljZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBpbnZvaWNlSWQ6IHtcclxuICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICByZWY6ICdJbnZvaWNlJyxcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuLy8gSW5kZXggZm9yIGZhc3RlciBxdWVyaWVzXHJcbnF1b3RhdGlvblNjaGVtYS5pbmRleCh7IGNsaWVudElkOiAxIH0pO1xyXG5xdW90YXRpb25TY2hlbWEuaW5kZXgoeyBzdGF0dXM6IDEgfSk7XHJcbnF1b3RhdGlvblNjaGVtYS5pbmRleCh7IGV2ZW50RGF0ZTogMSB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5RdW90YXRpb24gfHwgbW9uZ29vc2UubW9kZWwoJ1F1b3RhdGlvbicsIHF1b3RhdGlvblNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxxdW90YXRpb25Db250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL3F1b3RhdGlvbkNvbnRyb2xsZXIuanNcIjtpbXBvcnQgUXVvdGF0aW9uIGZyb20gJy4uL21vZGVscy9RdW90YXRpb24uanMnO1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL21vZGVscy9DbGllbnQuanMnO1xyXG5cclxuLy8gR2VuZXJhdGUgdW5pcXVlIHF1b3RhdGlvbiBudW1iZXJcclxuY29uc3QgZ2VuZXJhdGVRdW90YXRpb25OdW1iZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgY29uc3QgY291bnQgPSBhd2FpdCBRdW90YXRpb24uY291bnREb2N1bWVudHMoKTtcclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgcmV0dXJuIGBRVC0ke3llYXJ9JHttb250aH0tJHtTdHJpbmcoY291bnQgKyAxKS5wYWRTdGFydCg1LCAnMCcpfWA7XHJcbn07XHJcblxyXG4vLyBHZXQgYWxsIHF1b3RhdGlvbnNcclxuZXhwb3J0IGNvbnN0IGdldEFsbFF1b3RhdGlvbnMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcXVvdGF0aW9ucyA9IGF3YWl0IFF1b3RhdGlvbi5maW5kKClcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgIHJlcy5qc29uKHF1b3RhdGlvbnMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHNpbmdsZSBxdW90YXRpb25cclxuZXhwb3J0IGNvbnN0IGdldFF1b3RhdGlvbkJ5SWQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcXVvdGF0aW9uID0gYXdhaXQgUXVvdGF0aW9uLmZpbmRCeUlkKHJlcS5wYXJhbXMuaWQpLnBvcHVsYXRlKCdjbGllbnRJZCcpO1xyXG4gICAgaWYgKCFxdW90YXRpb24pIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ1F1b3RhdGlvbiBub3QgZm91bmQnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzLmpzb24ocXVvdGF0aW9uKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENyZWF0ZSBxdW90YXRpb25cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVF1b3RhdGlvbiA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBsZXQgeyBjbGllbnRJZCwgY2xpZW50TmFtZSwgY2xpZW50IH0gPSByZXEuYm9keTtcclxuXHJcbiAgICAvLyBIYW5kbGUgXCJDbGllbnRcIiBzdHJpbmcgZnJvbSBmcm9udGVuZFxyXG4gICAgY29uc3QgbmFtZVRvU2VhcmNoID0gY2xpZW50TmFtZSB8fCBjbGllbnQ7XHJcblxyXG4gICAgLy8gSWYgbm8gSUQgYnV0IHdlIGhhdmUgYSBuYW1lLCB0cnkgdG8gZmluZCBvciBjcmVhdGUgdGhlIGNsaWVudFxyXG4gICAgaWYgKCFjbGllbnRJZCAmJiBuYW1lVG9TZWFyY2gpIHtcclxuICAgICAgbGV0IGV4aXN0aW5nQ2xpZW50ID0gYXdhaXQgQ2xpZW50LmZpbmRPbmUoeyBuYW1lOiBuYW1lVG9TZWFyY2ggfSk7XHJcbiAgICAgIGlmIChleGlzdGluZ0NsaWVudCkge1xyXG4gICAgICAgIGNsaWVudElkID0gZXhpc3RpbmdDbGllbnQuX2lkO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgTGVhZCBjbGllbnRcclxuICAgICAgICBjb25zdCBuZXdDbGllbnQgPSBhd2FpdCBDbGllbnQuY3JlYXRlKHtcclxuICAgICAgICAgIG5hbWU6IG5hbWVUb1NlYXJjaCxcclxuICAgICAgICAgIGVtYWlsOiByZXEuYm9keS5lbWFpbCB8fCBgcGVuZGluZy0ke0RhdGUubm93KCl9QGV4YW1wbGUuY29tYCxcclxuICAgICAgICAgIHBob25lOiByZXEuYm9keS53aGF0c2FwcF9ubyB8fCBcIjAwMDAwMDAwMDBcIixcclxuICAgICAgICAgIHN0YXR1czogJ0xlYWQnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2xpZW50SWQgPSBuZXdDbGllbnQuX2lkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXVvdGF0aW9uTnVtYmVyID0gYXdhaXQgZ2VuZXJhdGVRdW90YXRpb25OdW1iZXIoKTtcclxuICAgIGNvbnN0IHF1b3RhdGlvbkRhdGEgPSB7XHJcbiAgICAgIC4uLnJlcS5ib2R5LFxyXG4gICAgICBxdW90YXRpb25OdW1iZXIsXHJcbiAgICAgIGNsaWVudElkLFxyXG4gICAgICBjbGllbnROYW1lOiBuYW1lVG9TZWFyY2ggLy8gU25hcHNob3RcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcXVvdGF0aW9uID0gbmV3IFF1b3RhdGlvbihxdW90YXRpb25EYXRhKTtcclxuICAgIGNvbnN0IHNhdmVkUXVvdGF0aW9uID0gYXdhaXQgcXVvdGF0aW9uLnNhdmUoKTtcclxuXHJcbiAgICAvLyBUcnkgcG9wdWxhdGluZyBpZiB3ZSBoYXZlIGFuIElELCBvdGhlcndpc2UgaWdub3JlXHJcbiAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgYXdhaXQgc2F2ZWRRdW90YXRpb24ucG9wdWxhdGUoJ2NsaWVudElkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oc2F2ZWRRdW90YXRpb24pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIHF1b3RhdGlvblxyXG5leHBvcnQgY29uc3QgdXBkYXRlUXVvdGF0aW9uID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHF1b3RhdGlvbiA9IGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwge1xyXG4gICAgICBuZXc6IHRydWUsXHJcbiAgICAgIHJ1blZhbGlkYXRvcnM6IHRydWUsXHJcbiAgICB9KS5wb3B1bGF0ZSgnY2xpZW50SWQnKTtcclxuXHJcbiAgICBpZiAoIXF1b3RhdGlvbikge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnUXVvdGF0aW9uIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24ocXVvdGF0aW9uKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBxdW90YXRpb25cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVF1b3RhdGlvbiA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBxdW90YXRpb24gPSBhd2FpdCBRdW90YXRpb24uZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICBpZiAoIXF1b3RhdGlvbikge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnUXVvdGF0aW9uIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6ICdRdW90YXRpb24gZGVsZXRlZCBzdWNjZXNzZnVsbHknIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRHVwbGljYXRlIHF1b3RhdGlvblxyXG5leHBvcnQgY29uc3QgZHVwbGljYXRlUXVvdGF0aW9uID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHF1b3RhdGlvbiA9IGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZChyZXEucGFyYW1zLmlkKTtcclxuICAgIGlmICghcXVvdGF0aW9uKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdRdW90YXRpb24gbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdW90YXRpb25OdW1iZXIgPSBhd2FpdCBnZW5lcmF0ZVF1b3RhdGlvbk51bWJlcigpO1xyXG4gICAgY29uc3QgbmV3UXVvdGF0aW9uID0gbmV3IFF1b3RhdGlvbih7XHJcbiAgICAgIC4uLnF1b3RhdGlvbi50b09iamVjdCgpLFxyXG4gICAgICBfaWQ6IHVuZGVmaW5lZCxcclxuICAgICAgcXVvdGF0aW9uTnVtYmVyLFxyXG4gICAgICBxdW90YXRpb25EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgICBzdGF0dXM6ICdEcmFmdCcsXHJcbiAgICAgIGNvbnZlcnRlZFRvSW52b2ljZTogZmFsc2UsXHJcbiAgICAgIGludm9pY2VJZDogbnVsbCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNhdmVkUXVvdGF0aW9uID0gYXdhaXQgbmV3UXVvdGF0aW9uLnNhdmUoKTtcclxuICAgIGF3YWl0IHNhdmVkUXVvdGF0aW9uLnBvcHVsYXRlKCdjbGllbnRJZCcpO1xyXG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oc2F2ZWRRdW90YXRpb24pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHF1b3RhdGlvbnMgYnkgY2xpZW50XHJcbmV4cG9ydCBjb25zdCBnZXRRdW90YXRpb25zQnlDbGllbnQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcXVvdGF0aW9ucyA9IGF3YWl0IFF1b3RhdGlvbi5maW5kKHsgY2xpZW50SWQ6IHJlcS5wYXJhbXMuY2xpZW50SWQgfSlcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgIHJlcy5qc29uKHF1b3RhdGlvbnMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHF1b3RhdGlvbnMgYnkgc3RhdHVzXHJcbmV4cG9ydCBjb25zdCBnZXRRdW90YXRpb25zQnlTdGF0dXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBzdGF0dXMgfSA9IHJlcS5xdWVyeTtcclxuICAgIGNvbnN0IHF1b3RhdGlvbnMgPSBhd2FpdCBRdW90YXRpb24uZmluZCh7IHN0YXR1cyB9KVxyXG4gICAgICAucG9wdWxhdGUoJ2NsaWVudElkJylcclxuICAgICAgLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgcmVzLmpzb24ocXVvdGF0aW9ucyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGludm9pY2VSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL2ludm9pY2VSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICBnZXRBbGxJbnZvaWNlcyxcclxuICBnZXRJbnZvaWNlQnlJZCxcclxuICBjcmVhdGVJbnZvaWNlLFxyXG4gIHVwZGF0ZUludm9pY2UsXHJcbiAgZGVsZXRlSW52b2ljZSxcclxuICBnZXRJbnZvaWNlc0J5Q2xpZW50LFxyXG4gIGdldEludm9pY2VzQnlQYXltZW50U3RhdHVzLFxyXG4gIHVwZGF0ZVBheW1lbnRTdGF0dXMsXHJcbiAgZ2V0T3ZlcmR1ZUludm9pY2VzLFxyXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL2ludm9pY2VDb250cm9sbGVyLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG4vLyBSb3V0ZXNcclxucm91dGVyLmdldCgnLycsIGdldEFsbEludm9pY2VzKTtcclxucm91dGVyLmdldCgnL292ZXJkdWUnLCBnZXRPdmVyZHVlSW52b2ljZXMpO1xyXG5yb3V0ZXIuZ2V0KCcvY2xpZW50LzpjbGllbnRJZCcsIGdldEludm9pY2VzQnlDbGllbnQpO1xyXG5yb3V0ZXIuZ2V0KCcvc3RhdHVzJywgZ2V0SW52b2ljZXNCeVBheW1lbnRTdGF0dXMpO1xyXG5yb3V0ZXIuZ2V0KCcvOmlkJywgZ2V0SW52b2ljZUJ5SWQpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZUludm9pY2UpO1xyXG5yb3V0ZXIucHV0KCcvOmlkJywgdXBkYXRlSW52b2ljZSk7XHJcbnJvdXRlci5wYXRjaCgnLzppZC9wYXltZW50LXN0YXR1cycsIHVwZGF0ZVBheW1lbnRTdGF0dXMpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlSW52b2ljZSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXEludm9pY2UuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL0ludm9pY2UuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgaW52b2ljZVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAge1xyXG4gICAgaW52b2ljZU51bWJlcjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHVuaXF1ZTogdHJ1ZSxcclxuICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnSW52b2ljZSBudW1iZXIgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBjbGllbnRJZDoge1xyXG4gICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgIHJlZjogJ0NsaWVudCcsXHJcbiAgICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBxdW90YXRpb25JZDoge1xyXG4gICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgIHJlZjogJ1F1b3RhdGlvbicsXHJcbiAgICAgIGRlZmF1bHQ6IG51bGwsXHJcbiAgICB9LFxyXG4gICAgZXZlbnRUeXBlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnRXZlbnQgdHlwZSBpcyByZXF1aXJlZCddLFxyXG4gICAgfSxcclxuICAgIGludm9pY2VEYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIGRlZmF1bHQ6IERhdGUubm93LFxyXG4gICAgfSxcclxuICAgIGV2ZW50RGF0ZToge1xyXG4gICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdFdmVudCBkYXRlIGlzIHJlcXVpcmVkJ10sXHJcbiAgICB9LFxyXG4gICAgZHVlRGF0ZToge1xyXG4gICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdEdWUgZGF0ZSBpcyByZXF1aXJlZCddLFxyXG4gICAgfSxcclxuICAgIHNlcnZpY2VzOiB7XHJcbiAgICAgIHR5cGU6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBzZXJ2aWNlSWQ6IHtcclxuICAgICAgICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICAgICAgICByZWY6ICdTZXJ2aWNlJyxcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgc2VydmljZU5hbWU6IFN0cmluZyxcclxuICAgICAgICAgIHF1YW50aXR5OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgICAgZGVmYXVsdDogMSxcclxuICAgICAgICAgICAgbWluOiBbMSwgJ1F1YW50aXR5IG11c3QgYmUgYXQgbGVhc3QgMSddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGRheXM6IHtcclxuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiAxLFxyXG4gICAgICAgICAgICBtaW46IFsxLCAnRGF5cyBtdXN0IGJlIGF0IGxlYXN0IDEnXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICByYXRlUGVyRGF5OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1pbjogWzAsICdSYXRlIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHRvdGFsOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgICAgIG1pbjogWzAsICdUb3RhbCBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgXSxcclxuICAgICAgZGVmYXVsdDogW10sIC8vIEFsbG93IGVtcHR5IHNlcnZpY2VzIGZvciBxdWljayBpbnZvaWNlc1xyXG4gICAgfSxcclxuICAgIHN1YnRvdGFsOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ1N1YnRvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGRpc2NvdW50OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ0Rpc2NvdW50IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGRpc2NvdW50VHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnZml4ZWQnLCAncGVyY2VudGFnZSddLFxyXG4gICAgICBkZWZhdWx0OiAnZml4ZWQnLFxyXG4gICAgfSxcclxuICAgIHRheFBlcmNlbnRhZ2U6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnVGF4IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICBtYXg6IFsxMDAsICdUYXggY2Fubm90IGV4Y2VlZCAxMDAlJ10sXHJcbiAgICB9LFxyXG4gICAgdGF4OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ1RheCBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgIH0sXHJcbiAgICBncmFuZFRvdGFsOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ0dyYW5kIHRvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIHBheW1lbnRTdGF0dXM6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBlbnVtOiBbJ1BhaWQnLCAnUGFydGlhbGx5IFBhaWQnLCAnUGFydGlhbCcsICdVbnBhaWQnLCAnT3ZlcmR1ZScsICdEcmFmdCcsICdTZW50J10sXHJcbiAgICAgIGRlZmF1bHQ6ICdVbnBhaWQnLFxyXG4gICAgfSxcclxuICAgIC8vIEVuaGFuY2VkIENSTSBGaWVsZHNcclxuICAgIGFtb3VudFBhaWQ6IHsgdHlwZTogTnVtYmVyLCBkZWZhdWx0OiAwLCBtaW46IDAgfSxcclxuICAgIHdvcmtmbG93U3RhZ2U6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnUGxhbm5pbmcnIH0sXHJcbiAgICBwYXltZW50TWV0aG9kOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJ1VQSScgfSxcclxuICAgIGNsaWVudE5hbWU6IHsgdHlwZTogU3RyaW5nLCB0cmltOiB0cnVlIH0sXHJcbiAgICBiYW5rRGV0YWlsczoge1xyXG4gICAgICBhY2NvdW50TmFtZTogU3RyaW5nLFxyXG4gICAgICBhY2NvdW50TnVtYmVyOiBTdHJpbmcsXHJcbiAgICAgIGlmc2NDb2RlOiBTdHJpbmcsXHJcbiAgICAgIHVwaUlkOiBTdHJpbmcsXHJcbiAgICB9LFxyXG4gICAgbm90ZXM6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHRoYW5rWW91TWVzc2FnZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGRlZmF1bHQ6ICdUaGFuayB5b3UgZm9yIHlvdXIgYnVzaW5lc3MuIFdlIGFwcHJlY2lhdGUgeW91ciBzdXBwb3J0IScsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbi8vIEluZGV4IGZvciBmYXN0ZXIgcXVlcmllc1xyXG5pbnZvaWNlU2NoZW1hLmluZGV4KHsgY2xpZW50SWQ6IDEgfSk7XHJcbmludm9pY2VTY2hlbWEuaW5kZXgoeyBwYXltZW50U3RhdHVzOiAxIH0pO1xyXG5pbnZvaWNlU2NoZW1hLmluZGV4KHsgZHVlRGF0ZTogMSB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5JbnZvaWNlIHx8IG1vbmdvb3NlLm1vZGVsKCdJbnZvaWNlJywgaW52b2ljZVNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxpbnZvaWNlQ29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9pbnZvaWNlQ29udHJvbGxlci5qc1wiO2ltcG9ydCBJbnZvaWNlIGZyb20gJy4uL21vZGVscy9JbnZvaWNlLmpzJztcclxuaW1wb3J0IFF1b3RhdGlvbiBmcm9tICcuLi9tb2RlbHMvUXVvdGF0aW9uLmpzJztcclxuaW1wb3J0IENsaWVudCBmcm9tICcuLi9tb2RlbHMvQ2xpZW50LmpzJztcclxuXHJcbi8vIEdlbmVyYXRlIHVuaXF1ZSBpbnZvaWNlIG51bWJlclxyXG5jb25zdCBnZW5lcmF0ZUludm9pY2VOdW1iZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgY29uc3QgY291bnQgPSBhd2FpdCBJbnZvaWNlLmNvdW50RG9jdW1lbnRzKCk7XHJcbiAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICBjb25zdCBtb250aCA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKS5wYWRTdGFydCgyLCAnMCcpO1xyXG4gIHJldHVybiBgSU5WLSR7eWVhcn0ke21vbnRofS0ke1N0cmluZyhjb3VudCArIDEpLnBhZFN0YXJ0KDUsICcwJyl9YDtcclxufTtcclxuXHJcbi8vIEdldCBhbGwgaW52b2ljZXNcclxuZXhwb3J0IGNvbnN0IGdldEFsbEludm9pY2VzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGludm9pY2VzID0gYXdhaXQgSW52b2ljZS5maW5kKClcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5wb3B1bGF0ZSgncXVvdGF0aW9uSWQnKVxyXG4gICAgICAuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICByZXMuanNvbihpbnZvaWNlcyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBHZXQgc2luZ2xlIGludm9pY2VcclxuZXhwb3J0IGNvbnN0IGdldEludm9pY2VCeUlkID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGludm9pY2UgPSBhd2FpdCBJbnZvaWNlLmZpbmRCeUlkKHJlcS5wYXJhbXMuaWQpXHJcbiAgICAgIC5wb3B1bGF0ZSgnY2xpZW50SWQnKVxyXG4gICAgICAucG9wdWxhdGUoJ3F1b3RhdGlvbklkJyk7XHJcbiAgICBpZiAoIWludm9pY2UpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ0ludm9pY2Ugbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuICAgIHJlcy5qc29uKGludm9pY2UpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ3JlYXRlIGludm9pY2VcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUludm9pY2UgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc29sZS5sb2coXCJDcmVhdGUgSW52b2ljZSBCb2R5OlwiLCByZXEuYm9keSk7IC8vIERlYnVnIGxvZ1xyXG5cclxuICAgIGxldCB7IGNsaWVudElkLCBjbGllbnROYW1lLCBjbGllbnQsIGFtb3VudCwgcGFpZCwgYW1vdW50UGFpZCwgZHVlRGF0ZSwgaW52b2ljZURhdGUsIGlzc3VlRGF0ZSB9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgLy8gSGFuZGxlIFwiQ2xpZW50XCIgc3RyaW5nXHJcbiAgICBjb25zdCBuYW1lVG9TZWFyY2ggPSBjbGllbnROYW1lIHx8IGNsaWVudDtcclxuXHJcbiAgICBpZiAoIWNsaWVudElkICYmIG5hbWVUb1NlYXJjaCkge1xyXG4gICAgICBsZXQgZXhpc3RpbmdDbGllbnQgPSBhd2FpdCBDbGllbnQuZmluZE9uZSh7IG5hbWU6IG5hbWVUb1NlYXJjaCB9KTtcclxuICAgICAgaWYgKGV4aXN0aW5nQ2xpZW50KSB7XHJcbiAgICAgICAgY2xpZW50SWQgPSBleGlzdGluZ0NsaWVudC5faWQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbmV3Q2xpZW50ID0gYXdhaXQgQ2xpZW50LmNyZWF0ZSh7XHJcbiAgICAgICAgICBuYW1lOiBuYW1lVG9TZWFyY2gsXHJcbiAgICAgICAgICBlbWFpbDogYGludm9pY2UtJHtEYXRlLm5vdygpfUBleGFtcGxlLmNvbWAsIC8vIEF2b2lkIGR1cGxpY2F0ZSBrZXkgZXJyb3JcclxuICAgICAgICAgIHBob25lOiBcIjAwMDAwMDAwMDBcIixcclxuICAgICAgICAgIHN0YXR1czogJ0FjdGl2ZSdcclxuICAgICAgICB9KTtcclxuICAgICAgICBjbGllbnRJZCA9IG5ld0NsaWVudC5faWQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbnZvaWNlTnVtYmVyID0gYXdhaXQgZ2VuZXJhdGVJbnZvaWNlTnVtYmVyKCk7XHJcblxyXG4gICAgLy8gUm9idXN0IGRhdGUgaGFuZGxpbmdcclxuICAgIGNvbnN0IHZhbGlkSW52b2ljZURhdGUgPSBpbnZvaWNlRGF0ZSB8fCBpc3N1ZURhdGUgfHwgbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IHZhbGlkRHVlRGF0ZSA9IGR1ZURhdGUgPyBuZXcgRGF0ZShkdWVEYXRlKSA6IG5ldyBEYXRlKERhdGUubm93KCkgKyA3ICogMjQgKiA2MCAqIDYwICogMTAwMCk7IC8vIERlZmF1bHQgKzcgZGF5c1xyXG5cclxuICAgIGNvbnN0IGludm9pY2VEYXRhID0ge1xyXG4gICAgICAuLi5yZXEuYm9keSxcclxuICAgICAgaW52b2ljZU51bWJlcixcclxuICAgICAgY2xpZW50SWQ6IGNsaWVudElkLCAvLyBFeHBsaWNpdGx5IHVzZSB0aGUgdmFyaWFibGUgd2UgcmVzb2x2ZWQgYWJvdmVcclxuICAgICAgY2xpZW50TmFtZTogbmFtZVRvU2VhcmNoLFxyXG4gICAgICBncmFuZFRvdGFsOiBOdW1iZXIoYW1vdW50KSB8fCBOdW1iZXIocmVxLmJvZHkuZ3JhbmRUb3RhbCkgfHwgMCxcclxuICAgICAgc3VidG90YWw6IE51bWJlcihhbW91bnQpIHx8IE51bWJlcihyZXEuYm9keS5ncmFuZFRvdGFsKSB8fCAwLCAvLyBFbnN1cmUgc3RyaWN0bHkgbnVtZXJpY1xyXG4gICAgICBhbW91bnRQYWlkOiBOdW1iZXIocGFpZCkgfHwgTnVtYmVyKGFtb3VudFBhaWQpIHx8IDAsXHJcbiAgICAgIGludm9pY2VEYXRlOiB2YWxpZEludm9pY2VEYXRlLFxyXG4gICAgICBldmVudERhdGU6IHJlcS5ib2R5LmV2ZW50RGF0ZSB8fCB2YWxpZEludm9pY2VEYXRlLFxyXG4gICAgICBkdWVEYXRlOiB2YWxpZER1ZURhdGUsXHJcbiAgICAgIGV2ZW50VHlwZTogcmVxLmJvZHkuZXZlbnRUeXBlIHx8IHJlcS5ib2R5LmV2ZW50IHx8ICdXZWRkaW5nJyxcclxuICAgICAgcGF5bWVudFN0YXR1czogcmVxLmJvZHkucGF5bWVudFN0YXR1cyB8fCByZXEuYm9keS5zdGF0dXMgfHwgJ1VucGFpZCcsXHJcbiAgICAgIHNlcnZpY2VzOiByZXEuYm9keS5zZXJ2aWNlcyAmJiBBcnJheS5pc0FycmF5KHJlcS5ib2R5LnNlcnZpY2VzKSA/IHJlcS5ib2R5LnNlcnZpY2VzIDogW10sXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IGludm9pY2UgPSBuZXcgSW52b2ljZShpbnZvaWNlRGF0YSk7XHJcbiAgICBjb25zdCBzYXZlZEludm9pY2UgPSBhd2FpdCBpbnZvaWNlLnNhdmUoKTtcclxuXHJcbiAgICAvLyBVcGRhdGUgcXVvdGF0aW9uIGlmIGNyZWF0ZWQgZnJvbSBxdW90YXRpb25cclxuICAgIGlmIChyZXEuYm9keS5xdW90YXRpb25JZCkge1xyXG4gICAgICBhd2FpdCBRdW90YXRpb24uZmluZEJ5SWRBbmRVcGRhdGUocmVxLmJvZHkucXVvdGF0aW9uSWQsIHtcclxuICAgICAgICBjb252ZXJ0ZWRUb0ludm9pY2U6IHRydWUsXHJcbiAgICAgICAgaW52b2ljZUlkOiBzYXZlZEludm9pY2UuX2lkLFxyXG4gICAgICAgIHN0YXR1czogJ0FjY2VwdGVkJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIGNsaWVudCB0b3RhbHMgaWYgd2UgaGF2ZSBhIHJlYWwgY2xpZW50XHJcbiAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgYXdhaXQgQ2xpZW50LmZpbmRCeUlkQW5kVXBkYXRlKGNsaWVudElkLCB7XHJcbiAgICAgICAgJGluYzogeyB0b3RhbEJpbGxlZDogc2F2ZWRJbnZvaWNlLmdyYW5kVG90YWwgfSxcclxuICAgICAgICBwZW5kaW5nQW1vdW50OiBzYXZlZEludm9pY2UuZ3JhbmRUb3RhbCAtIChzYXZlZEludm9pY2UuYW1vdW50UGFpZCB8fCAwKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGNsaWVudElkKSBhd2FpdCBzYXZlZEludm9pY2UucG9wdWxhdGUoJ2NsaWVudElkJyk7XHJcbiAgICBpZiAoc2F2ZWRJbnZvaWNlLnF1b3RhdGlvbklkKSBhd2FpdCBzYXZlZEludm9pY2UucG9wdWxhdGUoJ3F1b3RhdGlvbklkJyk7XHJcblxyXG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oc2F2ZWRJbnZvaWNlKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBpbnZvaWNlXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVJbnZvaWNlID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGludm9pY2UgPSBhd2FpdCBJbnZvaWNlLmZpbmRCeUlkQW5kVXBkYXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5ib2R5LCB7XHJcbiAgICAgIG5ldzogdHJ1ZSxcclxuICAgICAgcnVuVmFsaWRhdG9yczogdHJ1ZSxcclxuICAgIH0pXHJcbiAgICAgIC5wb3B1bGF0ZSgnY2xpZW50SWQnKVxyXG4gICAgICAucG9wdWxhdGUoJ3F1b3RhdGlvbklkJyk7XHJcblxyXG4gICAgaWYgKCFpbnZvaWNlKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdJbnZvaWNlIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24oaW52b2ljZSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBEZWxldGUgaW52b2ljZVxyXG5leHBvcnQgY29uc3QgZGVsZXRlSW52b2ljZSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpbnZvaWNlID0gYXdhaXQgSW52b2ljZS5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgIGlmICghaW52b2ljZSkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnSW52b2ljZSBub3QgZm91bmQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFVwZGF0ZSBxdW90YXRpb24gaWYgaXQgZXhpc3RzXHJcbiAgICBpZiAoaW52b2ljZS5xdW90YXRpb25JZCkge1xyXG4gICAgICBhd2FpdCBRdW90YXRpb24uZmluZEJ5SWRBbmRVcGRhdGUoaW52b2ljZS5xdW90YXRpb25JZCwge1xyXG4gICAgICAgIGNvbnZlcnRlZFRvSW52b2ljZTogZmFsc2UsXHJcbiAgICAgICAgaW52b2ljZUlkOiBudWxsLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6ICdJbnZvaWNlIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5JyB9KTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEdldCBpbnZvaWNlcyBieSBjbGllbnRcclxuZXhwb3J0IGNvbnN0IGdldEludm9pY2VzQnlDbGllbnQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaW52b2ljZXMgPSBhd2FpdCBJbnZvaWNlLmZpbmQoeyBjbGllbnRJZDogcmVxLnBhcmFtcy5jbGllbnRJZCB9KVxyXG4gICAgICAucG9wdWxhdGUoJ2NsaWVudElkJylcclxuICAgICAgLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgcmVzLmpzb24oaW52b2ljZXMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IGludm9pY2VzIGJ5IHBheW1lbnQgc3RhdHVzXHJcbmV4cG9ydCBjb25zdCBnZXRJbnZvaWNlc0J5UGF5bWVudFN0YXR1cyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB7IHN0YXR1cyB9ID0gcmVxLnF1ZXJ5O1xyXG4gICAgY29uc3QgaW52b2ljZXMgPSBhd2FpdCBJbnZvaWNlLmZpbmQoeyBwYXltZW50U3RhdHVzOiBzdGF0dXMgfSlcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgIHJlcy5qc29uKGludm9pY2VzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBpbnZvaWNlIHBheW1lbnQgc3RhdHVzXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVQYXltZW50U3RhdHVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgcGF5bWVudFN0YXR1cyB9ID0gcmVxLmJvZHk7XHJcbiAgICBjb25zdCBpbnZvaWNlID0gYXdhaXQgSW52b2ljZS5maW5kQnlJZEFuZFVwZGF0ZShcclxuICAgICAgcmVxLnBhcmFtcy5pZCxcclxuICAgICAgeyBwYXltZW50U3RhdHVzIH0sXHJcbiAgICAgIHsgbmV3OiB0cnVlLCBydW5WYWxpZGF0b3JzOiB0cnVlIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFpbnZvaWNlKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdJbnZvaWNlIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24oaW52b2ljZSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBHZXQgb3ZlcmR1ZSBpbnZvaWNlc1xyXG5leHBvcnQgY29uc3QgZ2V0T3ZlcmR1ZUludm9pY2VzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGludm9pY2VzID0gYXdhaXQgSW52b2ljZS5maW5kKHtcclxuICAgICAgZHVlRGF0ZTogeyAkbHQ6IHRvZGF5IH0sXHJcbiAgICAgIHBheW1lbnRTdGF0dXM6IHsgJG5lOiAnUGFpZCcgfSxcclxuICAgIH0pXHJcbiAgICAgIC5wb3B1bGF0ZSgnY2xpZW50SWQnKVxyXG4gICAgICAuc29ydCh7IGR1ZURhdGU6IDEgfSk7XHJcbiAgICByZXMuanNvbihpbnZvaWNlcyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGF1dGguanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL2F1dGguanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRqc1wiO1xyXG5pbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcclxuaW1wb3J0IFVzZXIgZnJvbSBcIi4uL21vZGVscy9Vc2VyLmpzXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgXCJjaGFuZ2UtdGhpcy1zZWNyZXRcIjtcclxuXHJcbi8vIFJlZ2lzdGVyXHJcbnJvdXRlci5wb3N0KFwiL3JlZ2lzdGVyXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCBwYXNzd29yZCB9ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgaWYgKCFuYW1lIHx8ICFlbWFpbCB8fCAhcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiTWlzc2luZyBmaWVsZHNcIiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWwgfSk7XHJcbiAgICAgICAgaWYgKGV4aXN0aW5nKSByZXR1cm4gcmVzLnN0YXR1cyg0MDkpLmpzb24oeyBlcnJvcjogXCJFbWFpbCBhbHJlYWR5IGluIHVzZVwiIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzYWx0ID0gYXdhaXQgYmNyeXB0LmdlblNhbHQoMTApO1xyXG4gICAgICAgIGNvbnN0IGhhc2ggPSBhd2FpdCBiY3J5cHQuaGFzaChwYXNzd29yZCwgc2FsdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmNyZWF0ZSh7IG5hbWUsIGVtYWlsLCBwYXNzd29yZDogaGFzaCB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbih7IGlkOiB1c2VyLl9pZCwgZW1haWw6IHVzZXIuZW1haWwgfSwgSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICBleHBpcmVzSW46IFwiN2RcIixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzLmpzb24oeyB0b2tlbiwgdXNlcjogeyBpZDogdXNlci5faWQsIG5hbWU6IHVzZXIubmFtZSwgZW1haWw6IHVzZXIuZW1haWwgfSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJTZXJ2ZXIgZXJyb3JcIiB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBMb2dpblxyXG5yb3V0ZXIucG9zdChcIi9sb2dpblwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGlmICghZW1haWwgfHwgIXBhc3N3b3JkKSByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBlcnJvcjogXCJNaXNzaW5nIGZpZWxkc1wiIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWwgfSk7XHJcbiAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBlcnJvcjogXCJJbnZhbGlkIGNyZWRlbnRpYWxzXCIgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1hdGNoID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xyXG4gICAgICAgIGlmICghbWF0Y2gpIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IGVycm9yOiBcIkludmFsaWQgY3JlZGVudGlhbHNcIiB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbih7IGlkOiB1c2VyLl9pZCwgZW1haWw6IHVzZXIuZW1haWwgfSwgSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICBleHBpcmVzSW46IFwiN2RcIixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzLmpzb24oeyB0b2tlbiwgdXNlcjogeyBpZDogdXNlci5faWQsIG5hbWU6IHVzZXIubmFtZSwgZW1haWw6IHVzZXIuZW1haWwgfSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJTZXJ2ZXIgZXJyb3JcIiB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXFVzZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL1VzZXIuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCB1c2VyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlLCB1bmlxdWU6IHRydWUsIGxvd2VyY2FzZTogdHJ1ZSB9LFxyXG4gICAgICAgIHBhc3N3b3JkOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICByb2xlOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJ1c2VyXCIsIGVudW06IFtcInVzZXJcIiwgXCJhZG1pblwiLCBcImVkaXRvclwiXSB9LFxyXG4gICAgICAgIHBob25lOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIHN0YXR1czogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiQWN0aXZlXCIsIGVudW06IFtcIkFjdGl2ZVwiLCBcIkluYWN0aXZlXCJdIH0sXHJcbiAgICB9LFxyXG4gICAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5Vc2VyIHx8IG1vbmdvb3NlLm1vZGVsKFwiVXNlclwiLCB1c2VyU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcc2xpZGVyUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9zbGlkZXJSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICAgIGdldEFsbFNsaWRlcnMsXHJcbiAgICBjcmVhdGVTbGlkZXIsXHJcbiAgICB1cGRhdGVTbGlkZXIsXHJcbiAgICBkZWxldGVTbGlkZXJcclxufSBmcm9tICcuLi9jb250cm9sbGVycy9zbGlkZXJDb250cm9sbGVyLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvJywgZ2V0QWxsU2xpZGVycyk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlU2xpZGVyKTtcclxucm91dGVyLnB1dCgnLzppZCcsIHVwZGF0ZVNsaWRlcik7XHJcbnJvdXRlci5kZWxldGUoJy86aWQnLCBkZWxldGVTbGlkZXIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1xcXFxTbGlkZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL1NsaWRlci5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IHNsaWRlclNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIHN1YnRpdGxlOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGltYWdlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBzdGF0dXM6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbXCJBY3RpdmVcIiwgXCJJbmFjdGl2ZVwiXSwgZGVmYXVsdDogXCJBY3RpdmVcIiB9LFxyXG4gICAgICAgIG9yZGVyOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxyXG4gICAgfSxcclxuICAgIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuU2xpZGVyIHx8IG1vbmdvb3NlLm1vZGVsKFwiU2xpZGVyXCIsIHNsaWRlclNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxzbGlkZXJDb250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL3NsaWRlckNvbnRyb2xsZXIuanNcIjtpbXBvcnQgU2xpZGVyIGZyb20gXCIuLi9tb2RlbHMvU2xpZGVyLmpzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsU2xpZGVycyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzbGlkZXJzID0gYXdhaXQgU2xpZGVyLmZpbmQoKS5zb3J0KHsgb3JkZXI6IDEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oc2xpZGVycyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVTbGlkZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gbmV3IFNsaWRlcihyZXEuYm9keSk7XHJcbiAgICAgICAgYXdhaXQgc2xpZGVyLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzbGlkZXIpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlU2xpZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGF3YWl0IFNsaWRlci5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwgeyBuZXc6IHRydWUgfSk7XHJcbiAgICAgICAgaWYgKCFzbGlkZXIpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiU2xpZGVyIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHNsaWRlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVTbGlkZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gYXdhaXQgU2xpZGVyLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIGlmICghc2xpZGVyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlNsaWRlciBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiU2xpZGVyIGRlbGV0ZWRcIiB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFxnYWxsZXJ5Um91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9nYWxsZXJ5Um91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgICBnZXRBbGxHYWxsZXJ5SXRlbXMsXHJcbiAgICBjcmVhdGVHYWxsZXJ5SXRlbSxcclxuICAgIHVwZGF0ZUdhbGxlcnlJdGVtLFxyXG4gICAgZGVsZXRlR2FsbGVyeUl0ZW1cclxufSBmcm9tICcuLi9jb250cm9sbGVycy9nYWxsZXJ5Q29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnLycsIGdldEFsbEdhbGxlcnlJdGVtcyk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlR2FsbGVyeUl0ZW0pO1xyXG5yb3V0ZXIucHV0KCcvOmlkJywgdXBkYXRlR2FsbGVyeUl0ZW0pO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlR2FsbGVyeUl0ZW0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1xcXFxHYWxsZXJ5LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9HYWxsZXJ5LmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgZ2FsbGVyeVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgaW1hZ2U6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGNhdGVnb3J5OiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJHZW5lcmFsXCIgfSxcclxuICAgICAgICBzdGF0dXM6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbXCJBY3RpdmVcIiwgXCJJbmFjdGl2ZVwiXSwgZGVmYXVsdDogXCJBY3RpdmVcIiB9LFxyXG4gICAgfSxcclxuICAgIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuR2FsbGVyeSB8fCBtb25nb29zZS5tb2RlbChcIkdhbGxlcnlcIiwgZ2FsbGVyeVNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxnYWxsZXJ5Q29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9nYWxsZXJ5Q29udHJvbGxlci5qc1wiO2ltcG9ydCBHYWxsZXJ5IGZyb20gXCIuLi9tb2RlbHMvR2FsbGVyeS5qc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbEdhbGxlcnlJdGVtcyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpdGVtcyA9IGF3YWl0IEdhbGxlcnkuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGl0ZW1zKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUdhbGxlcnlJdGVtID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBuZXcgR2FsbGVyeShyZXEuYm9keSk7XHJcbiAgICAgICAgYXdhaXQgaXRlbS5zYXZlKCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oaXRlbSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVHYWxsZXJ5SXRlbSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpdGVtID0gYXdhaXQgR2FsbGVyeS5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwgeyBuZXc6IHRydWUgfSk7XHJcbiAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIkl0ZW0gbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oaXRlbSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVHYWxsZXJ5SXRlbSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpdGVtID0gYXdhaXQgR2FsbGVyeS5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIWl0ZW0pIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiSXRlbSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiSXRlbSBkZWxldGVkXCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcb3JkZXJSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL29yZGVyUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgICBnZXRBbGxPcmRlcnMsXHJcbiAgICBjcmVhdGVPcmRlcixcclxuICAgIHVwZGF0ZU9yZGVyLFxyXG4gICAgZGVsZXRlT3JkZXJcclxufSBmcm9tICcuLi9jb250cm9sbGVycy9vcmRlckNvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRBbGxPcmRlcnMpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZU9yZGVyKTtcclxucm91dGVyLnB1dCgnLzppZCcsIHVwZGF0ZU9yZGVyKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZU9yZGVyKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcT3JkZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL09yZGVyLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3Qgb3JkZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIHdoYXRzYXBwX25vOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBldmVudF9uYW1lOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIHBob3RvZ3JhcGh5X3R5cGU6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgbG9jYXRpb246IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgZXZlbnRfZGF0ZTogeyB0eXBlOiBEYXRlIH0sXHJcbiAgICAgICAgZXZlbnRfZW5kX2RhdGU6IHsgdHlwZTogRGF0ZSB9LFxyXG4gICAgICAgIHNlcnZpY2VDb25maWc6IHsgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk1peGVkIH0sXHJcbiAgICAgICAgc3RhcnRfdGltZTogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBlbmRfdGltZTogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBzZXJ2aWNlOiB7IHR5cGU6IFN0cmluZyB9LCAvLyBTdG9yaW5nIGFzIGNvbW1hLXNlcGFyYXRlZCBzdHJpbmcgYXMgcGVyIGZyb250ZW5kIGxvZ2ljXHJcbiAgICAgICAgYWxidW1fcGFnZXM6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgYW1vdW50OiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgICAgIGFtb3VudF9wYWlkOiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgICAgIHJlbWFpbmluZ19hbW91bnQ6IHsgdHlwZTogTnVtYmVyIH0sXHJcbiAgICAgICAgZGVsaXZlcmFibGVzOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGRlbGl2ZXJ5X2RhdGU6IHsgdHlwZTogRGF0ZSB9LFxyXG4gICAgICAgIG9yZGVyX3N0YXR1czogeyB0eXBlOiBTdHJpbmcsIGVudW06IFtcIlBlbmRpbmdcIiwgXCJJbiBQcm9ncmVzc1wiLCBcIkRlbGl2ZXJlZFwiLCBcIkNhbmNlbGxlZFwiXSwgZGVmYXVsdDogXCJQZW5kaW5nXCIgfSxcclxuICAgICAgICBub3RlczogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICByZWxhdGVkVXNlcjogeyB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ1VzZXInIH0sXHJcbiAgICAgICAgY2xpZW50OiB7IHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCwgcmVmOiAnQ2xpZW50JyB9XHJcbiAgICB9LFxyXG4gICAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5PcmRlciB8fCBtb25nb29zZS5tb2RlbChcIk9yZGVyXCIsIG9yZGVyU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXG9yZGVyQ29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9vcmRlckNvbnRyb2xsZXIuanNcIjtpbXBvcnQgT3JkZXIgZnJvbSBcIi4uL21vZGVscy9PcmRlci5qc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbE9yZGVycyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBvcmRlcnMgPSBhd2FpdCBPcmRlci5maW5kKCkucG9wdWxhdGUoJ3JlbGF0ZWRVc2VyJywgJ25hbWUgZW1haWwnKS5zb3J0KHsgZGVsaXZlcnlfZGF0ZTogLTEsIGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24ob3JkZXJzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZU9yZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG9yZGVyRGF0YSA9IHsgLi4ucmVxLmJvZHkgfTtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCB3aGF0c2FwcF9ubyB9ID0gb3JkZXJEYXRhO1xyXG5cclxuICAgICAgICAvLyBUcnkgdG8gbGluayB3aXRoIGV4aXN0aW5nIGNsaWVudCBvciBjcmVhdGUgbmV3IG9uZVxyXG4gICAgICAgIGlmIChuYW1lIHx8IGVtYWlsIHx8IHdoYXRzYXBwX25vKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IENsaWVudCA9IChhd2FpdCBpbXBvcnQoXCIuLi9tb2RlbHMvQ2xpZW50LmpzXCIpKS5kZWZhdWx0O1xyXG5cclxuICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgY2xpZW50IGJ5IHVuaXF1ZSBpZGVudGlmaWVyc1xyXG4gICAgICAgICAgICBsZXQgY2xpZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGVtYWlsKSBjbGllbnQgPSBhd2FpdCBDbGllbnQuZmluZE9uZSh7IGVtYWlsIH0pO1xyXG4gICAgICAgICAgICBpZiAoIWNsaWVudCAmJiB3aGF0c2FwcF9ubykgY2xpZW50ID0gYXdhaXQgQ2xpZW50LmZpbmRPbmUoeyBwaG9uZTogd2hhdHNhcHBfbm8gfSk7XHJcbiAgICAgICAgICAgIGlmICghY2xpZW50ICYmIG5hbWUpIGNsaWVudCA9IGF3YWl0IENsaWVudC5maW5kT25lKHsgbmFtZSB9KTsgLy8gRmFsbGJhY2sgdG8gbmFtZVxyXG5cclxuICAgICAgICAgICAgaWYgKGNsaWVudCkge1xyXG4gICAgICAgICAgICAgICAgb3JkZXJEYXRhLmNsaWVudCA9IGNsaWVudC5faWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGNsaWVudCBpZiBlbm91Z2ggaW5mb1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnQgPSBuZXcgQ2xpZW50KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSB8fCBcIlVua25vd25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsIHx8IGB0ZW1wXyR7RGF0ZS5ub3coKX1AZXhhbXBsZS5jb21gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZTogd2hhdHNhcHBfbm8gfHwgXCIwMDAwMDAwMDAwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUmVndWxhclwiLCAvLyBEZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCJPcmRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBvcmRlckRhdGEuY2xpZW50ID0gY2xpZW50Ll9pZDtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGNsaWVudEVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBdXRvLWNyZWF0ZSBjbGllbnQgZmFpbGVkOlwiLCBjbGllbnRFcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByb2NlZWQgd2l0aG91dCBsaW5raW5nIGlmIGNsaWVudCBjcmVhdGlvbiBmYWlsc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvcmRlciA9IG5ldyBPcmRlcihvcmRlckRhdGEpO1xyXG4gICAgICAgIGF3YWl0IG9yZGVyLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihvcmRlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVPcmRlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBvcmRlciA9IGF3YWl0IE9yZGVyLmZpbmRCeUlkQW5kVXBkYXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5ib2R5LCB7IG5ldzogdHJ1ZSB9KTtcclxuICAgICAgICBpZiAoIW9yZGVyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIk9yZGVyIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKG9yZGVyKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZU9yZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgT3JkZXIuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFvcmRlcikgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJPcmRlciBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiT3JkZXIgZGVsZXRlZFwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHVzZXJSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL3VzZXJSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICAgIGdldEFsbFVzZXJzLFxyXG4gICAgY3JlYXRlVXNlcixcclxuICAgIHVwZGF0ZVVzZXIsXHJcbiAgICBkZWxldGVVc2VyXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvdXNlckNvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRBbGxVc2Vycyk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlVXNlcik7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVVc2VyKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZVVzZXIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcdXNlckNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvdXNlckNvbnRyb2xsZXIuanNcIjtpbXBvcnQgVXNlciBmcm9tIFwiLi4vbW9kZWxzL1VzZXIuanNcIjtcclxuaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxVc2VycyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB1c2VycyA9IGF3YWl0IFVzZXIuZmluZCgpLnNlbGVjdChcIi1wYXNzd29yZFwiKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICByZXMuanNvbih1c2Vycyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVVc2VyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgZW1haWwsIHBhc3N3b3JkLCByb2xlLCBwaG9uZSwgc3RhdHVzIH0gPSByZXEuYm9keTtcclxuICAgICAgICBjb25zdCBleGlzdGluZyA9IGF3YWl0IFVzZXIuZmluZE9uZSh7IGVtYWlsIH0pO1xyXG4gICAgICAgIGlmIChleGlzdGluZykgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogXCJFbWFpbCBhbHJlYWR5IGV4aXN0c1wiIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCk7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHsgbmFtZSwgZW1haWwsIHBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZCwgcm9sZSwgcGhvbmUsIHN0YXR1cyB9KTtcclxuICAgICAgICBhd2FpdCB1c2VyLnNhdmUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgeyBwYXNzd29yZDogXywgLi4udXNlcldpdGhvdXRQYXNzd29yZCB9ID0gdXNlci50b09iamVjdCgpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHVzZXJXaXRob3V0UGFzc3dvcmQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlVXNlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IHBhc3N3b3JkLCAuLi5yZXN0IH0gPSByZXEuYm9keTtcclxuICAgICAgICBjb25zdCB1cGRhdGVEYXRhID0geyAuLi5yZXN0IH07XHJcblxyXG4gICAgICAgIGlmIChwYXNzd29yZCAmJiBwYXNzd29yZC50cmltKCkgIT09IFwiXCIpIHtcclxuICAgICAgICAgICAgdXBkYXRlRGF0YS5wYXNzd29yZCA9IGF3YWl0IGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCB1cGRhdGVEYXRhLCB7IG5ldzogdHJ1ZSB9KS5zZWxlY3QoXCItcGFzc3dvcmRcIik7XHJcbiAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlVzZXIgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24odXNlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBkZWxldGVVc2VyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIGlmICghdXNlcikgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJVc2VyIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHsgbWVzc2FnZTogXCJVc2VyIGRlbGV0ZWRcIiB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFxmaWxtUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9maWxtUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgICBnZXRBbGxGaWxtcyxcclxuICAgIGNyZWF0ZUZpbG0sXHJcbiAgICB1cGRhdGVGaWxtLFxyXG4gICAgZGVsZXRlRmlsbVxyXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL2ZpbG1Db250cm9sbGVyLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvJywgZ2V0QWxsRmlsbXMpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZUZpbG0pO1xyXG5yb3V0ZXIucHV0KCcvOmlkJywgdXBkYXRlRmlsbSk7XHJcbnJvdXRlci5kZWxldGUoJy86aWQnLCBkZWxldGVGaWxtKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcRmlsbS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvRmlsbS5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IGZpbG1TY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICB5b3V0dWJlVXJsOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBjYXRlZ29yeTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiV2VkZGluZ1wiIH0sXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZW51bTogW1wiQWN0aXZlXCIsIFwiSW5hY3RpdmVcIl0sIGRlZmF1bHQ6IFwiQWN0aXZlXCIgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkZpbG0gfHwgbW9uZ29vc2UubW9kZWwoXCJGaWxtXCIsIGZpbG1TY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcZmlsbUNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvZmlsbUNvbnRyb2xsZXIuanNcIjtpbXBvcnQgRmlsbSBmcm9tIFwiLi4vbW9kZWxzL0ZpbG0uanNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxGaWxtcyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBmaWxtcyA9IGF3YWl0IEZpbG0uZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGZpbG1zKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUZpbG0gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZmlsbSA9IG5ldyBGaWxtKHJlcS5ib2R5KTtcclxuICAgICAgICBhd2FpdCBmaWxtLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihmaWxtKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUZpbG0gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZmlsbSA9IGF3YWl0IEZpbG0uZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgIGlmICghZmlsbSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJGaWxtIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGZpbG0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlRmlsbSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBmaWxtID0gYXdhaXQgRmlsbS5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIWZpbG0pIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiRmlsbSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiRmlsbSBkZWxldGVkXCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcbG92ZVN0b3J5Um91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9sb3ZlU3RvcnlSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0QWxsTG92ZVN0b3JpZXMsXHJcbiAgICBnZXRMb3ZlU3RvcnlCeUlkLFxyXG4gICAgY3JlYXRlTG92ZVN0b3J5LFxyXG4gICAgdXBkYXRlTG92ZVN0b3J5LFxyXG4gICAgZGVsZXRlTG92ZVN0b3J5LFxyXG59IGZyb20gXCIuLi9jb250cm9sbGVycy9sb3ZlU3RvcnlDb250cm9sbGVyLmpzXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldChcIi9cIiwgZ2V0QWxsTG92ZVN0b3JpZXMpO1xyXG5yb3V0ZXIuZ2V0KFwiLzppZFwiLCBnZXRMb3ZlU3RvcnlCeUlkKTtcclxucm91dGVyLnBvc3QoXCIvXCIsIGNyZWF0ZUxvdmVTdG9yeSk7XHJcbnJvdXRlci5wdXQoXCIvOmlkXCIsIHVwZGF0ZUxvdmVTdG9yeSk7XHJcbnJvdXRlci5kZWxldGUoXCIvOmlkXCIsIGRlbGV0ZUxvdmVTdG9yeSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXExvdmVTdG9yeS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvTG92ZVN0b3J5LmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgbG92ZVN0b3J5U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgbG9jYXRpb246IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSwgLy8gRnVsbCBEZXNjcmlwdGlvblxyXG4gICAgICAgIHRodW1ibmFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sIC8vIEJhc2U2NCBvciBVUkxcclxuICAgICAgICBnYWxsZXJ5OiBbeyB0eXBlOiBTdHJpbmcgfV0sIC8vIEFycmF5IG9mIEJhc2U2NCBvciBVUkxzXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZW51bTogW1wiQWN0aXZlXCIsIFwiSW5hY3RpdmVcIl0sIGRlZmF1bHQ6IFwiQWN0aXZlXCIgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkxvdmVTdG9yeSB8fCBtb25nb29zZS5tb2RlbChcIkxvdmVTdG9yeVwiLCBsb3ZlU3RvcnlTY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcbG92ZVN0b3J5Q29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9sb3ZlU3RvcnlDb250cm9sbGVyLmpzXCI7aW1wb3J0IExvdmVTdG9yeSBmcm9tIFwiLi4vbW9kZWxzL0xvdmVTdG9yeS5qc1wiO1xyXG5cclxuLy8gR2V0IGFsbCBsb3ZlIHN0b3JpZXNcclxuZXhwb3J0IGNvbnN0IGdldEFsbExvdmVTdG9yaWVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHN0b3JpZXMgPSBhd2FpdCBMb3ZlU3RvcnkuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHN0b3JpZXMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBHZXQgc2luZ2xlIGxvdmUgc3RvcnlcclxuZXhwb3J0IGNvbnN0IGdldExvdmVTdG9yeUJ5SWQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc3RvcnkgPSBhd2FpdCBMb3ZlU3RvcnkuZmluZEJ5SWQocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFzdG9yeSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJTdG9yeSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbihzdG9yeSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIENyZWF0ZSBuZXcgbG92ZSBzdG9yeVxyXG5leHBvcnQgY29uc3QgY3JlYXRlTG92ZVN0b3J5ID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHN0b3J5ID0gbmV3IExvdmVTdG9yeShyZXEuYm9keSk7XHJcbiAgICAgICAgYXdhaXQgc3Rvcnkuc2F2ZSgpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKHN0b3J5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIGxvdmUgc3RvcnlcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUxvdmVTdG9yeSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzdG9yeSA9IGF3YWl0IExvdmVTdG9yeS5maW5kQnlJZEFuZFVwZGF0ZShyZXEucGFyYW1zLmlkLCByZXEuYm9keSwgeyBuZXc6IHRydWUgfSk7XHJcbiAgICAgICAgaWYgKCFzdG9yeSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJTdG9yeSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbihzdG9yeSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBsb3ZlIHN0b3J5XHJcbmV4cG9ydCBjb25zdCBkZWxldGVMb3ZlU3RvcnkgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc3RvcnkgPSBhd2FpdCBMb3ZlU3RvcnkuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFzdG9yeSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJTdG9yeSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiU3RvcnkgZGVsZXRlZCBzdWNjZXNzZnVsbHlcIiB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFxlbnF1aXJ5Um91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9lbnF1aXJ5Um91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZUVucXVpcnksXHJcbiAgICBnZXRBbGxFbnF1aXJpZXMsXHJcbiAgICB1cGRhdGVFbnF1aXJ5U3RhdHVzLFxyXG4gICAgZGVsZXRlRW5xdWlyeVxyXG59IGZyb20gXCIuLi9jb250cm9sbGVycy9lbnF1aXJ5Q29udHJvbGxlci5qc1wiO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5wb3N0KFwiL1wiLCBjcmVhdGVFbnF1aXJ5KTtcclxucm91dGVyLmdldChcIi9cIiwgZ2V0QWxsRW5xdWlyaWVzKTtcclxucm91dGVyLnB1dChcIi86aWQvc3RhdHVzXCIsIHVwZGF0ZUVucXVpcnlTdGF0dXMpO1xyXG5yb3V0ZXIuZGVsZXRlKFwiLzppZFwiLCBkZWxldGVFbnF1aXJ5KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcRW5xdWlyeS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvRW5xdWlyeS5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IGVucXVpcnlTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIGdyb29tTmFtZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgYnJpZGVOYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBwaG9uZU51bWJlcjogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgZXZlbnRTdGFydERhdGU6IHsgdHlwZTogRGF0ZSwgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBldmVudEVuZERhdGU6IHsgdHlwZTogRGF0ZSwgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBldmVudHM6IFt7IHR5cGU6IFN0cmluZyB9XSwgLy8gQXJyYXkgb2YgZXZlbnQgbmFtZXNcclxuICAgICAgICBidWRnZXQ6IHsgdHlwZTogTnVtYmVyIH0sXHJcbiAgICAgICAgbG9jYXRpb246IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIHNlcnZpY2VzOiBbeyB0eXBlOiBTdHJpbmcgfV0sIC8vIEFycmF5IG9mIHNlcnZpY2VzIChQaG90b2dyYXBoeS9GaWxtcy9Cb3RoKVxyXG4gICAgICAgIG1lc3NhZ2U6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZW51bTogW1wiTmV3XCIsIFwiQ29udGFjdGVkXCIsIFwiQm9va2VkXCIsIFwiQ2xvc2VkXCJdLCBkZWZhdWx0OiBcIk5ld1wiIH0sXHJcbiAgICB9LFxyXG4gICAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5FbnF1aXJ5IHx8IG1vbmdvb3NlLm1vZGVsKFwiRW5xdWlyeVwiLCBlbnF1aXJ5U2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHV0aWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHV0aWxzXFxcXGVtYWlsU2VydmljZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci91dGlscy9lbWFpbFNlcnZpY2UuanNcIjtpbXBvcnQgbm9kZW1haWxlciBmcm9tICdub2RlbWFpbGVyJztcclxuXHJcbmNvbnN0IHRyYW5zcG9ydGVyID0gbm9kZW1haWxlci5jcmVhdGVUcmFuc3BvcnQoe1xyXG4gICAgc2VydmljZTogJ2dtYWlsJyxcclxuICAgIGF1dGg6IHtcclxuICAgICAgICB1c2VyOiBwcm9jZXNzLmVudi5FTUFJTF9VU0VSLFxyXG4gICAgICAgIHBhc3M6IHByb2Nlc3MuZW52LkVNQUlMX1BBU1MsXHJcbiAgICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBjb25zdCBzZW5kRW1haWwgPSBhc3luYyAoeyB0bywgc3ViamVjdCwgaHRtbCwgcmVwbHlUbyB9KSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSBhd2FpdCB0cmFuc3BvcnRlci5zZW5kTWFpbCh7XHJcbiAgICAgICAgICAgIGZyb206IGBcIiR7cHJvY2Vzcy5lbnYuRU1BSUxfRlJPTV9OQU1FIHx8ICdQb3RvZ3JhcGh5IFdlYmFwcCd9XCIgPCR7cHJvY2Vzcy5lbnYuRU1BSUxfVVNFUn0+YCxcclxuICAgICAgICAgICAgdG8sXHJcbiAgICAgICAgICAgIHJlcGx5VG8sXHJcbiAgICAgICAgICAgIHN1YmplY3QsXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJNZXNzYWdlIHNlbnQ6ICVzXCIsIGluZm8ubWVzc2FnZUlkKTtcclxuICAgICAgICByZXR1cm4gaW5mbztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNlbmRpbmcgZW1haWw6IFwiLCBlcnJvcik7XHJcbiAgICAgICAgLy8gRG9uJ3QgdGhyb3cgZXJyb3IgdG8gYXZvaWQgYnJlYWtpbmcgdGhlIG1haW4gcmVxdWVzdCwganVzdCBsb2cgaXRcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGVucXVpcnlDb250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL2VucXVpcnlDb250cm9sbGVyLmpzXCI7aW1wb3J0IEVucXVpcnkgZnJvbSBcIi4uL21vZGVscy9FbnF1aXJ5LmpzXCI7XHJcblxyXG5pbXBvcnQgeyBzZW5kRW1haWwgfSBmcm9tIFwiLi4vdXRpbHMvZW1haWxTZXJ2aWNlLmpzXCI7XHJcblxyXG4vLyBDcmVhdGUgYSBuZXcgZW5xdWlyeSAoUHVibGljKVxyXG5leHBvcnQgY29uc3QgY3JlYXRlRW5xdWlyeSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBlbnF1aXJ5ID0gbmV3IEVucXVpcnkocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IGVucXVpcnkuc2F2ZSgpO1xyXG5cclxuICAgICAgICAvLyBTZW5kIEVtYWlsIE5vdGlmaWNhdGlvblxyXG4gICAgICAgIGNvbnN0IGFkbWluRW1haWwgPSBcInBpeGVscHJvaXRzb2x1dGlvbnNAZ21haWwuY29tXCI7XHJcbiAgICAgICAgaWYgKGFkbWluRW1haWwpIHtcclxuICAgICAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBgXHJcbiAgICAgICAgICAgICAgICA8aDI+TmV3IFwiQm9vayBVc1wiIEVucXVpcnkgUmVjZWl2ZWQ8L2gyPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5Db3VwbGU6PC9zdHJvbmc+ICR7ZW5xdWlyeS5ncm9vbU5hbWV9ICYgJHtlbnF1aXJ5LmJyaWRlTmFtZX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPlBob25lOjwvc3Ryb25nPiAke2VucXVpcnkucGhvbmVOdW1iZXJ9PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5EYXRlOjwvc3Ryb25nPiAke25ldyBEYXRlKGVucXVpcnkuZXZlbnRTdGFydERhdGUpLnRvRGF0ZVN0cmluZygpfSAtICR7bmV3IERhdGUoZW5xdWlyeS5ldmVudEVuZERhdGUpLnRvRGF0ZVN0cmluZygpfTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+TG9jYXRpb246PC9zdHJvbmc+ICR7ZW5xdWlyeS5sb2NhdGlvbn08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPkJ1ZGdldDo8L3N0cm9uZz4gJHtlbnF1aXJ5LmJ1ZGdldH08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPk1lc3NhZ2U6PC9zdHJvbmc+ICR7ZW5xdWlyeS5tZXNzYWdlfTwvcD5cclxuICAgICAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIke3Byb2Nlc3MuZW52LkNMSUVOVF9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCd9L2VucXVpcmllc1wiPlZpZXcgaW4gQWRtaW4gUGFuZWw8L2E+XHJcbiAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBzZW5kRW1haWwoe1xyXG4gICAgICAgICAgICAgICAgdG86IGFkbWluRW1haWwsXHJcbiAgICAgICAgICAgICAgICBzdWJqZWN0OiBgTmV3IEVucXVpcnk6ICR7ZW5xdWlyeS5ncm9vbU5hbWV9ICYgJHtlbnF1aXJ5LmJyaWRlTmFtZX1gLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbENvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICByZXBseVRvOiBcIlwiLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKGVucXVpcnkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBHZXQgYWxsIGVucXVpcmllcyAoQWRtaW4pXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxFbnF1aXJpZXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZW5xdWlyaWVzID0gYXdhaXQgRW5xdWlyeS5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oZW5xdWlyaWVzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIGVucXVpcnkgc3RhdHVzIChBZG1pbilcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUVucXVpcnlTdGF0dXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IGVucXVpcnkgPSBhd2FpdCBFbnF1aXJ5LmZpbmRCeUlkQW5kVXBkYXRlKFxyXG4gICAgICAgICAgICByZXEucGFyYW1zLmlkLFxyXG4gICAgICAgICAgICB7IHN0YXR1cyB9LFxyXG4gICAgICAgICAgICB7IG5ldzogdHJ1ZSB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoIWVucXVpcnkpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiRW5xdWlyeSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbihlbnF1aXJ5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gRGVsZXRlIGVucXVpcnkgKEFkbWluKVxyXG5leHBvcnQgY29uc3QgZGVsZXRlRW5xdWlyeSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBlbnF1aXJ5ID0gYXdhaXQgRW5xdWlyeS5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIWVucXVpcnkpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiRW5xdWlyeSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiRW5xdWlyeSBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGNvbnRhY3RSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL2NvbnRhY3RSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQge1xyXG4gICAgY3JlYXRlQ29udGFjdCxcclxuICAgIGdldEFsbENvbnRhY3RzLFxyXG4gICAgdXBkYXRlQ29udGFjdFN0YXR1cyxcclxuICAgIGRlbGV0ZUNvbnRhY3RcclxufSBmcm9tIFwiLi4vY29udHJvbGxlcnMvY29udGFjdENvbnRyb2xsZXIuanNcIjtcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5yb3V0ZXIucG9zdChcIi9cIiwgY3JlYXRlQ29udGFjdCk7XHJcbnJvdXRlci5nZXQoXCIvXCIsIGdldEFsbENvbnRhY3RzKTtcclxucm91dGVyLnB1dChcIi86aWQvc3RhdHVzXCIsIHVwZGF0ZUNvbnRhY3RTdGF0dXMpO1xyXG5yb3V0ZXIuZGVsZXRlKFwiLzppZFwiLCBkZWxldGVDb250YWN0KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcQ29udGFjdC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvQ29udGFjdC5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IGNvbnRhY3RTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBzdWJqZWN0OiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBtZXNzYWdlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBzdGF0dXM6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbXCJOZXdcIiwgXCJSZWFkXCIsIFwiUmVwbGllZFwiXSwgZGVmYXVsdDogXCJOZXdcIiB9LFxyXG4gICAgfSxcclxuICAgIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuQ29udGFjdCB8fCBtb25nb29zZS5tb2RlbChcIkNvbnRhY3RcIiwgY29udGFjdFNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxjb250YWN0Q29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9jb250YWN0Q29udHJvbGxlci5qc1wiO2ltcG9ydCBDb250YWN0IGZyb20gXCIuLi9tb2RlbHMvQ29udGFjdC5qc1wiO1xyXG5cclxuaW1wb3J0IHsgc2VuZEVtYWlsIH0gZnJvbSBcIi4uL3V0aWxzL2VtYWlsU2VydmljZS5qc1wiO1xyXG5cclxuLy8gQ3JlYXRlIGEgbmV3IGNvbnRhY3QgbWVzc2FnZSAoUHVibGljKVxyXG5leHBvcnQgY29uc3QgY3JlYXRlQ29udGFjdCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjb250YWN0ID0gbmV3IENvbnRhY3QocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IGNvbnRhY3Quc2F2ZSgpO1xyXG5cclxuICAgICAgICAvLyBTZW5kIEVtYWlsIE5vdGlmaWNhdGlvblxyXG4gICAgICAgIGNvbnN0IGFkbWluRW1haWwgPSBcInBpeGVscHJvaXRzb2x1dGlvbnNAZ21haWwuY29tXCI7XHJcbiAgICAgICAgaWYgKGFkbWluRW1haWwpIHtcclxuICAgICAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBgXHJcbiAgICAgICAgICAgICAgICA8aDI+TmV3IENvbnRhY3QgTWVzc2FnZSBSZWNlaXZlZDwvaDI+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPk5hbWU6PC9zdHJvbmc+ICR7Y29udGFjdC5uYW1lfTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+RW1haWw6PC9zdHJvbmc+ICR7Y29udGFjdC5lbWFpbH08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPlN1YmplY3Q6PC9zdHJvbmc+ICR7Y29udGFjdC5zdWJqZWN0fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+TWVzc2FnZTo8L3N0cm9uZz48L3A+XHJcbiAgICAgICAgICAgICAgICA8cD4ke2NvbnRhY3QubWVzc2FnZX08L3A+XHJcbiAgICAgICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtwcm9jZXNzLmVudi5DTElFTlRfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnfS9jb250YWN0LW1lc3NhZ2VzXCI+VmlldyBpbiBBZG1pbiBQYW5lbDwvYT5cclxuICAgICAgICAgICAgYDtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IHNlbmRFbWFpbCh7XHJcbiAgICAgICAgICAgICAgICB0bzogYWRtaW5FbWFpbCxcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IGBOZXcgTWVzc2FnZTogJHtjb250YWN0LnN1YmplY3R9YCxcclxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxDb250ZW50LFxyXG4gICAgICAgICAgICAgICAgcmVwbHlUbzogY29udGFjdC5lbWFpbCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihjb250YWN0KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gR2V0IGFsbCBjb250YWN0IG1lc3NhZ2VzIChBZG1pbilcclxuZXhwb3J0IGNvbnN0IGdldEFsbENvbnRhY3RzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhY3RzID0gYXdhaXQgQ29udGFjdC5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oY29udGFjdHMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBVcGRhdGUgY29udGFjdCBzdGF0dXMgKEFkbWluKVxyXG5leHBvcnQgY29uc3QgdXBkYXRlQ29udGFjdFN0YXR1cyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IHN0YXR1cyB9ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgY29uc3QgY29udGFjdCA9IGF3YWl0IENvbnRhY3QuZmluZEJ5SWRBbmRVcGRhdGUoXHJcbiAgICAgICAgICAgIHJlcS5wYXJhbXMuaWQsXHJcbiAgICAgICAgICAgIHsgc3RhdHVzIH0sXHJcbiAgICAgICAgICAgIHsgbmV3OiB0cnVlIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGlmICghY29udGFjdCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJDb250YWN0IG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGNvbnRhY3QpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBEZWxldGUgY29udGFjdCAoQWRtaW4pXHJcbmV4cG9ydCBjb25zdCBkZWxldGVDb250YWN0ID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhY3QgPSBhd2FpdCBDb250YWN0LmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIGlmICghY29udGFjdCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJDb250YWN0IG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHsgbWVzc2FnZTogXCJDb250YWN0IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcZGFzaGJvYXJkUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9kYXNoYm9hcmRSb3V0ZXMuanNcIjtcclxuaW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7IGdldERhc2hib2FyZFN0YXRzIH0gZnJvbSAnLi4vY29udHJvbGxlcnMvZGFzaGJvYXJkQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnL3N0YXRzJywgZ2V0RGFzaGJvYXJkU3RhdHMpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcZGFzaGJvYXJkQ29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9kYXNoYm9hcmRDb250cm9sbGVyLmpzXCI7XHJcbmltcG9ydCBFbnF1aXJ5IGZyb20gXCIuLi9tb2RlbHMvRW5xdWlyeS5qc1wiO1xyXG5pbXBvcnQgT3JkZXIgZnJvbSBcIi4uL21vZGVscy9PcmRlci5qc1wiO1xyXG5pbXBvcnQgUXVvdGF0aW9uIGZyb20gXCIuLi9tb2RlbHMvUXVvdGF0aW9uLmpzXCI7XHJcbmltcG9ydCBJbnZvaWNlIGZyb20gXCIuLi9tb2RlbHMvSW52b2ljZS5qc1wiO1xyXG5pbXBvcnQgQ29udGFjdCBmcm9tIFwiLi4vbW9kZWxzL0NvbnRhY3QuanNcIjtcclxuaW1wb3J0IENsaWVudCBmcm9tIFwiLi4vbW9kZWxzL0NsaWVudC5qc1wiO1xyXG5pbXBvcnQgVGVzdGltb25pYWwgZnJvbSBcIi4uL21vZGVscy9UZXN0aW1vbmlhbC5qc1wiO1xyXG5pbXBvcnQgR2FsbGVyeSBmcm9tIFwiLi4vbW9kZWxzL0dhbGxlcnkuanNcIjtcclxuaW1wb3J0IFNsaWRlciBmcm9tIFwiLi4vbW9kZWxzL1NsaWRlci5qc1wiO1xyXG5pbXBvcnQgTG92ZVN0b3J5IGZyb20gXCIuLi9tb2RlbHMvTG92ZVN0b3J5LmpzXCI7XHJcbmltcG9ydCBGaWxtIGZyb20gXCIuLi9tb2RlbHMvRmlsbS5qc1wiO1xyXG5pbXBvcnQgVXNlciBmcm9tIFwiLi4vbW9kZWxzL1VzZXIuanNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXREYXNoYm9hcmRTdGF0cyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgdG9kYXkuc2V0SG91cnMoMCwgMCwgMCwgMCk7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRPZldlZWsgPSBuZXcgRGF0ZSh0b2RheSk7XHJcbiAgICAgICAgc3RhcnRPZldlZWsuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgLSA3KTtcclxuICAgICAgICBjb25zdCBzdGFydE9mTW9udGggPSBuZXcgRGF0ZSh0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpLCAxKTtcclxuXHJcbiAgICAgICAgLy8gMS4gS1BJIENhcmRzXHJcbiAgICAgICAgY29uc3QgbmV3RW5xdWlyaWVzVG9kYXkgPSBhd2FpdCBFbnF1aXJ5LmNvdW50RG9jdW1lbnRzKHsgY3JlYXRlZEF0OiB7ICRndGU6IHRvZGF5IH0gfSk7XHJcbiAgICAgICAgY29uc3QgbmV3RW5xdWlyaWVzV2VlayA9IGF3YWl0IEVucXVpcnkuY291bnREb2N1bWVudHMoeyBjcmVhdGVkQXQ6IHsgJGd0ZTogc3RhcnRPZldlZWsgfSB9KTtcclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgb3JkZXIgc3RhdHVzIGVudW0gZm9yICdQZW5kaW5nJy8nQ29uZmlybWVkJyBvciBzaW1pbGFyXHJcbiAgICAgICAgY29uc3QgbmV3T3JkZXJzQ291bnQgPSBhd2FpdCBPcmRlci5jb3VudERvY3VtZW50cyh7IGNyZWF0ZWRBdDogeyAkZ3RlOiBzdGFydE9mTW9udGggfSB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGVuZGluZ1F1b3RhdGlvbnMgPSBhd2FpdCBRdW90YXRpb24uY291bnREb2N1bWVudHMoe1xyXG4gICAgICAgICAgICBzdGF0dXM6IHsgJGluOiBbJ0RyYWZ0JywgJ1NlbnQnLCAnQXdhaXRpbmcgQXBwcm92YWwnXSB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVucGFpZEludm9pY2VzQWdnID0gYXdhaXQgSW52b2ljZS5hZ2dyZWdhdGUoW1xyXG4gICAgICAgICAgICB7ICRtYXRjaDogeyBwYXltZW50U3RhdHVzOiB7ICRuZTogJ1BhaWQnIH0gfSB9LFxyXG4gICAgICAgICAgICB7ICRncm91cDogeyBfaWQ6IG51bGwsIGNvdW50OiB7ICRzdW06IDEgfSwgdG90YWxBbW91bnQ6IHsgJHN1bTogeyAkc3VidHJhY3Q6IFtcIiRncmFuZFRvdGFsXCIsIFwiJGFtb3VudFBhaWRcIl0gfSB9IH0gfVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIGNvbnN0IHVucGFpZEludm9pY2VzQ291bnQgPSB1bnBhaWRJbnZvaWNlc0FnZ1swXT8uY291bnQgfHwgMDtcclxuICAgICAgICBjb25zdCB1bnBhaWRJbnZvaWNlc0Ftb3VudCA9IHVucGFpZEludm9pY2VzQWdnWzBdPy50b3RhbEFtb3VudCB8fCAwO1xyXG5cclxuICAgICAgICBjb25zdCBuZXh0V2VlayA9IG5ldyBEYXRlKHRvZGF5KTtcclxuICAgICAgICBuZXh0V2Vlay5zZXREYXRlKHRvZGF5LmdldERhdGUoKSArIDcpO1xyXG4gICAgICAgIGNvbnN0IHVwY29taW5nU2hvb3RzQ291bnQgPSBhd2FpdCBPcmRlci5jb3VudERvY3VtZW50cyh7XHJcbiAgICAgICAgICAgIGV2ZW50X2RhdGU6IHsgJGd0ZTogdG9kYXksICRsdGU6IG5leHRXZWVrIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR2FsbGVyeSAvIENvbnRlbnQgSGVhbHRoXHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeVF1ZXVlID0gYXdhaXQgT3JkZXIuY291bnREb2N1bWVudHMoeyBvcmRlcl9zdGF0dXM6ICdJbiBQcm9ncmVzcycgfSk7XHJcbiAgICAgICAgY29uc3QgZ2FsbGVyeVN0YXRzID0ge1xyXG4gICAgICAgICAgICB0b3RhbDogYXdhaXQgR2FsbGVyeS5jb3VudERvY3VtZW50cygpLFxyXG4gICAgICAgICAgICAvLyB1cGxvYWRlZDogYXdhaXQgR2FsbGVyeS5jb3VudERvY3VtZW50cyh7IHN0YXR1czogJ1B1Ymxpc2hlZCcgfSkgLy8gSWYgU3RhdHVzIGV4aXN0c1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHVucmVhZE1lc3NhZ2VzID0gYXdhaXQgQ29udGFjdC5jb3VudERvY3VtZW50cyh7IHN0YXR1czogJ05ldycgfSk7XHJcbiAgICAgICAgY29uc3QgYWN0aXZlQ2xpZW50cyA9IGF3YWl0IENsaWVudC5jb3VudERvY3VtZW50cyh7IHN0YXR1czogJ0FjdGl2ZScgfSk7XHJcbiAgICAgICAgY29uc3QgcGVuZGluZ1Rlc3RpbW9uaWFscyA9IGF3YWl0IFRlc3RpbW9uaWFsLmNvdW50RG9jdW1lbnRzKHsgc3RhdHVzOiAnUGVuZGluZycgfSk7XHJcblxyXG4gICAgICAgIC8vIDIuIEFjdGlvbiBSZXF1aXJlZFxyXG4gICAgICAgIGNvbnN0IHllc3RlcmRheSA9IG5ldyBEYXRlKHRvZGF5KTtcclxuICAgICAgICB5ZXN0ZXJkYXkuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgLSAxKTtcclxuICAgICAgICBjb25zdCBlbnF1aXJpZXNOb1JlcGx5ID0gYXdhaXQgRW5xdWlyeS5maW5kKHtcclxuICAgICAgICAgICAgY3JlYXRlZEF0OiB7ICRsdDogeWVzdGVyZGF5IH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogJ05ldydcclxuICAgICAgICB9KS5zZWxlY3QoJ19pZCBuYW1lcyBncm9vbU5hbWUgYnJpZGVOYW1lIGNyZWF0ZWRBdCcpLmxpbWl0KDUpO1xyXG5cclxuICAgICAgICBjb25zdCB0aHJlZURheXNBZ28gPSBuZXcgRGF0ZSh0b2RheSk7XHJcbiAgICAgICAgdGhyZWVEYXlzQWdvLnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpIC0gMyk7XHJcbiAgICAgICAgY29uc3Qgb2xkUXVvdGF0aW9ucyA9IGF3YWl0IFF1b3RhdGlvbi5maW5kKHtcclxuICAgICAgICAgICAgdXBkYXRlZEF0OiB7ICRsdDogdGhyZWVEYXlzQWdvIH0sXHJcbiAgICAgICAgICAgIHN0YXR1czogJ1NlbnQnXHJcbiAgICAgICAgfSkuc2VsZWN0KCdfaWQgcXVvdGVOdW1iZXIgY2xpZW50TmFtZSB1cGRhdGVkQXQnKS5saW1pdCg1KTtcclxuXHJcbiAgICAgICAgY29uc3QgcGVuZGluZ09yZGVycyA9IGF3YWl0IE9yZGVyLmZpbmQoeyBvcmRlcl9zdGF0dXM6ICdQZW5kaW5nJyB9KS5zZWxlY3QoJ19pZCBuYW1lIGNyZWF0ZWRBdCcpLmxpbWl0KDUpO1xyXG5cclxuICAgICAgICBjb25zdCBvdmVyZHVlSW52b2ljZXMgPSBhd2FpdCBJbnZvaWNlLmZpbmQoe1xyXG4gICAgICAgICAgICBkdWVEYXRlOiB7ICRsdDogdG9kYXkgfSxcclxuICAgICAgICAgICAgcGF5bWVudFN0YXR1czogeyAkbmU6ICdQYWlkJyB9XHJcbiAgICAgICAgfSkuc2VsZWN0KCdfaWQgaW52b2ljZU51bWJlciBjbGllbnROYW1lIGR1ZURhdGUgZ3JhbmRUb3RhbCBhbW91bnRQYWlkJykubGltaXQoNSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBlbmRpbmdUZXN0aW1vbmlhbHNMaXN0ID0gYXdhaXQgVGVzdGltb25pYWwuZmluZCh7IHN0YXR1czogJ1BlbmRpbmcnIH0pLnNlbGVjdCgnX2lkIGNvdXBsZU5hbWUgY3JlYXRlZEF0IHNob3J0RGVzY3JpcHRpb24gZnVsbERlc2NyaXB0aW9uIHJhdGluZyBsb2NhdGlvbiB0aHVtYm5haWwnKS5saW1pdCg0KTtcclxuXHJcbiAgICAgICAgLy8gMy4gUGlwZWxpbmVcclxuICAgICAgICBjb25zdCBwaXBlbGluZVN0YXRzID0gYXdhaXQgT3JkZXIuYWdncmVnYXRlKFtcclxuICAgICAgICAgICAgeyAkZ3JvdXA6IHsgX2lkOiBcIiRvcmRlcl9zdGF0dXNcIiwgY291bnQ6IHsgJHN1bTogMSB9IH0gfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICBjb25zdCBvcmRlcnNCeVR5cGUgPSBhd2FpdCBPcmRlci5hZ2dyZWdhdGUoW1xyXG4gICAgICAgICAgICB7ICRncm91cDogeyBfaWQ6IFwiJHBob3RvZ3JhcGh5X3R5cGVcIiwgY291bnQ6IHsgJHN1bTogMSB9IH0gfVxyXG4gICAgICAgIF0pO1xyXG5cclxuICAgICAgICAvLyA0LiBDYWxlbmRhciAvIFNjaGVkdWxlIC0gTmV4dCA1IHNob290c1xyXG4gICAgICAgIGNvbnN0IHVwY29taW5nU2hvb3RzID0gYXdhaXQgT3JkZXIuZmluZCh7XHJcbiAgICAgICAgICAgIGV2ZW50X2RhdGU6IHsgJGd0ZTogdG9kYXkgfVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5zb3J0KHsgZXZlbnRfZGF0ZTogMSB9KVxyXG4gICAgICAgICAgICAubGltaXQoNSlcclxuICAgICAgICAgICAgLnNlbGVjdCgnX2lkIG5hbWUgZXZlbnRfbmFtZSBldmVudF9kYXRlIGxvY2F0aW9uIHBob3RvZ3JhcGh5X3R5cGUgb3JkZXJfc3RhdHVzJyk7XHJcblxyXG4gICAgICAgIC8vIDUuIFJldmVudWUgU25hcHNob3QgKFRoaXMgTW9udGgpXHJcbiAgICAgICAgY29uc3QgcmV2ZW51ZVN0YXRzID0gYXdhaXQgSW52b2ljZS5hZ2dyZWdhdGUoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWF0Y2g6IHtcclxuICAgICAgICAgICAgICAgICAgICBpbnZvaWNlRGF0ZTogeyAkZ3RlOiBzdGFydE9mTW9udGggfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkZ3JvdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICBfaWQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmlsbGVkOiB7ICRzdW06IFwiJGdyYW5kVG90YWxcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3RlZDogeyAkc3VtOiBcIiRhbW91bnRQYWlkXCIgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgY29uc3QgdGhpc01vbnRoQmlsbGVkID0gcmV2ZW51ZVN0YXRzWzBdPy5iaWxsZWQgfHwgMDtcclxuICAgICAgICBjb25zdCB0aGlzTW9udGhDb2xsZWN0ZWQgPSByZXZlbnVlU3RhdHNbMF0/LmNvbGxlY3RlZCB8fCAwO1xyXG5cclxuICAgICAgICAvLyBUb3RhbCBPdXRzdGFuZGluZyAoQWxsIHRpbWUpXHJcbiAgICAgICAgY29uc3QgdG90YWxPdXRzdGFuZGluZ0FnZyA9IGF3YWl0IEludm9pY2UuYWdncmVnYXRlKFtcclxuICAgICAgICAgICAgeyAkbWF0Y2g6IHsgcGF5bWVudFN0YXR1czogeyAkbmU6ICdQYWlkJyB9IH0gfSxcclxuICAgICAgICAgICAgeyAkZ3JvdXA6IHsgX2lkOiBudWxsLCB0b3RhbDogeyAkc3VtOiB7ICRzdWJ0cmFjdDogW1wiJGdyYW5kVG90YWxcIiwgXCIkYW1vdW50UGFpZFwiXSB9IH0gfSB9XHJcbiAgICAgICAgXSk7XHJcbiAgICAgICAgY29uc3QgdG90YWxPdXRzdGFuZGluZyA9IHRvdGFsT3V0c3RhbmRpbmdBZ2dbMF0/LnRvdGFsIHx8IDA7XHJcblxyXG4gICAgICAgIC8vIDYuIFJlY2VudCBBY3Rpdml0eVxyXG4gICAgICAgIGNvbnN0IHJlY2VudEVucXVpcmllcyA9IGF3YWl0IEVucXVpcnkuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pLmxpbWl0KDMpLmxlYW4oKTtcclxuICAgICAgICBjb25zdCByZWNlbnRPcmRlcnMgPSBhd2FpdCBPcmRlci5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSkubGltaXQoMykubGVhbigpO1xyXG4gICAgICAgIGNvbnN0IHJlY2VudEludm9pY2VzID0gYXdhaXQgSW52b2ljZS5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSkubGltaXQoMykubGVhbigpO1xyXG5cclxuICAgICAgICBjb25zdCBhY3Rpdml0eUZlZWQgPSBbXHJcbiAgICAgICAgICAgIC4uLnJlY2VudEVucXVpcmllcy5tYXAoZSA9PiAoeyB0eXBlOiAnRW5xdWlyeScsIGRhdGU6IGUuY3JlYXRlZEF0LCB0ZXh0OiBgTmV3IGVucXVpcnk6ICR7ZS5ncm9vbU5hbWV9ICYgJHtlLmJyaWRlTmFtZX1gLCBpZDogZS5faWQgfSkpLFxyXG4gICAgICAgICAgICAuLi5yZWNlbnRPcmRlcnMubWFwKG8gPT4gKHsgdHlwZTogJ09yZGVyJywgZGF0ZTogby5jcmVhdGVkQXQsIHRleHQ6IGBPcmRlciBjcmVhdGVkOiAke28ubmFtZX1gLCBpZDogby5faWQgfSkpLFxyXG4gICAgICAgICAgICAuLi5yZWNlbnRJbnZvaWNlcy5tYXAoaSA9PiAoeyB0eXBlOiAnSW52b2ljZScsIGRhdGU6IGkuY3JlYXRlZEF0LCB0ZXh0OiBgSW52b2ljZSAke2kuaW52b2ljZU51bWJlcn1gLCBpZDogaS5faWQgfSkpXHJcbiAgICAgICAgXS5zb3J0KChhLCBiKSA9PiBuZXcgRGF0ZShiLmRhdGUpIC0gbmV3IERhdGUoYS5kYXRlKSkuc2xpY2UoMCwgMTApO1xyXG5cclxuICAgICAgICAvLyA5LiBDb250ZW50IEhlYWx0aFxyXG4gICAgICAgIGNvbnN0IHNsaWRlckFjdGl2ZSA9IGF3YWl0IFNsaWRlci5jb3VudERvY3VtZW50cyh7IGFjdGl2ZTogdHJ1ZSB9KTtcclxuICAgICAgICBjb25zdCBzdG9yaWVzUHVibGlzaGVkID0gYXdhaXQgTG92ZVN0b3J5LmNvdW50RG9jdW1lbnRzKHsgc3RhdHVzOiAnUHVibGlzaGVkJyB9KTtcclxuICAgICAgICBjb25zdCB0ZXN0aW1vbmlhbHNQdWJsaXNoZWQgPSBhd2FpdCBUZXN0aW1vbmlhbC5jb3VudERvY3VtZW50cyh7IHN0YXR1czogJ1B1Ymxpc2hlZCcgfSk7XHJcblxyXG4gICAgICAgIC8vIDEwLiBVc2Vyc1xyXG4gICAgICAgIGNvbnN0IHVzZXJTdGF0cyA9IHtcclxuICAgICAgICAgICAgdG90YWw6IGF3YWl0IFVzZXIuY291bnREb2N1bWVudHMoKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7XHJcbiAgICAgICAgICAgIGtwaToge1xyXG4gICAgICAgICAgICAgICAgbmV3RW5xdWlyaWVzVG9kYXksXHJcbiAgICAgICAgICAgICAgICBuZXdFbnF1aXJpZXNXZWVrLFxyXG4gICAgICAgICAgICAgICAgbmV3T3JkZXJzQ291bnQsIC8vIE1vbnRoXHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nUXVvdGF0aW9ucyxcclxuICAgICAgICAgICAgICAgIHVucGFpZEludm9pY2VzQ291bnQsXHJcbiAgICAgICAgICAgICAgICB1bnBhaWRJbnZvaWNlc0Ftb3VudCxcclxuICAgICAgICAgICAgICAgIHVwY29taW5nU2hvb3RzQ291bnQsXHJcbiAgICAgICAgICAgICAgICBnYWxsZXJ5UXVldWUsXHJcbiAgICAgICAgICAgICAgICB1bnJlYWRNZXNzYWdlcyxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUNsaWVudHMsXHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nVGVzdGltb25pYWxzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFjdGlvblJlcXVpcmVkOiB7XHJcbiAgICAgICAgICAgICAgICBlbnF1aXJpZXNOb1JlcGx5LFxyXG4gICAgICAgICAgICAgICAgb2xkUXVvdGF0aW9ucyxcclxuICAgICAgICAgICAgICAgIHBlbmRpbmdPcmRlcnMsXHJcbiAgICAgICAgICAgICAgICBvdmVyZHVlSW52b2ljZXMsXHJcbiAgICAgICAgICAgICAgICBwZW5kaW5nVGVzdGltb25pYWxzTGlzdFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBwaXBlbGluZTogcGlwZWxpbmVTdGF0cyxcclxuICAgICAgICAgICAgb3JkZXJzQnlUeXBlLFxyXG4gICAgICAgICAgICBzY2hlZHVsZTogdXBjb21pbmdTaG9vdHMsXHJcbiAgICAgICAgICAgIHJldmVudWU6IHtcclxuICAgICAgICAgICAgICAgIHRoaXNNb250aEJpbGxlZCxcclxuICAgICAgICAgICAgICAgIHRoaXNNb250aENvbGxlY3RlZCxcclxuICAgICAgICAgICAgICAgIHRvdGFsT3V0c3RhbmRpbmdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aXZpdHlGZWVkLFxyXG4gICAgICAgICAgICBjb250ZW50SGVhbHRoOiB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZXJBY3RpdmUsXHJcbiAgICAgICAgICAgICAgICBzdG9yaWVzUHVibGlzaGVkLFxyXG4gICAgICAgICAgICAgICAgdGVzdGltb25pYWxzUHVibGlzaGVkXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbGxlcnlTdGF0cyxcclxuICAgICAgICAgICAgdXNlclN0YXRzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiRGFzaGJvYXJkIFN0YXRzIEVycm9yOlwiLCBlcnJvcik7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBcIkVycm9yIGZldGNoaW5nIGRhc2hib2FyZCBzdGF0c1wiLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcVGVzdGltb25pYWwuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL1Rlc3RpbW9uaWFsLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgdGVzdGltb25pYWxTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIGNvdXBsZU5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGxvY2F0aW9uOiB7IHR5cGU6IFN0cmluZywgdHJpbTogdHJ1ZSB9LFxyXG4gICAgICAgIHRodW1ibmFpbDogeyB0eXBlOiBTdHJpbmcgfSwgLy8gVVJMIG9yIEJhc2U2NFxyXG4gICAgICAgIHNob3J0RGVzY3JpcHRpb246IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgbWF4bGVuZ3RoOiAxMDAwIH0sXHJcbiAgICAgICAgZnVsbERlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIHJhdGluZzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDUsIG1pbjogMSwgbWF4OiA1IH0sXHJcbiAgICAgICAgZGlzcGxheU9yZGVyOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxyXG4gICAgICAgIHN0YXR1czoge1xyXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIGVudW06IFtcIkFjdGl2ZVwiLCBcIkluYWN0aXZlXCIsIFwiUGVuZGluZ1wiXSxcclxuICAgICAgICAgICAgZGVmYXVsdDogXCJBY3RpdmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuLy8gSW5kZXggZm9yIHNvcnRpbmcgYnkgZGlzcGxheSBvcmRlclxyXG50ZXN0aW1vbmlhbFNjaGVtYS5pbmRleCh7IGRpc3BsYXlPcmRlcjogMSB9KTtcclxuXHJcbi8vIEZvcmNlIHJlY29tcGlsYXRpb24gb2YgbW9kZWwgaWYgaXQgZXhpc3RzIChmb3IgSE1SL0RldiBlbnZpcm9ubWVudClcclxuaWYgKG1vbmdvb3NlLm1vZGVscy5UZXN0aW1vbmlhbCkge1xyXG4gICAgZGVsZXRlIG1vbmdvb3NlLm1vZGVscy5UZXN0aW1vbmlhbDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXCJUZXN0aW1vbmlhbFwiLCB0ZXN0aW1vbmlhbFNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHRlc3RpbW9uaWFsUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy90ZXN0aW1vbmlhbFJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7XHJcbiAgICBjcmVhdGVUZXN0aW1vbmlhbCxcclxuICAgIGdldEFsbFRlc3RpbW9uaWFscyxcclxuICAgIGdldFRlc3RpbW9uaWFsQnlJZCxcclxuICAgIHVwZGF0ZVRlc3RpbW9uaWFsLFxyXG4gICAgZGVsZXRlVGVzdGltb25pYWxcclxufSBmcm9tIFwiLi4vY29udHJvbGxlcnMvdGVzdGltb25pYWxDb250cm9sbGVyLmpzXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLnBvc3QoXCIvXCIsIGNyZWF0ZVRlc3RpbW9uaWFsKTtcclxucm91dGVyLmdldChcIi9cIiwgZ2V0QWxsVGVzdGltb25pYWxzKTtcclxucm91dGVyLmdldChcIi86aWRcIiwgZ2V0VGVzdGltb25pYWxCeUlkKTtcclxucm91dGVyLnB1dChcIi86aWRcIiwgdXBkYXRlVGVzdGltb25pYWwpO1xyXG5yb3V0ZXIuZGVsZXRlKFwiLzppZFwiLCBkZWxldGVUZXN0aW1vbmlhbCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFx0ZXN0aW1vbmlhbENvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvdGVzdGltb25pYWxDb250cm9sbGVyLmpzXCI7aW1wb3J0IFRlc3RpbW9uaWFsIGZyb20gXCIuLi9tb2RlbHMvVGVzdGltb25pYWwuanNcIjtcclxuXHJcbi8vIENyZWF0ZSBhIG5ldyB0ZXN0aW1vbmlhbFxyXG5leHBvcnQgY29uc3QgY3JlYXRlVGVzdGltb25pYWwgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdGVzdGltb25pYWwgPSBuZXcgVGVzdGltb25pYWwocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IHRlc3RpbW9uaWFsLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbih0ZXN0aW1vbmlhbCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIEdldCBhbGwgdGVzdGltb25pYWxzIChBZG1pbjogYWxsLCBXZWJzaXRlOiBhY3RpdmUpXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxUZXN0aW1vbmlhbHMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyB0eXBlIH0gPSByZXEucXVlcnk7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge307XHJcblxyXG4gICAgICAgIC8vIElmIHF1ZXJ5IHBhcmFtID90eXBlPWFjdGl2ZSBpcyBwYXNzZWQsIHJldHVybiBvbmx5IGFjdGl2ZSBvbmVzIChzb3J0ZWQgYnkgZGlzcGxheU9yZGVyKVxyXG4gICAgICAgIGlmICh0eXBlID09PSAnYWN0aXZlJykge1xyXG4gICAgICAgICAgICBxdWVyeS5zdGF0dXMgPSAnQWN0aXZlJztcclxuICAgICAgICAgICAgLy8gU29ydCBieSBkaXNwbGF5T3JkZXIgYXNjZW5kaW5nLCB0aGVuIGNyZWF0ZWRBdCBkZXNjZW5kaW5nXHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RpbW9uaWFscyA9IGF3YWl0IFRlc3RpbW9uaWFsLmZpbmQocXVlcnkpLnNvcnQoeyBkaXNwbGF5T3JkZXI6IDEsIGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuanNvbih0ZXN0aW1vbmlhbHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGVmYXVsdDogcmV0dXJuIGFsbCAoc29ydGVkIGJ5IGNyZWF0ZWRBdCBkZXNjKSBmb3IgQWRtaW5cclxuICAgICAgICBjb25zdCB0ZXN0aW1vbmlhbHMgPSBhd2FpdCBUZXN0aW1vbmlhbC5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24odGVzdGltb25pYWxzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHNpbmdsZSB0ZXN0aW1vbmlhbFxyXG5leHBvcnQgY29uc3QgZ2V0VGVzdGltb25pYWxCeUlkID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHRlc3RpbW9uaWFsID0gYXdhaXQgVGVzdGltb25pYWwuZmluZEJ5SWQocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCF0ZXN0aW1vbmlhbCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJUZXN0aW1vbmlhbCBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih0ZXN0aW1vbmlhbCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gVXBkYXRlIHRlc3RpbW9uaWFsXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVUZXN0aW1vbmlhbCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB0ZXN0aW1vbmlhbCA9IGF3YWl0IFRlc3RpbW9uaWFsLmZpbmRCeUlkQW5kVXBkYXRlKFxyXG4gICAgICAgICAgICByZXEucGFyYW1zLmlkLFxyXG4gICAgICAgICAgICByZXEuYm9keSxcclxuICAgICAgICAgICAgeyBuZXc6IHRydWUgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKCF0ZXN0aW1vbmlhbCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJUZXN0aW1vbmlhbCBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih0ZXN0aW1vbmlhbCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSB0ZXN0aW1vbmlhbFxyXG5leHBvcnQgY29uc3QgZGVsZXRlVGVzdGltb25pYWwgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdGVzdGltb25pYWwgPSBhd2FpdCBUZXN0aW1vbmlhbC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIXRlc3RpbW9uaWFsKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlRlc3RpbW9uaWFsIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHsgbWVzc2FnZTogXCJUZXN0aW1vbmlhbCBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGV2ZW50VHlwZVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZXZlbnRUeXBlUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgICBnZXRBbGxFdmVudFR5cGVzLFxyXG4gICAgY3JlYXRlRXZlbnRUeXBlLFxyXG4gICAgdXBkYXRlRXZlbnRUeXBlLFxyXG4gICAgZGVsZXRlRXZlbnRUeXBlXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvZXZlbnRUeXBlQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnLycsIGdldEFsbEV2ZW50VHlwZXMpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZUV2ZW50VHlwZSk7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVFdmVudFR5cGUpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlRXZlbnRUeXBlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcRXZlbnRUeXBlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9FdmVudFR5cGUuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgZXZlbnRUeXBlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnRXZlbnQgdHlwZSBuYW1lIGlzIHJlcXVpcmVkJ10sXHJcbiAgICAgICAgICAgIHVuaXF1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzQWN0aXZlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkV2ZW50VHlwZSB8fCBtb25nb29zZS5tb2RlbCgnRXZlbnRUeXBlJywgZXZlbnRUeXBlU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGV2ZW50VHlwZUNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvZXZlbnRUeXBlQ29udHJvbGxlci5qc1wiO2ltcG9ydCBFdmVudFR5cGUgZnJvbSAnLi4vbW9kZWxzL0V2ZW50VHlwZS5qcyc7XHJcblxyXG4vLyBHZXQgYWxsIGV2ZW50IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxFdmVudFR5cGVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50VHlwZXMgPSBhd2FpdCBFdmVudFR5cGUuZmluZCh7IGlzQWN0aXZlOiB0cnVlIH0pLnNvcnQoeyBuYW1lOiAxIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGV2ZW50VHlwZXMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGUgZXZlbnQgdHlwZVxyXG5leHBvcnQgY29uc3QgY3JlYXRlRXZlbnRUeXBlID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgbGFiZWwgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IG5ldyBFdmVudFR5cGUoe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwgfHwgbmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHNhdmVkRXZlbnRUeXBlID0gYXdhaXQgZXZlbnRUeXBlLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzYXZlZEV2ZW50VHlwZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvci5jb2RlID09PSAxMTAwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnRXZlbnQgdHlwZSBhbHJlYWR5IGV4aXN0cycgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBldmVudCB0eXBlXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVFdmVudFR5cGUgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBuYW1lLCBsYWJlbCwgaXNBY3RpdmUgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRFdmVudFR5cGUgPSBhd2FpdCBFdmVudFR5cGUuZmluZEJ5SWRBbmRVcGRhdGUoXHJcbiAgICAgICAgICAgIHJlcS5wYXJhbXMuaWQsXHJcbiAgICAgICAgICAgIHsgbmFtZSwgbGFiZWwsIGlzQWN0aXZlIH0sXHJcbiAgICAgICAgICAgIHsgbmV3OiB0cnVlLCBydW5WYWxpZGF0b3JzOiB0cnVlIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGlmICghdXBkYXRlZEV2ZW50VHlwZSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJFdmVudCBUeXBlIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHVwZGF0ZWRFdmVudFR5cGUpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIERlbGV0ZSBldmVudCB0eXBlXHJcbmV4cG9ydCBjb25zdCBkZWxldGVFdmVudFR5cGUgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgRXZlbnRUeXBlLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIHJlcy5qc29uKHsgbWVzc2FnZTogJ0V2ZW50IHR5cGUgZGVsZXRlZCcgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbWlkZGxld2FyZVxcXFxlcnJvckhhbmRsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbWlkZGxld2FyZS9lcnJvckhhbmRsZXIuanNcIjsvLyBFcnJvciBoYW5kbGluZyBtaWRkbGV3YXJlXHJcbmV4cG9ydCBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyLCByZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycik7XHJcblxyXG4gIC8vIE1vbmdvb3NlIHZhbGlkYXRpb24gZXJyb3JcclxuICBpZiAoZXJyLm5hbWUgPT09ICdWYWxpZGF0aW9uRXJyb3InKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlcyA9IE9iamVjdC52YWx1ZXMoZXJyLmVycm9ycykubWFwKChlKSA9PiBlLm1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ1ZhbGlkYXRpb24gZXJyb3InLFxyXG4gICAgICBlcnJvcnM6IG1lc3NhZ2VzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBNb25nb29zZSBjYXN0IGVycm9yXHJcbiAgaWYgKGVyci5uYW1lID09PSAnQ2FzdEVycm9yJykge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ0ludmFsaWQgSUQgZm9ybWF0JyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRHVwbGljYXRlIGtleSBlcnJvclxyXG4gIGlmIChlcnIuY29kZSA9PT0gMTEwMDApIHtcclxuICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKGVyci5rZXlWYWx1ZSlbMF07XHJcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xyXG4gICAgICBtZXNzYWdlOiBgJHtrZXl9IGFscmVhZHkgZXhpc3RzYCxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gSldUIGVycm9yc1xyXG4gIGlmIChlcnIubmFtZSA9PT0gJ0pzb25XZWJUb2tlbkVycm9yJykge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ0ludmFsaWQgdG9rZW4nLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyLm5hbWUgPT09ICdUb2tlbkV4cGlyZWRFcnJvcicpIHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7XHJcbiAgICAgIG1lc3NhZ2U6ICdUb2tlbiBleHBpcmVkJyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRGVmYXVsdCBlcnJvclxyXG4gIHJlcy5zdGF0dXMoZXJyLnN0YXR1c0NvZGUgfHwgNTAwKS5qc29uKHtcclxuICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlIHx8ICdTZXJ2ZXIgZXJyb3InLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8gNDA0IGhhbmRsZXJcclxuZXhwb3J0IGNvbnN0IG5vdEZvdW5kSGFuZGxlciA9IChyZXEsIHJlcykgPT4ge1xyXG4gIHJlcy5zdGF0dXMoNDA0KS5qc29uKHtcclxuICAgIG1lc3NhZ2U6IGBSb3V0ZSAke3JlcS5vcmlnaW5hbFVybH0gbm90IGZvdW5kYCxcclxuICB9KTtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFrYyxPQUFPQSxlQUFjO0FBQXZkLElBRU0sY0E4RUM7QUFoRlA7QUFBQTtBQUVBLElBQU0sZUFBZSxJQUFJQSxVQUFTO0FBQUEsTUFDaEM7QUFBQSxRQUNFLE1BQU07QUFBQSxVQUNKLE1BQU07QUFBQSxVQUNOLFVBQVUsQ0FBQyxNQUFNLHlCQUF5QjtBQUFBLFVBQzFDLE1BQU07QUFBQSxVQUNOLFdBQVcsQ0FBQyxHQUFHLG9DQUFvQztBQUFBLFFBQ3JEO0FBQUEsUUFDQSxPQUFPO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixVQUFVLENBQUMsTUFBTSxtQkFBbUI7QUFBQSxVQUNwQyxXQUFXO0FBQUEsVUFDWCxNQUFNO0FBQUEsVUFDTixPQUFPLENBQUMsaURBQWlELDhCQUE4QjtBQUFBLFFBQ3pGO0FBQUEsUUFDQSxPQUFPO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixVQUFVLENBQUMsTUFBTSwwQkFBMEI7QUFBQSxVQUMzQyxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0EsU0FBUztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBLE1BQU07QUFBQSxV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QUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxNQUFNLEtBQUssUUFBUSxrQ0FBVyxZQUFZO0FBQUEsUUFDMUMsT0FBTyxLQUFLLFFBQVEsa0NBQVcsa0JBQWtCO0FBQUEsTUFDbkQ7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUM7QUFBQSxFQUNsQyxTQUFTO0FBQUEsSUFDUCxRQUFRLENBQUMsU0FBUyxXQUFXO0FBQUEsSUFDN0IsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsVUFBVTtBQUFBLE1BQ3ZDLFdBQVcsS0FBSyxRQUFRLGtDQUFXLFVBQVU7QUFBQSxNQUM3QyxZQUFZLEtBQUssUUFBUSxrQ0FBVyxXQUFXO0FBQUEsSUFDakQ7QUFBQSxFQUNGO0FBQ0YsRUFBRTtBQUVGLFFBQVEsSUFBSSw2Q0FBNkMsS0FBSyxJQUFJLElBQUksZUFBZTtBQUNyRixTQUFTLGdCQUF3QjtBQUMvQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUE7QUFBQSxJQUNQLGdCQUFnQixRQUFRO0FBRXRCLGFBQU8sWUFBWSxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVM7QUFDekMsY0FBTSxNQUFNLElBQUksT0FBTztBQUN2QixZQUFJLElBQUksV0FBVyxRQUFRLEtBQUssQ0FBQyxJQUFJLFdBQVcsTUFBTSxLQUFLLENBQUMsSUFBSSxTQUFTLEdBQUcsR0FBRztBQUM3RSxjQUFJLE1BQU07QUFBQSxRQUNaO0FBQ0EsYUFBSztBQUFBLE1BQ1AsQ0FBQztBQUVELFlBQU0sTUFBTSxhQUFhLEVBQUUsZ0JBQWdCLEtBQUssQ0FBQztBQUdqRCxhQUFPLFlBQVksSUFBSSxHQUFHO0FBQUEsSUFDNUI7QUFBQSxFQUNGO0FBQ0Y7IiwKICAibmFtZXMiOiBbIm1vbmdvb3NlIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgImJjcnlwdCIsICJiY3J5cHQiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAidGVzdGltb25pYWxzIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyJdCn0K
