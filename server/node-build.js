import path from "path";
import { createServer } from "./index.js";
import express from "express";

const app = createServer();
const port = process.env.PORT || 3000;

// In production, serve the built SPA files
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");

// API-only mode (Decoupled architecture)
app.get("/", (req, res) => {
  res.json({ message: "Photography API is running 🚀", status: "active" });
});

// Explicit 404 for API routes
// Explicit 404 for any other route
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(port, () => {
  console.log(
    `🚀 The Patil Photography & Film's server running on port ${port}`,
  );
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
