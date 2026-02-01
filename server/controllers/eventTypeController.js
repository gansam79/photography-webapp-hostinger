import EventType from '../models/EventType.js';

// Get all event types
export const getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await EventType.find({ isActive: true }).sort({ name: 1 });
        res.json(eventTypes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create event type
export const createEventType = async (req, res) => {
    try {
        const { name, label } = req.body;
        const eventType = new EventType({
            name,
            label: label || name
        });
        const savedEventType = await eventType.save();
        res.status(201).json(savedEventType);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Event type already exists' });
        }
        res.status(400).json({ message: error.message });
    }
};

// Update event type
export const updateEventType = async (req, res) => {
    try {
        const { name, label, isActive } = req.body;
        const updatedEventType = await EventType.findByIdAndUpdate(
            req.params.id,
            { name, label, isActive },
            { new: true, runValidators: true }
        );
        if (!updatedEventType) return res.status(404).json({ message: "Event Type not found" });
        res.json(updatedEventType);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// Delete event type
export const deleteEventType = async (req, res) => {
    try {
        await EventType.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event type deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
