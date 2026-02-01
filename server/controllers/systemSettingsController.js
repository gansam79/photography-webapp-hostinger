import SystemSettings from '../models/SystemSettings.js';

// @desc    Get system settings (Branding, etc.)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update system settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res) => {
    try {
        let settings = await SystemSettings.findOne(); // Not using getSettings() to avoid creation if we just want to update valid doc

        if (!settings) {
            settings = new SystemSettings();
        }

        const {
            businessName,
            primaryLogo,
            secondaryLogo,
            backgroundImage,
            socialLinks,
            websiteUrl,
            contactEmail,
            contactPhone,
            primaryMobileNumber,
            secondaryMobileNumber,
            address
        } = req.body;

        if (businessName !== undefined) settings.businessName = businessName;
        if (primaryLogo !== undefined) settings.primaryLogo = primaryLogo;
        if (secondaryLogo !== undefined) settings.secondaryLogo = secondaryLogo;
        if (backgroundImage !== undefined) settings.backgroundImage = backgroundImage;
        if (socialLinks !== undefined) settings.socialLinks = socialLinks;
        if (websiteUrl !== undefined) settings.websiteUrl = websiteUrl;
        if (contactEmail !== undefined) settings.contactEmail = contactEmail;
        if (contactPhone !== undefined) settings.contactPhone = contactPhone;
        if (primaryMobileNumber !== undefined) settings.primaryMobileNumber = primaryMobileNumber;
        if (secondaryMobileNumber !== undefined) settings.secondaryMobileNumber = secondaryMobileNumber;
        if (address !== undefined) settings.address = address;

        const updatedSettings = await settings.save();
        res.json(updatedSettings);

    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
