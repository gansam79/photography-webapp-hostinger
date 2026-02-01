import Enquiry from "../models/Enquiry.js";

import { sendEmail } from "../utils/emailService.js";
import { generateEmailHtml } from "../utils/emailTemplates.js";

// Create a new enquiry (Public)
export const createEnquiry = async (req, res) => {
    try {
        const enquiry = new Enquiry(req.body);
        await enquiry.save();

        // Send Email Notification
        const adminEmail = "pixelproitsolutions@gmail.com";
        if (adminEmail) {
            const htmlContent = generateEmailHtml({
                title: "New Booking Enquiry",
                greeting: "Hello Admin,",
                intro: `You have received a new "Book Us" enquiry from ${enquiry.groomName} & ${enquiry.brideName}.`,
                details: {
                    "Groom's Name": enquiry.groomName || 'N/A',
                    "Bride's Name": enquiry.brideName || 'N/A',
                    "Phone Number": enquiry.phoneNumber || 'N/A',
                    "Email": enquiry.email || 'N/A',
                    "Event Dates": `${new Date(enquiry.eventStartDate).toDateString()} - ${new Date(enquiry.eventEndDate).toDateString()}`,
                    "Location": enquiry.location || 'N/A',
                    "Budget": enquiry.budget ? `₹${enquiry.budget}` : 'N/A',
                    "Message": enquiry.message || 'No additional message',
                    "Submission Date": new Date().toLocaleString()
                },
                actionText: "View in Admin Panel",
                actionUrl: `${process.env.CLIENT_URL || 'http://localhost:8080'}/enquiries`
            });

            await sendEmail({
                to: adminEmail,
                subject: `New Enquiry: ${enquiry.groomName} & ${enquiry.brideName}`,
                html: htmlContent,
                replyTo: enquiry.email || "",
            });
        }

        res.status(201).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all enquiries (Admin)
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update enquiry status (Admin)
export const updateEnquiryStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete enquiry (Admin)
export const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
        if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
        res.json({ message: "Enquiry deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
