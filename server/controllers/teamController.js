import TeamMember from '../models/TeamMember.js';

// Get all team members
export const getTeamMembers = async (req, res) => {
    try {
        const { publicOnly } = req.query;
        const filter = publicOnly === 'true' ? { isVisible: true } : {};

        // Sort by 'order' (ascending) and then by 'createdAt'
        const members = await TeamMember.find(filter).sort({ order: 1, createdAt: -1 });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new team member
export const createTeamMember = async (req, res) => {
    try {
        const newMember = new TeamMember(req.body);
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a team member
export const updateTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMember = await TeamMember.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.status(200).json(updatedMember);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a team member
export const deleteTeamMember = async (req, res) => {
    try {
        const { id } = req.params;
        await TeamMember.findByIdAndDelete(id);
        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
