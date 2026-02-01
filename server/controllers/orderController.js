import Order from "../models/Order.js";
import { sendEmail } from "../utils/emailService.js";
import { generateEmailHtml } from "../utils/emailTemplates.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('relatedUser', 'name email').sort({ delivery_date: -1, createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const orderData = { ...req.body };
        const { name, email, whatsapp_no, event_name, event_date } = orderData;

        // Try to link with existing client or create new one
        if (name || email || whatsapp_no) {
            const Client = (await import("../models/Client.js")).default;

            // Try to find client by unique identifiers
            let client = null;
            if (email) client = await Client.findOne({ email });
            if (!client && whatsapp_no) client = await Client.findOne({ phone: whatsapp_no });
            if (!client && name) client = await Client.findOne({ name }); // Fallback to name

            if (client) {
                orderData.client = client._id;
            } else {
                // Create new client if enough info
                try {
                    client = new Client({
                        name: name || "Unknown",
                        email: email || `temp_${Date.now()}@example.com`,
                        phone: whatsapp_no || "0000000000",
                        type: "Regular", // Default
                        source: "Order"
                    });
                    await client.save();
                    orderData.client = client._id;
                } catch (clientErr) {
                    console.error("Auto-create client failed:", clientErr);
                    // Proceed without linking if client creation fails
                }
            }
        }

        const order = new Order(orderData);
        await order.save();

        // Send Email Notification if email is provided
        // Send Email Notification if email is provided
        if (email) {
            const htmlContent = generateEmailHtml({
                title: "Order Confirmation",
                greeting: `Hello ${name || 'Valued Customer'},`,
                intro: "Thank you for choosing The Patil Photography. Your order has been placed successfully. Below are the details of your booking.",
                details: {
                    "Order ID": order._id.toString().slice(-6).toUpperCase(),
                    "Event Name": event_name || 'N/A',
                    "Event Date": event_date ? new Date(event_date).toDateString() : 'N/A',
                    "Location": orderData.location || 'N/A',
                    "Service Type": orderData.photography_type || 'N/A',
                    "Services": Array.isArray(orderData.service) ? orderData.service.join(", ") : (orderData.service || 'N/A'),
                    "Package": orderData.package || 'N/A',
                    "Album Pages": orderData.album_pages || 'N/A',
                    "Total Amount": orderData.amount ? `₹${Number(orderData.amount).toLocaleString('en-IN')}` : 'N/A',
                    "Paid Amount": orderData.amount_paid ? `₹${Number(orderData.amount_paid).toLocaleString('en-IN')}` : '0',
                    "Balance Due": orderData.remaining_amount ? `₹${Number(orderData.remaining_amount).toLocaleString('en-IN')}` : 'N/A',
                    "Deliverables": orderData.deliverables || 'N/A',
                    "Delivery Date": orderData.delivery_date ? new Date(orderData.delivery_date).toDateString() : 'TBD'
                },
                actionText: "Contact Us",
                actionUrl: process.env.CLIENT_URL || "#"
            });

            await sendEmail({
                to: email,
                cc: "pixelproitsolutions@gmail.com",
                subject: `Order Confirmation - ${event_name || 'Event'}`,
                html: htmlContent
            });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json({ message: "Order deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
