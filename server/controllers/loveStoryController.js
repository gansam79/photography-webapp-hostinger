import LoveStory from "../models/LoveStory.js";

// Get all love stories
export const getAllLoveStories = async (req, res) => {
    try {
        const stories = await LoveStory.find().sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single love story
export const getLoveStoryById = async (req, res) => {
    try {
        const story = await LoveStory.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        res.json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new love story
export const createLoveStory = async (req, res) => {
    try {
        const story = new LoveStory(req.body);
        await story.save();
        res.status(201).json(story);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update love story
export const updateLoveStory = async (req, res) => {
    try {
        const story = await LoveStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!story) return res.status(404).json({ message: "Story not found" });
        res.json(story);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete love story
export const deleteLoveStory = async (req, res) => {
    try {
        const story = await LoveStory.findByIdAndDelete(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        res.json({ message: "Story deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
