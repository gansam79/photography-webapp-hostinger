import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        default: 'Photographer'
    },
    bio: {
        type: String,
        trim: true
    },
    image: {
        type: String, // URL to image
        default: ''
    },
    socialLinks: {
        instagram: { type: String, default: '' },
        facebook: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    contact: {
        phone: { type: String, default: '' },
        email: { type: String, default: '' }
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
