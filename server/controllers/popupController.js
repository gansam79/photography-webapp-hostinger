import Popup from "../models/Popup.js";

// Get the active popup (or the configure one)
// We assume we only maintain ONE popup configuration document for simplicity.
export const getPopup = async (req, res) => {
    try {
        let popup = await Popup.findOne();
        if (!popup) {
            // Create default if not exists
            popup = await Popup.create({ isActive: false });
        }
        res.json(popup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update the popup configuration
export const updatePopup = async (req, res) => {
    try {
        const { title, description, image, isActive } = req.body;

        let popup = await Popup.findOne();
        if (!popup) {
            popup = new Popup({ title, description, image, isActive });
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
