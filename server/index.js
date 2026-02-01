import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB, getDbStatus } from "./db.js";
import { handleDemo } from "./routes/demo.js";
import clientRoutes from "./routes/clientRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import authRoutes from "./routes/auth.js";
import sliderRoutes from "./routes/sliderRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import filmRoutes from "./routes/filmRoutes.js";
import loveStoryRoutes from "./routes/loveStoryRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";
import eventTypeRoutes from "./routes/eventTypeRoutes.js";
import systemSettingsRoutes from "./routes/systemSettingsRoutes.js";
import teamRoutes from "./routes/teamManagement.js";
import popupRoutes from "./routes/popupRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";




// Root route - Only for production/standalone

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://localhost:8080",
  "https://potography-webapp.vercel.app",
  "https://potography-webapp-website.vercel.app",
];

const buildAllowedOrigins = () => {
  const envOrigins = process.env.CORS_ALLOWLIST || process.env.CORS_ORIGIN || "";
  const parsed = envOrigins
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return Array.from(new Set([...defaultAllowedOrigins, ...parsed]));
};

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow vercel preview apps
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    console.warn(`⚠️  Blocked CORS origin: ${origin}`);
    return callback(null, false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

let dbConnectionPromise;
const ensureDbConnection = () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = connectDB().catch((error) => {
      console.error("❌ MongoDB connection failed", error);
      dbConnectionPromise = undefined;
      throw error;
    });
  }
  return dbConnectionPromise;
};

export function createServer(config = {}) {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Ensure MongoDB connection starts as soon as the server boots
  ensureDbConnection();

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/db-status", (_req, res) => {
    const state = getDbStatus();
    // Map mongoose readyState to human-readable
    const map = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };
    res.json({ state, status: map[state] ?? "unknown" });
  });

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      dbState: getDbStatus(),
      timestamp: new Date().toISOString(),
      allowedOrigins,
    });
  });

  // Auth routes
  app.use("/api/auth", authRoutes);

  // API Routes
  app.use("/api/clients", clientRoutes);
  app.use("/api/services", serviceRoutes);
  app.use("/api/quotations", quotationRoutes);
  app.use("/api/invoices", invoiceRoutes);
  app.use("/api/slider", sliderRoutes);
  app.use("/api/gallery", galleryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/films", filmRoutes);
  app.use("/api/love-stories", loveStoryRoutes);
  app.use("/api/enquiries", enquiryRoutes);
  app.use("/api/contact", contactRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/testimonials", testimonialRoutes);
  app.use("/api/event-types", eventTypeRoutes);
  app.use("/api/settings", systemSettingsRoutes);
  app.use("/api/team", teamRoutes);
  console.log("Registering popup routes...", popupRoutes);
  app.use("/api/popup", popupRoutes);
  console.log("✅ Contact, Dashboard, Testimonial & Popup routes registered " + Date.now());

  // Root route - Only for production/standalone
  if (!config.middlewareMode) {
    app.get("/", (req, res) => {
      res.json({ message: "Photography API is running 🚀", status: "active" });
    });
  }

  // 404 + error handling
  if (!config.middlewareMode) {
    app.use(notFoundHandler);
  }

  app.use(errorHandler);

  return app;
}

