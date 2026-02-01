import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
    platform: {
        type: String,
        required: true,
        enum: ['WhatsApp', 'Instagram', 'Facebook', 'YouTube', 'Twitter', 'LinkedIn', 'Other']
    },
    url: {
        type: String,
        required: true
    },
    icon: {
        type: String, // Can store icon name (e.g., Lucide icon name) or URL
        default: ''
    },
    active: {
        type: Boolean,
        default: true
    }
});

const systemSettingsSchema = new mongoose.Schema({
    businessName: {
        type: String,
        default: "The Patil Photography & Film's"
    },
    primaryLogo: {
        type: String, // URL to the image
        default: ""
    },
    secondaryLogo: {
        type: String, // URL to the image (e.g., for dark mode or footer)
        default: ""
    },
    backgroundImage: {
        type: String, // URL or base64 background image (for login/hero)
        default: ""
    },
    socialLinks: [socialLinkSchema],
    websiteUrl: {
        type: String,
        default: ""
    },
    contactEmail: {
        type: String,
        default: ""
    },
    contactPhone: {
        type: String,
        default: ""
    },
    primaryMobileNumber: {
        type: String,
        default: ""
    },
    secondaryMobileNumber: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    // Add more fields here as needed (GST, etc.)
}, { timestamps: true });


// Singleton pattern: Ensure only one settings document exists
systemSettingsSchema.statics.getSettings = async function () {
    const settings = await this.findOne();
    if (settings) return settings;
    return await this.create({});
};

export default mongoose.models.SystemSettings || mongoose.model('SystemSettings', systemSettingsSchema);
