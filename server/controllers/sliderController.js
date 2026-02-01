import Slider from "../models/Slider.js";

export const getAllSliders = async (req, res) => {
    try {
        const sliders = await Slider.find().sort({ order: 1 });
        res.json(sliders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createSlider = async (req, res) => {
    try {
        const slider = new Slider(req.body);
        await slider.save();
        res.status(201).json(slider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateSlider = async (req, res) => {
    try {
        const slider = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!slider) return res.status(404).json({ message: "Slider not found" });
        res.json(slider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteSlider = async (req, res) => {
    try {
        const slider = await Slider.findByIdAndDelete(req.params.id);
        if (!slider) return res.status(404).json({ message: "Slider not found" });
        res.json({ message: "Slider deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
