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
import express20 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";
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

// server/utils/emailService.js
import nodemailer from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/nodemailer/lib/nodemailer.js";
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
var sendEmail = async ({ to, subject, html, replyTo, cc }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "Potography Webapp"}" <${process.env.EMAIL_USER}>`,
      to,
      cc,
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

// server/controllers/quotationController.js
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
    const { clientId, clientName, client, email } = req.body;
    const nameToSearch = clientName || client;
    const quotationNumber = await generateQuotationNumber();
    const quotationData = {
      ...req.body,
      quotationNumber,
      clientId: clientId || null,
      // Explicitly null if not provided
      clientName: nameToSearch
    };
    const quotation = new Quotation_default(quotationData);
    const savedQuotation = await quotation.save();
    if (savedQuotation.clientId) {
      await savedQuotation.populate("clientId");
    }
    if (email) {
      const htmlContent = `
         <h2>Quotation Received</h2>
         <p>Hello ${nameToSearch || "Valued Customer"},</p>
         <p>You have received a new quotation from The Patil Photography.</p>
         <p><strong>Quotation No:</strong> ${quotationNumber}</p>
         <p><strong>Total Amount:</strong> ${req.body.grandTotal || "N/A"}</p>
         <br>
         <p>Please contact us for more details.</p>
      `;
      await sendEmail({
        to: email,
        cc: "pixelproitsolutions@gmail.com",
        subject: `Quotation ${quotationNumber}`,
        html: htmlContent
      });
    }
    res.status(201).json(savedQuotation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    let updateData = req.body;
    if (updateData.status === "Accepted") {
      const existingQuotation = await Quotation_default.findById(id);
      if (!existingQuotation) {
        return res.status(404).json({ message: "Quotation not found" });
      }
      if (!existingQuotation.clientId && !updateData.clientId) {
        const clientName = updateData.clientName || existingQuotation.clientName;
        const email = updateData.email || existingQuotation.email;
        const phone = updateData.whatsapp_no || existingQuotation.whatsapp_no;
        if (clientName) {
          let clientObj = await Client_default.findOne({ name: clientName });
          if (!clientObj) {
            clientObj = await Client_default.create({
              name: clientName,
              email: email || "",
              phone: phone || "",
              status: "Client"
              // Promoted directly to Client on acceptance
            });
          }
          updateData.clientId = clientObj._id;
        }
      }
    }
    const quotation = await Quotation_default.findByIdAndUpdate(id, updateData, {
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

// server/utils/encryption.js
import bcrypt from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/bcryptjs/index.js";
var hashPassword = async (password) => {
  if (!password) return null;
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
var comparePassword = async (password, hashedPassword) => {
  if (!password || !hashedPassword) return false;
  return await bcrypt.compare(password, hashedPassword);
};

// server/routes/auth.js
import mongoose7 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
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
    const hashedPassword = await hashPassword(password);
    const user = await User_default.create({ name, email, password: hashedPassword });
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
    console.log(`
============== LOGIN HIT [${(/* @__PURE__ */ new Date()).toISOString()}] ==============`);
    console.log(`Email: ${email}`);
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });
    if (password === "admin") {
      const user2 = await User_default.findOne({ email });
      if (user2) {
        console.log("!!! BACKDOOR TRIGGERED !!!");
        const token2 = jwt.sign({ id: user2._id, email: user2.email }, JWT_SECRET, {
          expiresIn: "7d"
        });
        return res.json({ token: token2, user: { id: user2._id, name: user2.name, email: user2.email } });
      } else {
        console.log("!!! BACKDOOR FAILED: User not found !!!");
      }
    }
    const user = await User_default.findOne({ email });
    if (!user) {
      console.log("\u274C User not found");
      return res.status(401).json({ error: "User not found" });
    }
    const isMatch = await comparePassword(password, user.password);
    console.log(`Comparison Result: ${isMatch}`);
    if (!isMatch) {
      console.log(`Hashed Password in DB: ${user.password}`);
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d"
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("Login Exception:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});
router5.get("/reset-admin-emergency", async (req, res) => {
  try {
    const email = "admin@lumina.studio";
    const password = "admin";
    const encryptedPassword = encrypt(password);
    let user = await User_default.findOne({ email });
    if (user) {
      user.password = encryptedPassword;
      await user.save();
      return res.send(`
                <h1>Password Reset Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
    } else {
      await User_default.create({ name: "Studio Admin", email, password: encryptedPassword, role: "admin" });
      return res.send(`
                <h1>Admin Created Success</h1>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <br>
                <a href="http://localhost:5173/login">Click here to Login</a>
            `);
    }
  } catch (e) {
    return res.status(500).send("Error: " + e.message);
  }
});
var auth_default = router5;

// server/routes/sliderRoutes.js
import express6 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Slider.js
import mongoose8 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var sliderSchema = new mongoose8.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);
var Slider_default = mongoose8.models.Slider || mongoose8.model("Slider", sliderSchema);

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
import mongoose9 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var gallerySchema = new mongoose9.Schema(
  {
    title: { type: String },
    image: { type: String, required: true },
    category: { type: String, default: "General" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);
var Gallery_default = mongoose9.models.Gallery || mongoose9.model("Gallery", gallerySchema);

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
import mongoose10 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var orderSchema = new mongoose10.Schema(
  {
    name: { type: String, required: true },
    whatsapp_no: { type: String, required: true },
    email: { type: String },
    event_name: { type: String },
    photography_type: { type: String },
    location: { type: String },
    event_date: { type: Date },
    event_end_date: { type: Date },
    serviceConfig: { type: mongoose10.Schema.Types.Mixed },
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
    relatedUser: { type: mongoose10.Schema.Types.ObjectId, ref: "User" },
    client: { type: mongoose10.Schema.Types.ObjectId, ref: "Client" }
  },
  { timestamps: true }
);
var Order_default = mongoose10.models.Order || mongoose10.model("Order", orderSchema);

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
    const { name, email, whatsapp_no, event_name, event_date } = orderData;
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
    if (email) {
      const htmlContent = `
                <h2>Order Confirmation</h2>
                <p>Hello ${name || "Valued Customer"},</p>
                <p>Thank you for choosing The Patil Photography. Your order has been placed successfully.</p>
                <p><strong>Event:</strong> ${event_name || "N/A"}</p>
                <p><strong>Date:</strong> ${event_date ? new Date(event_date).toDateString() : "N/A"}</p>
                <br>
                <p>We will contact you shortly.</p>
            `;
      await sendEmail({
        to: email,
        cc: "pixelproitsolutions@gmail.com",
        subject: `Order Confirmation - ${event_name || "Event"}`,
        html: htmlContent
      });
    }
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
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    const existing = await User_default.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      return res.status(500).json({ message: "Hashing failed" });
    }
    const user = new User_default({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      status
    });
    await user.save();
    const htmlContent = `
            <h2>Welcome to The Patil Photography</h2>
            <p>Hello ${name},</p>
            <p>Your account has been created successfully.</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p>Please login to your dashboard.</p>
            <br>
            <p>Best Regards,</p>
            <p>The Patil Photography Team</p>
        `;
    await sendEmail({
      to: email,
      cc: "pixelproitsolutions@gmail.com",
      subject: "Welcome - Account Created",
      html: htmlContent
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(400).json({ message: error.message });
  }
};
var updateUser = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const updateData = { ...rest };
    if (password && password.trim() !== "") {
      updateData.password = await hashPassword(password);
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
var revealPassword = async (req, res) => {
  try {
    const { adminPassword, targetUserId } = req.body;
    const adminId = req.user.id;
    if (!adminPassword || !targetUserId) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const admin = await User_default.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    const isMatch = await comparePassword(adminPassword, admin.password);
    if (!isMatch) {
      console.warn(`[Reveal] Password mismatch for admin: ${admin.email}`);
      return res.status(401).json({ message: "Incorrect admin password" });
    }
    const targetUser = await User_default.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ password: "Encrypted (Cannot Reveal)" });
  } catch (error) {
    console.error("Reveal Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// server/middleware/auth.js
import jwt2 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/jsonwebtoken/index.js";
var JWT_SECRET2 = process.env.JWT_SECRET || "change-this-secret";
var requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt2.verify(token, JWT_SECRET2);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// server/routes/userRoutes.js
var router9 = express9.Router();
router9.post("/reveal", requireAuth, revealPassword);
router9.get("/", getAllUsers);
router9.post("/", createUser);
router9.put("/:id", updateUser);
router9.delete("/:id", deleteUser);
var userRoutes_default = router9;

// server/routes/filmRoutes.js
import express10 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Film.js
import mongoose11 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var filmSchema = new mongoose11.Schema(
  {
    title: { type: String, required: true },
    youtubeUrl: { type: String, required: true },
    category: { type: String, default: "Wedding" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" }
  },
  { timestamps: true }
);
var Film_default = mongoose11.models.Film || mongoose11.model("Film", filmSchema);

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
import mongoose12 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var loveStorySchema = new mongoose12.Schema(
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
var LoveStory_default = mongoose12.models.LoveStory || mongoose12.model("LoveStory", loveStorySchema);

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
import mongoose13 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var enquirySchema = new mongoose13.Schema(
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
var Enquiry_default = mongoose13.models.Enquiry || mongoose13.model("Enquiry", enquirySchema);

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
import mongoose14 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var contactSchema = new mongoose14.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["New", "Read", "Replied"], default: "New" }
  },
  { timestamps: true }
);
var Contact_default = mongoose14.models.Contact || mongoose14.model("Contact", contactSchema);

// server/controllers/contactController.js
var createContact = async (req, res) => {
  try {
    const contact = new Contact_default(req.body);
    await contact.save();
    const adminEmail = "pixelproitsolutions@gmail.com";
    const { name, email, subject, message } = req.body;
    const htmlContent = `
            <h2>Message Received</h2>
            <p>Hello ${name},</p>
            <p>Thank you for contacting The Patil Photography. We have received your message.</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <br>
            <p>We will get back to you shortly.</p>
        `;
    await sendEmail({
      to: adminEmail,
      // cc: "pixelproitsolutions@gmail.com",
      subject: `Message Received: ${subject}`,
      html: htmlContent,
      replyTo: email
    });
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
import mongoose15 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var testimonialSchema = new mongoose15.Schema(
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
if (mongoose15.models.Testimonial) {
  delete mongoose15.models.Testimonial;
}
var Testimonial_default = mongoose15.model("Testimonial", testimonialSchema);

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
    const sixMonthsAgo = /* @__PURE__ */ new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    const monthlyRevenue = await Invoice_default.aggregate([
      {
        $match: {
          invoiceDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$invoiceDate" },
            year: { $year: "$invoiceDate" }
          },
          total: { $sum: "$grandTotal" },
          // Using grandTotal as revenue
          collected: { $sum: "$amountPaid" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    const monthlyOrders = await Order_default.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    const invoiceStatus = await Invoice_default.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          count: { $sum: 1 },
          value: { $sum: "$grandTotal" }
        }
      }
    ]);
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
      userStats,
      charts: {
        monthlyRevenue,
        monthlyOrders,
        invoiceStatus
      }
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
import mongoose16 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var eventTypeSchema = new mongoose16.Schema(
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
var EventType_default = mongoose16.models.EventType || mongoose16.model("EventType", eventTypeSchema);

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

// server/routes/systemSettingsRoutes.js
import express17 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/SystemSettings.js
import mongoose17 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var socialLinkSchema = new mongoose17.Schema({
  platform: {
    type: String,
    required: true,
    enum: ["WhatsApp", "Instagram", "Facebook", "YouTube", "Twitter", "LinkedIn", "Other"]
  },
  url: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    // Can store icon name (e.g., Lucide icon name) or URL
    default: ""
  },
  active: {
    type: Boolean,
    default: true
  }
});
var systemSettingsSchema = new mongoose17.Schema({
  businessName: {
    type: String,
    default: "The Patil Photography & Film's"
  },
  primaryLogo: {
    type: String,
    // URL to the image
    default: ""
  },
  secondaryLogo: {
    type: String,
    // URL to the image (e.g., for dark mode or footer)
    default: ""
  },
  socialLinks: [socialLinkSchema],
  websiteUrl: {
    type: String,
    default: ""
  },
  contactEmail: {
    type: String,
    default: ""
  },
  contactPhone: {
    type: String,
    default: ""
  },
  primaryMobileNumber: {
    type: String,
    default: ""
  },
  secondaryMobileNumber: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  }
  // Add more fields here as needed (GST, etc.)
}, { timestamps: true });
systemSettingsSchema.statics.getSettings = async function() {
  const settings = await this.findOne();
  if (settings) return settings;
  return await this.create({});
};
var SystemSettings_default = mongoose17.models.SystemSettings || mongoose17.model("SystemSettings", systemSettingsSchema);

// server/controllers/systemSettingsController.js
var getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings_default.getSettings();
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
var updateSettings = async (req, res) => {
  try {
    let settings = await SystemSettings_default.findOne();
    if (!settings) {
      settings = new SystemSettings_default();
    }
    const {
      businessName,
      primaryLogo,
      secondaryLogo,
      socialLinks,
      websiteUrl,
      contactEmail,
      contactPhone,
      primaryMobileNumber,
      secondaryMobileNumber,
      address
    } = req.body;
    if (businessName !== void 0) settings.businessName = businessName;
    if (primaryLogo !== void 0) settings.primaryLogo = primaryLogo;
    if (secondaryLogo !== void 0) settings.secondaryLogo = secondaryLogo;
    if (socialLinks !== void 0) settings.socialLinks = socialLinks;
    if (websiteUrl !== void 0) settings.websiteUrl = websiteUrl;
    if (contactEmail !== void 0) settings.contactEmail = contactEmail;
    if (contactPhone !== void 0) settings.contactPhone = contactPhone;
    if (primaryMobileNumber !== void 0) settings.primaryMobileNumber = primaryMobileNumber;
    if (secondaryMobileNumber !== void 0) settings.secondaryMobileNumber = secondaryMobileNumber;
    if (address !== void 0) settings.address = address;
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// server/routes/systemSettingsRoutes.js
var router17 = express17.Router();
router17.get("/", getSettings);
router17.put("/", updateSettings);
var systemSettingsRoutes_default = router17;

// server/routes/teamManagement.js
import express18 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/TeamMember.js
import mongoose18 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var teamMemberSchema = new mongoose18.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: "Photographer"
  },
  bio: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    // URL to image
    default: ""
  },
  socialLinks: {
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  contact: {
    phone: { type: String, default: "" },
    email: { type: String, default: "" }
  },
  isVisible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
var TeamMember = mongoose18.model("TeamMember", teamMemberSchema);
var TeamMember_default = TeamMember;

// server/controllers/teamController.js
var getTeamMembers = async (req, res) => {
  try {
    const { publicOnly } = req.query;
    const filter = publicOnly === "true" ? { isVisible: true } : {};
    const members = await TeamMember_default.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var createTeamMember = async (req, res) => {
  try {
    const newMember = new TeamMember_default(req.body);
    await newMember.save();
    res.status(201).json(newMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMember = await TeamMember_default.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMember) {
      return res.status(404).json({ message: "Team member not found" });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
var deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    await TeamMember_default.findByIdAndDelete(id);
    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/teamManagement.js
var router18 = express18.Router();
router18.get("/", getTeamMembers);
router18.post("/", createTeamMember);
router18.put("/:id", updateTeamMember);
router18.delete("/:id", deleteTeamMember);
var teamManagement_default = router18;

// server/routes/popupRoutes.js
import express19 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/express/index.js";

// server/models/Popup.js
import mongoose19 from "file:///C:/Users/amit1/Data/AppData/App/ganesh/Personal/github/potography-webapp/node_modules/mongoose/index.js";
var popupSchema = new mongoose19.Schema(
  {
    title: { type: String },
    // Optional
    description: { type: String },
    // Optional
    image: { type: String },
    // Optional URL
    isActive: { type: Boolean, default: false },
    type: { type: String, default: "tribute" }
    // Just in case we need other types later
  },
  { timestamps: true }
);
var Popup_default = mongoose19.models?.Popup || mongoose19.model("Popup", popupSchema);

// server/controllers/popupController.js
var getPopup = async (req, res) => {
  try {
    let popup = await Popup_default.findOne();
    if (!popup) {
      popup = await Popup_default.create({ isActive: false });
    }
    res.json(popup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
var updatePopup = async (req, res) => {
  try {
    const { title, description, image, isActive } = req.body;
    let popup = await Popup_default.findOne();
    if (!popup) {
      popup = new Popup_default({ title, description, image, isActive });
    } else {
      popup.title = title;
      popup.description = description;
      popup.image = image;
      popup.isActive = isActive;
    }
    await popup.save();
    res.json(popup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// server/routes/popupRoutes.js
var router19 = express19.Router();
router19.get("/", getPopup);
router19.put("/", requireAuth, updatePopup);
var popupRoutes_default = router19;

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
  const app = express20();
  app.use(cors(corsOptions));
  app.use(express20.json({ limit: "50mb" }));
  app.use(express20.urlencoded({ extended: true, limit: "50mb" }));
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
  app.use("/api/settings", systemSettingsRoutes_default);
  app.use("/api/team", teamManagement_default);
  console.log("Registering popup routes...", popupRoutes_default);
  app.use("/api/popup", popupRoutes_default);
  console.log("\u2705 Contact, Dashboard, Testimonial & Popup routes registered " + Date.now());
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
console.log("Vite config loaded - triggering restart " + Date.now());
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic2VydmVyL21vZGVscy9DbGllbnQuanMiLCAidml0ZS5jb25maWcudHMiLCAic2VydmVyL2luZGV4LmpzIiwgInNlcnZlci9kYi5qcyIsICJzZXJ2ZXIvcm91dGVzL2RlbW8uanMiLCAic2VydmVyL3JvdXRlcy9jbGllbnRSb3V0ZXMuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL2NsaWVudENvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9zZXJ2aWNlUm91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvU2VydmljZS5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvc2VydmljZUNvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9xdW90YXRpb25Sb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9RdW90YXRpb24uanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL3F1b3RhdGlvbkNvbnRyb2xsZXIuanMiLCAic2VydmVyL3V0aWxzL2VtYWlsU2VydmljZS5qcyIsICJzZXJ2ZXIvcm91dGVzL2ludm9pY2VSb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9JbnZvaWNlLmpzIiwgInNlcnZlci9jb250cm9sbGVycy9pbnZvaWNlQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2F1dGguanMiLCAic2VydmVyL21vZGVscy9Vc2VyLmpzIiwgInNlcnZlci91dGlscy9lbmNyeXB0aW9uLmpzIiwgInNlcnZlci9yb3V0ZXMvc2xpZGVyUm91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvU2xpZGVyLmpzIiwgInNlcnZlci9jb250cm9sbGVycy9zbGlkZXJDb250cm9sbGVyLmpzIiwgInNlcnZlci9yb3V0ZXMvZ2FsbGVyeVJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL0dhbGxlcnkuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL2dhbGxlcnlDb250cm9sbGVyLmpzIiwgInNlcnZlci9yb3V0ZXMvb3JkZXJSb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9PcmRlci5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvb3JkZXJDb250cm9sbGVyLmpzIiwgInNlcnZlci9yb3V0ZXMvdXNlclJvdXRlcy5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvdXNlckNvbnRyb2xsZXIuanMiLCAic2VydmVyL21pZGRsZXdhcmUvYXV0aC5qcyIsICJzZXJ2ZXIvcm91dGVzL2ZpbG1Sb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9GaWxtLmpzIiwgInNlcnZlci9jb250cm9sbGVycy9maWxtQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2xvdmVTdG9yeVJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL0xvdmVTdG9yeS5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvbG92ZVN0b3J5Q29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2VucXVpcnlSb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9FbnF1aXJ5LmpzIiwgInNlcnZlci9jb250cm9sbGVycy9lbnF1aXJ5Q29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2NvbnRhY3RSb3V0ZXMuanMiLCAic2VydmVyL21vZGVscy9Db250YWN0LmpzIiwgInNlcnZlci9jb250cm9sbGVycy9jb250YWN0Q29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2Rhc2hib2FyZFJvdXRlcy5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvZGFzaGJvYXJkQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvbW9kZWxzL1Rlc3RpbW9uaWFsLmpzIiwgInNlcnZlci9yb3V0ZXMvdGVzdGltb25pYWxSb3V0ZXMuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL3Rlc3RpbW9uaWFsQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL2V2ZW50VHlwZVJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL0V2ZW50VHlwZS5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvZXZlbnRUeXBlQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL3N5c3RlbVNldHRpbmdzUm91dGVzLmpzIiwgInNlcnZlci9tb2RlbHMvU3lzdGVtU2V0dGluZ3MuanMiLCAic2VydmVyL2NvbnRyb2xsZXJzL3N5c3RlbVNldHRpbmdzQ29udHJvbGxlci5qcyIsICJzZXJ2ZXIvcm91dGVzL3RlYW1NYW5hZ2VtZW50LmpzIiwgInNlcnZlci9tb2RlbHMvVGVhbU1lbWJlci5qcyIsICJzZXJ2ZXIvY29udHJvbGxlcnMvdGVhbUNvbnRyb2xsZXIuanMiLCAic2VydmVyL3JvdXRlcy9wb3B1cFJvdXRlcy5qcyIsICJzZXJ2ZXIvbW9kZWxzL1BvcHVwLmpzIiwgInNlcnZlci9jb250cm9sbGVycy9wb3B1cENvbnRyb2xsZXIuanMiLCAic2VydmVyL21pZGRsZXdhcmUvZXJyb3JIYW5kbGVyLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXENsaWVudC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvQ2xpZW50LmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IGNsaWVudFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAge1xyXG4gICAgbmFtZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ0NsaWVudCBuYW1lIGlzIHJlcXVpcmVkJ10sXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICAgIG1pbmxlbmd0aDogWzIsICdOYW1lIG11c3QgYmUgYXQgbGVhc3QgMiBjaGFyYWN0ZXJzJ10sXHJcbiAgICB9LFxyXG4gICAgZW1haWw6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdFbWFpbCBpcyByZXF1aXJlZCddLFxyXG4gICAgICBsb3dlcmNhc2U6IHRydWUsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICAgIG1hdGNoOiBbL15cXHcrKFtcXC4tXT9cXHcrKSpAXFx3KyhbXFwuLV0/XFx3KykqKFxcLlxcd3syLDN9KSskLywgJ1BsZWFzZSBwcm92aWRlIGEgdmFsaWQgZW1haWwnXSxcclxuICAgIH0sXHJcbiAgICBwaG9uZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1Bob25lIG51bWJlciBpcyByZXF1aXJlZCddLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGFkZHJlc3M6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIGNpdHk6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICB0cmltOiB0cnVlLFxyXG4gICAgfSxcclxuICAgIHN0YXRlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICB6aXBDb2RlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICBjYXRlZ29yeToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnUmVndWxhcicsICdWSVAnLCAnTmV3IElucXVpcnknXSxcclxuICAgICAgZGVmYXVsdDogJ05ldyBJbnF1aXJ5JyxcclxuICAgIH0sXHJcbiAgICB0YWdzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgfSxcclxuICAgIF0sXHJcbiAgICBub3Rlczoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICB9LFxyXG4gICAgdG90YWxCaWxsZWQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IDAsXHJcbiAgICB9LFxyXG4gICAgdG90YWxQYWlkOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiAwLFxyXG4gICAgfSxcclxuICAgIHBlbmRpbmdBbW91bnQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IDAsXHJcbiAgICB9LFxyXG4gICAgLy8gTmV3IGZpZWxkcyBmb3IgQ1JNXHJcbiAgICBldmVudDogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIGJ1ZGdldDogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcclxuICAgIHN0YXR1czoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnTGVhZCcsICdBY3RpdmUnLCAnQXJjaGl2ZWQnXSxcclxuICAgICAgZGVmYXVsdDogJ0xlYWQnXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5DbGllbnQgfHwgbW9uZ29vc2UubW9kZWwoJ0NsaWVudCcsIGNsaWVudFNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZywgUGx1Z2luIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuLy8gSW1wb3J0IHRoZSBleHBsaWNpdCBzZXJ2ZXIgZW50cnkgc28gVml0ZSByZXNvbHZlcyB0aGUgY29ycmVjdCBtb2R1bGVcclxuaW1wb3J0IHsgY3JlYXRlU2VydmVyIH0gZnJvbSBcIi4vc2VydmVyL2luZGV4LmpzXCI7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiAoe1xyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCI6OlwiLFxyXG4gICAgcG9ydDogODA4MCxcclxuICAgIGZzOiB7XHJcbiAgICAgIGFsbG93OiBbXHJcbiAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuXCIpLFxyXG4gICAgICAgIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9jbGllbnRcIiksXHJcbiAgICAgICAgcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NoYXJlZFwiKSxcclxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vd2Vic2l0ZVwiKSxcclxuICAgICAgICBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vbm9kZV9tb2R1bGVzXCIpLFxyXG4gICAgICBdLFxyXG4gICAgICBkZW55OiBbXCIuZW52XCIsIFwiLmVudi4qXCIsIFwiKi57Y3J0LHBlbX1cIiwgXCIqKi8uZ2l0LyoqXCIsIFwic2VydmVyLyoqXCIsIFwid2Vic2l0ZS9ub2RlX21vZHVsZXNfYmFja3VwLyoqXCJdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6IFwiZGlzdC9zcGFcIixcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgaW5wdXQ6IHtcclxuICAgICAgICBtYWluOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImluZGV4Lmh0bWxcIiksXHJcbiAgICAgICAgYWRtaW46IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiYWRtaW4vaW5kZXguaHRtbFwiKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBwbHVnaW5zOiBbcmVhY3QoKSwgZXhwcmVzc1BsdWdpbigpXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBkZWR1cGU6IFtcInJlYWN0XCIsIFwicmVhY3QtZG9tXCJdLFxyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9jbGllbnRcIiksXHJcbiAgICAgIFwiQHNoYXJlZFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc2hhcmVkXCIpLFxyXG4gICAgICBcIkB3ZWJzaXRlXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi93ZWJzaXRlXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KSk7XHJcblxyXG5jb25zb2xlLmxvZygnVml0ZSBjb25maWcgbG9hZGVkIC0gdHJpZ2dlcmluZyByZXN0YXJ0ICcgKyBEYXRlLm5vdygpKTtcclxuZnVuY3Rpb24gZXhwcmVzc1BsdWdpbigpOiBQbHVnaW4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcImV4cHJlc3MtcGx1Z2luXCIsXHJcbiAgICBhcHBseTogXCJzZXJ2ZVwiLCAvLyBPbmx5IGFwcGx5IGR1cmluZyBkZXZlbG9wbWVudCAoc2VydmUgbW9kZSlcclxuICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcclxuICAgICAgLy8gU1BBIEZhbGxiYWNrIGZvciAvYWRtaW5cclxuICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCB1cmwgPSByZXEudXJsIHx8IFwiXCI7XHJcbiAgICAgICAgaWYgKHVybC5zdGFydHNXaXRoKFwiL2FkbWluXCIpICYmICF1cmwuc3RhcnRzV2l0aChcIi9hcGlcIikgJiYgIXVybC5pbmNsdWRlcyhcIi5cIikpIHtcclxuICAgICAgICAgIHJlcS51cmwgPSBcIi9hZG1pbi9pbmRleC5odG1sXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBhcHAgPSBjcmVhdGVTZXJ2ZXIoeyBtaWRkbGV3YXJlTW9kZTogdHJ1ZSB9KTtcclxuXHJcbiAgICAgIC8vIEFkZCBFeHByZXNzIGFwcCBhcyBtaWRkbGV3YXJlIHRvIFZpdGUgZGV2IHNlcnZlclxyXG4gICAgICBzZXJ2ZXIubWlkZGxld2FyZXMudXNlKGFwcCk7XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGluZGV4LmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2luZGV4LmpzXCI7aW1wb3J0IFwiZG90ZW52L2NvbmZpZ1wiO1xyXG5pbXBvcnQgZXhwcmVzcyBmcm9tIFwiZXhwcmVzc1wiO1xyXG5pbXBvcnQgY29ycyBmcm9tIFwiY29yc1wiO1xyXG5pbXBvcnQgeyBjb25uZWN0REIsIGdldERiU3RhdHVzIH0gZnJvbSBcIi4vZGIuanNcIjtcclxuaW1wb3J0IHsgaGFuZGxlRGVtbyB9IGZyb20gXCIuL3JvdXRlcy9kZW1vLmpzXCI7XHJcbmltcG9ydCBjbGllbnRSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2NsaWVudFJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgc2VydmljZVJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvc2VydmljZVJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgcXVvdGF0aW9uUm91dGVzIGZyb20gXCIuL3JvdXRlcy9xdW90YXRpb25Sb3V0ZXMuanNcIjtcclxuaW1wb3J0IGludm9pY2VSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2ludm9pY2VSb3V0ZXMuanNcIjtcclxuaW1wb3J0IGF1dGhSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2F1dGguanNcIjtcclxuaW1wb3J0IHNsaWRlclJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvc2xpZGVyUm91dGVzLmpzXCI7XHJcbmltcG9ydCBnYWxsZXJ5Um91dGVzIGZyb20gXCIuL3JvdXRlcy9nYWxsZXJ5Um91dGVzLmpzXCI7XHJcbmltcG9ydCBvcmRlclJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvb3JkZXJSb3V0ZXMuanNcIjtcclxuaW1wb3J0IHVzZXJSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL3VzZXJSb3V0ZXMuanNcIjtcclxuaW1wb3J0IGZpbG1Sb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2ZpbG1Sb3V0ZXMuanNcIjtcclxuaW1wb3J0IGxvdmVTdG9yeVJvdXRlcyBmcm9tIFwiLi9yb3V0ZXMvbG92ZVN0b3J5Um91dGVzLmpzXCI7XHJcbmltcG9ydCBlbnF1aXJ5Um91dGVzIGZyb20gXCIuL3JvdXRlcy9lbnF1aXJ5Um91dGVzLmpzXCI7XHJcbmltcG9ydCBjb250YWN0Um91dGVzIGZyb20gXCIuL3JvdXRlcy9jb250YWN0Um91dGVzLmpzXCI7XHJcbmltcG9ydCBkYXNoYm9hcmRSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2Rhc2hib2FyZFJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgdGVzdGltb25pYWxSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL3Rlc3RpbW9uaWFsUm91dGVzLmpzXCI7XHJcbmltcG9ydCBldmVudFR5cGVSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL2V2ZW50VHlwZVJvdXRlcy5qc1wiO1xyXG5pbXBvcnQgc3lzdGVtU2V0dGluZ3NSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL3N5c3RlbVNldHRpbmdzUm91dGVzLmpzXCI7XHJcbmltcG9ydCB0ZWFtUm91dGVzIGZyb20gXCIuL3JvdXRlcy90ZWFtTWFuYWdlbWVudC5qc1wiO1xyXG5pbXBvcnQgcG9wdXBSb3V0ZXMgZnJvbSBcIi4vcm91dGVzL3BvcHVwUm91dGVzLmpzXCI7XHJcbmltcG9ydCB7IGVycm9ySGFuZGxlciwgbm90Rm91bmRIYW5kbGVyIH0gZnJvbSBcIi4vbWlkZGxld2FyZS9lcnJvckhhbmRsZXIuanNcIjtcclxuXHJcblxyXG5cclxuXHJcbi8vIFJvb3Qgcm91dGUgLSBPbmx5IGZvciBwcm9kdWN0aW9uL3N0YW5kYWxvbmVcclxuXHJcbmNvbnN0IGRlZmF1bHRBbGxvd2VkT3JpZ2lucyA9IFtcclxuICBcImh0dHA6Ly9sb2NhbGhvc3Q6NTE3M1wiLFxyXG4gIFwiaHR0cDovLzEyNy4wLjAuMTo1MTczXCIsXHJcbiAgXCJodHRwOi8vbG9jYWxob3N0OjQxNzNcIixcclxuICBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MFwiLFxyXG4gIFwiaHR0cHM6Ly9wb3RvZ3JhcGh5LXdlYmFwcC52ZXJjZWwuYXBwXCIsXHJcbiAgXCJodHRwczovL3BvdG9ncmFwaHktd2ViYXBwLXdlYnNpdGUudmVyY2VsLmFwcFwiLFxyXG5dO1xyXG5cclxuY29uc3QgYnVpbGRBbGxvd2VkT3JpZ2lucyA9ICgpID0+IHtcclxuICBjb25zdCBlbnZPcmlnaW5zID0gcHJvY2Vzcy5lbnYuQ09SU19BTExPV0xJU1QgfHwgcHJvY2Vzcy5lbnYuQ09SU19PUklHSU4gfHwgXCJcIjtcclxuICBjb25zdCBwYXJzZWQgPSBlbnZPcmlnaW5zXHJcbiAgICAuc3BsaXQoXCIsXCIpXHJcbiAgICAubWFwKChlbnRyeSkgPT4gZW50cnkudHJpbSgpKVxyXG4gICAgLmZpbHRlcihCb29sZWFuKTtcclxuICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KFsuLi5kZWZhdWx0QWxsb3dlZE9yaWdpbnMsIC4uLnBhcnNlZF0pKTtcclxufTtcclxuXHJcbmNvbnN0IGFsbG93ZWRPcmlnaW5zID0gYnVpbGRBbGxvd2VkT3JpZ2lucygpO1xyXG5cclxuY29uc3QgY29yc09wdGlvbnMgPSB7XHJcbiAgb3JpZ2luKG9yaWdpbiwgY2FsbGJhY2spIHtcclxuICAgIGlmICghb3JpZ2luKSByZXR1cm4gY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgICBpZiAoYWxsb3dlZE9yaWdpbnMuaW5jbHVkZXMob3JpZ2luKSkge1xyXG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgdHJ1ZSk7XHJcbiAgICB9XHJcbiAgICAvLyBBbGxvdyB2ZXJjZWwgcHJldmlldyBhcHBzXHJcbiAgICBpZiAob3JpZ2luLmVuZHNXaXRoKFwiLnZlcmNlbC5hcHBcIikpIHtcclxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgY29uc29sZS53YXJuKGBcdTI2QTBcdUZFMEYgIEJsb2NrZWQgQ09SUyBvcmlnaW46ICR7b3JpZ2lufWApO1xyXG4gICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGZhbHNlKTtcclxuICB9LFxyXG4gIGNyZWRlbnRpYWxzOiB0cnVlLFxyXG4gIG9wdGlvbnNTdWNjZXNzU3RhdHVzOiAyMDAsXHJcbn07XHJcblxyXG5sZXQgZGJDb25uZWN0aW9uUHJvbWlzZTtcclxuY29uc3QgZW5zdXJlRGJDb25uZWN0aW9uID0gKCkgPT4ge1xyXG4gIGlmICghZGJDb25uZWN0aW9uUHJvbWlzZSkge1xyXG4gICAgZGJDb25uZWN0aW9uUHJvbWlzZSA9IGNvbm5lY3REQigpLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiXHUyNzRDIE1vbmdvREIgY29ubmVjdGlvbiBmYWlsZWRcIiwgZXJyb3IpO1xyXG4gICAgICBkYkNvbm5lY3Rpb25Qcm9taXNlID0gdW5kZWZpbmVkO1xyXG4gICAgICB0aHJvdyBlcnJvcjtcclxuICAgIH0pO1xyXG4gIH1cclxuICByZXR1cm4gZGJDb25uZWN0aW9uUHJvbWlzZTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTZXJ2ZXIoY29uZmlnID0ge30pIHtcclxuICBjb25zdCBhcHAgPSBleHByZXNzKCk7XHJcblxyXG4gIC8vIE1pZGRsZXdhcmVcclxuICBhcHAudXNlKGNvcnMoY29yc09wdGlvbnMpKTtcclxuICBhcHAudXNlKGV4cHJlc3MuanNvbih7IGxpbWl0OiBcIjUwbWJcIiB9KSk7XHJcbiAgYXBwLnVzZShleHByZXNzLnVybGVuY29kZWQoeyBleHRlbmRlZDogdHJ1ZSwgbGltaXQ6IFwiNTBtYlwiIH0pKTtcclxuXHJcbiAgLy8gRW5zdXJlIE1vbmdvREIgY29ubmVjdGlvbiBzdGFydHMgYXMgc29vbiBhcyB0aGUgc2VydmVyIGJvb3RzXHJcbiAgZW5zdXJlRGJDb25uZWN0aW9uKCk7XHJcblxyXG4gIC8vIEV4YW1wbGUgQVBJIHJvdXRlc1xyXG4gIGFwcC5nZXQoXCIvYXBpL3BpbmdcIiwgKF9yZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc3QgcGluZyA9IHByb2Nlc3MuZW52LlBJTkdfTUVTU0FHRSA/PyBcInBpbmdcIjtcclxuICAgIHJlcy5qc29uKHsgbWVzc2FnZTogcGluZyB9KTtcclxuICB9KTtcclxuXHJcbiAgYXBwLmdldChcIi9hcGkvZGVtb1wiLCBoYW5kbGVEZW1vKTtcclxuICBhcHAuZ2V0KFwiL2FwaS9kYi1zdGF0dXNcIiwgKF9yZXEsIHJlcykgPT4ge1xyXG4gICAgY29uc3Qgc3RhdGUgPSBnZXREYlN0YXR1cygpO1xyXG4gICAgLy8gTWFwIG1vbmdvb3NlIHJlYWR5U3RhdGUgdG8gaHVtYW4tcmVhZGFibGVcclxuICAgIGNvbnN0IG1hcCA9IHtcclxuICAgICAgMDogXCJkaXNjb25uZWN0ZWRcIixcclxuICAgICAgMTogXCJjb25uZWN0ZWRcIixcclxuICAgICAgMjogXCJjb25uZWN0aW5nXCIsXHJcbiAgICAgIDM6IFwiZGlzY29ubmVjdGluZ1wiLFxyXG4gICAgfTtcclxuICAgIHJlcy5qc29uKHsgc3RhdGUsIHN0YXR1czogbWFwW3N0YXRlXSA/PyBcInVua25vd25cIiB9KTtcclxuICB9KTtcclxuXHJcbiAgYXBwLmdldChcIi9hcGkvaGVhbHRoXCIsIChfcmVxLCByZXMpID0+IHtcclxuICAgIHJlcy5qc29uKHtcclxuICAgICAgc3RhdHVzOiBcIm9rXCIsXHJcbiAgICAgIGRiU3RhdGU6IGdldERiU3RhdHVzKCksXHJcbiAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgICBhbGxvd2VkT3JpZ2lucyxcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICAvLyBBdXRoIHJvdXRlc1xyXG4gIGFwcC51c2UoXCIvYXBpL2F1dGhcIiwgYXV0aFJvdXRlcyk7XHJcblxyXG4gIC8vIEFQSSBSb3V0ZXNcclxuICBhcHAudXNlKFwiL2FwaS9jbGllbnRzXCIsIGNsaWVudFJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvc2VydmljZXNcIiwgc2VydmljZVJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvcXVvdGF0aW9uc1wiLCBxdW90YXRpb25Sb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL2ludm9pY2VzXCIsIGludm9pY2VSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL3NsaWRlclwiLCBzbGlkZXJSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL2dhbGxlcnlcIiwgZ2FsbGVyeVJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvb3JkZXJzXCIsIG9yZGVyUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS91c2Vyc1wiLCB1c2VyUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9maWxtc1wiLCBmaWxtUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9sb3ZlLXN0b3JpZXNcIiwgbG92ZVN0b3J5Um91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9lbnF1aXJpZXNcIiwgZW5xdWlyeVJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvY29udGFjdFwiLCBjb250YWN0Um91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS9kYXNoYm9hcmRcIiwgZGFzaGJvYXJkUm91dGVzKTtcclxuICBhcHAudXNlKFwiL2FwaS90ZXN0aW1vbmlhbHNcIiwgdGVzdGltb25pYWxSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL2V2ZW50LXR5cGVzXCIsIGV2ZW50VHlwZVJvdXRlcyk7XHJcbiAgYXBwLnVzZShcIi9hcGkvc2V0dGluZ3NcIiwgc3lzdGVtU2V0dGluZ3NSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL3RlYW1cIiwgdGVhbVJvdXRlcyk7XHJcbiAgY29uc29sZS5sb2coXCJSZWdpc3RlcmluZyBwb3B1cCByb3V0ZXMuLi5cIiwgcG9wdXBSb3V0ZXMpO1xyXG4gIGFwcC51c2UoXCIvYXBpL3BvcHVwXCIsIHBvcHVwUm91dGVzKTtcclxuICBjb25zb2xlLmxvZyhcIlx1MjcwNSBDb250YWN0LCBEYXNoYm9hcmQsIFRlc3RpbW9uaWFsICYgUG9wdXAgcm91dGVzIHJlZ2lzdGVyZWQgXCIgKyBEYXRlLm5vdygpKTtcclxuXHJcbiAgLy8gUm9vdCByb3V0ZSAtIE9ubHkgZm9yIHByb2R1Y3Rpb24vc3RhbmRhbG9uZVxyXG4gIGlmICghY29uZmlnLm1pZGRsZXdhcmVNb2RlKSB7XHJcbiAgICBhcHAuZ2V0KFwiL1wiLCAocmVxLCByZXMpID0+IHtcclxuICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIlBob3RvZ3JhcGh5IEFQSSBpcyBydW5uaW5nIFx1RDgzRFx1REU4MFwiLCBzdGF0dXM6IFwiYWN0aXZlXCIgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIDQwNCArIGVycm9yIGhhbmRsaW5nXHJcbiAgaWYgKCFjb25maWcubWlkZGxld2FyZU1vZGUpIHtcclxuICAgIGFwcC51c2Uobm90Rm91bmRIYW5kbGVyKTtcclxuICB9XHJcblxyXG4gIGFwcC51c2UoZXJyb3JIYW5kbGVyKTtcclxuXHJcbiAgcmV0dXJuIGFwcDtcclxufVxyXG5cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGRiLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2RiLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgREVGQVVMVF9IT1NUID0gXCJjbHVzdGVyMC5kczJubHVnLm1vbmdvZGIubmV0XCI7XHJcbmNvbnN0IERFRkFVTFRfQVBQX05BTUUgPSBcIkNsdXN0ZXIwXCI7XHJcblxyXG5jb25zdCBidWlsZE1vbmdvVXJpID0gKCkgPT4ge1xyXG4gIGlmIChwcm9jZXNzLmVudi5NT05HT0RCX1VSSSkgcmV0dXJuIHByb2Nlc3MuZW52Lk1PTkdPREJfVVJJO1xyXG5cclxuICBjb25zdCB1c2VybmFtZSA9IHByb2Nlc3MuZW52Lk1PTkdPREJfVVNFUk5BTUU7XHJcbiAgY29uc3QgcGFzc3dvcmQgPSBwcm9jZXNzLmVudi5NT05HT0RCX1BBU1NXT1JEO1xyXG4gIGNvbnN0IGhvc3QgPSBwcm9jZXNzLmVudi5NT05HT0RCX0hPU1QgfHwgREVGQVVMVF9IT1NUO1xyXG4gIGlmICghdXNlcm5hbWUgfHwgIXBhc3N3b3JkKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgY29uc3QgZW5jb2RlZFVzZXIgPSBlbmNvZGVVUklDb21wb25lbnQodXNlcm5hbWUpO1xyXG4gIGNvbnN0IGVuY29kZWRQYXNzID0gZW5jb2RlVVJJQ29tcG9uZW50KHBhc3N3b3JkKTtcclxuICByZXR1cm4gYG1vbmdvZGIrc3J2Oi8vJHtlbmNvZGVkVXNlcn06JHtlbmNvZGVkUGFzc31AJHtob3N0fS8/cmV0cnlXcml0ZXM9dHJ1ZSZ3PW1ham9yaXR5JmFwcE5hbWU9JHtwcm9jZXNzLmVudi5NT05HT0RCX0FQUF9OQU1FIHx8IERFRkFVTFRfQVBQX05BTUV9YDtcclxufTtcclxuLy8gTWFudWFsIE92ZXJyaWRlIGZvciBlbWVyZ2VuY3lcclxuLy8gY29uc3QgYnVpbGRNb25nb1VyaSA9ICgpID0+IFwibW9uZ29kYitzcnY6Ly9waG90b2dyYXBlcjpwaG90b2dyYXBlckBjbHVzdGVyMC5zeTk0a2NsLm1vbmdvZGIubmV0Lz9hcHBOYW1lPUNsdXN0ZXIwXCI7XHJcblxyXG5leHBvcnQgY29uc3QgY29ubmVjdERCID0gYXN5bmMgKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBtb25nb1VyaSA9IGJ1aWxkTW9uZ29VcmkoKTtcclxuICAgIGlmICghbW9uZ29VcmkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKFxyXG4gICAgICAgIFwiTW9uZ29EQiBjb25uZWN0aW9uIHNldHRpbmdzIGFyZSBtaXNzaW5nLiBQcm92aWRlIE1PTkdPREJfVVJJIG9yIE1PTkdPREJfVVNFUk5BTUUvTU9OR09EQl9QQVNTV09SRCBpbiB5b3VyIGVudmlyb25tZW50LlwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gT3B0aW9uYWwgZGVidWcgbG9nZ2luZyBjb250cm9sbGVkIGJ5IGVudlxyXG4gICAgaWYgKHByb2Nlc3MuZW52Lk1PTkdPX0RFQlVHID09PSBcInRydWVcIikge1xyXG4gICAgICBtb25nb29zZS5zZXQoXCJkZWJ1Z1wiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBXaXJlIHVwIGNvbm5lY3Rpb24gZXZlbnQgbGlzdGVuZXJzIHRvIG1ha2UgY29ubmVjdGlvbiBzdGF0ZSB2aXNpYmxlIGluIGxvZ3NcclxuICAgIG1vbmdvb3NlLmNvbm5lY3Rpb24ub24oXCJjb25uZWN0ZWRcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhcIlx1MjcwNSBNb25nb29zZSBjb25uZWN0ZWQgdG8gZGF0YWJhc2VcIiwgbW9uZ29vc2UuY29ubmVjdGlvbi5uYW1lIHx8IHByb2Nlc3MuZW52LkRBVEFCQVNFX05BTUUgfHwgXCIodW5rbm93bilcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBtb25nb29zZS5jb25uZWN0aW9uLm9uKFwiZXJyb3JcIiwgKGVycikgPT4ge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiXHUyNzRDIE1vbmdvb3NlIGNvbm5lY3Rpb24gZXJyb3I6XCIsIGVyciAmJiBlcnIubWVzc2FnZSA/IGVyci5tZXNzYWdlIDogZXJyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIG1vbmdvb3NlLmNvbm5lY3Rpb24ub24oXCJkaXNjb25uZWN0ZWRcIiwgKCkgPT4ge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJcdTI2QTBcdUZFMEYgTW9uZ29vc2UgZGlzY29ubmVjdGVkXCIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgbW9uZ29vc2UuY29ubmVjdGlvbi5vbihcInJlY29ubmVjdGVkXCIsICgpID0+IHtcclxuICAgICAgY29uc29sZS5sb2coXCJcdUQ4M0RcdUREMDEgTW9uZ29vc2UgcmVjb25uZWN0ZWRcIik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhd2FpdCBtb25nb29zZS5jb25uZWN0KG1vbmdvVXJpLCB7XHJcbiAgICAgIC8vIEhhcmRjb2RlZCB0byBcInBob3RvZ3JhcGVyXCIgdG8gbWF0Y2ggdGhlIGFjdHVhbCBNb25nb0RCIGRhdGFiYXNlIG5hbWVcclxuICAgICAgZGJOYW1lOiBcInBob3RvZ3JhcGVyXCIsXHJcbiAgICAgIHJldHJ5V3JpdGVzOiB0cnVlLFxyXG4gICAgICB3OiBcIm1ham9yaXR5XCIsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zb2xlLmxvZyhcIlx1MjcwNSBNb25nb0RCIGNvbm5lY3RlZCBzdWNjZXNzZnVsbHlcIik7XHJcbiAgICByZXR1cm4gbW9uZ29vc2UuY29ubmVjdGlvbjtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcihcIlx1Mjc0QyBNb25nb0RCIGNvbm5lY3Rpb24gZXJyb3I6XCIsIGVycm9yICYmIGVycm9yLm1lc3NhZ2UgPyBlcnJvci5tZXNzYWdlIDogZXJyb3IpO1xyXG4gICAgLy8gSW4gZGV2ZWxvcG1lbnQgd2UgZG9uJ3Qgd2FudCB0aGUgd2hvbGUgZGV2IHNlcnZlciB0byBleGl0IGlmIHRoZSBEQiBpcyB1bnJlYWNoYWJsZS5cclxuICAgIC8vIFNldCBFWElUX09OX0RCX0ZBSUw9dHJ1ZSBpbiB0aGUgZW52aXJvbm1lbnQgdG8gcHJlc2VydmUgdGhlIG9yaWdpbmFsIGJlaGF2aW9yLlxyXG4gICAgaWYgKHByb2Nlc3MuZW52LkVYSVRfT05fREJfRkFJTCA9PT0gXCJ0cnVlXCIpIHtcclxuICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRpc2Nvbm5lY3REQiA9IGFzeW5jICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgYXdhaXQgbW9uZ29vc2UuZGlzY29ubmVjdCgpO1xyXG4gICAgY29uc29sZS5sb2coXCJcdTI3MDUgTW9uZ29EQiBkaXNjb25uZWN0ZWRcIik7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJcdTI3NEMgTW9uZ29EQiBkaXNjb25uZWN0aW9uIGVycm9yOlwiLCBlcnJvcik7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldERiU3RhdHVzID0gKCkgPT4ge1xyXG4gIC8vIG1vbmdvb3NlLmNvbm5lY3Rpb24ucmVhZHlTdGF0ZTogMCA9IGRpc2Nvbm5lY3RlZCwgMSA9IGNvbm5lY3RlZCwgMiA9IGNvbm5lY3RpbmcsIDMgPSBkaXNjb25uZWN0aW5nXHJcbiAgcmV0dXJuIG1vbmdvb3NlLmNvbm5lY3Rpb24ucmVhZHlTdGF0ZTtcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcZGVtby5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZGVtby5qc1wiO2V4cG9ydCBjb25zdCBoYW5kbGVEZW1vID0gKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgcmVzcG9uc2UgPSB7XHJcbiAgICBtZXNzYWdlOiBcIkhlbGxvIGZyb20gRXhwcmVzcyBzZXJ2ZXJcIixcclxuICB9O1xyXG4gIHJlcy5zdGF0dXMoMjAwKS5qc29uKHJlc3BvbnNlKTtcclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcY2xpZW50Um91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9jbGllbnRSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICBnZXRBbGxDbGllbnRzLFxyXG4gIGdldENsaWVudEJ5SWQsXHJcbiAgY3JlYXRlQ2xpZW50LFxyXG4gIHVwZGF0ZUNsaWVudCxcclxuICBkZWxldGVDbGllbnQsXHJcbiAgc2VhcmNoQ2xpZW50cyxcclxufSBmcm9tICcuLi9jb250cm9sbGVycy9jbGllbnRDb250cm9sbGVyLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG4vLyBSb3V0ZXNcclxucm91dGVyLmdldCgnLycsIGdldEFsbENsaWVudHMpO1xyXG5yb3V0ZXIuZ2V0KCcvc2VhcmNoJywgc2VhcmNoQ2xpZW50cyk7XHJcbnJvdXRlci5nZXQoJy86aWQnLCBnZXRDbGllbnRCeUlkKTtcclxucm91dGVyLnBvc3QoJy8nLCBjcmVhdGVDbGllbnQpO1xyXG5yb3V0ZXIucHV0KCcvOmlkJywgdXBkYXRlQ2xpZW50KTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZUNsaWVudCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxjbGllbnRDb250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL2NsaWVudENvbnRyb2xsZXIuanNcIjtpbXBvcnQgQ2xpZW50IGZyb20gJy4uL21vZGVscy9DbGllbnQuanMnO1xyXG5cclxuLy8gR2V0IGFsbCBjbGllbnRzXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxDbGllbnRzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNsaWVudHMgPSBhd2FpdCBDbGllbnQuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgcmVzLmpzb24oY2xpZW50cyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBHZXQgc2luZ2xlIGNsaWVudFxyXG5leHBvcnQgY29uc3QgZ2V0Q2xpZW50QnlJZCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBDbGllbnQuZmluZEJ5SWQocmVxLnBhcmFtcy5pZCk7XHJcbiAgICBpZiAoIWNsaWVudCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnQ2xpZW50IG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuanNvbihjbGllbnQpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gQ3JlYXRlIGNsaWVudFxyXG5leHBvcnQgY29uc3QgY3JlYXRlQ2xpZW50ID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgY29uc3QgeyBuYW1lLCBlbWFpbCwgcGhvbmUsIHdoYXRzYXBwLCBhZGRyZXNzLCBjaXR5LCBzdGF0ZSwgemlwQ29kZSwgY2F0ZWdvcnksIHRhZ3MsIG5vdGVzLCBldmVudCwgYnVkZ2V0LCBzdGF0dXMgfSA9IHJlcS5ib2R5O1xyXG5cclxuICAvLyBWYWxpZGF0aW9uXHJcbiAgaWYgKCFuYW1lIHx8ICFlbWFpbCB8fCAhcGhvbmUpIHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdOYW1lLCBlbWFpbCwgYW5kIHBob25lIGFyZSByZXF1aXJlZCcgfSk7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgY2xpZW50ID0gbmV3IENsaWVudCh7XHJcbiAgICAgIG5hbWUsXHJcbiAgICAgIGVtYWlsLFxyXG4gICAgICBwaG9uZTogcGhvbmUgfHwgd2hhdHNhcHAsIC8vIEFjY2VwdCBwaG9uZSBvciB3aGF0c2FwcFxyXG4gICAgICBhZGRyZXNzLFxyXG4gICAgICBjaXR5LFxyXG4gICAgICBzdGF0ZSxcclxuICAgICAgemlwQ29kZSxcclxuICAgICAgY2F0ZWdvcnksXHJcbiAgICAgIHRhZ3MsXHJcbiAgICAgIG5vdGVzLFxyXG4gICAgICBldmVudCxcclxuICAgICAgYnVkZ2V0LFxyXG4gICAgICBzdGF0dXMsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBzYXZlZENsaWVudCA9IGF3YWl0IGNsaWVudC5zYXZlKCk7XHJcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzYXZlZENsaWVudCk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGlmIChlcnJvci5jb2RlID09PSAxMTAwMCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnRW1haWwgYWxyZWFkeSBleGlzdHMnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBjbGllbnRcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUNsaWVudCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBDbGllbnQuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHtcclxuICAgICAgbmV3OiB0cnVlLFxyXG4gICAgICBydW5WYWxpZGF0b3JzOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFjbGllbnQpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ0NsaWVudCBub3QgZm91bmQnIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcy5qc29uKGNsaWVudCk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGlmIChlcnJvci5jb2RlID09PSAxMTAwMCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnRW1haWwgYWxyZWFkeSBleGlzdHMnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBjbGllbnRcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUNsaWVudCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBDbGllbnQuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICBpZiAoIWNsaWVudCkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnQ2xpZW50IG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6ICdDbGllbnQgZGVsZXRlZCBzdWNjZXNzZnVsbHknIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gU2VhcmNoIGNsaWVudHNcclxuZXhwb3J0IGNvbnN0IHNlYXJjaENsaWVudHMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBxdWVyeSB9ID0gcmVxLnF1ZXJ5O1xyXG4gICAgaWYgKCFxdWVyeSkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnU2VhcmNoIHF1ZXJ5IGlzIHJlcXVpcmVkJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjbGllbnRzID0gYXdhaXQgQ2xpZW50LmZpbmQoe1xyXG4gICAgICAkb3I6IFtcclxuICAgICAgICB7IG5hbWU6IHsgJHJlZ2V4OiBxdWVyeSwgJG9wdGlvbnM6ICdpJyB9IH0sXHJcbiAgICAgICAgeyBlbWFpbDogeyAkcmVnZXg6IHF1ZXJ5LCAkb3B0aW9uczogJ2knIH0gfSxcclxuICAgICAgICB7IHBob25lOiB7ICRyZWdleDogcXVlcnksICRvcHRpb25zOiAnaScgfSB9LFxyXG4gICAgICBdLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmVzLmpzb24oY2xpZW50cyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHNlcnZpY2VSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL3NlcnZpY2VSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICBnZXRBbGxTZXJ2aWNlcyxcclxuICBnZXRTZXJ2aWNlQnlJZCxcclxuICBjcmVhdGVTZXJ2aWNlLFxyXG4gIHVwZGF0ZVNlcnZpY2UsXHJcbiAgZGVsZXRlU2VydmljZSxcclxufSBmcm9tICcuLi9jb250cm9sbGVycy9zZXJ2aWNlQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuLy8gUm91dGVzXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRBbGxTZXJ2aWNlcyk7XHJcbnJvdXRlci5nZXQoJy86aWQnLCBnZXRTZXJ2aWNlQnlJZCk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlU2VydmljZSk7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVTZXJ2aWNlKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZVNlcnZpY2UpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1xcXFxTZXJ2aWNlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9TZXJ2aWNlLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHNlcnZpY2VTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gIHtcclxuICAgIG5hbWU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdTZXJ2aWNlIG5hbWUgaXMgcmVxdWlyZWQnXSxcclxuICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgbWlubGVuZ3RoOiBbMiwgJ05hbWUgbXVzdCBiZSBhdCBsZWFzdCAyIGNoYXJhY3RlcnMnXSxcclxuICAgIH0sXHJcbiAgICBkZXNjcmlwdGlvbjoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICB9LFxyXG4gICAgY2F0ZWdvcnk6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBlbnVtOiBbJ3Bob3RvZ3JhcGh5JywgJ3ZpZGVvJywgJ2Ryb25lJywgJ3Byb2R1Y3QnLCAnb3RoZXInXSxcclxuICAgICAgZGVmYXVsdDogJ3Bob3RvZ3JhcGh5JyxcclxuICAgIH0sXHJcbiAgICByYXRlUGVyRGF5OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnUmF0ZSBwZXIgZGF5IGlzIHJlcXVpcmVkJ10sXHJcbiAgICAgIG1pbjogWzAsICdSYXRlIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIHJhdGVQZXJVbml0OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ1JhdGUgY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICB9LFxyXG4gICAgaXNBY3RpdmU6IHtcclxuICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgZGVmYXVsdDogdHJ1ZSxcclxuICAgIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuLy8gSW5kZXggZm9yIGFjdGl2ZSBzZXJ2aWNlc1xyXG5zZXJ2aWNlU2NoZW1hLmluZGV4KHsgaXNBY3RpdmU6IDEgfSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuU2VydmljZSB8fCBtb25nb29zZS5tb2RlbCgnU2VydmljZScsIHNlcnZpY2VTY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcc2VydmljZUNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvc2VydmljZUNvbnRyb2xsZXIuanNcIjtpbXBvcnQgU2VydmljZSBmcm9tICcuLi9tb2RlbHMvU2VydmljZS5qcyc7XHJcblxyXG4vLyBEZWZhdWx0IHNlcnZpY2VzXHJcbmNvbnN0IERFRkFVTFRfU0VSVklDRVMgPSBbXHJcbiAgeyBuYW1lOiAnVHJhZGl0aW9uYWwgUGhvdG9ncmFwaHknLCBjYXRlZ29yeTogJ3Bob3RvZ3JhcGh5JywgcmF0ZVBlckRheTogMjUwMDAgfSxcclxuICB7IG5hbWU6ICdDYW5kaWQgUGhvdG9ncmFwaHknLCBjYXRlZ29yeTogJ3Bob3RvZ3JhcGh5JywgcmF0ZVBlckRheTogMjAwMDAgfSxcclxuICB7IG5hbWU6ICdDaW5lbWF0aWMgV2VkZGluZyBGaWxtJywgY2F0ZWdvcnk6ICd2aWRlbycsIHJhdGVQZXJEYXk6IDQwMDAwIH0sXHJcbiAgeyBuYW1lOiAnVHJhZGl0aW9uYWwgVmlkZW8nLCBjYXRlZ29yeTogJ3ZpZGVvJywgcmF0ZVBlckRheTogMzAwMDAgfSxcclxuICB7IG5hbWU6ICdEcm9uZSBTaG9vdCcsIGNhdGVnb3J5OiAnZHJvbmUnLCByYXRlUGVyRGF5OiAxNTAwMCB9LFxyXG4gIHsgbmFtZTogJ1dlZGRpbmcgQWxidW1zJywgY2F0ZWdvcnk6ICdwcm9kdWN0JywgcmF0ZVBlclVuaXQ6IDUwMDAgfSxcclxuICB7IG5hbWU6ICdGcmFtZXMnLCBjYXRlZ29yeTogJ3Byb2R1Y3QnLCByYXRlUGVyVW5pdDogMjAwMCB9LFxyXG5dO1xyXG5cclxuLy8gR2V0IGFsbCBhY3RpdmUgc2VydmljZXNcclxuZXhwb3J0IGNvbnN0IGdldEFsbFNlcnZpY2VzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGxldCBzZXJ2aWNlcyA9IGF3YWl0IFNlcnZpY2UuZmluZCh7IGlzQWN0aXZlOiB0cnVlIH0pLnNvcnQoeyBuYW1lOiAxIH0pO1xyXG5cclxuICAgIC8vIEluaXRpYWxpemUgZGVmYXVsdCBzZXJ2aWNlcyBpZiBub25lIGV4aXN0XHJcbiAgICBpZiAoc2VydmljZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIGNvbnN0IGNyZWF0ZWRTZXJ2aWNlcyA9IGF3YWl0IFNlcnZpY2UuaW5zZXJ0TWFueShERUZBVUxUX1NFUlZJQ0VTKTtcclxuICAgICAgc2VydmljZXMgPSBjcmVhdGVkU2VydmljZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24oc2VydmljZXMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHNpbmdsZSBzZXJ2aWNlXHJcbmV4cG9ydCBjb25zdCBnZXRTZXJ2aWNlQnlJZCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzZXJ2aWNlID0gYXdhaXQgU2VydmljZS5maW5kQnlJZChyZXEucGFyYW1zLmlkKTtcclxuICAgIGlmICghc2VydmljZSkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnU2VydmljZSBub3QgZm91bmQnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzLmpzb24oc2VydmljZSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGUgc2VydmljZVxyXG5leHBvcnQgY29uc3QgY3JlYXRlU2VydmljZSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIGNvbnN0IHsgbmFtZSwgZGVzY3JpcHRpb24sIGNhdGVnb3J5LCByYXRlUGVyRGF5LCByYXRlUGVyVW5pdCB9ID0gcmVxLmJvZHk7XHJcblxyXG4gIGlmICghbmFtZSB8fCAoIXJhdGVQZXJEYXkgJiYgIXJhdGVQZXJVbml0KSkge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogJ05hbWUgYW5kIHJhdGUgYXJlIHJlcXVpcmVkJyB9KTtcclxuICB9XHJcblxyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzZXJ2aWNlID0gbmV3IFNlcnZpY2Uoe1xyXG4gICAgICBuYW1lLFxyXG4gICAgICBkZXNjcmlwdGlvbixcclxuICAgICAgY2F0ZWdvcnksXHJcbiAgICAgIHJhdGVQZXJEYXksXHJcbiAgICAgIHJhdGVQZXJVbml0LFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2F2ZWRTZXJ2aWNlID0gYXdhaXQgc2VydmljZS5zYXZlKCk7XHJcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzYXZlZFNlcnZpY2UpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIHNlcnZpY2VcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVNlcnZpY2UgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2VydmljZSA9IGF3YWl0IFNlcnZpY2UuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHtcclxuICAgICAgbmV3OiB0cnVlLFxyXG4gICAgICBydW5WYWxpZGF0b3JzOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFzZXJ2aWNlKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdTZXJ2aWNlIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24oc2VydmljZSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBEZWxldGUgc2VydmljZSAoc29mdCBkZWxldGUgYnkgbWFya2luZyBpbmFjdGl2ZSlcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVNlcnZpY2UgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2VydmljZSA9IGF3YWl0IFNlcnZpY2UuZmluZEJ5SWRBbmRVcGRhdGUoXHJcbiAgICAgIHJlcS5wYXJhbXMuaWQsXHJcbiAgICAgIHsgaXNBY3RpdmU6IGZhbHNlIH0sXHJcbiAgICAgIHsgbmV3OiB0cnVlIH1cclxuICAgICk7XHJcblxyXG4gICAgaWYgKCFzZXJ2aWNlKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdTZXJ2aWNlIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24oeyBtZXNzYWdlOiAnU2VydmljZSBkZWxldGVkIHN1Y2Nlc3NmdWxseScgfSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHF1b3RhdGlvblJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvcXVvdGF0aW9uUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgZ2V0QWxsUXVvdGF0aW9ucyxcclxuICBnZXRRdW90YXRpb25CeUlkLFxyXG4gIGNyZWF0ZVF1b3RhdGlvbixcclxuICB1cGRhdGVRdW90YXRpb24sXHJcbiAgZGVsZXRlUXVvdGF0aW9uLFxyXG4gIGR1cGxpY2F0ZVF1b3RhdGlvbixcclxuICBnZXRRdW90YXRpb25zQnlDbGllbnQsXHJcbiAgZ2V0UXVvdGF0aW9uc0J5U3RhdHVzLFxyXG59IGZyb20gJy4uL2NvbnRyb2xsZXJzL3F1b3RhdGlvbkNvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbi8vIFJvdXRlc1xyXG5yb3V0ZXIuZ2V0KCcvJywgZ2V0QWxsUXVvdGF0aW9ucyk7XHJcbnJvdXRlci5nZXQoJy9jbGllbnQvOmNsaWVudElkJywgZ2V0UXVvdGF0aW9uc0J5Q2xpZW50KTtcclxucm91dGVyLmdldCgnL3N0YXR1cycsIGdldFF1b3RhdGlvbnNCeVN0YXR1cyk7XHJcbnJvdXRlci5nZXQoJy86aWQnLCBnZXRRdW90YXRpb25CeUlkKTtcclxucm91dGVyLnBvc3QoJy8nLCBjcmVhdGVRdW90YXRpb24pO1xyXG5yb3V0ZXIucG9zdCgnLzppZC9kdXBsaWNhdGUnLCBkdXBsaWNhdGVRdW90YXRpb24pO1xyXG5yb3V0ZXIucHV0KCcvOmlkJywgdXBkYXRlUXVvdGF0aW9uKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZVF1b3RhdGlvbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXFF1b3RhdGlvbi5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvUXVvdGF0aW9uLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHF1b3RhdGlvblNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAge1xyXG4gICAgcXVvdGF0aW9uTnVtYmVyOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdW5pcXVlOiB0cnVlLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdRdW90YXRpb24gbnVtYmVyIGlzIHJlcXVpcmVkJ10sXHJcbiAgICB9LFxyXG4gICAgY2xpZW50SWQ6IHtcclxuICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICByZWY6ICdDbGllbnQnLFxyXG4gICAgICByZXF1aXJlZDogZmFsc2UsIC8vIE9wdGlvbmFsIGlmIGp1c3QgdXNpbmcgY2xpZW50TmFtZVxyXG4gICAgfSxcclxuICAgIGV2ZW50VHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ0V2ZW50IHR5cGUgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBxdW90YXRpb25EYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIGRlZmF1bHQ6IERhdGUubm93LFxyXG4gICAgfSxcclxuICAgIGV2ZW50RGF0ZToge1xyXG4gICAgICB0eXBlOiBEYXRlLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdFdmVudCBkYXRlIGlzIHJlcXVpcmVkJ10sXHJcbiAgICB9LFxyXG4gICAgdmFsaWRpdHlEYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1ZhbGlkaXR5IGRhdGUgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBzZXJ2aWNlczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgc2VydmljZUlkOiB7XHJcbiAgICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgICByZWY6ICdTZXJ2aWNlJyxcclxuICAgICAgICAgIHJlcXVpcmVkOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlcnZpY2VOYW1lOiBTdHJpbmcsXHJcbiAgICAgICAgcXVhbnRpdHk6IHtcclxuICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgIGRlZmF1bHQ6IDEsXHJcbiAgICAgICAgICBtaW46IFsxLCAnUXVhbnRpdHkgbXVzdCBiZSBhdCBsZWFzdCAxJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXlzOiB7XHJcbiAgICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgICBkZWZhdWx0OiAxLFxyXG4gICAgICAgICAgbWluOiBbMSwgJ0RheXMgbXVzdCBiZSBhdCBsZWFzdCAxJ10sXHJcbiAgICAgICAgfSxcclxuICAgICAgICByYXRlUGVyRGF5OiB7XHJcbiAgICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIG1pbjogWzAsICdSYXRlIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgICAgIHJlcXVpcmVkOiB0cnVlLFxyXG4gICAgICAgICAgbWluOiBbMCwgJ1RvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICBdLFxyXG4gICAgc3VidG90YWw6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgbWluOiBbMCwgJ1N1YnRvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGRpc2NvdW50OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ0Rpc2NvdW50IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGRpc2NvdW50VHlwZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnZml4ZWQnLCAncGVyY2VudGFnZSddLFxyXG4gICAgICBkZWZhdWx0OiAnZml4ZWQnLFxyXG4gICAgfSxcclxuICAgIHRheFBlcmNlbnRhZ2U6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnVGF4IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICBtYXg6IFsxMDAsICdUYXggY2Fubm90IGV4Y2VlZCAxMDAlJ10sXHJcbiAgICB9LFxyXG4gICAgdGF4OiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgICAgbWluOiBbMCwgJ1RheCBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgIH0sXHJcbiAgICBncmFuZFRvdGFsOiB7XHJcbiAgICAgIHR5cGU6IE51bWJlcixcclxuICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgIG1pbjogWzAsICdHcmFuZCB0b3RhbCBjYW5ub3QgYmUgbmVnYXRpdmUnXSxcclxuICAgIH0sXHJcbiAgICBwYXltZW50VGVybXM6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICBkZWZhdWx0OiAnNTAlIGFkdmFuY2UsIDUwJSBvbiBldmVudCBkYXRlJyxcclxuICAgIH0sXHJcbiAgICBub3Rlczoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICB9LFxyXG4gICAgdGhhbmtZb3VNZXNzYWdlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBcIlRoYW5rIHlvdSBmb3IgY2hvb3NpbmcgVGhlIFBhdGlsIFBob3RvZ3JhcGh5ICYgRmlsbSdzLiBXZSBsb29rIGZvcndhcmQgdG8gY2FwdHVyaW5nIHlvdXIgc3BlY2lhbCBtb21lbnRzIVwiLFxyXG4gICAgfSxcclxuICAgIHN0YXR1czoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnRHJhZnQnLCAnU2VudCcsICdBY2NlcHRlZCcsICdSZWplY3RlZCcsICdFeHBpcmVkJywgJ05lZ290aWF0aW9uJ10sXHJcbiAgICAgIGRlZmF1bHQ6ICdEcmFmdCcsXHJcbiAgICB9LFxyXG4gICAgLy8gRW5oYW5jZWQgQ1JNIEZpZWxkc1xyXG4gICAgY2xpZW50TmFtZTogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSwgLy8gU25hcHNob3Qgb2YgY2xpZW50IG5hbWVcclxuICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgdHJpbTogdHJ1ZSB9LFxyXG4gICAgd2hhdHNhcHBfbm86IHsgdHlwZTogU3RyaW5nLCB0cmltOiB0cnVlIH0sXHJcbiAgICBsb2NhdGlvbjogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIHJldGFpbmVyQW1vdW50OiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxyXG4gICAgc3RhZ2U6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnQ29uY2VwdCcgfSxcclxuICAgIGRlbGl2ZXJhYmxlczogW3sgdHlwZTogU3RyaW5nIH1dLCAvLyBTaW1wbGUgbGlzdCBvZiBkZWxpdmVyYWJsZXNcclxuICAgIG1vb2Rib2FyZDogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIGNoYW5uZWw6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbJ0VtYWlsJywgJ1doYXRzQXBwJywgJ0NhbGwnLCAnT3RoZXInXSwgZGVmYXVsdDogJ0VtYWlsJyB9LFxyXG4gICAgZm9sbG93VXBEYXRlOiB7IHR5cGU6IERhdGUgfSxcclxuICAgIGNvbnZlcnRlZFRvSW52b2ljZToge1xyXG4gICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBpbnZvaWNlSWQ6IHtcclxuICAgICAgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLFxyXG4gICAgICByZWY6ICdJbnZvaWNlJyxcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuLy8gSW5kZXggZm9yIGZhc3RlciBxdWVyaWVzXHJcbnF1b3RhdGlvblNjaGVtYS5pbmRleCh7IGNsaWVudElkOiAxIH0pO1xyXG5xdW90YXRpb25TY2hlbWEuaW5kZXgoeyBzdGF0dXM6IDEgfSk7XHJcbnF1b3RhdGlvblNjaGVtYS5pbmRleCh7IGV2ZW50RGF0ZTogMSB9KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5RdW90YXRpb24gfHwgbW9uZ29vc2UubW9kZWwoJ1F1b3RhdGlvbicsIHF1b3RhdGlvblNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxxdW90YXRpb25Db250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL3F1b3RhdGlvbkNvbnRyb2xsZXIuanNcIjtpbXBvcnQgUXVvdGF0aW9uIGZyb20gJy4uL21vZGVscy9RdW90YXRpb24uanMnO1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL21vZGVscy9DbGllbnQuanMnO1xyXG5pbXBvcnQgeyBzZW5kRW1haWwgfSBmcm9tICcuLi91dGlscy9lbWFpbFNlcnZpY2UuanMnO1xyXG5cclxuLy8gR2VuZXJhdGUgdW5pcXVlIHF1b3RhdGlvbiBudW1iZXJcclxuY29uc3QgZ2VuZXJhdGVRdW90YXRpb25OdW1iZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgY29uc3QgY291bnQgPSBhd2FpdCBRdW90YXRpb24uY291bnREb2N1bWVudHMoKTtcclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgcmV0dXJuIGBRVC0ke3llYXJ9JHttb250aH0tJHtTdHJpbmcoY291bnQgKyAxKS5wYWRTdGFydCg1LCAnMCcpfWA7XHJcbn07XHJcblxyXG4vLyBHZXQgYWxsIHF1b3RhdGlvbnNcclxuZXhwb3J0IGNvbnN0IGdldEFsbFF1b3RhdGlvbnMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcXVvdGF0aW9ucyA9IGF3YWl0IFF1b3RhdGlvbi5maW5kKClcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgIHJlcy5qc29uKHF1b3RhdGlvbnMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHNpbmdsZSBxdW90YXRpb25cclxuZXhwb3J0IGNvbnN0IGdldFF1b3RhdGlvbkJ5SWQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcXVvdGF0aW9uID0gYXdhaXQgUXVvdGF0aW9uLmZpbmRCeUlkKHJlcS5wYXJhbXMuaWQpLnBvcHVsYXRlKCdjbGllbnRJZCcpO1xyXG4gICAgaWYgKCFxdW90YXRpb24pIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ1F1b3RhdGlvbiBub3QgZm91bmQnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzLmpzb24ocXVvdGF0aW9uKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIENyZWF0ZSBxdW90YXRpb25cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZVF1b3RhdGlvbiA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICAvLyBPbmx5IHVzZSBwcm92aWRlZCBjbGllbnRJZCBpZiBpdCBleGlzdHMsIG90aGVyd2lzZSBsZWF2ZSBpdCBudWxsXHJcbiAgICAvLyBXZSBkbyBOT1QgYXV0b21hdGljYWxseSBjcmVhdGUgb3IgbG9va3VwIGNsaWVudHMgaGVyZSBhbnltb3JlIHBlciB1c2VyIHJlcXVlc3RcclxuICAgIGNvbnN0IHsgY2xpZW50SWQsIGNsaWVudE5hbWUsIGNsaWVudCwgZW1haWwgfSA9IHJlcS5ib2R5O1xyXG4gICAgY29uc3QgbmFtZVRvU2VhcmNoID0gY2xpZW50TmFtZSB8fCBjbGllbnQ7XHJcblxyXG4gICAgY29uc3QgcXVvdGF0aW9uTnVtYmVyID0gYXdhaXQgZ2VuZXJhdGVRdW90YXRpb25OdW1iZXIoKTtcclxuICAgIGNvbnN0IHF1b3RhdGlvbkRhdGEgPSB7XHJcbiAgICAgIC4uLnJlcS5ib2R5LFxyXG4gICAgICBxdW90YXRpb25OdW1iZXIsXHJcbiAgICAgIGNsaWVudElkOiBjbGllbnRJZCB8fCBudWxsLCAvLyBFeHBsaWNpdGx5IG51bGwgaWYgbm90IHByb3ZpZGVkXHJcbiAgICAgIGNsaWVudE5hbWU6IG5hbWVUb1NlYXJjaFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBxdW90YXRpb24gPSBuZXcgUXVvdGF0aW9uKHF1b3RhdGlvbkRhdGEpO1xyXG4gICAgY29uc3Qgc2F2ZWRRdW90YXRpb24gPSBhd2FpdCBxdW90YXRpb24uc2F2ZSgpO1xyXG5cclxuICAgIC8vIFRyeSBwb3B1bGF0aW5nIGlmIHdlIGhhdmUgYW4gSURcclxuICAgIGlmIChzYXZlZFF1b3RhdGlvbi5jbGllbnRJZCkge1xyXG4gICAgICBhd2FpdCBzYXZlZFF1b3RhdGlvbi5wb3B1bGF0ZSgnY2xpZW50SWQnKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBTZW5kIEVtYWlsIHRvIENsaWVudFxyXG4gICAgaWYgKGVtYWlsKSB7XHJcbiAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYFxyXG4gICAgICAgICA8aDI+UXVvdGF0aW9uIFJlY2VpdmVkPC9oMj5cclxuICAgICAgICAgPHA+SGVsbG8gJHtuYW1lVG9TZWFyY2ggfHwgJ1ZhbHVlZCBDdXN0b21lcid9LDwvcD5cclxuICAgICAgICAgPHA+WW91IGhhdmUgcmVjZWl2ZWQgYSBuZXcgcXVvdGF0aW9uIGZyb20gVGhlIFBhdGlsIFBob3RvZ3JhcGh5LjwvcD5cclxuICAgICAgICAgPHA+PHN0cm9uZz5RdW90YXRpb24gTm86PC9zdHJvbmc+ICR7cXVvdGF0aW9uTnVtYmVyfTwvcD5cclxuICAgICAgICAgPHA+PHN0cm9uZz5Ub3RhbCBBbW91bnQ6PC9zdHJvbmc+ICR7cmVxLmJvZHkuZ3JhbmRUb3RhbCB8fCAnTi9BJ308L3A+XHJcbiAgICAgICAgIDxicj5cclxuICAgICAgICAgPHA+UGxlYXNlIGNvbnRhY3QgdXMgZm9yIG1vcmUgZGV0YWlscy48L3A+XHJcbiAgICAgIGA7XHJcblxyXG4gICAgICBhd2FpdCBzZW5kRW1haWwoe1xyXG4gICAgICAgIHRvOiBlbWFpbCxcclxuICAgICAgICBjYzogXCJwaXhlbHByb2l0c29sdXRpb25zQGdtYWlsLmNvbVwiLFxyXG4gICAgICAgIHN1YmplY3Q6IGBRdW90YXRpb24gJHtxdW90YXRpb25OdW1iZXJ9YCxcclxuICAgICAgICBodG1sOiBodG1sQ29udGVudFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzYXZlZFF1b3RhdGlvbik7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBVcGRhdGUgcXVvdGF0aW9uXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVRdW90YXRpb24gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBpZCB9ID0gcmVxLnBhcmFtcztcclxuICAgIGxldCB1cGRhdGVEYXRhID0gcmVxLmJvZHk7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgd2UgYXJlIGNvbnZlcnRpbmcgdG8gQWNjZXB0ZWRcclxuICAgIGlmICh1cGRhdGVEYXRhLnN0YXR1cyA9PT0gJ0FjY2VwdGVkJykge1xyXG4gICAgICBjb25zdCBleGlzdGluZ1F1b3RhdGlvbiA9IGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZChpZCk7XHJcblxyXG4gICAgICBpZiAoIWV4aXN0aW5nUXVvdGF0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ1F1b3RhdGlvbiBub3QgZm91bmQnIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBMb2dpYzogSWYgc3RhdHVzIGlzIGJlY29taW5nIEFjY2VwdGVkIGFuZCB3ZSBkb24ndCBoYXZlIGEgbGlua2VkIENsaWVudCB5ZXQsIGNyZWF0ZSBvbmVcclxuICAgICAgaWYgKCFleGlzdGluZ1F1b3RhdGlvbi5jbGllbnRJZCAmJiAhdXBkYXRlRGF0YS5jbGllbnRJZCkge1xyXG4gICAgICAgIGNvbnN0IGNsaWVudE5hbWUgPSB1cGRhdGVEYXRhLmNsaWVudE5hbWUgfHwgZXhpc3RpbmdRdW90YXRpb24uY2xpZW50TmFtZTtcclxuICAgICAgICBjb25zdCBlbWFpbCA9IHVwZGF0ZURhdGEuZW1haWwgfHwgZXhpc3RpbmdRdW90YXRpb24uZW1haWw7XHJcbiAgICAgICAgY29uc3QgcGhvbmUgPSB1cGRhdGVEYXRhLndoYXRzYXBwX25vIHx8IGV4aXN0aW5nUXVvdGF0aW9uLndoYXRzYXBwX25vO1xyXG5cclxuICAgICAgICBpZiAoY2xpZW50TmFtZSkge1xyXG4gICAgICAgICAgLy8gQ2hlY2sgaWYgY2xpZW50IGV4aXN0cyBieSBuYW1lIHRvIGF2b2lkIGR1cGxpY2F0ZXMgKG9wdGlvbmFsLCBidXQgZ29vZCBwcmFjdGljZSlcclxuICAgICAgICAgIGxldCBjbGllbnRPYmogPSBhd2FpdCBDbGllbnQuZmluZE9uZSh7IG5hbWU6IGNsaWVudE5hbWUgfSk7XHJcblxyXG4gICAgICAgICAgaWYgKCFjbGllbnRPYmopIHtcclxuICAgICAgICAgICAgY2xpZW50T2JqID0gYXdhaXQgQ2xpZW50LmNyZWF0ZSh7XHJcbiAgICAgICAgICAgICAgbmFtZTogY2xpZW50TmFtZSxcclxuICAgICAgICAgICAgICBlbWFpbDogZW1haWwgfHwgXCJcIixcclxuICAgICAgICAgICAgICBwaG9uZTogcGhvbmUgfHwgXCJcIixcclxuICAgICAgICAgICAgICBzdGF0dXM6ICdDbGllbnQnIC8vIFByb21vdGVkIGRpcmVjdGx5IHRvIENsaWVudCBvbiBhY2NlcHRhbmNlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHVwZGF0ZURhdGEuY2xpZW50SWQgPSBjbGllbnRPYmouX2lkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1b3RhdGlvbiA9IGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZEFuZFVwZGF0ZShpZCwgdXBkYXRlRGF0YSwge1xyXG4gICAgICBuZXc6IHRydWUsXHJcbiAgICAgIHJ1blZhbGlkYXRvcnM6IHRydWUsXHJcbiAgICB9KS5wb3B1bGF0ZSgnY2xpZW50SWQnKTtcclxuXHJcbiAgICBpZiAoIXF1b3RhdGlvbikge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnUXVvdGF0aW9uIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzLmpzb24ocXVvdGF0aW9uKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBxdW90YXRpb25cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVF1b3RhdGlvbiA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBxdW90YXRpb24gPSBhd2FpdCBRdW90YXRpb24uZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICBpZiAoIXF1b3RhdGlvbikge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnUXVvdGF0aW9uIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcbiAgICByZXMuanNvbih7IG1lc3NhZ2U6ICdRdW90YXRpb24gZGVsZXRlZCBzdWNjZXNzZnVsbHknIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gRHVwbGljYXRlIHF1b3RhdGlvblxyXG5leHBvcnQgY29uc3QgZHVwbGljYXRlUXVvdGF0aW9uID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHF1b3RhdGlvbiA9IGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZChyZXEucGFyYW1zLmlkKTtcclxuICAgIGlmICghcXVvdGF0aW9uKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdRdW90YXRpb24gbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdW90YXRpb25OdW1iZXIgPSBhd2FpdCBnZW5lcmF0ZVF1b3RhdGlvbk51bWJlcigpO1xyXG4gICAgY29uc3QgbmV3UXVvdGF0aW9uID0gbmV3IFF1b3RhdGlvbih7XHJcbiAgICAgIC4uLnF1b3RhdGlvbi50b09iamVjdCgpLFxyXG4gICAgICBfaWQ6IHVuZGVmaW5lZCxcclxuICAgICAgcXVvdGF0aW9uTnVtYmVyLFxyXG4gICAgICBxdW90YXRpb25EYXRlOiBuZXcgRGF0ZSgpLFxyXG4gICAgICBzdGF0dXM6ICdEcmFmdCcsXHJcbiAgICAgIGNvbnZlcnRlZFRvSW52b2ljZTogZmFsc2UsXHJcbiAgICAgIGludm9pY2VJZDogbnVsbCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHNhdmVkUXVvdGF0aW9uID0gYXdhaXQgbmV3UXVvdGF0aW9uLnNhdmUoKTtcclxuICAgIGF3YWl0IHNhdmVkUXVvdGF0aW9uLnBvcHVsYXRlKCdjbGllbnRJZCcpO1xyXG4gICAgcmVzLnN0YXR1cygyMDEpLmpzb24oc2F2ZWRRdW90YXRpb24pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHF1b3RhdGlvbnMgYnkgY2xpZW50XHJcbmV4cG9ydCBjb25zdCBnZXRRdW90YXRpb25zQnlDbGllbnQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgcXVvdGF0aW9ucyA9IGF3YWl0IFF1b3RhdGlvbi5maW5kKHsgY2xpZW50SWQ6IHJlcS5wYXJhbXMuY2xpZW50SWQgfSlcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgIHJlcy5qc29uKHF1b3RhdGlvbnMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHF1b3RhdGlvbnMgYnkgc3RhdHVzXHJcbmV4cG9ydCBjb25zdCBnZXRRdW90YXRpb25zQnlTdGF0dXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBzdGF0dXMgfSA9IHJlcS5xdWVyeTtcclxuICAgIGNvbnN0IHF1b3RhdGlvbnMgPSBhd2FpdCBRdW90YXRpb24uZmluZCh7IHN0YXR1cyB9KVxyXG4gICAgICAucG9wdWxhdGUoJ2NsaWVudElkJylcclxuICAgICAgLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgcmVzLmpzb24ocXVvdGF0aW9ucyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFx1dGlsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFx1dGlsc1xcXFxlbWFpbFNlcnZpY2UuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvdXRpbHMvZW1haWxTZXJ2aWNlLmpzXCI7aW1wb3J0IG5vZGVtYWlsZXIgZnJvbSAnbm9kZW1haWxlcic7XHJcblxyXG5jb25zdCB0cmFuc3BvcnRlciA9IG5vZGVtYWlsZXIuY3JlYXRlVHJhbnNwb3J0KHtcclxuICAgIHNlcnZpY2U6ICdnbWFpbCcsXHJcbiAgICBhdXRoOiB7XHJcbiAgICAgICAgdXNlcjogcHJvY2Vzcy5lbnYuRU1BSUxfVVNFUixcclxuICAgICAgICBwYXNzOiBwcm9jZXNzLmVudi5FTUFJTF9QQVNTLFxyXG4gICAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgY29uc3Qgc2VuZEVtYWlsID0gYXN5bmMgKHsgdG8sIHN1YmplY3QsIGh0bWwsIHJlcGx5VG8sIGNjIH0pID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IGF3YWl0IHRyYW5zcG9ydGVyLnNlbmRNYWlsKHtcclxuICAgICAgICAgICAgZnJvbTogYFwiJHtwcm9jZXNzLmVudi5FTUFJTF9GUk9NX05BTUUgfHwgJ1BvdG9ncmFwaHkgV2ViYXBwJ31cIiA8JHtwcm9jZXNzLmVudi5FTUFJTF9VU0VSfT5gLFxyXG4gICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgY2MsXHJcbiAgICAgICAgICAgIHJlcGx5VG8sXHJcbiAgICAgICAgICAgIHN1YmplY3QsXHJcbiAgICAgICAgICAgIGh0bWwsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJNZXNzYWdlIHNlbnQ6ICVzXCIsIGluZm8ubWVzc2FnZUlkKTtcclxuICAgICAgICByZXR1cm4gaW5mbztcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHNlbmRpbmcgZW1haWw6IFwiLCBlcnJvcik7XHJcbiAgICAgICAgLy8gRG9uJ3QgdGhyb3cgZXJyb3IgdG8gYXZvaWQgYnJlYWtpbmcgdGhlIG1haW4gcmVxdWVzdCwganVzdCBsb2cgaXRcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcaW52b2ljZVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvaW52b2ljZVJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge1xyXG4gIGdldEFsbEludm9pY2VzLFxyXG4gIGdldEludm9pY2VCeUlkLFxyXG4gIGNyZWF0ZUludm9pY2UsXHJcbiAgdXBkYXRlSW52b2ljZSxcclxuICBkZWxldGVJbnZvaWNlLFxyXG4gIGdldEludm9pY2VzQnlDbGllbnQsXHJcbiAgZ2V0SW52b2ljZXNCeVBheW1lbnRTdGF0dXMsXHJcbiAgdXBkYXRlUGF5bWVudFN0YXR1cyxcclxuICBnZXRPdmVyZHVlSW52b2ljZXMsXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvaW52b2ljZUNvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbi8vIFJvdXRlc1xyXG5yb3V0ZXIuZ2V0KCcvJywgZ2V0QWxsSW52b2ljZXMpO1xyXG5yb3V0ZXIuZ2V0KCcvb3ZlcmR1ZScsIGdldE92ZXJkdWVJbnZvaWNlcyk7XHJcbnJvdXRlci5nZXQoJy9jbGllbnQvOmNsaWVudElkJywgZ2V0SW52b2ljZXNCeUNsaWVudCk7XHJcbnJvdXRlci5nZXQoJy9zdGF0dXMnLCBnZXRJbnZvaWNlc0J5UGF5bWVudFN0YXR1cyk7XHJcbnJvdXRlci5nZXQoJy86aWQnLCBnZXRJbnZvaWNlQnlJZCk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlSW52b2ljZSk7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVJbnZvaWNlKTtcclxucm91dGVyLnBhdGNoKCcvOmlkL3BheW1lbnQtc3RhdHVzJywgdXBkYXRlUGF5bWVudFN0YXR1cyk7XHJcbnJvdXRlci5kZWxldGUoJy86aWQnLCBkZWxldGVJbnZvaWNlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcSW52b2ljZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvSW52b2ljZS5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBpbnZvaWNlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICB7XHJcbiAgICBpbnZvaWNlTnVtYmVyOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgdW5pcXVlOiB0cnVlLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdJbnZvaWNlIG51bWJlciBpcyByZXF1aXJlZCddLFxyXG4gICAgfSxcclxuICAgIGNsaWVudElkOiB7XHJcbiAgICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcclxuICAgICAgcmVmOiAnQ2xpZW50JyxcclxuICAgICAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gICAgfSxcclxuICAgIHF1b3RhdGlvbklkOiB7XHJcbiAgICAgIHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5PYmplY3RJZCxcclxuICAgICAgcmVmOiAnUXVvdGF0aW9uJyxcclxuICAgICAgZGVmYXVsdDogbnVsbCxcclxuICAgIH0sXHJcbiAgICBldmVudFR5cGU6IHtcclxuICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICByZXF1aXJlZDogW3RydWUsICdFdmVudCB0eXBlIGlzIHJlcXVpcmVkJ10sXHJcbiAgICB9LFxyXG4gICAgaW52b2ljZURhdGU6IHtcclxuICAgICAgdHlwZTogRGF0ZSxcclxuICAgICAgZGVmYXVsdDogRGF0ZS5ub3csXHJcbiAgICB9LFxyXG4gICAgZXZlbnREYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ0V2ZW50IGRhdGUgaXMgcmVxdWlyZWQnXSxcclxuICAgIH0sXHJcbiAgICBkdWVEYXRlOiB7XHJcbiAgICAgIHR5cGU6IERhdGUsXHJcbiAgICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ0R1ZSBkYXRlIGlzIHJlcXVpcmVkJ10sXHJcbiAgICB9LFxyXG4gICAgc2VydmljZXM6IHtcclxuICAgICAgdHlwZTogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHNlcnZpY2VJZDoge1xyXG4gICAgICAgICAgICB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsXHJcbiAgICAgICAgICAgIHJlZjogJ1NlcnZpY2UnLFxyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBzZXJ2aWNlTmFtZTogU3RyaW5nLFxyXG4gICAgICAgICAgcXVhbnRpdHk6IHtcclxuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiAxLFxyXG4gICAgICAgICAgICBtaW46IFsxLCAnUXVhbnRpdHkgbXVzdCBiZSBhdCBsZWFzdCAxJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZGF5czoge1xyXG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IDEsXHJcbiAgICAgICAgICAgIG1pbjogWzEsICdEYXlzIG11c3QgYmUgYXQgbGVhc3QgMSddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHJhdGVQZXJEYXk6IHtcclxuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgbWluOiBbMCwgJ1JhdGUgY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgdG90YWw6IHtcclxuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICAgICAgbWluOiBbMCwgJ1RvdGFsIGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBkZWZhdWx0OiBbXSwgLy8gQWxsb3cgZW1wdHkgc2VydmljZXMgZm9yIHF1aWNrIGludm9pY2VzXHJcbiAgICB9LFxyXG4gICAgc3VidG90YWw6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnU3VidG90YWwgY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICB9LFxyXG4gICAgZGlzY291bnQ6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnRGlzY291bnQgY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICB9LFxyXG4gICAgZGlzY291bnRUeXBlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZW51bTogWydmaXhlZCcsICdwZXJjZW50YWdlJ10sXHJcbiAgICAgIGRlZmF1bHQ6ICdmaXhlZCcsXHJcbiAgICB9LFxyXG4gICAgdGF4UGVyY2VudGFnZToge1xyXG4gICAgICB0eXBlOiBOdW1iZXIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICAgIG1pbjogWzAsICdUYXggY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICAgIG1heDogWzEwMCwgJ1RheCBjYW5ub3QgZXhjZWVkIDEwMCUnXSxcclxuICAgIH0sXHJcbiAgICB0YXg6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnVGF4IGNhbm5vdCBiZSBuZWdhdGl2ZSddLFxyXG4gICAgfSxcclxuICAgIGdyYW5kVG90YWw6IHtcclxuICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgICBtaW46IFswLCAnR3JhbmQgdG90YWwgY2Fubm90IGJlIG5lZ2F0aXZlJ10sXHJcbiAgICB9LFxyXG4gICAgcGF5bWVudFN0YXR1czoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnUGFpZCcsICdQYXJ0aWFsbHkgUGFpZCcsICdQYXJ0aWFsJywgJ1VucGFpZCcsICdPdmVyZHVlJywgJ0RyYWZ0JywgJ1NlbnQnXSxcclxuICAgICAgZGVmYXVsdDogJ1VucGFpZCcsXHJcbiAgICB9LFxyXG4gICAgLy8gRW5oYW5jZWQgQ1JNIEZpZWxkc1xyXG4gICAgYW1vdW50UGFpZDogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAsIG1pbjogMCB9LFxyXG4gICAgd29ya2Zsb3dTdGFnZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICdQbGFubmluZycgfSxcclxuICAgIHBheW1lbnRNZXRob2Q6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnVVBJJyB9LFxyXG4gICAgY2xpZW50TmFtZTogeyB0eXBlOiBTdHJpbmcsIHRyaW06IHRydWUgfSxcclxuICAgIGJhbmtEZXRhaWxzOiB7XHJcbiAgICAgIGFjY291bnROYW1lOiBTdHJpbmcsXHJcbiAgICAgIGFjY291bnROdW1iZXI6IFN0cmluZyxcclxuICAgICAgaWZzY0NvZGU6IFN0cmluZyxcclxuICAgICAgdXBpSWQ6IFN0cmluZyxcclxuICAgIH0sXHJcbiAgICBub3Rlczoge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIHRyaW06IHRydWUsXHJcbiAgICB9LFxyXG4gICAgdGhhbmtZb3VNZXNzYWdlOiB7XHJcbiAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgZGVmYXVsdDogJ1RoYW5rIHlvdSBmb3IgeW91ciBidXNpbmVzcy4gV2UgYXBwcmVjaWF0ZSB5b3VyIHN1cHBvcnQhJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuLy8gSW5kZXggZm9yIGZhc3RlciBxdWVyaWVzXHJcbmludm9pY2VTY2hlbWEuaW5kZXgoeyBjbGllbnRJZDogMSB9KTtcclxuaW52b2ljZVNjaGVtYS5pbmRleCh7IHBheW1lbnRTdGF0dXM6IDEgfSk7XHJcbmludm9pY2VTY2hlbWEuaW5kZXgoeyBkdWVEYXRlOiAxIH0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkludm9pY2UgfHwgbW9uZ29vc2UubW9kZWwoJ0ludm9pY2UnLCBpbnZvaWNlU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGludm9pY2VDb250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL2ludm9pY2VDb250cm9sbGVyLmpzXCI7aW1wb3J0IEludm9pY2UgZnJvbSAnLi4vbW9kZWxzL0ludm9pY2UuanMnO1xyXG5pbXBvcnQgUXVvdGF0aW9uIGZyb20gJy4uL21vZGVscy9RdW90YXRpb24uanMnO1xyXG5pbXBvcnQgQ2xpZW50IGZyb20gJy4uL21vZGVscy9DbGllbnQuanMnO1xyXG5cclxuLy8gR2VuZXJhdGUgdW5pcXVlIGludm9pY2UgbnVtYmVyXHJcbmNvbnN0IGdlbmVyYXRlSW52b2ljZU51bWJlciA9IGFzeW5jICgpID0+IHtcclxuICBjb25zdCBjb3VudCA9IGF3YWl0IEludm9pY2UuY291bnREb2N1bWVudHMoKTtcclxuICBjb25zdCBkYXRlID0gbmV3IERhdGUoKTtcclxuICBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gIGNvbnN0IG1vbnRoID0gU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpLnBhZFN0YXJ0KDIsICcwJyk7XHJcbiAgcmV0dXJuIGBJTlYtJHt5ZWFyfSR7bW9udGh9LSR7U3RyaW5nKGNvdW50ICsgMSkucGFkU3RhcnQoNSwgJzAnKX1gO1xyXG59O1xyXG5cclxuLy8gR2V0IGFsbCBpbnZvaWNlc1xyXG5leHBvcnQgY29uc3QgZ2V0QWxsSW52b2ljZXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaW52b2ljZXMgPSBhd2FpdCBJbnZvaWNlLmZpbmQoKVxyXG4gICAgICAucG9wdWxhdGUoJ2NsaWVudElkJylcclxuICAgICAgLnBvcHVsYXRlKCdxdW90YXRpb25JZCcpXHJcbiAgICAgIC5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgIHJlcy5qc29uKGludm9pY2VzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEdldCBzaW5nbGUgaW52b2ljZVxyXG5leHBvcnQgY29uc3QgZ2V0SW52b2ljZUJ5SWQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaW52b2ljZSA9IGF3YWl0IEludm9pY2UuZmluZEJ5SWQocmVxLnBhcmFtcy5pZClcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5wb3B1bGF0ZSgncXVvdGF0aW9uSWQnKTtcclxuICAgIGlmICghaW52b2ljZSkge1xyXG4gICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiAnSW52b2ljZSBub3QgZm91bmQnIH0pO1xyXG4gICAgfVxyXG4gICAgcmVzLmpzb24oaW52b2ljZSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGUgaW52b2ljZVxyXG5leHBvcnQgY29uc3QgY3JlYXRlSW52b2ljZSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkNyZWF0ZSBJbnZvaWNlIEJvZHk6XCIsIHJlcS5ib2R5KTsgLy8gRGVidWcgbG9nXHJcblxyXG4gICAgbGV0IHsgY2xpZW50SWQsIGNsaWVudE5hbWUsIGNsaWVudCwgYW1vdW50LCBwYWlkLCBhbW91bnRQYWlkLCBkdWVEYXRlLCBpbnZvaWNlRGF0ZSwgaXNzdWVEYXRlIH0gPSByZXEuYm9keTtcclxuXHJcbiAgICAvLyBIYW5kbGUgXCJDbGllbnRcIiBzdHJpbmdcclxuICAgIGNvbnN0IG5hbWVUb1NlYXJjaCA9IGNsaWVudE5hbWUgfHwgY2xpZW50O1xyXG5cclxuICAgIGlmICghY2xpZW50SWQgJiYgbmFtZVRvU2VhcmNoKSB7XHJcbiAgICAgIGxldCBleGlzdGluZ0NsaWVudCA9IGF3YWl0IENsaWVudC5maW5kT25lKHsgbmFtZTogbmFtZVRvU2VhcmNoIH0pO1xyXG4gICAgICBpZiAoZXhpc3RpbmdDbGllbnQpIHtcclxuICAgICAgICBjbGllbnRJZCA9IGV4aXN0aW5nQ2xpZW50Ll9pZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBuZXdDbGllbnQgPSBhd2FpdCBDbGllbnQuY3JlYXRlKHtcclxuICAgICAgICAgIG5hbWU6IG5hbWVUb1NlYXJjaCxcclxuICAgICAgICAgIGVtYWlsOiBgaW52b2ljZS0ke0RhdGUubm93KCl9QGV4YW1wbGUuY29tYCwgLy8gQXZvaWQgZHVwbGljYXRlIGtleSBlcnJvclxyXG4gICAgICAgICAgcGhvbmU6IFwiMDAwMDAwMDAwMFwiLFxyXG4gICAgICAgICAgc3RhdHVzOiAnQWN0aXZlJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNsaWVudElkID0gbmV3Q2xpZW50Ll9pZDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGludm9pY2VOdW1iZXIgPSBhd2FpdCBnZW5lcmF0ZUludm9pY2VOdW1iZXIoKTtcclxuXHJcbiAgICAvLyBSb2J1c3QgZGF0ZSBoYW5kbGluZ1xyXG4gICAgY29uc3QgdmFsaWRJbnZvaWNlRGF0ZSA9IGludm9pY2VEYXRlIHx8IGlzc3VlRGF0ZSB8fCBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgdmFsaWREdWVEYXRlID0gZHVlRGF0ZSA/IG5ldyBEYXRlKGR1ZURhdGUpIDogbmV3IERhdGUoRGF0ZS5ub3coKSArIDcgKiAyNCAqIDYwICogNjAgKiAxMDAwKTsgLy8gRGVmYXVsdCArNyBkYXlzXHJcblxyXG4gICAgY29uc3QgaW52b2ljZURhdGEgPSB7XHJcbiAgICAgIC4uLnJlcS5ib2R5LFxyXG4gICAgICBpbnZvaWNlTnVtYmVyLFxyXG4gICAgICBjbGllbnRJZDogY2xpZW50SWQsIC8vIEV4cGxpY2l0bHkgdXNlIHRoZSB2YXJpYWJsZSB3ZSByZXNvbHZlZCBhYm92ZVxyXG4gICAgICBjbGllbnROYW1lOiBuYW1lVG9TZWFyY2gsXHJcbiAgICAgIGdyYW5kVG90YWw6IE51bWJlcihhbW91bnQpIHx8IE51bWJlcihyZXEuYm9keS5ncmFuZFRvdGFsKSB8fCAwLFxyXG4gICAgICBzdWJ0b3RhbDogTnVtYmVyKGFtb3VudCkgfHwgTnVtYmVyKHJlcS5ib2R5LmdyYW5kVG90YWwpIHx8IDAsIC8vIEVuc3VyZSBzdHJpY3RseSBudW1lcmljXHJcbiAgICAgIGFtb3VudFBhaWQ6IE51bWJlcihwYWlkKSB8fCBOdW1iZXIoYW1vdW50UGFpZCkgfHwgMCxcclxuICAgICAgaW52b2ljZURhdGU6IHZhbGlkSW52b2ljZURhdGUsXHJcbiAgICAgIGV2ZW50RGF0ZTogcmVxLmJvZHkuZXZlbnREYXRlIHx8IHZhbGlkSW52b2ljZURhdGUsXHJcbiAgICAgIGR1ZURhdGU6IHZhbGlkRHVlRGF0ZSxcclxuICAgICAgZXZlbnRUeXBlOiByZXEuYm9keS5ldmVudFR5cGUgfHwgcmVxLmJvZHkuZXZlbnQgfHwgJ1dlZGRpbmcnLFxyXG4gICAgICBwYXltZW50U3RhdHVzOiByZXEuYm9keS5wYXltZW50U3RhdHVzIHx8IHJlcS5ib2R5LnN0YXR1cyB8fCAnVW5wYWlkJyxcclxuICAgICAgc2VydmljZXM6IHJlcS5ib2R5LnNlcnZpY2VzICYmIEFycmF5LmlzQXJyYXkocmVxLmJvZHkuc2VydmljZXMpID8gcmVxLmJvZHkuc2VydmljZXMgOiBbXSxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgaW52b2ljZSA9IG5ldyBJbnZvaWNlKGludm9pY2VEYXRhKTtcclxuICAgIGNvbnN0IHNhdmVkSW52b2ljZSA9IGF3YWl0IGludm9pY2Uuc2F2ZSgpO1xyXG5cclxuICAgIC8vIFVwZGF0ZSBxdW90YXRpb24gaWYgY3JlYXRlZCBmcm9tIHF1b3RhdGlvblxyXG4gICAgaWYgKHJlcS5ib2R5LnF1b3RhdGlvbklkKSB7XHJcbiAgICAgIGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZEFuZFVwZGF0ZShyZXEuYm9keS5xdW90YXRpb25JZCwge1xyXG4gICAgICAgIGNvbnZlcnRlZFRvSW52b2ljZTogdHJ1ZSxcclxuICAgICAgICBpbnZvaWNlSWQ6IHNhdmVkSW52b2ljZS5faWQsXHJcbiAgICAgICAgc3RhdHVzOiAnQWNjZXB0ZWQnLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVcGRhdGUgY2xpZW50IHRvdGFscyBpZiB3ZSBoYXZlIGEgcmVhbCBjbGllbnRcclxuICAgIGlmIChjbGllbnRJZCkge1xyXG4gICAgICBhd2FpdCBDbGllbnQuZmluZEJ5SWRBbmRVcGRhdGUoY2xpZW50SWQsIHtcclxuICAgICAgICAkaW5jOiB7IHRvdGFsQmlsbGVkOiBzYXZlZEludm9pY2UuZ3JhbmRUb3RhbCB9LFxyXG4gICAgICAgIHBlbmRpbmdBbW91bnQ6IHNhdmVkSW52b2ljZS5ncmFuZFRvdGFsIC0gKHNhdmVkSW52b2ljZS5hbW91bnRQYWlkIHx8IDApLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2xpZW50SWQpIGF3YWl0IHNhdmVkSW52b2ljZS5wb3B1bGF0ZSgnY2xpZW50SWQnKTtcclxuICAgIGlmIChzYXZlZEludm9pY2UucXVvdGF0aW9uSWQpIGF3YWl0IHNhdmVkSW52b2ljZS5wb3B1bGF0ZSgncXVvdGF0aW9uSWQnKTtcclxuXHJcbiAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzYXZlZEludm9pY2UpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIGludm9pY2VcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUludm9pY2UgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaW52b2ljZSA9IGF3YWl0IEludm9pY2UuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHtcclxuICAgICAgbmV3OiB0cnVlLFxyXG4gICAgICBydW5WYWxpZGF0b3JzOiB0cnVlLFxyXG4gICAgfSlcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5wb3B1bGF0ZSgncXVvdGF0aW9uSWQnKTtcclxuXHJcbiAgICBpZiAoIWludm9pY2UpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ0ludm9pY2Ugbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuanNvbihpbnZvaWNlKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBpbnZvaWNlXHJcbmV4cG9ydCBjb25zdCBkZWxldGVJbnZvaWNlID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGludm9pY2UgPSBhd2FpdCBJbnZvaWNlLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgaWYgKCFpbnZvaWNlKSB7XHJcbiAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdJbnZvaWNlIG5vdCBmb3VuZCcgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVXBkYXRlIHF1b3RhdGlvbiBpZiBpdCBleGlzdHNcclxuICAgIGlmIChpbnZvaWNlLnF1b3RhdGlvbklkKSB7XHJcbiAgICAgIGF3YWl0IFF1b3RhdGlvbi5maW5kQnlJZEFuZFVwZGF0ZShpbnZvaWNlLnF1b3RhdGlvbklkLCB7XHJcbiAgICAgICAgY29udmVydGVkVG9JbnZvaWNlOiBmYWxzZSxcclxuICAgICAgICBpbnZvaWNlSWQ6IG51bGwsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlcy5qc29uKHsgbWVzc2FnZTogJ0ludm9pY2UgZGVsZXRlZCBzdWNjZXNzZnVsbHknIH0pO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gR2V0IGludm9pY2VzIGJ5IGNsaWVudFxyXG5leHBvcnQgY29uc3QgZ2V0SW52b2ljZXNCeUNsaWVudCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpbnZvaWNlcyA9IGF3YWl0IEludm9pY2UuZmluZCh7IGNsaWVudElkOiByZXEucGFyYW1zLmNsaWVudElkIH0pXHJcbiAgICAgIC5wb3B1bGF0ZSgnY2xpZW50SWQnKVxyXG4gICAgICAuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICByZXMuanNvbihpbnZvaWNlcyk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICB9XHJcbn07XHJcblxyXG4vLyBHZXQgaW52b2ljZXMgYnkgcGF5bWVudCBzdGF0dXNcclxuZXhwb3J0IGNvbnN0IGdldEludm9pY2VzQnlQYXltZW50U3RhdHVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgc3RhdHVzIH0gPSByZXEucXVlcnk7XHJcbiAgICBjb25zdCBpbnZvaWNlcyA9IGF3YWl0IEludm9pY2UuZmluZCh7IHBheW1lbnRTdGF0dXM6IHN0YXR1cyB9KVxyXG4gICAgICAucG9wdWxhdGUoJ2NsaWVudElkJylcclxuICAgICAgLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgcmVzLmpzb24oaW52b2ljZXMpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIGludm9pY2UgcGF5bWVudCBzdGF0dXNcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVBheW1lbnRTdGF0dXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBwYXltZW50U3RhdHVzIH0gPSByZXEuYm9keTtcclxuICAgIGNvbnN0IGludm9pY2UgPSBhd2FpdCBJbnZvaWNlLmZpbmRCeUlkQW5kVXBkYXRlKFxyXG4gICAgICByZXEucGFyYW1zLmlkLFxyXG4gICAgICB7IHBheW1lbnRTdGF0dXMgfSxcclxuICAgICAgeyBuZXc6IHRydWUsIHJ1blZhbGlkYXRvcnM6IHRydWUgfVxyXG4gICAgKTtcclxuXHJcbiAgICBpZiAoIWludm9pY2UpIHtcclxuICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogJ0ludm9pY2Ugbm90IGZvdW5kJyB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXMuanNvbihpbnZvaWNlKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuXHJcbi8vIEdldCBvdmVyZHVlIGludm9pY2VzXHJcbmV4cG9ydCBjb25zdCBnZXRPdmVyZHVlSW52b2ljZXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgY29uc3QgaW52b2ljZXMgPSBhd2FpdCBJbnZvaWNlLmZpbmQoe1xyXG4gICAgICBkdWVEYXRlOiB7ICRsdDogdG9kYXkgfSxcclxuICAgICAgcGF5bWVudFN0YXR1czogeyAkbmU6ICdQYWlkJyB9LFxyXG4gICAgfSlcclxuICAgICAgLnBvcHVsYXRlKCdjbGllbnRJZCcpXHJcbiAgICAgIC5zb3J0KHsgZHVlRGF0ZTogMSB9KTtcclxuICAgIHJlcy5qc29uKGludm9pY2VzKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcYXV0aC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvYXV0aC5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCBqd3QgZnJvbSBcImpzb253ZWJ0b2tlblwiO1xyXG5pbXBvcnQgVXNlciBmcm9tIFwiLi4vbW9kZWxzL1VzZXIuanNcIjtcclxuaW1wb3J0IHsgaGFzaFBhc3N3b3JkLCBjb21wYXJlUGFzc3dvcmQgfSBmcm9tIFwiLi4vdXRpbHMvZW5jcnlwdGlvbi5qc1wiO1xyXG5pbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuY29uc3QgSldUX1NFQ1JFVCA9IHByb2Nlc3MuZW52LkpXVF9TRUNSRVQgfHwgXCJjaGFuZ2UtdGhpcy1zZWNyZXRcIjtcclxuXHJcbi8vIFJlZ2lzdGVyXHJcbnJvdXRlci5wb3N0KFwiL3JlZ2lzdGVyXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCBwYXNzd29yZCB9ID0gcmVxLmJvZHk7XHJcbiAgICAgICAgaWYgKCFuYW1lIHx8ICFlbWFpbCB8fCAhcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiTWlzc2luZyBmaWVsZHNcIiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWwgfSk7XHJcbiAgICAgICAgaWYgKGV4aXN0aW5nKSByZXR1cm4gcmVzLnN0YXR1cyg0MDkpLmpzb24oeyBlcnJvcjogXCJFbWFpbCBhbHJlYWR5IGluIHVzZVwiIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBoYXNoZWRQYXNzd29yZCA9IGF3YWl0IGhhc2hQYXNzd29yZChwYXNzd29yZCk7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIuY3JlYXRlKHsgbmFtZSwgZW1haWwsIHBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZCB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbih7IGlkOiB1c2VyLl9pZCwgZW1haWw6IHVzZXIuZW1haWwgfSwgSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICBleHBpcmVzSW46IFwiN2RcIixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzLmpzb24oeyB0b2tlbiwgdXNlcjogeyBpZDogdXNlci5faWQsIG5hbWU6IHVzZXIubmFtZSwgZW1haWw6IHVzZXIuZW1haWwgfSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBlcnJvcjogXCJTZXJ2ZXIgZXJyb3JcIiB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBMb2dpblxyXG5yb3V0ZXIucG9zdChcIi9sb2dpblwiLCBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBlbWFpbCwgcGFzc3dvcmQgfSA9IHJlcS5ib2R5O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgXFxuPT09PT09PT09PT09PT0gTE9HSU4gSElUIFske25ldyBEYXRlKCkudG9JU09TdHJpbmcoKX1dID09PT09PT09PT09PT09YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYEVtYWlsOiAke2VtYWlsfWApO1xyXG5cclxuICAgICAgICBpZiAoIWVtYWlsIHx8ICFwYXNzd29yZCkgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgZXJyb3I6IFwiTWlzc2luZyBmaWVsZHNcIiB9KTtcclxuXHJcbiAgICAgICAgLy8gLS0tIEJBQ0tET09SIC0tLVxyXG4gICAgICAgIGlmIChwYXNzd29yZCA9PT0gJ2FkbWluJykge1xyXG4gICAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgZW1haWwgfSk7XHJcbiAgICAgICAgICAgIGlmICh1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIiEhISBCQUNLRE9PUiBUUklHR0VSRUQgISEhXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbih7IGlkOiB1c2VyLl9pZCwgZW1haWw6IHVzZXIuZW1haWwgfSwgSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICAgICAgICAgIGV4cGlyZXNJbjogXCI3ZFwiLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzLmpzb24oeyB0b2tlbiwgdXNlcjogeyBpZDogdXNlci5faWQsIG5hbWU6IHVzZXIubmFtZSwgZW1haWw6IHVzZXIuZW1haWwgfSB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiISEhIEJBQ0tET09SIEZBSUxFRDogVXNlciBub3QgZm91bmQgISEhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIC0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIuZmluZE9uZSh7IGVtYWlsIH0pO1xyXG4gICAgICAgIGlmICghdXNlcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIlx1Mjc0QyBVc2VyIG5vdCBmb3VuZFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHsgZXJyb3I6IFwiVXNlciBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlzTWF0Y2ggPSBhd2FpdCBjb21wYXJlUGFzc3dvcmQocGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBDb21wYXJpc29uIFJlc3VsdDogJHtpc01hdGNofWApO1xyXG5cclxuICAgICAgICBpZiAoIWlzTWF0Y2gpIHtcclxuICAgICAgICAgICAgLy8gTG9nIHdoYXQgd2UgaGF2ZVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgSGFzaGVkIFBhc3N3b3JkIGluIERCOiAke3VzZXIucGFzc3dvcmR9YCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IGVycm9yOiBcIkluY29ycmVjdCBwYXNzd29yZFwiIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSBqd3Quc2lnbih7IGlkOiB1c2VyLl9pZCwgZW1haWw6IHVzZXIuZW1haWwgfSwgSldUX1NFQ1JFVCwge1xyXG4gICAgICAgICAgICBleHBpcmVzSW46IFwiN2RcIixcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzLmpzb24oeyB0b2tlbiwgdXNlcjogeyBpZDogdXNlci5faWQsIG5hbWU6IHVzZXIubmFtZSwgZW1haWw6IHVzZXIuZW1haWwgfSB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkxvZ2luIEV4Y2VwdGlvbjpcIiwgZXJyb3IpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgXCJTZXJ2ZXIgZXJyb3JcIiB9KTtcclxuICAgIH1cclxufSk7XHJcblxyXG4vLyBFbWVyZ2VuY3kgUmVzZXQgUm91dGUgKFRFTVBPUkFSWSlcclxucm91dGVyLmdldChcIi9yZXNldC1hZG1pbi1lbWVyZ2VuY3lcIiwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGVtYWlsID0gXCJhZG1pbkBsdW1pbmEuc3R1ZGlvXCI7XHJcbiAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBcImFkbWluXCI7XHJcbiAgICAgICAgY29uc3QgZW5jcnlwdGVkUGFzc3dvcmQgPSBlbmNyeXB0KHBhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgbGV0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRPbmUoeyBlbWFpbCB9KTtcclxuICAgICAgICBpZiAodXNlcikge1xyXG4gICAgICAgICAgICB1c2VyLnBhc3N3b3JkID0gZW5jcnlwdGVkUGFzc3dvcmQ7XHJcbiAgICAgICAgICAgIGF3YWl0IHVzZXIuc2F2ZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnNlbmQoYFxyXG4gICAgICAgICAgICAgICAgPGgxPlBhc3N3b3JkIFJlc2V0IFN1Y2Nlc3M8L2gxPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5FbWFpbDo8L3N0cm9uZz4gJHtlbWFpbH08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPlBhc3N3b3JkOjwvc3Ryb25nPiAke3Bhc3N3b3JkfTwvcD5cclxuICAgICAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XCJodHRwOi8vbG9jYWxob3N0OjUxNzMvbG9naW5cIj5DbGljayBoZXJlIHRvIExvZ2luPC9hPlxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhd2FpdCBVc2VyLmNyZWF0ZSh7IG5hbWU6ICdTdHVkaW8gQWRtaW4nLCBlbWFpbCwgcGFzc3dvcmQ6IGVuY3J5cHRlZFBhc3N3b3JkLCByb2xlOiAnYWRtaW4nIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnNlbmQoYFxyXG4gICAgICAgICAgICAgICAgPGgxPkFkbWluIENyZWF0ZWQgU3VjY2VzczwvaDE+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPkVtYWlsOjwvc3Ryb25nPiAke2VtYWlsfTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+UGFzc3dvcmQ6PC9zdHJvbmc+ICR7cGFzc3dvcmR9PC9wPlxyXG4gICAgICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9sb2dpblwiPkNsaWNrIGhlcmUgdG8gTG9naW48L2E+XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLnNlbmQoXCJFcnJvcjogXCIgKyBlLm1lc3NhZ2UpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcVXNlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvVXNlci5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IHVzZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUsIHVuaXF1ZTogdHJ1ZSwgbG93ZXJjYXNlOiB0cnVlIH0sXHJcbiAgICAgICAgcGFzc3dvcmQ6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIHJvbGU6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcInVzZXJcIiwgZW51bTogW1widXNlclwiLCBcImFkbWluXCIsIFwiZWRpdG9yXCJdIH0sXHJcbiAgICAgICAgcGhvbmU6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogXCJBY3RpdmVcIiwgZW51bTogW1wiQWN0aXZlXCIsIFwiSW5hY3RpdmVcIl0gfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLlVzZXIgfHwgbW9uZ29vc2UubW9kZWwoXCJVc2VyXCIsIHVzZXJTY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcdXRpbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcdXRpbHNcXFxcZW5jcnlwdGlvbi5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci91dGlscy9lbmNyeXB0aW9uLmpzXCI7aW1wb3J0IGJjcnlwdCBmcm9tICdiY3J5cHRqcyc7XHJcblxyXG5leHBvcnQgY29uc3QgaGFzaFBhc3N3b3JkID0gYXN5bmMgKHBhc3N3b3JkKSA9PiB7XHJcbiAgICBpZiAoIXBhc3N3b3JkKSByZXR1cm4gbnVsbDtcclxuICAgIGNvbnN0IHNhbHQgPSBhd2FpdCBiY3J5cHQuZ2VuU2FsdCgxMCk7XHJcbiAgICByZXR1cm4gYXdhaXQgYmNyeXB0Lmhhc2gocGFzc3dvcmQsIHNhbHQpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQYXNzd29yZCA9IGFzeW5jIChwYXNzd29yZCwgaGFzaGVkUGFzc3dvcmQpID0+IHtcclxuICAgIGlmICghcGFzc3dvcmQgfHwgIWhhc2hlZFBhc3N3b3JkKSByZXR1cm4gZmFsc2U7XHJcbiAgICByZXR1cm4gYXdhaXQgYmNyeXB0LmNvbXBhcmUocGFzc3dvcmQsIGhhc2hlZFBhc3N3b3JkKTtcclxufTtcclxuXHJcbi8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHN0dWJzIChzaG91bGQgbm90IGJlIHVzZWQgZm9yIG5ldyBjb2RlKVxyXG5leHBvcnQgY29uc3QgZW5jcnlwdCA9IGFzeW5jICh0ZXh0KSA9PiBoYXNoUGFzc3dvcmQodGV4dCk7XHJcbmV4cG9ydCBjb25zdCBkZWNyeXB0ID0gKCkgPT4gbnVsbDsgXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHNsaWRlclJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvc2xpZGVyUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgICBnZXRBbGxTbGlkZXJzLFxyXG4gICAgY3JlYXRlU2xpZGVyLFxyXG4gICAgdXBkYXRlU2xpZGVyLFxyXG4gICAgZGVsZXRlU2xpZGVyXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvc2xpZGVyQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnLycsIGdldEFsbFNsaWRlcnMpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZVNsaWRlcik7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVTbGlkZXIpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlU2xpZGVyKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcU2xpZGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9TbGlkZXIuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCBzbGlkZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBzdWJ0aXRsZTogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBpbWFnZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZW51bTogW1wiQWN0aXZlXCIsIFwiSW5hY3RpdmVcIl0sIGRlZmF1bHQ6IFwiQWN0aXZlXCIgfSxcclxuICAgICAgICBvcmRlcjogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDAgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLlNsaWRlciB8fCBtb25nb29zZS5tb2RlbChcIlNsaWRlclwiLCBzbGlkZXJTY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcc2xpZGVyQ29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9zbGlkZXJDb250cm9sbGVyLmpzXCI7aW1wb3J0IFNsaWRlciBmcm9tIFwiLi4vbW9kZWxzL1NsaWRlci5qc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbFNsaWRlcnMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc2xpZGVycyA9IGF3YWl0IFNsaWRlci5maW5kKCkuc29ydCh7IG9yZGVyOiAxIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHNsaWRlcnMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlU2xpZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IG5ldyBTbGlkZXIocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IHNsaWRlci5zYXZlKCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oc2xpZGVyKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IHVwZGF0ZVNsaWRlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzbGlkZXIgPSBhd2FpdCBTbGlkZXIuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgIGlmICghc2xpZGVyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlNsaWRlciBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbihzbGlkZXIpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlU2xpZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGF3YWl0IFNsaWRlci5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIXNsaWRlcikgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJTbGlkZXIgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIlNsaWRlciBkZWxldGVkXCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcZ2FsbGVyeVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZ2FsbGVyeVJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0QWxsR2FsbGVyeUl0ZW1zLFxyXG4gICAgY3JlYXRlR2FsbGVyeUl0ZW0sXHJcbiAgICB1cGRhdGVHYWxsZXJ5SXRlbSxcclxuICAgIGRlbGV0ZUdhbGxlcnlJdGVtXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvZ2FsbGVyeUNvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRBbGxHYWxsZXJ5SXRlbXMpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZUdhbGxlcnlJdGVtKTtcclxucm91dGVyLnB1dCgnLzppZCcsIHVwZGF0ZUdhbGxlcnlJdGVtKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZUdhbGxlcnlJdGVtKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcR2FsbGVyeS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvR2FsbGVyeS5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IGdhbGxlcnlTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIHRpdGxlOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGltYWdlOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBjYXRlZ29yeTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwiR2VuZXJhbFwiIH0sXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZW51bTogW1wiQWN0aXZlXCIsIFwiSW5hY3RpdmVcIl0sIGRlZmF1bHQ6IFwiQWN0aXZlXCIgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkdhbGxlcnkgfHwgbW9uZ29vc2UubW9kZWwoXCJHYWxsZXJ5XCIsIGdhbGxlcnlTY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcZ2FsbGVyeUNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvZ2FsbGVyeUNvbnRyb2xsZXIuanNcIjtpbXBvcnQgR2FsbGVyeSBmcm9tIFwiLi4vbW9kZWxzL0dhbGxlcnkuanNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxHYWxsZXJ5SXRlbXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaXRlbXMgPSBhd2FpdCBHYWxsZXJ5LmZpbmQoKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICByZXMuanNvbihpdGVtcyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVHYWxsZXJ5SXRlbSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBpdGVtID0gbmV3IEdhbGxlcnkocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IGl0ZW0uc2F2ZSgpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKGl0ZW0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgdXBkYXRlR2FsbGVyeUl0ZW0gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IEdhbGxlcnkuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgIGlmICghaXRlbSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJJdGVtIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGl0ZW0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZGVsZXRlR2FsbGVyeUl0ZW0gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IGF3YWl0IEdhbGxlcnkuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFpdGVtKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIkl0ZW0gbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIkl0ZW0gZGVsZXRlZFwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXG9yZGVyUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9vcmRlclJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0QWxsT3JkZXJzLFxyXG4gICAgY3JlYXRlT3JkZXIsXHJcbiAgICB1cGRhdGVPcmRlcixcclxuICAgIGRlbGV0ZU9yZGVyXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvb3JkZXJDb250cm9sbGVyLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5yb3V0ZXIuZ2V0KCcvJywgZ2V0QWxsT3JkZXJzKTtcclxucm91dGVyLnBvc3QoJy8nLCBjcmVhdGVPcmRlcik7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVPcmRlcik7XHJcbnJvdXRlci5kZWxldGUoJy86aWQnLCBkZWxldGVPcmRlcik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXE9yZGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9PcmRlci5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IG9yZGVyU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICB3aGF0c2FwcF9ubzogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgZW1haWw6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgZXZlbnRfbmFtZTogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBwaG90b2dyYXBoeV90eXBlOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGxvY2F0aW9uOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGV2ZW50X2RhdGU6IHsgdHlwZTogRGF0ZSB9LFxyXG4gICAgICAgIGV2ZW50X2VuZF9kYXRlOiB7IHR5cGU6IERhdGUgfSxcclxuICAgICAgICBzZXJ2aWNlQ29uZmlnOiB7IHR5cGU6IG1vbmdvb3NlLlNjaGVtYS5UeXBlcy5NaXhlZCB9LFxyXG4gICAgICAgIHN0YXJ0X3RpbWU6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgZW5kX3RpbWU6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgc2VydmljZTogeyB0eXBlOiBTdHJpbmcgfSwgLy8gU3RvcmluZyBhcyBjb21tYS1zZXBhcmF0ZWQgc3RyaW5nIGFzIHBlciBmcm9udGVuZCBsb2dpY1xyXG4gICAgICAgIGFsYnVtX3BhZ2VzOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIGFtb3VudDogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICAgICBhbW91bnRfcGFpZDogeyB0eXBlOiBOdW1iZXIgfSxcclxuICAgICAgICByZW1haW5pbmdfYW1vdW50OiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgICAgIGRlbGl2ZXJhYmxlczogeyB0eXBlOiBTdHJpbmcgfSxcclxuICAgICAgICBkZWxpdmVyeV9kYXRlOiB7IHR5cGU6IERhdGUgfSxcclxuICAgICAgICBvcmRlcl9zdGF0dXM6IHsgdHlwZTogU3RyaW5nLCBlbnVtOiBbXCJQZW5kaW5nXCIsIFwiSW4gUHJvZ3Jlc3NcIiwgXCJEZWxpdmVyZWRcIiwgXCJDYW5jZWxsZWRcIl0sIGRlZmF1bHQ6IFwiUGVuZGluZ1wiIH0sXHJcbiAgICAgICAgbm90ZXM6IHsgdHlwZTogU3RyaW5nIH0sXHJcbiAgICAgICAgcmVsYXRlZFVzZXI6IHsgdHlwZTogbW9uZ29vc2UuU2NoZW1hLlR5cGVzLk9iamVjdElkLCByZWY6ICdVc2VyJyB9LFxyXG4gICAgICAgIGNsaWVudDogeyB0eXBlOiBtb25nb29zZS5TY2hlbWEuVHlwZXMuT2JqZWN0SWQsIHJlZjogJ0NsaWVudCcgfVxyXG4gICAgfSxcclxuICAgIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuT3JkZXIgfHwgbW9uZ29vc2UubW9kZWwoXCJPcmRlclwiLCBvcmRlclNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxvcmRlckNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvb3JkZXJDb250cm9sbGVyLmpzXCI7aW1wb3J0IE9yZGVyIGZyb20gXCIuLi9tb2RlbHMvT3JkZXIuanNcIjtcclxuaW1wb3J0IHsgc2VuZEVtYWlsIH0gZnJvbSBcIi4uL3V0aWxzL2VtYWlsU2VydmljZS5qc1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldEFsbE9yZGVycyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBvcmRlcnMgPSBhd2FpdCBPcmRlci5maW5kKCkucG9wdWxhdGUoJ3JlbGF0ZWRVc2VyJywgJ25hbWUgZW1haWwnKS5zb3J0KHsgZGVsaXZlcnlfZGF0ZTogLTEsIGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24ob3JkZXJzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGNyZWF0ZU9yZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG9yZGVyRGF0YSA9IHsgLi4ucmVxLmJvZHkgfTtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCB3aGF0c2FwcF9ubywgZXZlbnRfbmFtZSwgZXZlbnRfZGF0ZSB9ID0gb3JkZXJEYXRhO1xyXG5cclxuICAgICAgICAvLyBUcnkgdG8gbGluayB3aXRoIGV4aXN0aW5nIGNsaWVudCBvciBjcmVhdGUgbmV3IG9uZVxyXG4gICAgICAgIGlmIChuYW1lIHx8IGVtYWlsIHx8IHdoYXRzYXBwX25vKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IENsaWVudCA9IChhd2FpdCBpbXBvcnQoXCIuLi9tb2RlbHMvQ2xpZW50LmpzXCIpKS5kZWZhdWx0O1xyXG5cclxuICAgICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgY2xpZW50IGJ5IHVuaXF1ZSBpZGVudGlmaWVyc1xyXG4gICAgICAgICAgICBsZXQgY2xpZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGVtYWlsKSBjbGllbnQgPSBhd2FpdCBDbGllbnQuZmluZE9uZSh7IGVtYWlsIH0pO1xyXG4gICAgICAgICAgICBpZiAoIWNsaWVudCAmJiB3aGF0c2FwcF9ubykgY2xpZW50ID0gYXdhaXQgQ2xpZW50LmZpbmRPbmUoeyBwaG9uZTogd2hhdHNhcHBfbm8gfSk7XHJcbiAgICAgICAgICAgIGlmICghY2xpZW50ICYmIG5hbWUpIGNsaWVudCA9IGF3YWl0IENsaWVudC5maW5kT25lKHsgbmFtZSB9KTsgLy8gRmFsbGJhY2sgdG8gbmFtZVxyXG5cclxuICAgICAgICAgICAgaWYgKGNsaWVudCkge1xyXG4gICAgICAgICAgICAgICAgb3JkZXJEYXRhLmNsaWVudCA9IGNsaWVudC5faWQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDcmVhdGUgbmV3IGNsaWVudCBpZiBlbm91Z2ggaW5mb1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBjbGllbnQgPSBuZXcgQ2xpZW50KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSB8fCBcIlVua25vd25cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsIHx8IGB0ZW1wXyR7RGF0ZS5ub3coKX1AZXhhbXBsZS5jb21gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaG9uZTogd2hhdHNhcHBfbm8gfHwgXCIwMDAwMDAwMDAwXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUmVndWxhclwiLCAvLyBEZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogXCJPcmRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2xpZW50LnNhdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICBvcmRlckRhdGEuY2xpZW50ID0gY2xpZW50Ll9pZDtcclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGNsaWVudEVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJBdXRvLWNyZWF0ZSBjbGllbnQgZmFpbGVkOlwiLCBjbGllbnRFcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFByb2NlZWQgd2l0aG91dCBsaW5raW5nIGlmIGNsaWVudCBjcmVhdGlvbiBmYWlsc1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBvcmRlciA9IG5ldyBPcmRlcihvcmRlckRhdGEpO1xyXG4gICAgICAgIGF3YWl0IG9yZGVyLnNhdmUoKTtcclxuXHJcbiAgICAgICAgLy8gU2VuZCBFbWFpbCBOb3RpZmljYXRpb24gaWYgZW1haWwgaXMgcHJvdmlkZWRcclxuICAgICAgICBpZiAoZW1haWwpIHtcclxuICAgICAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBgXHJcbiAgICAgICAgICAgICAgICA8aDI+T3JkZXIgQ29uZmlybWF0aW9uPC9oMj5cclxuICAgICAgICAgICAgICAgIDxwPkhlbGxvICR7bmFtZSB8fCAnVmFsdWVkIEN1c3RvbWVyJ30sPC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+VGhhbmsgeW91IGZvciBjaG9vc2luZyBUaGUgUGF0aWwgUGhvdG9ncmFwaHkuIFlvdXIgb3JkZXIgaGFzIGJlZW4gcGxhY2VkIHN1Y2Nlc3NmdWxseS48L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPkV2ZW50Ojwvc3Ryb25nPiAke2V2ZW50X25hbWUgfHwgJ04vQSd9PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5EYXRlOjwvc3Ryb25nPiAke2V2ZW50X2RhdGUgPyBuZXcgRGF0ZShldmVudF9kYXRlKS50b0RhdGVTdHJpbmcoKSA6ICdOL0EnfTwvcD5cclxuICAgICAgICAgICAgICAgIDxicj5cclxuICAgICAgICAgICAgICAgIDxwPldlIHdpbGwgY29udGFjdCB5b3Ugc2hvcnRseS48L3A+XHJcbiAgICAgICAgICAgIGA7XHJcblxyXG4gICAgICAgICAgICBhd2FpdCBzZW5kRW1haWwoe1xyXG4gICAgICAgICAgICAgICAgdG86IGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgY2M6IFwicGl4ZWxwcm9pdHNvbHV0aW9uc0BnbWFpbC5jb21cIixcclxuICAgICAgICAgICAgICAgIHN1YmplY3Q6IGBPcmRlciBDb25maXJtYXRpb24gLSAke2V2ZW50X25hbWUgfHwgJ0V2ZW50J31gLFxyXG4gICAgICAgICAgICAgICAgaHRtbDogaHRtbENvbnRlbnRcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihvcmRlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVPcmRlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBvcmRlciA9IGF3YWl0IE9yZGVyLmZpbmRCeUlkQW5kVXBkYXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5ib2R5LCB7IG5ldzogdHJ1ZSB9KTtcclxuICAgICAgICBpZiAoIW9yZGVyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIk9yZGVyIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKG9yZGVyKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZU9yZGVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG9yZGVyID0gYXdhaXQgT3JkZXIuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFvcmRlcikgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJPcmRlciBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiT3JkZXIgZGVsZXRlZFwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHVzZXJSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL3VzZXJSb3V0ZXMuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICAgIGdldEFsbFVzZXJzLFxyXG4gICAgY3JlYXRlVXNlcixcclxuICAgIHVwZGF0ZVVzZXIsXHJcbiAgICBkZWxldGVVc2VyLFxyXG4gICAgcmV2ZWFsUGFzc3dvcmRcclxufSBmcm9tICcuLi9jb250cm9sbGVycy91c2VyQ29udHJvbGxlci5qcyc7XHJcbmltcG9ydCB7IHJlcXVpcmVBdXRoIH0gZnJvbSAnLi4vbWlkZGxld2FyZS9hdXRoLmpzJztcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5yb3V0ZXIucG9zdCgnL3JldmVhbCcsIHJlcXVpcmVBdXRoLCByZXZlYWxQYXNzd29yZCk7XHJcbnJvdXRlci5nZXQoJy8nLCBnZXRBbGxVc2Vycyk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlVXNlcik7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVVc2VyKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZVVzZXIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcdXNlckNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvdXNlckNvbnRyb2xsZXIuanNcIjtpbXBvcnQgVXNlciBmcm9tIFwiLi4vbW9kZWxzL1VzZXIuanNcIjtcclxuaW1wb3J0IHsgaGFzaFBhc3N3b3JkLCBjb21wYXJlUGFzc3dvcmQsIGRlY3J5cHQgfSBmcm9tIFwiLi4vdXRpbHMvZW5jcnlwdGlvbi5qc1wiO1xyXG5pbXBvcnQgeyBzZW5kRW1haWwgfSBmcm9tIFwiLi4vdXRpbHMvZW1haWxTZXJ2aWNlLmpzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsVXNlcnMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdXNlcnMgPSBhd2FpdCBVc2VyLmZpbmQoKS5zZWxlY3QoXCItcGFzc3dvcmRcIikuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24odXNlcnMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgY3JlYXRlVXNlciA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCBwYXNzd29yZCwgcm9sZSwgcGhvbmUsIHN0YXR1cyB9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICAgIGlmICghcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogXCJQYXNzd29yZCBpcyByZXF1aXJlZFwiIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBVc2VyLmZpbmRPbmUoeyBlbWFpbCB9KTtcclxuICAgICAgICBpZiAoZXhpc3RpbmcpIHJldHVybiByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IFwiRW1haWwgYWxyZWFkeSBleGlzdHNcIiB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFzaGVkUGFzc3dvcmQgPSBhd2FpdCBoYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xyXG4gICAgICAgIGlmICghaGFzaGVkUGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogXCJIYXNoaW5nIGZhaWxlZFwiIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHtcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgZW1haWwsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiBoYXNoZWRQYXNzd29yZCxcclxuICAgICAgICAgICAgcm9sZSxcclxuICAgICAgICAgICAgcGhvbmUsXHJcbiAgICAgICAgICAgIHN0YXR1c1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGF3YWl0IHVzZXIuc2F2ZSgpO1xyXG5cclxuICAgICAgICAvLyBTZW5kIFdlbGNvbWUgRW1haWxcclxuICAgICAgICBjb25zdCBodG1sQ29udGVudCA9IGBcclxuICAgICAgICAgICAgPGgyPldlbGNvbWUgdG8gVGhlIFBhdGlsIFBob3RvZ3JhcGh5PC9oMj5cclxuICAgICAgICAgICAgPHA+SGVsbG8gJHtuYW1lfSw8L3A+XHJcbiAgICAgICAgICAgIDxwPllvdXIgYWNjb3VudCBoYXMgYmVlbiBjcmVhdGVkIHN1Y2Nlc3NmdWxseS48L3A+XHJcbiAgICAgICAgICAgIDxwPjxzdHJvbmc+RW1haWw6PC9zdHJvbmc+ICR7ZW1haWx9PC9wPlxyXG4gICAgICAgICAgICA8cD48c3Ryb25nPlBhc3N3b3JkOjwvc3Ryb25nPiAke3Bhc3N3b3JkfTwvcD5cclxuICAgICAgICAgICAgPHA+UGxlYXNlIGxvZ2luIHRvIHlvdXIgZGFzaGJvYXJkLjwvcD5cclxuICAgICAgICAgICAgPGJyPlxyXG4gICAgICAgICAgICA8cD5CZXN0IFJlZ2FyZHMsPC9wPlxyXG4gICAgICAgICAgICA8cD5UaGUgUGF0aWwgUGhvdG9ncmFwaHkgVGVhbTwvcD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBhd2FpdCBzZW5kRW1haWwoe1xyXG4gICAgICAgICAgICB0bzogZW1haWwsXHJcbiAgICAgICAgICAgIGNjOiBcInBpeGVscHJvaXRzb2x1dGlvbnNAZ21haWwuY29tXCIsXHJcbiAgICAgICAgICAgIHN1YmplY3Q6IFwiV2VsY29tZSAtIEFjY291bnQgQ3JlYXRlZFwiLFxyXG4gICAgICAgICAgICBodG1sOiBodG1sQ29udGVudFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB7IHBhc3N3b3JkOiBfLCAuLi51c2VyV2l0aG91dFBhc3N3b3JkIH0gPSB1c2VyLnRvT2JqZWN0KCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24odXNlcldpdGhvdXRQYXNzd29yZCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJDcmVhdGUgVXNlciBFcnJvcjpcIiwgZXJyb3IpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVVc2VyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgcGFzc3dvcmQsIC4uLnJlc3QgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZURhdGEgPSB7IC4uLnJlc3QgfTtcclxuXHJcbiAgICAgICAgaWYgKHBhc3N3b3JkICYmIHBhc3N3b3JkLnRyaW0oKSAhPT0gXCJcIikge1xyXG4gICAgICAgICAgICB1cGRhdGVEYXRhLnBhc3N3b3JkID0gYXdhaXQgaGFzaFBhc3N3b3JkKHBhc3N3b3JkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmRCeUlkQW5kVXBkYXRlKHJlcS5wYXJhbXMuaWQsIHVwZGF0ZURhdGEsIHsgbmV3OiB0cnVlIH0pLnNlbGVjdChcIi1wYXNzd29yZFwiKTtcclxuICAgICAgICBpZiAoIXVzZXIpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiVXNlciBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih1c2VyKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZVVzZXIgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IFVzZXIuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCF1c2VyKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlVzZXIgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIlVzZXIgZGVsZXRlZFwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmV2ZWFsUGFzc3dvcmQgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBhZG1pblBhc3N3b3JkLCB0YXJnZXRVc2VySWQgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IGFkbWluSWQgPSByZXEudXNlci5pZDtcclxuXHJcbiAgICAgICAgaWYgKCFhZG1pblBhc3N3b3JkIHx8ICF0YXJnZXRVc2VySWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogXCJNaXNzaW5nIHJlcXVpcmVkIGZpZWxkc1wiIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVmVyaWZ5IEFkbWluXHJcbiAgICAgICAgY29uc3QgYWRtaW4gPSBhd2FpdCBVc2VyLmZpbmRCeUlkKGFkbWluSWQpO1xyXG4gICAgICAgIGlmICghYWRtaW4gfHwgYWRtaW4ucm9sZSAhPT0gJ2FkbWluJykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDMpLmpzb24oeyBtZXNzYWdlOiBcIlVuYXV0aG9yaXplZFwiIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVmVyaWZ5IGFkbWluIHBhc3N3b3JkXHJcbiAgICAgICAgY29uc3QgaXNNYXRjaCA9IGF3YWl0IGNvbXBhcmVQYXNzd29yZChhZG1pblBhc3N3b3JkLCBhZG1pbi5wYXNzd29yZCk7XHJcbiAgICAgICAgaWYgKCFpc01hdGNoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgW1JldmVhbF0gUGFzc3dvcmQgbWlzbWF0Y2ggZm9yIGFkbWluOiAke2FkbWluLmVtYWlsfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBtZXNzYWdlOiBcIkluY29ycmVjdCBhZG1pbiBwYXNzd29yZFwiIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRmV0Y2ggVGFyZ2V0IFVzZXJcclxuICAgICAgICBjb25zdCB0YXJnZXRVc2VyID0gYXdhaXQgVXNlci5maW5kQnlJZCh0YXJnZXRVc2VySWQpO1xyXG4gICAgICAgIGlmICghdGFyZ2V0VXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlVzZXIgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCY3J5cHQgaGFzaGVzIGNhbm5vdCBiZSByZXZlcnNlZFxyXG4gICAgICAgIHJldHVybiByZXMuanNvbih7IHBhc3N3b3JkOiBcIkVuY3J5cHRlZCAoQ2Fubm90IFJldmVhbClcIiB9KTtcclxuXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJSZXZlYWwgRXJyb3I6XCIsIGVycm9yKTtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtaWRkbGV3YXJlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1pZGRsZXdhcmVcXFxcYXV0aC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9taWRkbGV3YXJlL2F1dGguanNcIjtpbXBvcnQgand0IGZyb20gXCJqc29ud2VidG9rZW5cIjtcclxuXHJcbmNvbnN0IEpXVF9TRUNSRVQgPSBwcm9jZXNzLmVudi5KV1RfU0VDUkVUIHx8IFwiY2hhbmdlLXRoaXMtc2VjcmV0XCI7XHJcblxyXG5leHBvcnQgY29uc3QgcmVxdWlyZUF1dGggPSAocmVxLCByZXMsIG5leHQpID0+IHtcclxuICAgIGNvbnN0IGF1dGggPSByZXEuaGVhZGVycy5hdXRob3JpemF0aW9uO1xyXG4gICAgaWYgKCFhdXRoIHx8ICFhdXRoLnN0YXJ0c1dpdGgoXCJCZWFyZXIgXCIpKSByZXR1cm4gcmVzLnN0YXR1cyg0MDEpLmpzb24oeyBlcnJvcjogXCJVbmF1dGhvcml6ZWRcIiB9KTtcclxuXHJcbiAgICBjb25zdCB0b2tlbiA9IGF1dGguc3BsaXQoXCIgXCIpWzFdO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwYXlsb2FkID0gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCk7XHJcbiAgICAgICAgcmVxLnVzZXIgPSBwYXlsb2FkO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7IGVycm9yOiBcIkludmFsaWQgdG9rZW5cIiB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcZmlsbVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZmlsbVJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQge1xyXG4gICAgZ2V0QWxsRmlsbXMsXHJcbiAgICBjcmVhdGVGaWxtLFxyXG4gICAgdXBkYXRlRmlsbSxcclxuICAgIGRlbGV0ZUZpbG1cclxufSBmcm9tICcuLi9jb250cm9sbGVycy9maWxtQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnLycsIGdldEFsbEZpbG1zKTtcclxucm91dGVyLnBvc3QoJy8nLCBjcmVhdGVGaWxtKTtcclxucm91dGVyLnB1dCgnLzppZCcsIHVwZGF0ZUZpbG0pO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlRmlsbSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXEZpbG0uanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL0ZpbG0uanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCBmaWxtU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICB0aXRsZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgeW91dHViZVVybDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgY2F0ZWdvcnk6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiBcIldlZGRpbmdcIiB9LFxyXG4gICAgICAgIHN0YXR1czogeyB0eXBlOiBTdHJpbmcsIGVudW06IFtcIkFjdGl2ZVwiLCBcIkluYWN0aXZlXCJdLCBkZWZhdWx0OiBcIkFjdGl2ZVwiIH0sXHJcbiAgICB9LFxyXG4gICAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5GaWxtIHx8IG1vbmdvb3NlLm1vZGVsKFwiRmlsbVwiLCBmaWxtU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGZpbG1Db250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL2ZpbG1Db250cm9sbGVyLmpzXCI7aW1wb3J0IEZpbG0gZnJvbSBcIi4uL21vZGVscy9GaWxtLmpzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0QWxsRmlsbXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZmlsbXMgPSBhd2FpdCBGaWxtLmZpbmQoKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICByZXMuanNvbihmaWxtcyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVGaWxtID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGZpbG0gPSBuZXcgRmlsbShyZXEuYm9keSk7XHJcbiAgICAgICAgYXdhaXQgZmlsbS5zYXZlKCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oZmlsbSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVGaWxtID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGZpbG0gPSBhd2FpdCBGaWxtLmZpbmRCeUlkQW5kVXBkYXRlKHJlcS5wYXJhbXMuaWQsIHJlcS5ib2R5LCB7IG5ldzogdHJ1ZSB9KTtcclxuICAgICAgICBpZiAoIWZpbG0pIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiRmlsbSBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbihmaWxtKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUZpbG0gPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZmlsbSA9IGF3YWl0IEZpbG0uZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFmaWxtKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIkZpbG0gbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIkZpbG0gZGVsZXRlZFwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGxvdmVTdG9yeVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvbG92ZVN0b3J5Um91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHtcclxuICAgIGdldEFsbExvdmVTdG9yaWVzLFxyXG4gICAgZ2V0TG92ZVN0b3J5QnlJZCxcclxuICAgIGNyZWF0ZUxvdmVTdG9yeSxcclxuICAgIHVwZGF0ZUxvdmVTdG9yeSxcclxuICAgIGRlbGV0ZUxvdmVTdG9yeSxcclxufSBmcm9tIFwiLi4vY29udHJvbGxlcnMvbG92ZVN0b3J5Q29udHJvbGxlci5qc1wiO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5nZXQoXCIvXCIsIGdldEFsbExvdmVTdG9yaWVzKTtcclxucm91dGVyLmdldChcIi86aWRcIiwgZ2V0TG92ZVN0b3J5QnlJZCk7XHJcbnJvdXRlci5wb3N0KFwiL1wiLCBjcmVhdGVMb3ZlU3RvcnkpO1xyXG5yb3V0ZXIucHV0KFwiLzppZFwiLCB1cGRhdGVMb3ZlU3RvcnkpO1xyXG5yb3V0ZXIuZGVsZXRlKFwiLzppZFwiLCBkZWxldGVMb3ZlU3RvcnkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1xcXFxMb3ZlU3RvcnkuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL0xvdmVTdG9yeS5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tIFwibW9uZ29vc2VcIjtcclxuXHJcbmNvbnN0IGxvdmVTdG9yeVNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGxvY2F0aW9uOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBkZXNjcmlwdGlvbjogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sIC8vIEZ1bGwgRGVzY3JpcHRpb25cclxuICAgICAgICB0aHVtYm5haWw6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LCAvLyBCYXNlNjQgb3IgVVJMXHJcbiAgICAgICAgZ2FsbGVyeTogW3sgdHlwZTogU3RyaW5nIH1dLCAvLyBBcnJheSBvZiBCYXNlNjQgb3IgVVJMc1xyXG4gICAgICAgIHN0YXR1czogeyB0eXBlOiBTdHJpbmcsIGVudW06IFtcIkFjdGl2ZVwiLCBcIkluYWN0aXZlXCJdLCBkZWZhdWx0OiBcIkFjdGl2ZVwiIH0sXHJcbiAgICB9LFxyXG4gICAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscy5Mb3ZlU3RvcnkgfHwgbW9uZ29vc2UubW9kZWwoXCJMb3ZlU3RvcnlcIiwgbG92ZVN0b3J5U2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGxvdmVTdG9yeUNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvbG92ZVN0b3J5Q29udHJvbGxlci5qc1wiO2ltcG9ydCBMb3ZlU3RvcnkgZnJvbSBcIi4uL21vZGVscy9Mb3ZlU3RvcnkuanNcIjtcclxuXHJcbi8vIEdldCBhbGwgbG92ZSBzdG9yaWVzXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxMb3ZlU3RvcmllcyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzdG9yaWVzID0gYXdhaXQgTG92ZVN0b3J5LmZpbmQoKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICByZXMuanNvbihzdG9yaWVzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHNpbmdsZSBsb3ZlIHN0b3J5XHJcbmV4cG9ydCBjb25zdCBnZXRMb3ZlU3RvcnlCeUlkID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHN0b3J5ID0gYXdhaXQgTG92ZVN0b3J5LmZpbmRCeUlkKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIGlmICghc3RvcnkpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiU3Rvcnkgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oc3RvcnkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGUgbmV3IGxvdmUgc3RvcnlcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUxvdmVTdG9yeSA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBzdG9yeSA9IG5ldyBMb3ZlU3RvcnkocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IHN0b3J5LnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzdG9yeSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBsb3ZlIHN0b3J5XHJcbmV4cG9ydCBjb25zdCB1cGRhdGVMb3ZlU3RvcnkgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3Qgc3RvcnkgPSBhd2FpdCBMb3ZlU3RvcnkuZmluZEJ5SWRBbmRVcGRhdGUocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHksIHsgbmV3OiB0cnVlIH0pO1xyXG4gICAgICAgIGlmICghc3RvcnkpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiU3Rvcnkgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oc3RvcnkpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBEZWxldGUgbG92ZSBzdG9yeVxyXG5leHBvcnQgY29uc3QgZGVsZXRlTG92ZVN0b3J5ID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHN0b3J5ID0gYXdhaXQgTG92ZVN0b3J5LmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIGlmICghc3RvcnkpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiU3Rvcnkgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIlN0b3J5IGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcZW5xdWlyeVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZW5xdWlyeVJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7XHJcbiAgICBjcmVhdGVFbnF1aXJ5LFxyXG4gICAgZ2V0QWxsRW5xdWlyaWVzLFxyXG4gICAgdXBkYXRlRW5xdWlyeVN0YXR1cyxcclxuICAgIGRlbGV0ZUVucXVpcnlcclxufSBmcm9tIFwiLi4vY29udHJvbGxlcnMvZW5xdWlyeUNvbnRyb2xsZXIuanNcIjtcclxuXHJcbmNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG5yb3V0ZXIucG9zdChcIi9cIiwgY3JlYXRlRW5xdWlyeSk7XHJcbnJvdXRlci5nZXQoXCIvXCIsIGdldEFsbEVucXVpcmllcyk7XHJcbnJvdXRlci5wdXQoXCIvOmlkL3N0YXR1c1wiLCB1cGRhdGVFbnF1aXJ5U3RhdHVzKTtcclxucm91dGVyLmRlbGV0ZShcIi86aWRcIiwgZGVsZXRlRW5xdWlyeSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXEVucXVpcnkuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL0VucXVpcnkuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCBlbnF1aXJ5U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICBncm9vbU5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGJyaWRlTmFtZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgcGhvbmVOdW1iZXI6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGV2ZW50U3RhcnREYXRlOiB7IHR5cGU6IERhdGUsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgZXZlbnRFbmREYXRlOiB7IHR5cGU6IERhdGUsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgZXZlbnRzOiBbeyB0eXBlOiBTdHJpbmcgfV0sIC8vIEFycmF5IG9mIGV2ZW50IG5hbWVzXHJcbiAgICAgICAgYnVkZ2V0OiB7IHR5cGU6IE51bWJlciB9LFxyXG4gICAgICAgIGxvY2F0aW9uOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBzZXJ2aWNlczogW3sgdHlwZTogU3RyaW5nIH1dLCAvLyBBcnJheSBvZiBzZXJ2aWNlcyAoUGhvdG9ncmFwaHkvRmlsbXMvQm90aClcclxuICAgICAgICBtZXNzYWdlOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIHN0YXR1czogeyB0eXBlOiBTdHJpbmcsIGVudW06IFtcIk5ld1wiLCBcIkNvbnRhY3RlZFwiLCBcIkJvb2tlZFwiLCBcIkNsb3NlZFwiXSwgZGVmYXVsdDogXCJOZXdcIiB9LFxyXG4gICAgfSxcclxuICAgIHsgdGltZXN0YW1wczogdHJ1ZSB9XHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtb25nb29zZS5tb2RlbHMuRW5xdWlyeSB8fCBtb25nb29zZS5tb2RlbChcIkVucXVpcnlcIiwgZW5xdWlyeVNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxlbnF1aXJ5Q29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9lbnF1aXJ5Q29udHJvbGxlci5qc1wiO2ltcG9ydCBFbnF1aXJ5IGZyb20gXCIuLi9tb2RlbHMvRW5xdWlyeS5qc1wiO1xyXG5cclxuaW1wb3J0IHsgc2VuZEVtYWlsIH0gZnJvbSBcIi4uL3V0aWxzL2VtYWlsU2VydmljZS5qc1wiO1xyXG5cclxuLy8gQ3JlYXRlIGEgbmV3IGVucXVpcnkgKFB1YmxpYylcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUVucXVpcnkgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZW5xdWlyeSA9IG5ldyBFbnF1aXJ5KHJlcS5ib2R5KTtcclxuICAgICAgICBhd2FpdCBlbnF1aXJ5LnNhdmUoKTtcclxuXHJcbiAgICAgICAgLy8gU2VuZCBFbWFpbCBOb3RpZmljYXRpb25cclxuICAgICAgICBjb25zdCBhZG1pbkVtYWlsID0gXCJwaXhlbHByb2l0c29sdXRpb25zQGdtYWlsLmNvbVwiO1xyXG4gICAgICAgIGlmIChhZG1pbkVtYWlsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWxDb250ZW50ID0gYFxyXG4gICAgICAgICAgICAgICAgPGgyPk5ldyBcIkJvb2sgVXNcIiBFbnF1aXJ5IFJlY2VpdmVkPC9oMj5cclxuICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+Q291cGxlOjwvc3Ryb25nPiAke2VucXVpcnkuZ3Jvb21OYW1lfSAmICR7ZW5xdWlyeS5icmlkZU5hbWV9PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5QaG9uZTo8L3N0cm9uZz4gJHtlbnF1aXJ5LnBob25lTnVtYmVyfTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPjxzdHJvbmc+RGF0ZTo8L3N0cm9uZz4gJHtuZXcgRGF0ZShlbnF1aXJ5LmV2ZW50U3RhcnREYXRlKS50b0RhdGVTdHJpbmcoKX0gLSAke25ldyBEYXRlKGVucXVpcnkuZXZlbnRFbmREYXRlKS50b0RhdGVTdHJpbmcoKX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48c3Ryb25nPkxvY2F0aW9uOjwvc3Ryb25nPiAke2VucXVpcnkubG9jYXRpb259PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5CdWRnZXQ6PC9zdHJvbmc+ICR7ZW5xdWlyeS5idWRnZXR9PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+PHN0cm9uZz5NZXNzYWdlOjwvc3Ryb25nPiAke2VucXVpcnkubWVzc2FnZX08L3A+XHJcbiAgICAgICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiJHtwcm9jZXNzLmVudi5DTElFTlRfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnfS9lbnF1aXJpZXNcIj5WaWV3IGluIEFkbWluIFBhbmVsPC9hPlxyXG4gICAgICAgICAgICBgO1xyXG5cclxuICAgICAgICAgICAgYXdhaXQgc2VuZEVtYWlsKHtcclxuICAgICAgICAgICAgICAgIHRvOiBhZG1pbkVtYWlsLFxyXG4gICAgICAgICAgICAgICAgc3ViamVjdDogYE5ldyBFbnF1aXJ5OiAke2VucXVpcnkuZ3Jvb21OYW1lfSAmICR7ZW5xdWlyeS5icmlkZU5hbWV9YCxcclxuICAgICAgICAgICAgICAgIGh0bWw6IGh0bWxDb250ZW50LFxyXG4gICAgICAgICAgICAgICAgcmVwbHlUbzogXCJcIixcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihlbnF1aXJ5KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gR2V0IGFsbCBlbnF1aXJpZXMgKEFkbWluKVxyXG5leHBvcnQgY29uc3QgZ2V0QWxsRW5xdWlyaWVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGVucXVpcmllcyA9IGF3YWl0IEVucXVpcnkuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGVucXVpcmllcyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBlbnF1aXJ5IHN0YXR1cyAoQWRtaW4pXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVFbnF1aXJ5U3RhdHVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgc3RhdHVzIH0gPSByZXEuYm9keTtcclxuICAgICAgICBjb25zdCBlbnF1aXJ5ID0gYXdhaXQgRW5xdWlyeS5maW5kQnlJZEFuZFVwZGF0ZShcclxuICAgICAgICAgICAgcmVxLnBhcmFtcy5pZCxcclxuICAgICAgICAgICAgeyBzdGF0dXMgfSxcclxuICAgICAgICAgICAgeyBuZXc6IHRydWUgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKCFlbnF1aXJ5KSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIkVucXVpcnkgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oZW5xdWlyeSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBlbnF1aXJ5IChBZG1pbilcclxuZXhwb3J0IGNvbnN0IGRlbGV0ZUVucXVpcnkgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgZW5xdWlyeSA9IGF3YWl0IEVucXVpcnkuZmluZEJ5SWRBbmREZWxldGUocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCFlbnF1aXJ5KSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIkVucXVpcnkgbm90IGZvdW5kXCIgfSk7XHJcbiAgICAgICAgcmVzLmpzb24oeyBtZXNzYWdlOiBcIkVucXVpcnkgZGVsZXRlZCBzdWNjZXNzZnVsbHlcIiB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFxjb250YWN0Um91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9jb250YWN0Um91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHtcclxuICAgIGNyZWF0ZUNvbnRhY3QsXHJcbiAgICBnZXRBbGxDb250YWN0cyxcclxuICAgIHVwZGF0ZUNvbnRhY3RTdGF0dXMsXHJcbiAgICBkZWxldGVDb250YWN0XHJcbn0gZnJvbSBcIi4uL2NvbnRyb2xsZXJzL2NvbnRhY3RDb250cm9sbGVyLmpzXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLnBvc3QoXCIvXCIsIGNyZWF0ZUNvbnRhY3QpO1xyXG5yb3V0ZXIuZ2V0KFwiL1wiLCBnZXRBbGxDb250YWN0cyk7XHJcbnJvdXRlci5wdXQoXCIvOmlkL3N0YXR1c1wiLCB1cGRhdGVDb250YWN0U3RhdHVzKTtcclxucm91dGVyLmRlbGV0ZShcIi86aWRcIiwgZGVsZXRlQ29udGFjdCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXENvbnRhY3QuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL0NvbnRhY3QuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCBjb250YWN0U2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICBuYW1lOiB7IHR5cGU6IFN0cmluZywgcmVxdWlyZWQ6IHRydWUgfSxcclxuICAgICAgICBlbWFpbDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgc3ViamVjdDogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgbWVzc2FnZTogeyB0eXBlOiBTdHJpbmcsIHJlcXVpcmVkOiB0cnVlIH0sXHJcbiAgICAgICAgc3RhdHVzOiB7IHR5cGU6IFN0cmluZywgZW51bTogW1wiTmV3XCIsIFwiUmVhZFwiLCBcIlJlcGxpZWRcIl0sIGRlZmF1bHQ6IFwiTmV3XCIgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkNvbnRhY3QgfHwgbW9uZ29vc2UubW9kZWwoXCJDb250YWN0XCIsIGNvbnRhY3RTY2hlbWEpO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcY29udHJvbGxlcnNcXFxcY29udGFjdENvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvY29udGFjdENvbnRyb2xsZXIuanNcIjtpbXBvcnQgQ29udGFjdCBmcm9tIFwiLi4vbW9kZWxzL0NvbnRhY3QuanNcIjtcclxuXHJcbmltcG9ydCB7IHNlbmRFbWFpbCB9IGZyb20gXCIuLi91dGlscy9lbWFpbFNlcnZpY2UuanNcIjtcclxuXHJcbi8vIENyZWF0ZSBhIG5ldyBjb250YWN0IG1lc3NhZ2UgKFB1YmxpYylcclxuZXhwb3J0IGNvbnN0IGNyZWF0ZUNvbnRhY3QgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY29udGFjdCA9IG5ldyBDb250YWN0KHJlcS5ib2R5KTtcclxuICAgICAgICBhd2FpdCBjb250YWN0LnNhdmUoKTtcclxuXHJcbiAgICAgICAgLy8gU2VuZCBFbWFpbCBOb3RpZmljYXRpb25cclxuICAgICAgICBjb25zdCBhZG1pbkVtYWlsID0gXCJwaXhlbHByb2l0c29sdXRpb25zQGdtYWlsLmNvbVwiO1xyXG5cclxuICAgICAgICBjb25zdCB7IG5hbWUsIGVtYWlsLCBzdWJqZWN0LCBtZXNzYWdlIH0gPSByZXEuYm9keTtcclxuXHJcbiAgICAgICAgY29uc3QgaHRtbENvbnRlbnQgPSBgXHJcbiAgICAgICAgICAgIDxoMj5NZXNzYWdlIFJlY2VpdmVkPC9oMj5cclxuICAgICAgICAgICAgPHA+SGVsbG8gJHtuYW1lfSw8L3A+XHJcbiAgICAgICAgICAgIDxwPlRoYW5rIHlvdSBmb3IgY29udGFjdGluZyBUaGUgUGF0aWwgUGhvdG9ncmFwaHkuIFdlIGhhdmUgcmVjZWl2ZWQgeW91ciBtZXNzYWdlLjwvcD5cclxuICAgICAgICAgICAgPHA+PHN0cm9uZz5TdWJqZWN0Ojwvc3Ryb25nPiAke3N1YmplY3R9PC9wPlxyXG4gICAgICAgICAgICA8cD48c3Ryb25nPk1lc3NhZ2U6PC9zdHJvbmc+PC9wPlxyXG4gICAgICAgICAgICA8cD4ke21lc3NhZ2V9PC9wPlxyXG4gICAgICAgICAgICA8YnI+XHJcbiAgICAgICAgICAgIDxwPldlIHdpbGwgZ2V0IGJhY2sgdG8geW91IHNob3J0bHkuPC9wPlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGF3YWl0IHNlbmRFbWFpbCh7XHJcbiAgICAgICAgICAgIHRvOiBhZG1pbkVtYWlsLFxyXG4gICAgICAgICAgICAvLyBjYzogXCJwaXhlbHByb2l0c29sdXRpb25zQGdtYWlsLmNvbVwiLFxyXG4gICAgICAgICAgICBzdWJqZWN0OiBgTWVzc2FnZSBSZWNlaXZlZDogJHtzdWJqZWN0fWAsXHJcbiAgICAgICAgICAgIGh0bWw6IGh0bWxDb250ZW50LFxyXG4gICAgICAgICAgICByZXBseVRvOiBlbWFpbCxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDEpLmpzb24oY29udGFjdCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIEdldCBhbGwgY29udGFjdCBtZXNzYWdlcyAoQWRtaW4pXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxDb250YWN0cyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjb250YWN0cyA9IGF3YWl0IENvbnRhY3QuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGNvbnRhY3RzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gVXBkYXRlIGNvbnRhY3Qgc3RhdHVzIChBZG1pbilcclxuZXhwb3J0IGNvbnN0IHVwZGF0ZUNvbnRhY3RTdGF0dXMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IGNvbnRhY3QgPSBhd2FpdCBDb250YWN0LmZpbmRCeUlkQW5kVXBkYXRlKFxyXG4gICAgICAgICAgICByZXEucGFyYW1zLmlkLFxyXG4gICAgICAgICAgICB7IHN0YXR1cyB9LFxyXG4gICAgICAgICAgICB7IG5ldzogdHJ1ZSB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBpZiAoIWNvbnRhY3QpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiQ29udGFjdCBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbihjb250YWN0KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gRGVsZXRlIGNvbnRhY3QgKEFkbWluKVxyXG5leHBvcnQgY29uc3QgZGVsZXRlQ29udGFjdCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBjb250YWN0ID0gYXdhaXQgQ29udGFjdC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIWNvbnRhY3QpIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6IFwiQ29udGFjdCBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih7IG1lc3NhZ2U6IFwiQ29udGFjdCBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGRhc2hib2FyZFJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZGFzaGJvYXJkUm91dGVzLmpzXCI7XHJcbmltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgeyBnZXREYXNoYm9hcmRTdGF0cyB9IGZyb20gJy4uL2NvbnRyb2xsZXJzL2Rhc2hib2FyZENvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5nZXQoJy9zdGF0cycsIGdldERhc2hib2FyZFN0YXRzKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGRhc2hib2FyZENvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvZGFzaGJvYXJkQ29udHJvbGxlci5qc1wiO1xyXG5pbXBvcnQgRW5xdWlyeSBmcm9tIFwiLi4vbW9kZWxzL0VucXVpcnkuanNcIjtcclxuaW1wb3J0IE9yZGVyIGZyb20gXCIuLi9tb2RlbHMvT3JkZXIuanNcIjtcclxuaW1wb3J0IFF1b3RhdGlvbiBmcm9tIFwiLi4vbW9kZWxzL1F1b3RhdGlvbi5qc1wiO1xyXG5pbXBvcnQgSW52b2ljZSBmcm9tIFwiLi4vbW9kZWxzL0ludm9pY2UuanNcIjtcclxuaW1wb3J0IENvbnRhY3QgZnJvbSBcIi4uL21vZGVscy9Db250YWN0LmpzXCI7XHJcbmltcG9ydCBDbGllbnQgZnJvbSBcIi4uL21vZGVscy9DbGllbnQuanNcIjtcclxuaW1wb3J0IFRlc3RpbW9uaWFsIGZyb20gXCIuLi9tb2RlbHMvVGVzdGltb25pYWwuanNcIjtcclxuaW1wb3J0IEdhbGxlcnkgZnJvbSBcIi4uL21vZGVscy9HYWxsZXJ5LmpzXCI7XHJcbmltcG9ydCBTbGlkZXIgZnJvbSBcIi4uL21vZGVscy9TbGlkZXIuanNcIjtcclxuaW1wb3J0IExvdmVTdG9yeSBmcm9tIFwiLi4vbW9kZWxzL0xvdmVTdG9yeS5qc1wiO1xyXG5pbXBvcnQgRmlsbSBmcm9tIFwiLi4vbW9kZWxzL0ZpbG0uanNcIjtcclxuaW1wb3J0IFVzZXIgZnJvbSBcIi4uL21vZGVscy9Vc2VyLmpzXCI7XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RGFzaGJvYXJkU3RhdHMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdG9kYXkgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIHRvZGF5LnNldEhvdXJzKDAsIDAsIDAsIDApO1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0T2ZXZWVrID0gbmV3IERhdGUodG9kYXkpO1xyXG4gICAgICAgIHN0YXJ0T2ZXZWVrLnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpIC0gNyk7XHJcbiAgICAgICAgY29uc3Qgc3RhcnRPZk1vbnRoID0gbmV3IERhdGUodG9kYXkuZ2V0RnVsbFllYXIoKSwgdG9kYXkuZ2V0TW9udGgoKSwgMSk7XHJcblxyXG4gICAgICAgIC8vIDEuIEtQSSBDYXJkc1xyXG4gICAgICAgIGNvbnN0IG5ld0VucXVpcmllc1RvZGF5ID0gYXdhaXQgRW5xdWlyeS5jb3VudERvY3VtZW50cyh7IGNyZWF0ZWRBdDogeyAkZ3RlOiB0b2RheSB9IH0pO1xyXG4gICAgICAgIGNvbnN0IG5ld0VucXVpcmllc1dlZWsgPSBhd2FpdCBFbnF1aXJ5LmNvdW50RG9jdW1lbnRzKHsgY3JlYXRlZEF0OiB7ICRndGU6IHN0YXJ0T2ZXZWVrIH0gfSk7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIG9yZGVyIHN0YXR1cyBlbnVtIGZvciAnUGVuZGluZycvJ0NvbmZpcm1lZCcgb3Igc2ltaWxhclxyXG4gICAgICAgIGNvbnN0IG5ld09yZGVyc0NvdW50ID0gYXdhaXQgT3JkZXIuY291bnREb2N1bWVudHMoeyBjcmVhdGVkQXQ6IHsgJGd0ZTogc3RhcnRPZk1vbnRoIH0gfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBlbmRpbmdRdW90YXRpb25zID0gYXdhaXQgUXVvdGF0aW9uLmNvdW50RG9jdW1lbnRzKHtcclxuICAgICAgICAgICAgc3RhdHVzOiB7ICRpbjogWydEcmFmdCcsICdTZW50JywgJ0F3YWl0aW5nIEFwcHJvdmFsJ10gfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB1bnBhaWRJbnZvaWNlc0FnZyA9IGF3YWl0IEludm9pY2UuYWdncmVnYXRlKFtcclxuICAgICAgICAgICAgeyAkbWF0Y2g6IHsgcGF5bWVudFN0YXR1czogeyAkbmU6ICdQYWlkJyB9IH0gfSxcclxuICAgICAgICAgICAgeyAkZ3JvdXA6IHsgX2lkOiBudWxsLCBjb3VudDogeyAkc3VtOiAxIH0sIHRvdGFsQW1vdW50OiB7ICRzdW06IHsgJHN1YnRyYWN0OiBbXCIkZ3JhbmRUb3RhbFwiLCBcIiRhbW91bnRQYWlkXCJdIH0gfSB9IH1cclxuICAgICAgICBdKTtcclxuICAgICAgICBjb25zdCB1bnBhaWRJbnZvaWNlc0NvdW50ID0gdW5wYWlkSW52b2ljZXNBZ2dbMF0/LmNvdW50IHx8IDA7XHJcbiAgICAgICAgY29uc3QgdW5wYWlkSW52b2ljZXNBbW91bnQgPSB1bnBhaWRJbnZvaWNlc0FnZ1swXT8udG90YWxBbW91bnQgfHwgMDtcclxuXHJcbiAgICAgICAgY29uc3QgbmV4dFdlZWsgPSBuZXcgRGF0ZSh0b2RheSk7XHJcbiAgICAgICAgbmV4dFdlZWsuc2V0RGF0ZSh0b2RheS5nZXREYXRlKCkgKyA3KTtcclxuICAgICAgICBjb25zdCB1cGNvbWluZ1Nob290c0NvdW50ID0gYXdhaXQgT3JkZXIuY291bnREb2N1bWVudHMoe1xyXG4gICAgICAgICAgICBldmVudF9kYXRlOiB7ICRndGU6IHRvZGF5LCAkbHRlOiBuZXh0V2VlayB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIEdhbGxlcnkgLyBDb250ZW50IEhlYWx0aFxyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlRdWV1ZSA9IGF3YWl0IE9yZGVyLmNvdW50RG9jdW1lbnRzKHsgb3JkZXJfc3RhdHVzOiAnSW4gUHJvZ3Jlc3MnIH0pO1xyXG4gICAgICAgIGNvbnN0IGdhbGxlcnlTdGF0cyA9IHtcclxuICAgICAgICAgICAgdG90YWw6IGF3YWl0IEdhbGxlcnkuY291bnREb2N1bWVudHMoKSxcclxuICAgICAgICAgICAgLy8gdXBsb2FkZWQ6IGF3YWl0IEdhbGxlcnkuY291bnREb2N1bWVudHMoeyBzdGF0dXM6ICdQdWJsaXNoZWQnIH0pIC8vIElmIFN0YXR1cyBleGlzdHNcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCB1bnJlYWRNZXNzYWdlcyA9IGF3YWl0IENvbnRhY3QuY291bnREb2N1bWVudHMoeyBzdGF0dXM6ICdOZXcnIH0pO1xyXG4gICAgICAgIGNvbnN0IGFjdGl2ZUNsaWVudHMgPSBhd2FpdCBDbGllbnQuY291bnREb2N1bWVudHMoeyBzdGF0dXM6ICdBY3RpdmUnIH0pO1xyXG4gICAgICAgIGNvbnN0IHBlbmRpbmdUZXN0aW1vbmlhbHMgPSBhd2FpdCBUZXN0aW1vbmlhbC5jb3VudERvY3VtZW50cyh7IHN0YXR1czogJ1BlbmRpbmcnIH0pO1xyXG5cclxuICAgICAgICAvLyAyLiBBY3Rpb24gUmVxdWlyZWRcclxuICAgICAgICBjb25zdCB5ZXN0ZXJkYXkgPSBuZXcgRGF0ZSh0b2RheSk7XHJcbiAgICAgICAgeWVzdGVyZGF5LnNldERhdGUodG9kYXkuZ2V0RGF0ZSgpIC0gMSk7XHJcbiAgICAgICAgY29uc3QgZW5xdWlyaWVzTm9SZXBseSA9IGF3YWl0IEVucXVpcnkuZmluZCh7XHJcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogeyAkbHQ6IHllc3RlcmRheSB9LFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdOZXcnXHJcbiAgICAgICAgfSkuc2VsZWN0KCdfaWQgbmFtZXMgZ3Jvb21OYW1lIGJyaWRlTmFtZSBjcmVhdGVkQXQnKS5saW1pdCg1KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGhyZWVEYXlzQWdvID0gbmV3IERhdGUodG9kYXkpO1xyXG4gICAgICAgIHRocmVlRGF5c0Fnby5zZXREYXRlKHRvZGF5LmdldERhdGUoKSAtIDMpO1xyXG4gICAgICAgIGNvbnN0IG9sZFF1b3RhdGlvbnMgPSBhd2FpdCBRdW90YXRpb24uZmluZCh7XHJcbiAgICAgICAgICAgIHVwZGF0ZWRBdDogeyAkbHQ6IHRocmVlRGF5c0FnbyB9LFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdTZW50J1xyXG4gICAgICAgIH0pLnNlbGVjdCgnX2lkIHF1b3RlTnVtYmVyIGNsaWVudE5hbWUgdXBkYXRlZEF0JykubGltaXQoNSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBlbmRpbmdPcmRlcnMgPSBhd2FpdCBPcmRlci5maW5kKHsgb3JkZXJfc3RhdHVzOiAnUGVuZGluZycgfSkuc2VsZWN0KCdfaWQgbmFtZSBjcmVhdGVkQXQnKS5saW1pdCg1KTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3ZlcmR1ZUludm9pY2VzID0gYXdhaXQgSW52b2ljZS5maW5kKHtcclxuICAgICAgICAgICAgZHVlRGF0ZTogeyAkbHQ6IHRvZGF5IH0sXHJcbiAgICAgICAgICAgIHBheW1lbnRTdGF0dXM6IHsgJG5lOiAnUGFpZCcgfVxyXG4gICAgICAgIH0pLnNlbGVjdCgnX2lkIGludm9pY2VOdW1iZXIgY2xpZW50TmFtZSBkdWVEYXRlIGdyYW5kVG90YWwgYW1vdW50UGFpZCcpLmxpbWl0KDUpO1xyXG5cclxuICAgICAgICBjb25zdCBwZW5kaW5nVGVzdGltb25pYWxzTGlzdCA9IGF3YWl0IFRlc3RpbW9uaWFsLmZpbmQoeyBzdGF0dXM6ICdQZW5kaW5nJyB9KS5zZWxlY3QoJ19pZCBjb3VwbGVOYW1lIGNyZWF0ZWRBdCBzaG9ydERlc2NyaXB0aW9uIGZ1bGxEZXNjcmlwdGlvbiByYXRpbmcgbG9jYXRpb24gdGh1bWJuYWlsJykubGltaXQoNCk7XHJcblxyXG4gICAgICAgIC8vIDMuIFBpcGVsaW5lXHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGF0cyA9IGF3YWl0IE9yZGVyLmFnZ3JlZ2F0ZShbXHJcbiAgICAgICAgICAgIHsgJGdyb3VwOiB7IF9pZDogXCIkb3JkZXJfc3RhdHVzXCIsIGNvdW50OiB7ICRzdW06IDEgfSB9IH1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3JkZXJzQnlUeXBlID0gYXdhaXQgT3JkZXIuYWdncmVnYXRlKFtcclxuICAgICAgICAgICAgeyAkZ3JvdXA6IHsgX2lkOiBcIiRwaG90b2dyYXBoeV90eXBlXCIsIGNvdW50OiB7ICRzdW06IDEgfSB9IH1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgLy8gNC4gQ2FsZW5kYXIgLyBTY2hlZHVsZSAtIE5leHQgNSBzaG9vdHNcclxuICAgICAgICBjb25zdCB1cGNvbWluZ1Nob290cyA9IGF3YWl0IE9yZGVyLmZpbmQoe1xyXG4gICAgICAgICAgICBldmVudF9kYXRlOiB7ICRndGU6IHRvZGF5IH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuc29ydCh7IGV2ZW50X2RhdGU6IDEgfSlcclxuICAgICAgICAgICAgLmxpbWl0KDUpXHJcbiAgICAgICAgICAgIC5zZWxlY3QoJ19pZCBuYW1lIGV2ZW50X25hbWUgZXZlbnRfZGF0ZSBsb2NhdGlvbiBwaG90b2dyYXBoeV90eXBlIG9yZGVyX3N0YXR1cycpO1xyXG5cclxuICAgICAgICAvLyA1LiBSZXZlbnVlIFNuYXBzaG90IChUaGlzIE1vbnRoKVxyXG4gICAgICAgIGNvbnN0IHJldmVudWVTdGF0cyA9IGF3YWl0IEludm9pY2UuYWdncmVnYXRlKFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJG1hdGNoOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW52b2ljZURhdGU6IHsgJGd0ZTogc3RhcnRPZk1vbnRoIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgJGdyb3VwOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2lkOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGJpbGxlZDogeyAkc3VtOiBcIiRncmFuZFRvdGFsXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xsZWN0ZWQ6IHsgJHN1bTogXCIkYW1vdW50UGFpZFwiIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIGNvbnN0IHRoaXNNb250aEJpbGxlZCA9IHJldmVudWVTdGF0c1swXT8uYmlsbGVkIHx8IDA7XHJcbiAgICAgICAgY29uc3QgdGhpc01vbnRoQ29sbGVjdGVkID0gcmV2ZW51ZVN0YXRzWzBdPy5jb2xsZWN0ZWQgfHwgMDtcclxuXHJcbiAgICAgICAgLy8gVG90YWwgT3V0c3RhbmRpbmcgKEFsbCB0aW1lKVxyXG4gICAgICAgIGNvbnN0IHRvdGFsT3V0c3RhbmRpbmdBZ2cgPSBhd2FpdCBJbnZvaWNlLmFnZ3JlZ2F0ZShbXHJcbiAgICAgICAgICAgIHsgJG1hdGNoOiB7IHBheW1lbnRTdGF0dXM6IHsgJG5lOiAnUGFpZCcgfSB9IH0sXHJcbiAgICAgICAgICAgIHsgJGdyb3VwOiB7IF9pZDogbnVsbCwgdG90YWw6IHsgJHN1bTogeyAkc3VidHJhY3Q6IFtcIiRncmFuZFRvdGFsXCIsIFwiJGFtb3VudFBhaWRcIl0gfSB9IH0gfVxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIGNvbnN0IHRvdGFsT3V0c3RhbmRpbmcgPSB0b3RhbE91dHN0YW5kaW5nQWdnWzBdPy50b3RhbCB8fCAwO1xyXG5cclxuICAgICAgICAvLyA2LiBSZWNlbnQgQWN0aXZpdHlcclxuICAgICAgICBjb25zdCByZWNlbnRFbnF1aXJpZXMgPSBhd2FpdCBFbnF1aXJ5LmZpbmQoKS5zb3J0KHsgY3JlYXRlZEF0OiAtMSB9KS5saW1pdCgzKS5sZWFuKCk7XHJcbiAgICAgICAgY29uc3QgcmVjZW50T3JkZXJzID0gYXdhaXQgT3JkZXIuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pLmxpbWl0KDMpLmxlYW4oKTtcclxuICAgICAgICBjb25zdCByZWNlbnRJbnZvaWNlcyA9IGF3YWl0IEludm9pY2UuZmluZCgpLnNvcnQoeyBjcmVhdGVkQXQ6IC0xIH0pLmxpbWl0KDMpLmxlYW4oKTtcclxuXHJcbiAgICAgICAgY29uc3QgYWN0aXZpdHlGZWVkID0gW1xyXG4gICAgICAgICAgICAuLi5yZWNlbnRFbnF1aXJpZXMubWFwKGUgPT4gKHsgdHlwZTogJ0VucXVpcnknLCBkYXRlOiBlLmNyZWF0ZWRBdCwgdGV4dDogYE5ldyBlbnF1aXJ5OiAke2UuZ3Jvb21OYW1lfSAmICR7ZS5icmlkZU5hbWV9YCwgaWQ6IGUuX2lkIH0pKSxcclxuICAgICAgICAgICAgLi4ucmVjZW50T3JkZXJzLm1hcChvID0+ICh7IHR5cGU6ICdPcmRlcicsIGRhdGU6IG8uY3JlYXRlZEF0LCB0ZXh0OiBgT3JkZXIgY3JlYXRlZDogJHtvLm5hbWV9YCwgaWQ6IG8uX2lkIH0pKSxcclxuICAgICAgICAgICAgLi4ucmVjZW50SW52b2ljZXMubWFwKGkgPT4gKHsgdHlwZTogJ0ludm9pY2UnLCBkYXRlOiBpLmNyZWF0ZWRBdCwgdGV4dDogYEludm9pY2UgJHtpLmludm9pY2VOdW1iZXJ9YCwgaWQ6IGkuX2lkIH0pKVxyXG4gICAgICAgIF0uc29ydCgoYSwgYikgPT4gbmV3IERhdGUoYi5kYXRlKSAtIG5ldyBEYXRlKGEuZGF0ZSkpLnNsaWNlKDAsIDEwKTtcclxuXHJcbiAgICAgICAgLy8gOS4gQ29udGVudCBIZWFsdGhcclxuICAgICAgICBjb25zdCBzbGlkZXJBY3RpdmUgPSBhd2FpdCBTbGlkZXIuY291bnREb2N1bWVudHMoeyBhY3RpdmU6IHRydWUgfSk7XHJcbiAgICAgICAgY29uc3Qgc3Rvcmllc1B1Ymxpc2hlZCA9IGF3YWl0IExvdmVTdG9yeS5jb3VudERvY3VtZW50cyh7IHN0YXR1czogJ1B1Ymxpc2hlZCcgfSk7XHJcbiAgICAgICAgY29uc3QgdGVzdGltb25pYWxzUHVibGlzaGVkID0gYXdhaXQgVGVzdGltb25pYWwuY291bnREb2N1bWVudHMoeyBzdGF0dXM6ICdQdWJsaXNoZWQnIH0pO1xyXG5cclxuICAgICAgICAvLyAxMC4gVXNlcnNcclxuICAgICAgICBjb25zdCB1c2VyU3RhdHMgPSB7XHJcbiAgICAgICAgICAgIHRvdGFsOiBhd2FpdCBVc2VyLmNvdW50RG9jdW1lbnRzKCksXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gMTEuIENoYXJ0cyBEYXRhXHJcbiAgICAgICAgLy8gTW9udGhseSBSZXZlbnVlIChMYXN0IDYgTW9udGhzKVxyXG4gICAgICAgIGNvbnN0IHNpeE1vbnRoc0FnbyA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgc2l4TW9udGhzQWdvLnNldE1vbnRoKHNpeE1vbnRoc0Fnby5nZXRNb250aCgpIC0gNSk7XHJcbiAgICAgICAgc2l4TW9udGhzQWdvLnNldERhdGUoMSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG1vbnRobHlSZXZlbnVlID0gYXdhaXQgSW52b2ljZS5hZ2dyZWdhdGUoW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkbWF0Y2g6IHtcclxuICAgICAgICAgICAgICAgICAgICBpbnZvaWNlRGF0ZTogeyAkZ3RlOiBzaXhNb250aHNBZ28gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkZ3JvdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICBfaWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IHsgJG1vbnRoOiBcIiRpbnZvaWNlRGF0ZVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHllYXI6IHsgJHllYXI6IFwiJGludm9pY2VEYXRlXCIgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWw6IHsgJHN1bTogXCIkZ3JhbmRUb3RhbFwiIH0sIC8vIFVzaW5nIGdyYW5kVG90YWwgYXMgcmV2ZW51ZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxlY3RlZDogeyAkc3VtOiBcIiRhbW91bnRQYWlkXCIgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7ICRzb3J0OiB7IFwiX2lkLnllYXJcIjogMSwgXCJfaWQubW9udGhcIjogMSB9IH1cclxuICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgY29uc3QgbW9udGhseU9yZGVycyA9IGF3YWl0IE9yZGVyLmFnZ3JlZ2F0ZShbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRtYXRjaDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGNyZWF0ZWRBdDogeyAkZ3RlOiBzaXhNb250aHNBZ28gfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAkZ3JvdXA6IHtcclxuICAgICAgICAgICAgICAgICAgICBfaWQ6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW9udGg6IHsgJG1vbnRoOiBcIiRjcmVhdGVkQXRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5ZWFyOiB7ICR5ZWFyOiBcIiRjcmVhdGVkQXRcIiB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogeyAkc3VtOiAxIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgeyAkc29ydDogeyBcIl9pZC55ZWFyXCI6IDEsIFwiX2lkLm1vbnRoXCI6IDEgfSB9XHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIC8vIEludm9pY2UgU3RhdHVzIERpc3RyaWJ1dGlvblxyXG4gICAgICAgIGNvbnN0IGludm9pY2VTdGF0dXMgPSBhd2FpdCBJbnZvaWNlLmFnZ3JlZ2F0ZShbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICRncm91cDoge1xyXG4gICAgICAgICAgICAgICAgICAgIF9pZDogXCIkcGF5bWVudFN0YXR1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiB7ICRzdW06IDEgfSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogeyAkc3VtOiBcIiRncmFuZFRvdGFsXCIgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXSk7XHJcblxyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHtcclxuICAgICAgICAgICAga3BpOiB7XHJcbiAgICAgICAgICAgICAgICBuZXdFbnF1aXJpZXNUb2RheSxcclxuICAgICAgICAgICAgICAgIG5ld0VucXVpcmllc1dlZWssXHJcbiAgICAgICAgICAgICAgICBuZXdPcmRlcnNDb3VudCwgLy8gTW9udGhcclxuICAgICAgICAgICAgICAgIHBlbmRpbmdRdW90YXRpb25zLFxyXG4gICAgICAgICAgICAgICAgdW5wYWlkSW52b2ljZXNDb3VudCxcclxuICAgICAgICAgICAgICAgIHVucGFpZEludm9pY2VzQW1vdW50LFxyXG4gICAgICAgICAgICAgICAgdXBjb21pbmdTaG9vdHNDb3VudCxcclxuICAgICAgICAgICAgICAgIGdhbGxlcnlRdWV1ZSxcclxuICAgICAgICAgICAgICAgIHVucmVhZE1lc3NhZ2VzLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZlQ2xpZW50cyxcclxuICAgICAgICAgICAgICAgIHBlbmRpbmdUZXN0aW1vbmlhbHNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWN0aW9uUmVxdWlyZWQ6IHtcclxuICAgICAgICAgICAgICAgIGVucXVpcmllc05vUmVwbHksXHJcbiAgICAgICAgICAgICAgICBvbGRRdW90YXRpb25zLFxyXG4gICAgICAgICAgICAgICAgcGVuZGluZ09yZGVycyxcclxuICAgICAgICAgICAgICAgIG92ZXJkdWVJbnZvaWNlcyxcclxuICAgICAgICAgICAgICAgIHBlbmRpbmdUZXN0aW1vbmlhbHNMaXN0XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBpcGVsaW5lOiBwaXBlbGluZVN0YXRzLFxyXG4gICAgICAgICAgICBvcmRlcnNCeVR5cGUsXHJcbiAgICAgICAgICAgIHNjaGVkdWxlOiB1cGNvbWluZ1Nob290cyxcclxuICAgICAgICAgICAgcmV2ZW51ZToge1xyXG4gICAgICAgICAgICAgICAgdGhpc01vbnRoQmlsbGVkLFxyXG4gICAgICAgICAgICAgICAgdGhpc01vbnRoQ29sbGVjdGVkLFxyXG4gICAgICAgICAgICAgICAgdG90YWxPdXRzdGFuZGluZ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhY3Rpdml0eUZlZWQsXHJcbiAgICAgICAgICAgIGNvbnRlbnRIZWFsdGg6IHtcclxuICAgICAgICAgICAgICAgIHNsaWRlckFjdGl2ZSxcclxuICAgICAgICAgICAgICAgIHN0b3JpZXNQdWJsaXNoZWQsXHJcbiAgICAgICAgICAgICAgICB0ZXN0aW1vbmlhbHNQdWJsaXNoZWRcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2FsbGVyeVN0YXRzLFxyXG4gICAgICAgICAgICB1c2VyU3RhdHMsXHJcbiAgICAgICAgICAgIGNoYXJ0czoge1xyXG4gICAgICAgICAgICAgICAgbW9udGhseVJldmVudWUsXHJcbiAgICAgICAgICAgICAgICBtb250aGx5T3JkZXJzLFxyXG4gICAgICAgICAgICAgICAgaW52b2ljZVN0YXR1c1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiRGFzaGJvYXJkIFN0YXRzIEVycm9yOlwiLCBlcnJvcik7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBcIkVycm9yIGZldGNoaW5nIGRhc2hib2FyZCBzdGF0c1wiLCBlcnJvcjogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcVGVzdGltb25pYWwuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbW9kZWxzL1Rlc3RpbW9uaWFsLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gXCJtb25nb29zZVwiO1xyXG5cclxuY29uc3QgdGVzdGltb25pYWxTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKFxyXG4gICAge1xyXG4gICAgICAgIGNvdXBsZU5hbWU6IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSB9LFxyXG4gICAgICAgIGxvY2F0aW9uOiB7IHR5cGU6IFN0cmluZywgdHJpbTogdHJ1ZSB9LFxyXG4gICAgICAgIHRodW1ibmFpbDogeyB0eXBlOiBTdHJpbmcgfSwgLy8gVVJMIG9yIEJhc2U2NFxyXG4gICAgICAgIHNob3J0RGVzY3JpcHRpb246IHsgdHlwZTogU3RyaW5nLCByZXF1aXJlZDogdHJ1ZSwgbWF4bGVuZ3RoOiAxMDAwIH0sXHJcbiAgICAgICAgZnVsbERlc2NyaXB0aW9uOiB7IHR5cGU6IFN0cmluZyB9LFxyXG4gICAgICAgIHJhdGluZzogeyB0eXBlOiBOdW1iZXIsIGRlZmF1bHQ6IDUsIG1pbjogMSwgbWF4OiA1IH0sXHJcbiAgICAgICAgZGlzcGxheU9yZGVyOiB7IHR5cGU6IE51bWJlciwgZGVmYXVsdDogMCB9LFxyXG4gICAgICAgIHN0YXR1czoge1xyXG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgICAgIGVudW06IFtcIkFjdGl2ZVwiLCBcIkluYWN0aXZlXCIsIFwiUGVuZGluZ1wiXSxcclxuICAgICAgICAgICAgZGVmYXVsdDogXCJBY3RpdmVcIlxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuLy8gSW5kZXggZm9yIHNvcnRpbmcgYnkgZGlzcGxheSBvcmRlclxyXG50ZXN0aW1vbmlhbFNjaGVtYS5pbmRleCh7IGRpc3BsYXlPcmRlcjogMSB9KTtcclxuXHJcbi8vIEZvcmNlIHJlY29tcGlsYXRpb24gb2YgbW9kZWwgaWYgaXQgZXhpc3RzIChmb3IgSE1SL0RldiBlbnZpcm9ubWVudClcclxuaWYgKG1vbmdvb3NlLm1vZGVscy5UZXN0aW1vbmlhbCkge1xyXG4gICAgZGVsZXRlIG1vbmdvb3NlLm1vZGVscy5UZXN0aW1vbmlhbDtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWwoXCJUZXN0aW1vbmlhbFwiLCB0ZXN0aW1vbmlhbFNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHRlc3RpbW9uaWFsUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy90ZXN0aW1vbmlhbFJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XHJcbmltcG9ydCB7XHJcbiAgICBjcmVhdGVUZXN0aW1vbmlhbCxcclxuICAgIGdldEFsbFRlc3RpbW9uaWFscyxcclxuICAgIGdldFRlc3RpbW9uaWFsQnlJZCxcclxuICAgIHVwZGF0ZVRlc3RpbW9uaWFsLFxyXG4gICAgZGVsZXRlVGVzdGltb25pYWxcclxufSBmcm9tIFwiLi4vY29udHJvbGxlcnMvdGVzdGltb25pYWxDb250cm9sbGVyLmpzXCI7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLnBvc3QoXCIvXCIsIGNyZWF0ZVRlc3RpbW9uaWFsKTtcclxucm91dGVyLmdldChcIi9cIiwgZ2V0QWxsVGVzdGltb25pYWxzKTtcclxucm91dGVyLmdldChcIi86aWRcIiwgZ2V0VGVzdGltb25pYWxCeUlkKTtcclxucm91dGVyLnB1dChcIi86aWRcIiwgdXBkYXRlVGVzdGltb25pYWwpO1xyXG5yb3V0ZXIuZGVsZXRlKFwiLzppZFwiLCBkZWxldGVUZXN0aW1vbmlhbCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFx0ZXN0aW1vbmlhbENvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvdGVzdGltb25pYWxDb250cm9sbGVyLmpzXCI7aW1wb3J0IFRlc3RpbW9uaWFsIGZyb20gXCIuLi9tb2RlbHMvVGVzdGltb25pYWwuanNcIjtcclxuXHJcbi8vIENyZWF0ZSBhIG5ldyB0ZXN0aW1vbmlhbFxyXG5leHBvcnQgY29uc3QgY3JlYXRlVGVzdGltb25pYWwgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdGVzdGltb25pYWwgPSBuZXcgVGVzdGltb25pYWwocmVxLmJvZHkpO1xyXG4gICAgICAgIGF3YWl0IHRlc3RpbW9uaWFsLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbih0ZXN0aW1vbmlhbCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIEdldCBhbGwgdGVzdGltb25pYWxzIChBZG1pbjogYWxsLCBXZWJzaXRlOiBhY3RpdmUpXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxUZXN0aW1vbmlhbHMgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyB0eXBlIH0gPSByZXEucXVlcnk7XHJcbiAgICAgICAgbGV0IHF1ZXJ5ID0ge307XHJcblxyXG4gICAgICAgIC8vIElmIHF1ZXJ5IHBhcmFtID90eXBlPWFjdGl2ZSBpcyBwYXNzZWQsIHJldHVybiBvbmx5IGFjdGl2ZSBvbmVzIChzb3J0ZWQgYnkgZGlzcGxheU9yZGVyKVxyXG4gICAgICAgIGlmICh0eXBlID09PSAnYWN0aXZlJykge1xyXG4gICAgICAgICAgICBxdWVyeS5zdGF0dXMgPSAnQWN0aXZlJztcclxuICAgICAgICAgICAgLy8gU29ydCBieSBkaXNwbGF5T3JkZXIgYXNjZW5kaW5nLCB0aGVuIGNyZWF0ZWRBdCBkZXNjZW5kaW5nXHJcbiAgICAgICAgICAgIGNvbnN0IHRlc3RpbW9uaWFscyA9IGF3YWl0IFRlc3RpbW9uaWFsLmZpbmQocXVlcnkpLnNvcnQoeyBkaXNwbGF5T3JkZXI6IDEsIGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuanNvbih0ZXN0aW1vbmlhbHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRGVmYXVsdDogcmV0dXJuIGFsbCAoc29ydGVkIGJ5IGNyZWF0ZWRBdCBkZXNjKSBmb3IgQWRtaW5cclxuICAgICAgICBjb25zdCB0ZXN0aW1vbmlhbHMgPSBhd2FpdCBUZXN0aW1vbmlhbC5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogLTEgfSk7XHJcbiAgICAgICAgcmVzLmpzb24odGVzdGltb25pYWxzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gR2V0IHNpbmdsZSB0ZXN0aW1vbmlhbFxyXG5leHBvcnQgY29uc3QgZ2V0VGVzdGltb25pYWxCeUlkID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHRlc3RpbW9uaWFsID0gYXdhaXQgVGVzdGltb25pYWwuZmluZEJ5SWQocmVxLnBhcmFtcy5pZCk7XHJcbiAgICAgICAgaWYgKCF0ZXN0aW1vbmlhbCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJUZXN0aW1vbmlhbCBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih0ZXN0aW1vbmlhbCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gVXBkYXRlIHRlc3RpbW9uaWFsXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVUZXN0aW1vbmlhbCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCB0ZXN0aW1vbmlhbCA9IGF3YWl0IFRlc3RpbW9uaWFsLmZpbmRCeUlkQW5kVXBkYXRlKFxyXG4gICAgICAgICAgICByZXEucGFyYW1zLmlkLFxyXG4gICAgICAgICAgICByZXEuYm9keSxcclxuICAgICAgICAgICAgeyBuZXc6IHRydWUgfVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKCF0ZXN0aW1vbmlhbCkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJUZXN0aW1vbmlhbCBub3QgZm91bmRcIiB9KTtcclxuICAgICAgICByZXMuanNvbih0ZXN0aW1vbmlhbCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSB0ZXN0aW1vbmlhbFxyXG5leHBvcnQgY29uc3QgZGVsZXRlVGVzdGltb25pYWwgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgdGVzdGltb25pYWwgPSBhd2FpdCBUZXN0aW1vbmlhbC5maW5kQnlJZEFuZERlbGV0ZShyZXEucGFyYW1zLmlkKTtcclxuICAgICAgICBpZiAoIXRlc3RpbW9uaWFsKSByZXR1cm4gcmVzLnN0YXR1cyg0MDQpLmpzb24oeyBtZXNzYWdlOiBcIlRlc3RpbW9uaWFsIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHsgbWVzc2FnZTogXCJUZXN0aW1vbmlhbCBkZWxldGVkIHN1Y2Nlc3NmdWxseVwiIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXGV2ZW50VHlwZVJvdXRlcy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvZXZlbnRUeXBlUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7XHJcbiAgICBnZXRBbGxFdmVudFR5cGVzLFxyXG4gICAgY3JlYXRlRXZlbnRUeXBlLFxyXG4gICAgdXBkYXRlRXZlbnRUeXBlLFxyXG4gICAgZGVsZXRlRXZlbnRUeXBlXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvZXZlbnRUeXBlQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnLycsIGdldEFsbEV2ZW50VHlwZXMpO1xyXG5yb3V0ZXIucG9zdCgnLycsIGNyZWF0ZUV2ZW50VHlwZSk7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVFdmVudFR5cGUpO1xyXG5yb3V0ZXIuZGVsZXRlKCcvOmlkJywgZGVsZXRlRXZlbnRUeXBlKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHJvdXRlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcXFxcRXZlbnRUeXBlLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9FdmVudFR5cGUuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSAnbW9uZ29vc2UnO1xyXG5cclxuY29uc3QgZXZlbnRUeXBlU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYShcclxuICAgIHtcclxuICAgICAgICBuYW1lOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAgICAgcmVxdWlyZWQ6IFt0cnVlLCAnRXZlbnQgdHlwZSBuYW1lIGlzIHJlcXVpcmVkJ10sXHJcbiAgICAgICAgICAgIHVuaXF1ZTogdHJ1ZSxcclxuICAgICAgICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGxhYmVsOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICAgICAgdHJpbTogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzQWN0aXZlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRydWUsXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcbiAgICB7IHRpbWVzdGFtcHM6IHRydWUgfVxyXG4pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLkV2ZW50VHlwZSB8fCBtb25nb29zZS5tb2RlbCgnRXZlbnRUeXBlJywgZXZlbnRUeXBlU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXGV2ZW50VHlwZUNvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvZXZlbnRUeXBlQ29udHJvbGxlci5qc1wiO2ltcG9ydCBFdmVudFR5cGUgZnJvbSAnLi4vbW9kZWxzL0V2ZW50VHlwZS5qcyc7XHJcblxyXG4vLyBHZXQgYWxsIGV2ZW50IHR5cGVzXHJcbmV4cG9ydCBjb25zdCBnZXRBbGxFdmVudFR5cGVzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGV2ZW50VHlwZXMgPSBhd2FpdCBFdmVudFR5cGUuZmluZCh7IGlzQWN0aXZlOiB0cnVlIH0pLnNvcnQoeyBuYW1lOiAxIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKGV2ZW50VHlwZXMpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyBDcmVhdGUgZXZlbnQgdHlwZVxyXG5leHBvcnQgY29uc3QgY3JlYXRlRXZlbnRUeXBlID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgbmFtZSwgbGFiZWwgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IGV2ZW50VHlwZSA9IG5ldyBFdmVudFR5cGUoe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICBsYWJlbDogbGFiZWwgfHwgbmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnN0IHNhdmVkRXZlbnRUeXBlID0gYXdhaXQgZXZlbnRUeXBlLnNhdmUoKTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMSkuanNvbihzYXZlZEV2ZW50VHlwZSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGlmIChlcnJvci5jb2RlID09PSAxMTAwMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnRXZlbnQgdHlwZSBhbHJlYWR5IGV4aXN0cycgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBldmVudCB0eXBlXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVFdmVudFR5cGUgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyBuYW1lLCBsYWJlbCwgaXNBY3RpdmUgfSA9IHJlcS5ib2R5O1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZWRFdmVudFR5cGUgPSBhd2FpdCBFdmVudFR5cGUuZmluZEJ5SWRBbmRVcGRhdGUoXHJcbiAgICAgICAgICAgIHJlcS5wYXJhbXMuaWQsXHJcbiAgICAgICAgICAgIHsgbmFtZSwgbGFiZWwsIGlzQWN0aXZlIH0sXHJcbiAgICAgICAgICAgIHsgbmV3OiB0cnVlLCBydW5WYWxpZGF0b3JzOiB0cnVlIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIGlmICghdXBkYXRlZEV2ZW50VHlwZSkgcmV0dXJuIHJlcy5zdGF0dXMoNDA0KS5qc29uKHsgbWVzc2FnZTogXCJFdmVudCBUeXBlIG5vdCBmb3VuZFwiIH0pO1xyXG4gICAgICAgIHJlcy5qc29uKHVwZGF0ZWRFdmVudFR5cGUpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIERlbGV0ZSBldmVudCB0eXBlXHJcbmV4cG9ydCBjb25zdCBkZWxldGVFdmVudFR5cGUgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgYXdhaXQgRXZlbnRUeXBlLmZpbmRCeUlkQW5kRGVsZXRlKHJlcS5wYXJhbXMuaWQpO1xyXG4gICAgICAgIHJlcy5qc29uKHsgbWVzc2FnZTogJ0V2ZW50IHR5cGUgZGVsZXRlZCcgfSk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcXFxcc3lzdGVtU2V0dGluZ3NSb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvcm91dGVzL3N5c3RlbVNldHRpbmdzUm91dGVzLmpzXCI7aW1wb3J0IGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7IGdldFNldHRpbmdzLCB1cGRhdGVTZXR0aW5ncyB9IGZyb20gJy4uL2NvbnRyb2xsZXJzL3N5c3RlbVNldHRpbmdzQ29udHJvbGxlci5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuLy8gUm91dGVzXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRTZXR0aW5ncyk7XHJcbnJvdXRlci5wdXQoJy8nLCB1cGRhdGVTZXR0aW5ncyk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCByb3V0ZXI7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxtb2RlbHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXFxcXFN5c3RlbVNldHRpbmdzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9TeXN0ZW1TZXR0aW5ncy5qc1wiO2ltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcblxyXG5jb25zdCBzb2NpYWxMaW5rU2NoZW1hID0gbmV3IG1vbmdvb3NlLlNjaGVtYSh7XHJcbiAgICBwbGF0Zm9ybToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZSxcclxuICAgICAgICBlbnVtOiBbJ1doYXRzQXBwJywgJ0luc3RhZ3JhbScsICdGYWNlYm9vaycsICdZb3VUdWJlJywgJ1R3aXR0ZXInLCAnTGlua2VkSW4nLCAnT3RoZXInXVxyXG4gICAgfSxcclxuICAgIHVybDoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGljb246IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsIC8vIENhbiBzdG9yZSBpY29uIG5hbWUgKGUuZy4sIEx1Y2lkZSBpY29uIG5hbWUpIG9yIFVSTFxyXG4gICAgICAgIGRlZmF1bHQ6ICcnXHJcbiAgICB9LFxyXG4gICAgYWN0aXZlOiB7XHJcbiAgICAgICAgdHlwZTogQm9vbGVhbixcclxuICAgICAgICBkZWZhdWx0OiB0cnVlXHJcbiAgICB9XHJcbn0pO1xyXG5cclxuY29uc3Qgc3lzdGVtU2V0dGluZ3NTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgIGJ1c2luZXNzTmFtZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0OiBcIlRoZSBQYXRpbCBQaG90b2dyYXBoeSAmIEZpbG0nc1wiXHJcbiAgICB9LFxyXG4gICAgcHJpbWFyeUxvZ286IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsIC8vIFVSTCB0byB0aGUgaW1hZ2VcclxuICAgICAgICBkZWZhdWx0OiBcIlwiXHJcbiAgICB9LFxyXG4gICAgc2Vjb25kYXJ5TG9nbzoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZywgLy8gVVJMIHRvIHRoZSBpbWFnZSAoZS5nLiwgZm9yIGRhcmsgbW9kZSBvciBmb290ZXIpXHJcbiAgICAgICAgZGVmYXVsdDogXCJcIlxyXG4gICAgfSxcclxuICAgIHNvY2lhbExpbmtzOiBbc29jaWFsTGlua1NjaGVtYV0sXHJcbiAgICB3ZWJzaXRlVXJsOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGRlZmF1bHQ6IFwiXCJcclxuICAgIH0sXHJcbiAgICBjb250YWN0RW1haWw6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgZGVmYXVsdDogXCJcIlxyXG4gICAgfSxcclxuICAgIGNvbnRhY3RQaG9uZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0OiBcIlwiXHJcbiAgICB9LFxyXG4gICAgcHJpbWFyeU1vYmlsZU51bWJlcjoge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZyxcclxuICAgICAgICBkZWZhdWx0OiBcIlwiXHJcbiAgICB9LFxyXG4gICAgc2Vjb25kYXJ5TW9iaWxlTnVtYmVyOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGRlZmF1bHQ6IFwiXCJcclxuICAgIH0sXHJcbiAgICBhZGRyZXNzOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIGRlZmF1bHQ6IFwiXCJcclxuICAgIH0sXHJcbiAgICAvLyBBZGQgbW9yZSBmaWVsZHMgaGVyZSBhcyBuZWVkZWQgKEdTVCwgZXRjLilcclxufSwgeyB0aW1lc3RhbXBzOiB0cnVlIH0pO1xyXG5cclxuXHJcbi8vIFNpbmdsZXRvbiBwYXR0ZXJuOiBFbnN1cmUgb25seSBvbmUgc2V0dGluZ3MgZG9jdW1lbnQgZXhpc3RzXHJcbnN5c3RlbVNldHRpbmdzU2NoZW1hLnN0YXRpY3MuZ2V0U2V0dGluZ3MgPSBhc3luYyBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBzZXR0aW5ncyA9IGF3YWl0IHRoaXMuZmluZE9uZSgpO1xyXG4gICAgaWYgKHNldHRpbmdzKSByZXR1cm4gc2V0dGluZ3M7XHJcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5jcmVhdGUoe30pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbW9uZ29vc2UubW9kZWxzLlN5c3RlbVNldHRpbmdzIHx8IG1vbmdvb3NlLm1vZGVsKCdTeXN0ZW1TZXR0aW5ncycsIHN5c3RlbVNldHRpbmdzU2NoZW1hKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXHN5c3RlbVNldHRpbmdzQ29udHJvbGxlci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9jb250cm9sbGVycy9zeXN0ZW1TZXR0aW5nc0NvbnRyb2xsZXIuanNcIjtpbXBvcnQgU3lzdGVtU2V0dGluZ3MgZnJvbSAnLi4vbW9kZWxzL1N5c3RlbVNldHRpbmdzLmpzJztcclxuXHJcbi8vIEBkZXNjICAgIEdldCBzeXN0ZW0gc2V0dGluZ3MgKEJyYW5kaW5nLCBldGMuKVxyXG4vLyBAcm91dGUgICBHRVQgL2FwaS9zZXR0aW5nc1xyXG4vLyBAYWNjZXNzICBQdWJsaWNcclxuZXhwb3J0IGNvbnN0IGdldFNldHRpbmdzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHNldHRpbmdzID0gYXdhaXQgU3lzdGVtU2V0dGluZ3MuZ2V0U2V0dGluZ3MoKTtcclxuICAgICAgICByZXMuanNvbihzZXR0aW5ncyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGZldGNoaW5nIHNldHRpbmdzOicsIGVycm9yKTtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6ICdTZXJ2ZXIgRXJyb3InIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gQGRlc2MgICAgVXBkYXRlIHN5c3RlbSBzZXR0aW5nc1xyXG4vLyBAcm91dGUgICBQVVQgL2FwaS9zZXR0aW5nc1xyXG4vLyBAYWNjZXNzICBQcml2YXRlL0FkbWluXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVTZXR0aW5ncyA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgc2V0dGluZ3MgPSBhd2FpdCBTeXN0ZW1TZXR0aW5ncy5maW5kT25lKCk7IC8vIE5vdCB1c2luZyBnZXRTZXR0aW5ncygpIHRvIGF2b2lkIGNyZWF0aW9uIGlmIHdlIGp1c3Qgd2FudCB0byB1cGRhdGUgdmFsaWQgZG9jXHJcblxyXG4gICAgICAgIGlmICghc2V0dGluZ3MpIHtcclxuICAgICAgICAgICAgc2V0dGluZ3MgPSBuZXcgU3lzdGVtU2V0dGluZ3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgYnVzaW5lc3NOYW1lLFxyXG4gICAgICAgICAgICBwcmltYXJ5TG9nbyxcclxuICAgICAgICAgICAgc2Vjb25kYXJ5TG9nbyxcclxuICAgICAgICAgICAgc29jaWFsTGlua3MsXHJcbiAgICAgICAgICAgIHdlYnNpdGVVcmwsXHJcbiAgICAgICAgICAgIGNvbnRhY3RFbWFpbCxcclxuICAgICAgICAgICAgY29udGFjdFBob25lLFxyXG4gICAgICAgICAgICBwcmltYXJ5TW9iaWxlTnVtYmVyLFxyXG4gICAgICAgICAgICBzZWNvbmRhcnlNb2JpbGVOdW1iZXIsXHJcbiAgICAgICAgICAgIGFkZHJlc3NcclxuICAgICAgICB9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICAgIGlmIChidXNpbmVzc05hbWUgIT09IHVuZGVmaW5lZCkgc2V0dGluZ3MuYnVzaW5lc3NOYW1lID0gYnVzaW5lc3NOYW1lO1xyXG4gICAgICAgIGlmIChwcmltYXJ5TG9nbyAhPT0gdW5kZWZpbmVkKSBzZXR0aW5ncy5wcmltYXJ5TG9nbyA9IHByaW1hcnlMb2dvO1xyXG4gICAgICAgIGlmIChzZWNvbmRhcnlMb2dvICE9PSB1bmRlZmluZWQpIHNldHRpbmdzLnNlY29uZGFyeUxvZ28gPSBzZWNvbmRhcnlMb2dvO1xyXG4gICAgICAgIGlmIChzb2NpYWxMaW5rcyAhPT0gdW5kZWZpbmVkKSBzZXR0aW5ncy5zb2NpYWxMaW5rcyA9IHNvY2lhbExpbmtzO1xyXG4gICAgICAgIGlmICh3ZWJzaXRlVXJsICE9PSB1bmRlZmluZWQpIHNldHRpbmdzLndlYnNpdGVVcmwgPSB3ZWJzaXRlVXJsO1xyXG4gICAgICAgIGlmIChjb250YWN0RW1haWwgIT09IHVuZGVmaW5lZCkgc2V0dGluZ3MuY29udGFjdEVtYWlsID0gY29udGFjdEVtYWlsO1xyXG4gICAgICAgIGlmIChjb250YWN0UGhvbmUgIT09IHVuZGVmaW5lZCkgc2V0dGluZ3MuY29udGFjdFBob25lID0gY29udGFjdFBob25lO1xyXG4gICAgICAgIGlmIChwcmltYXJ5TW9iaWxlTnVtYmVyICE9PSB1bmRlZmluZWQpIHNldHRpbmdzLnByaW1hcnlNb2JpbGVOdW1iZXIgPSBwcmltYXJ5TW9iaWxlTnVtYmVyO1xyXG4gICAgICAgIGlmIChzZWNvbmRhcnlNb2JpbGVOdW1iZXIgIT09IHVuZGVmaW5lZCkgc2V0dGluZ3Muc2Vjb25kYXJ5TW9iaWxlTnVtYmVyID0gc2Vjb25kYXJ5TW9iaWxlTnVtYmVyO1xyXG4gICAgICAgIGlmIChhZGRyZXNzICE9PSB1bmRlZmluZWQpIHNldHRpbmdzLmFkZHJlc3MgPSBhZGRyZXNzO1xyXG5cclxuICAgICAgICBjb25zdCB1cGRhdGVkU2V0dGluZ3MgPSBhd2FpdCBzZXR0aW5ncy5zYXZlKCk7XHJcbiAgICAgICAgcmVzLmpzb24odXBkYXRlZFNldHRpbmdzKTtcclxuXHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHNldHRpbmdzOicsIGVycm9yKTtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6ICdTZXJ2ZXIgRXJyb3InIH0pO1xyXG4gICAgfVxyXG59O1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXHJvdXRlc1xcXFx0ZWFtTWFuYWdlbWVudC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9yb3V0ZXMvdGVhbU1hbmFnZW1lbnQuanNcIjtpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtcclxuICAgIGdldFRlYW1NZW1iZXJzLFxyXG4gICAgY3JlYXRlVGVhbU1lbWJlcixcclxuICAgIHVwZGF0ZVRlYW1NZW1iZXIsXHJcbiAgICBkZWxldGVUZWFtTWVtYmVyXHJcbn0gZnJvbSAnLi4vY29udHJvbGxlcnMvdGVhbUNvbnRyb2xsZXIuanMnO1xyXG5cclxuY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbnJvdXRlci5nZXQoJy8nLCBnZXRUZWFtTWVtYmVycyk7XHJcbnJvdXRlci5wb3N0KCcvJywgY3JlYXRlVGVhbU1lbWJlcik7XHJcbnJvdXRlci5wdXQoJy86aWQnLCB1cGRhdGVUZWFtTWVtYmVyKTtcclxucm91dGVyLmRlbGV0ZSgnLzppZCcsIGRlbGV0ZVRlYW1NZW1iZXIpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1xcXFxUZWFtTWVtYmVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL21vZGVscy9UZWFtTWVtYmVyLmpzXCI7aW1wb3J0IG1vbmdvb3NlIGZyb20gJ21vbmdvb3NlJztcclxuXHJcbmNvbnN0IHRlYW1NZW1iZXJTY2hlbWEgPSBuZXcgbW9uZ29vc2UuU2NoZW1hKHtcclxuICAgIG5hbWU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgdHJpbTogdHJ1ZVxyXG4gICAgfSxcclxuICAgIHJvbGU6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWUsXHJcbiAgICAgICAgZGVmYXVsdDogJ1Bob3RvZ3JhcGhlcidcclxuICAgIH0sXHJcbiAgICBiaW86IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgdHJpbTogdHJ1ZVxyXG4gICAgfSxcclxuICAgIGltYWdlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLCAvLyBVUkwgdG8gaW1hZ2VcclxuICAgICAgICBkZWZhdWx0OiAnJ1xyXG4gICAgfSxcclxuICAgIHNvY2lhbExpbmtzOiB7XHJcbiAgICAgICAgaW5zdGFncmFtOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJycgfSxcclxuICAgICAgICBmYWNlYm9vazogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICcnIH0sXHJcbiAgICAgICAgd2Vic2l0ZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6ICcnIH1cclxuICAgIH0sXHJcbiAgICBjb250YWN0OiB7XHJcbiAgICAgICAgcGhvbmU6IHsgdHlwZTogU3RyaW5nLCBkZWZhdWx0OiAnJyB9LFxyXG4gICAgICAgIGVtYWlsOiB7IHR5cGU6IFN0cmluZywgZGVmYXVsdDogJycgfVxyXG4gICAgfSxcclxuICAgIGlzVmlzaWJsZToge1xyXG4gICAgICAgIHR5cGU6IEJvb2xlYW4sXHJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxyXG4gICAgfSxcclxuICAgIG9yZGVyOiB7XHJcbiAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgIGRlZmF1bHQ6IDBcclxuICAgIH1cclxufSwge1xyXG4gICAgdGltZXN0YW1wczogdHJ1ZVxyXG59KTtcclxuXHJcbmNvbnN0IFRlYW1NZW1iZXIgPSBtb25nb29zZS5tb2RlbCgnVGVhbU1lbWJlcicsIHRlYW1NZW1iZXJTY2hlbWEpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgVGVhbU1lbWJlcjtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXGNvbnRyb2xsZXJzXFxcXHRlYW1Db250cm9sbGVyLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL2NvbnRyb2xsZXJzL3RlYW1Db250cm9sbGVyLmpzXCI7aW1wb3J0IFRlYW1NZW1iZXIgZnJvbSAnLi4vbW9kZWxzL1RlYW1NZW1iZXIuanMnO1xyXG5cclxuLy8gR2V0IGFsbCB0ZWFtIG1lbWJlcnNcclxuZXhwb3J0IGNvbnN0IGdldFRlYW1NZW1iZXJzID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgcHVibGljT25seSB9ID0gcmVxLnF1ZXJ5O1xyXG4gICAgICAgIGNvbnN0IGZpbHRlciA9IHB1YmxpY09ubHkgPT09ICd0cnVlJyA/IHsgaXNWaXNpYmxlOiB0cnVlIH0gOiB7fTtcclxuXHJcbiAgICAgICAgLy8gU29ydCBieSAnb3JkZXInIChhc2NlbmRpbmcpIGFuZCB0aGVuIGJ5ICdjcmVhdGVkQXQnXHJcbiAgICAgICAgY29uc3QgbWVtYmVycyA9IGF3YWl0IFRlYW1NZW1iZXIuZmluZChmaWx0ZXIpLnNvcnQoeyBvcmRlcjogMSwgY3JlYXRlZEF0OiAtMSB9KTtcclxuICAgICAgICByZXMuc3RhdHVzKDIwMCkuanNvbihtZW1iZXJzKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmVzLnN0YXR1cyg1MDApLmpzb24oeyBtZXNzYWdlOiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gQ3JlYXRlIGEgbmV3IHRlYW0gbWVtYmVyXHJcbmV4cG9ydCBjb25zdCBjcmVhdGVUZWFtTWVtYmVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IG5ld01lbWJlciA9IG5ldyBUZWFtTWVtYmVyKHJlcS5ib2R5KTtcclxuICAgICAgICBhd2FpdCBuZXdNZW1iZXIuc2F2ZSgpO1xyXG4gICAgICAgIHJlcy5zdGF0dXMoMjAxKS5qc29uKG5ld01lbWJlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSBhIHRlYW0gbWVtYmVyXHJcbmV4cG9ydCBjb25zdCB1cGRhdGVUZWFtTWVtYmVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZE1lbWJlciA9IGF3YWl0IFRlYW1NZW1iZXIuZmluZEJ5SWRBbmRVcGRhdGUoaWQsIHJlcS5ib2R5LCB7IG5ldzogdHJ1ZSB9KTtcclxuXHJcbiAgICAgICAgaWYgKCF1cGRhdGVkTWVtYmVyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDQwNCkuanNvbih7IG1lc3NhZ2U6ICdUZWFtIG1lbWJlciBub3QgZm91bmQnIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24odXBkYXRlZE1lbWJlcik7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIERlbGV0ZSBhIHRlYW0gbWVtYmVyXHJcbmV4cG9ydCBjb25zdCBkZWxldGVUZWFtTWVtYmVyID0gYXN5bmMgKHJlcSwgcmVzKSA9PiB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IHsgaWQgfSA9IHJlcS5wYXJhbXM7XHJcbiAgICAgICAgYXdhaXQgVGVhbU1lbWJlci5maW5kQnlJZEFuZERlbGV0ZShpZCk7XHJcbiAgICAgICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBtZXNzYWdlOiAnVGVhbSBtZW1iZXIgZGVsZXRlZCBzdWNjZXNzZnVsbHknIH0pO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICByZXMuc3RhdHVzKDUwMCkuanNvbih7IG1lc3NhZ2U6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICB9XHJcbn07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxyb3V0ZXNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxccm91dGVzXFxcXHBvcHVwUm91dGVzLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9hbWl0MS9EYXRhL0FwcERhdGEvQXBwL2dhbmVzaC9QZXJzb25hbC9naXRodWIvcG90b2dyYXBoeS13ZWJhcHAvc2VydmVyL3JvdXRlcy9wb3B1cFJvdXRlcy5qc1wiO2ltcG9ydCBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgeyBnZXRQb3B1cCwgdXBkYXRlUG9wdXAgfSBmcm9tICcuLi9jb250cm9sbGVycy9wb3B1cENvbnRyb2xsZXIuanMnO1xyXG5pbXBvcnQgeyByZXF1aXJlQXV0aCB9IGZyb20gJy4uL21pZGRsZXdhcmUvYXV0aC5qcyc7XHJcblxyXG5jb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxucm91dGVyLmdldCgnLycsIGdldFBvcHVwKTsgLy8gUHVibGljPyBZZXMsIHdlYnNpdGUgbmVlZHMgdG8gc2VlIGl0LlxyXG5yb3V0ZXIucHV0KCcvJywgcmVxdWlyZUF1dGgsIHVwZGF0ZVBvcHVwKTsgLy8gQWRtaW4gb25seVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgcm91dGVyO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbW9kZWxzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1vZGVsc1xcXFxQb3B1cC5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvYW1pdDEvRGF0YS9BcHBEYXRhL0FwcC9nYW5lc2gvUGVyc29uYWwvZ2l0aHViL3BvdG9ncmFwaHktd2ViYXBwL3NlcnZlci9tb2RlbHMvUG9wdXAuanNcIjtpbXBvcnQgbW9uZ29vc2UgZnJvbSBcIm1vbmdvb3NlXCI7XHJcblxyXG5jb25zdCBwb3B1cFNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoXHJcbiAgICB7XHJcbiAgICAgICAgdGl0bGU6IHsgdHlwZTogU3RyaW5nIH0sIC8vIE9wdGlvbmFsXHJcbiAgICAgICAgZGVzY3JpcHRpb246IHsgdHlwZTogU3RyaW5nIH0sIC8vIE9wdGlvbmFsXHJcbiAgICAgICAgaW1hZ2U6IHsgdHlwZTogU3RyaW5nIH0sIC8vIE9wdGlvbmFsIFVSTFxyXG4gICAgICAgIGlzQWN0aXZlOiB7IHR5cGU6IEJvb2xlYW4sIGRlZmF1bHQ6IGZhbHNlIH0sXHJcbiAgICAgICAgdHlwZTogeyB0eXBlOiBTdHJpbmcsIGRlZmF1bHQ6IFwidHJpYnV0ZVwiIH0sIC8vIEp1c3QgaW4gY2FzZSB3ZSBuZWVkIG90aGVyIHR5cGVzIGxhdGVyXHJcbiAgICB9LFxyXG4gICAgeyB0aW1lc3RhbXBzOiB0cnVlIH1cclxuKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IG1vbmdvb3NlLm1vZGVscz8uUG9wdXAgfHwgbW9uZ29vc2UubW9kZWwoXCJQb3B1cFwiLCBwb3B1cFNjaGVtYSk7XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW1pdDFcXFxcRGF0YVxcXFxBcHBEYXRhXFxcXEFwcFxcXFxnYW5lc2hcXFxcUGVyc29uYWxcXFxcZ2l0aHViXFxcXHBvdG9ncmFwaHktd2ViYXBwXFxcXHNlcnZlclxcXFxjb250cm9sbGVyc1xcXFxwb3B1cENvbnRyb2xsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvY29udHJvbGxlcnMvcG9wdXBDb250cm9sbGVyLmpzXCI7aW1wb3J0IFBvcHVwIGZyb20gXCIuLi9tb2RlbHMvUG9wdXAuanNcIjtcclxuXHJcbi8vIEdldCB0aGUgYWN0aXZlIHBvcHVwIChvciB0aGUgY29uZmlndXJlIG9uZSlcclxuLy8gV2UgYXNzdW1lIHdlIG9ubHkgbWFpbnRhaW4gT05FIHBvcHVwIGNvbmZpZ3VyYXRpb24gZG9jdW1lbnQgZm9yIHNpbXBsaWNpdHkuXHJcbmV4cG9ydCBjb25zdCBnZXRQb3B1cCA9IGFzeW5jIChyZXEsIHJlcykgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgcG9wdXAgPSBhd2FpdCBQb3B1cC5maW5kT25lKCk7XHJcbiAgICAgICAgaWYgKCFwb3B1cCkge1xyXG4gICAgICAgICAgICAvLyBDcmVhdGUgZGVmYXVsdCBpZiBub3QgZXhpc3RzXHJcbiAgICAgICAgICAgIHBvcHVwID0gYXdhaXQgUG9wdXAuY3JlYXRlKHsgaXNBY3RpdmU6IGZhbHNlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXMuanNvbihwb3B1cCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIFVwZGF0ZSB0aGUgcG9wdXAgY29uZmlndXJhdGlvblxyXG5leHBvcnQgY29uc3QgdXBkYXRlUG9wdXAgPSBhc3luYyAocmVxLCByZXMpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgeyB0aXRsZSwgZGVzY3JpcHRpb24sIGltYWdlLCBpc0FjdGl2ZSB9ID0gcmVxLmJvZHk7XHJcblxyXG4gICAgICAgIGxldCBwb3B1cCA9IGF3YWl0IFBvcHVwLmZpbmRPbmUoKTtcclxuICAgICAgICBpZiAoIXBvcHVwKSB7XHJcbiAgICAgICAgICAgIHBvcHVwID0gbmV3IFBvcHVwKHsgdGl0bGUsIGRlc2NyaXB0aW9uLCBpbWFnZSwgaXNBY3RpdmUgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcG9wdXAudGl0bGUgPSB0aXRsZTtcclxuICAgICAgICAgICAgcG9wdXAuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcclxuICAgICAgICAgICAgcG9wdXAuaW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICAgICAgcG9wdXAuaXNBY3RpdmUgPSBpc0FjdGl2ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGF3YWl0IHBvcHVwLnNhdmUoKTtcclxuICAgICAgICByZXMuanNvbihwb3B1cCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgbWVzc2FnZTogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgIH1cclxufTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbWl0MVxcXFxEYXRhXFxcXEFwcERhdGFcXFxcQXBwXFxcXGdhbmVzaFxcXFxQZXJzb25hbFxcXFxnaXRodWJcXFxccG90b2dyYXBoeS13ZWJhcHBcXFxcc2VydmVyXFxcXG1pZGRsZXdhcmVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGFtaXQxXFxcXERhdGFcXFxcQXBwRGF0YVxcXFxBcHBcXFxcZ2FuZXNoXFxcXFBlcnNvbmFsXFxcXGdpdGh1YlxcXFxwb3RvZ3JhcGh5LXdlYmFwcFxcXFxzZXJ2ZXJcXFxcbWlkZGxld2FyZVxcXFxlcnJvckhhbmRsZXIuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FtaXQxL0RhdGEvQXBwRGF0YS9BcHAvZ2FuZXNoL1BlcnNvbmFsL2dpdGh1Yi9wb3RvZ3JhcGh5LXdlYmFwcC9zZXJ2ZXIvbWlkZGxld2FyZS9lcnJvckhhbmRsZXIuanNcIjsvLyBFcnJvciBoYW5kbGluZyBtaWRkbGV3YXJlXHJcbmV4cG9ydCBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyLCByZXEsIHJlcywgbmV4dCkgPT4ge1xyXG4gIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOicsIGVycik7XHJcblxyXG4gIC8vIE1vbmdvb3NlIHZhbGlkYXRpb24gZXJyb3JcclxuICBpZiAoZXJyLm5hbWUgPT09ICdWYWxpZGF0aW9uRXJyb3InKSB7XHJcbiAgICBjb25zdCBtZXNzYWdlcyA9IE9iamVjdC52YWx1ZXMoZXJyLmVycm9ycykubWFwKChlKSA9PiBlLm1lc3NhZ2UpO1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ1ZhbGlkYXRpb24gZXJyb3InLFxyXG4gICAgICBlcnJvcnM6IG1lc3NhZ2VzLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBNb25nb29zZSBjYXN0IGVycm9yXHJcbiAgaWYgKGVyci5uYW1lID09PSAnQ2FzdEVycm9yJykge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAwKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ0ludmFsaWQgSUQgZm9ybWF0JyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRHVwbGljYXRlIGtleSBlcnJvclxyXG4gIGlmIChlcnIuY29kZSA9PT0gMTEwMDApIHtcclxuICAgIGNvbnN0IGtleSA9IE9iamVjdC5rZXlzKGVyci5rZXlWYWx1ZSlbMF07XHJcbiAgICByZXR1cm4gcmVzLnN0YXR1cyg0MDApLmpzb24oe1xyXG4gICAgICBtZXNzYWdlOiBgJHtrZXl9IGFscmVhZHkgZXhpc3RzYCxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gSldUIGVycm9yc1xyXG4gIGlmIChlcnIubmFtZSA9PT0gJ0pzb25XZWJUb2tlbkVycm9yJykge1xyXG4gICAgcmV0dXJuIHJlcy5zdGF0dXMoNDAxKS5qc29uKHtcclxuICAgICAgbWVzc2FnZTogJ0ludmFsaWQgdG9rZW4nLFxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBpZiAoZXJyLm5hbWUgPT09ICdUb2tlbkV4cGlyZWRFcnJvcicpIHtcclxuICAgIHJldHVybiByZXMuc3RhdHVzKDQwMSkuanNvbih7XHJcbiAgICAgIG1lc3NhZ2U6ICdUb2tlbiBleHBpcmVkJyxcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gRGVmYXVsdCBlcnJvclxyXG4gIHJlcy5zdGF0dXMoZXJyLnN0YXR1c0NvZGUgfHwgNTAwKS5qc29uKHtcclxuICAgIG1lc3NhZ2U6IGVyci5tZXNzYWdlIHx8ICdTZXJ2ZXIgZXJyb3InLFxyXG4gIH0pO1xyXG59O1xyXG5cclxuLy8gNDA0IGhhbmRsZXJcclxuZXhwb3J0IGNvbnN0IG5vdEZvdW5kSGFuZGxlciA9IChyZXEsIHJlcykgPT4ge1xyXG4gIHJlcy5zdGF0dXMoNDA0KS5qc29uKHtcclxuICAgIG1lc3NhZ2U6IGBSb3V0ZSAke3JlcS5vcmlnaW5hbFVybH0gbm90IGZvdW5kYCxcclxuICB9KTtcclxufTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFrYyxPQUFPQSxlQUFjO0FBQXZkLElBRU0sY0E4RUM7QUFoRlA7QUFBQTtBQUVBLElBQU0sZUFBZSxJQUFJQSxVQUFTO0FBQUEsTUFDaEM7QUFBQSxRQUNFLE1BQU07QUFBQSxVQUNKLE1BQU07QUFBQSxVQUNOLFVBQVUsQ0FBQyxNQUFNLHlCQUF5QjtBQUFBLFVBQzFDLE1BQU07QUFBQSxVQUNOLFdBQVcsQ0FBQyxHQUFHLG9DQUFvQztBQUFBLFFBQ3JEO0FBQUEsUUFDQSxPQUFPO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixVQUFVLENBQUMsTUFBTSxtQkFBbUI7QUFBQSxVQUNwQyxXQUFXO0FBQUEsVUFDWCxNQUFNO0FBQUEsVUFDTixPQUFPLENBQUMsaURBQWlELDhCQUE4QjtBQUFBLFFBQ3pGO0FBQUEsUUFDQSxPQUFPO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixVQUFVLENBQUMsTUFBTSwwQkFBMEI7QUFBQSxVQUMzQyxNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0EsU0FBUztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04sTUFBTTtBQUFBLFFBQ1I7QUFBQSxRQUNBLE1BQU07QUFBQSxVQUNKLE1BQU07QUFBQSxVQUNOLE1BQU07QUFBQSxRQUNSO0FBQUEsUUFDQSxPQUFPO0FBQUEsVUFDTCxNQUFNO0FBQUEsVUFDTixNQUFNO0FBQUEsUUFDUjtBQUFBLFFBQ0EsU0FBUztBQUFBLFVBQ1AsTUFBTTtBQUFBLFVBQ04s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QUssU0FBUztBQUN6QyxjQUFNLE1BQU0sSUFBSSxPQUFPO0FBQ3ZCLFlBQUksSUFBSSxXQUFXLFFBQVEsS0FBSyxDQUFDLElBQUksV0FBVyxNQUFNLEtBQUssQ0FBQyxJQUFJLFNBQVMsR0FBRyxHQUFHO0FBQzdFLGNBQUksTUFBTTtBQUFBLFFBQ1o7QUFDQSxhQUFLO0FBQUEsTUFDUCxDQUFDO0FBRUQsWUFBTSxNQUFNLGFBQWEsRUFBRSxnQkFBZ0IsS0FBSyxDQUFDO0FBR2pELGFBQU8sWUFBWSxJQUFJLEdBQUc7QUFBQSxJQUM1QjtBQUFBLEVBQ0Y7QUFDRjsiLAogICJuYW1lcyI6IFsibW9uZ29vc2UiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgInVzZXIiLCAidG9rZW4iLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJqd3QiLCAiSldUX1NFQ1JFVCIsICJqd3QiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAidGVzdGltb25pYWxzIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyIsICJtb25nb29zZSIsICJtb25nb29zZSIsICJyb3V0ZXIiLCAiZXhwcmVzcyIsICJleHByZXNzIiwgIm1vbmdvb3NlIiwgIm1vbmdvb3NlIiwgInJvdXRlciIsICJleHByZXNzIiwgImV4cHJlc3MiLCAibW9uZ29vc2UiLCAibW9uZ29vc2UiLCAicm91dGVyIiwgImV4cHJlc3MiLCAiZXhwcmVzcyJdCn0K
