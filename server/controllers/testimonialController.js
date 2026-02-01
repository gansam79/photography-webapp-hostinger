import Testimonial from "../models/Testimonial.js";

// Create a new testimonial
export const createTestimonial = async (req, res) => {
    try {
        const testimonial = new Testimonial(req.body);
        await testimonial.save();
        res.status(201).json(testimonial);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all testimonials (Admin: all, Website: active)
export const getAllTestimonials = async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        // If query param ?type=active is passed, return only active ones (sorted by displayOrder)
        if (type === 'active') {
            query.status = 'Active';
            // Sort by displayOrder ascending, then createdAt descending
            const testimonials = await Testimonial.find(query).sort({ displayOrder: 1, createdAt: -1 });
            return res.json(testimonials);
        }

        // Default: return all (sorted by createdAt desc) for Admin
        const testimonials = await Testimonial.find().sort({ createdAt: -1 });
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single testimonial
export const getTestimonialById = async (req, res) => {
    try {
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update testimonial
export const updateTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndUpdate(
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

// Delete testimonial
export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
        res.json({ message: "Testimonial deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
