import Service from '../models/Service.js';

// Default services
const DEFAULT_SERVICES = [
  { name: 'Traditional Photography', category: 'photography', ratePerDay: 25000 },
  { name: 'Candid Photography', category: 'photography', ratePerDay: 20000 },
  { name: 'Cinematic Wedding Film', category: 'video', ratePerDay: 40000 },
  { name: 'Traditional Video', category: 'video', ratePerDay: 30000 },
  { name: 'Drone Shoot', category: 'drone', ratePerDay: 15000 },
  { name: 'Wedding Albums', category: 'product', ratePerUnit: 5000 },
  { name: 'Frames', category: 'product', ratePerUnit: 2000 },
];

// Get all active services
export const getAllServices = async (req, res) => {
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
};

// Get single service
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create service
export const createService = async (req, res) => {
  const { name, description, category, ratePerDay, ratePerUnit } = req.body;

  if (!name || (!ratePerDay && !ratePerUnit)) {
    return res.status(400).json({ message: 'Name and rate are required' });
  }

  try {
    const service = new Service({
      name,
      description,
      category,
      ratePerDay,
      ratePerUnit,
    });

    const savedService = await service.save();
    res.status(201).json(savedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete service (soft delete by marking inactive)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
