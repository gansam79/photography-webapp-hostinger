import express from "express";
import Service from "../models/Service.js";

const router = express.Router();

// Initialize default services
const DEFAULT_SERVICES = [
  {
    name: "Traditional Photography",
    category: "photography",
    ratePerDay: 25000,
  },
  { name: "Candid Photography", category: "photography", ratePerDay: 20000 },
  { name: "Cinematic Wedding Film", category: "video", ratePerDay: 40000 },
  { name: "Traditional Video", category: "video", ratePerDay: 30000 },
  { name: "Drone Shoot", category: "drone", ratePerDay: 15000 },
  { name: "Wedding Albums", category: "product", ratePerUnit: 5000 },
  { name: "Frames", category: "product", ratePerUnit: 2000 },
];

// Get all services
router.get("/", async (req, res) => {
  try {
    let services = await Service.find({ isActive: true }).sort({ name: 1 });

    // Initialize default services if none exist
    if (services.length === 0) {
      const createdServices = await Service.insertMany(DEFAULT_SERVICES);
      services = createdServices;
    }

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create service
router.post("/", async (req, res) => {
  const service = new Service(req.body);
  try {
    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update service
router.put("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
