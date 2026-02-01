
import Enquiry from "../models/Enquiry.js";
import Order from "../models/Order.js";
import Quotation from "../models/Quotation.js";
import Invoice from "../models/Invoice.js";
import Contact from "../models/Contact.js";
import Client from "../models/Client.js";
import Testimonial from "../models/Testimonial.js";
import Gallery from "../models/Gallery.js";
import Slider from "../models/Slider.js";
import LoveStory from "../models/LoveStory.js";
import Film from "../models/Film.js";
import User from "../models/User.js";

export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - 7);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // 1. KPI Cards
        const newEnquiriesToday = await Enquiry.countDocuments({ createdAt: { $gte: today } });
        const newEnquiriesWeek = await Enquiry.countDocuments({ createdAt: { $gte: startOfWeek } });

        // Check order status enum for 'Pending'/'Confirmed' or similar
        const newOrdersCount = await Order.countDocuments({ createdAt: { $gte: startOfMonth } });

        const pendingQuotations = await Quotation.countDocuments({
            status: { $in: ['Draft', 'Sent', 'Awaiting Approval'] }
        });

        const unpaidInvoicesAgg = await Invoice.aggregate([
            { $match: { paymentStatus: { $ne: 'Paid' } } },
            { $group: { _id: null, count: { $sum: 1 }, totalAmount: { $sum: { $subtract: ["$grandTotal", "$amountPaid"] } } } }
        ]);
        const unpaidInvoicesCount = unpaidInvoicesAgg[0]?.count || 0;
        const unpaidInvoicesAmount = unpaidInvoicesAgg[0]?.totalAmount || 0;

        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const upcomingShootsCount = await Order.countDocuments({
            event_date: { $gte: today, $lte: nextWeek }
        });

        // Gallery / Content Health
        const galleryQueue = await Order.countDocuments({ order_status: 'In Progress' });
        const galleryStats = {
            total: await Gallery.countDocuments(),
            // uploaded: await Gallery.countDocuments({ status: 'Published' }) // If Status exists
        };

        const unreadMessages = await Contact.countDocuments({ status: 'New' });
        const activeClients = await Client.countDocuments({ status: 'Active' });
        const pendingTestimonials = await Testimonial.countDocuments({ status: 'Pending' });

        // 2. Action Required
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        const enquiriesNoReply = await Enquiry.find({
            createdAt: { $lt: yesterday },
            status: 'New'
        }).select('_id names groomName brideName createdAt').limit(5);

        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);
        const oldQuotations = await Quotation.find({
            updatedAt: { $lt: threeDaysAgo },
            status: 'Sent'
        }).select('_id quoteNumber clientName updatedAt').limit(5);

        const pendingOrders = await Order.find({ order_status: 'Pending' }).select('_id name createdAt').limit(5);

        const overdueInvoices = await Invoice.find({
            dueDate: { $lt: today },
            paymentStatus: { $ne: 'Paid' }
        }).select('_id invoiceNumber clientName dueDate grandTotal amountPaid').limit(5);

        const pendingTestimonialsList = await Testimonial.find({ status: 'Pending' }).select('_id coupleName createdAt shortDescription fullDescription rating location thumbnail').limit(4);

        // 3. Pipeline
        const pipelineStats = await Order.aggregate([
            { $group: { _id: "$order_status", count: { $sum: 1 } } }
        ]);

        const ordersByType = await Order.aggregate([
            { $group: { _id: "$photography_type", count: { $sum: 1 } } }
        ]);

        // 4. Calendar / Schedule - Next 5 shoots
        const upcomingShoots = await Order.find({
            event_date: { $gte: today }
        })
            .sort({ event_date: 1 })
            .limit(5)
            .select('_id name event_name event_date location photography_type order_status');

        // 5. Revenue Snapshot (This Month)
        const revenueStats = await Invoice.aggregate([
            {
                $match: {
                    invoiceDate: { $gte: startOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    billed: { $sum: "$grandTotal" },
                    collected: { $sum: "$amountPaid" }
                }
            }
        ]);
        const thisMonthBilled = revenueStats[0]?.billed || 0;
        const thisMonthCollected = revenueStats[0]?.collected || 0;

        // Total Outstanding (All time)
        const totalOutstandingAgg = await Invoice.aggregate([
            { $match: { paymentStatus: { $ne: 'Paid' } } },
            { $group: { _id: null, total: { $sum: { $subtract: ["$grandTotal", "$amountPaid"] } } } }
        ]);
        const totalOutstanding = totalOutstandingAgg[0]?.total || 0;

        // 6. Recent Activity
        const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(3).lean();
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(3).lean();
        const recentInvoices = await Invoice.find().sort({ createdAt: -1 }).limit(3).lean();

        const activityFeed = [
            ...recentEnquiries.map(e => ({ type: 'Enquiry', date: e.createdAt, text: `New enquiry: ${e.groomName} & ${e.brideName}`, id: e._id })),
            ...recentOrders.map(o => ({ type: 'Order', date: o.createdAt, text: `Order created: ${o.name}`, id: o._id })),
            ...recentInvoices.map(i => ({ type: 'Invoice', date: i.createdAt, text: `Invoice ${i.invoiceNumber}`, id: i._id }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        // 9. Content Health
        const sliderActive = await Slider.countDocuments({ active: true });
        const storiesPublished = await LoveStory.countDocuments({ status: 'Published' });
        const testimonialsPublished = await Testimonial.countDocuments({ status: 'Published' });

        // 10. Users
        const userStats = {
            total: await User.countDocuments(),
        };

        // 11. Charts Data
        // Monthly Revenue (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyRevenue = await Invoice.aggregate([
            {
                $match: {
                    invoiceDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$invoiceDate" },
                        year: { $year: "$invoiceDate" }
                    },
                    total: { $sum: "$grandTotal" }, // Using grandTotal as revenue
                    collected: { $sum: "$amountPaid" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthlyOrders = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Invoice Status Distribution
        const invoiceStatus = await Invoice.aggregate([
            {
                $group: {
                    _id: "$paymentStatus",
                    count: { $sum: 1 },
                    value: { $sum: "$grandTotal" }
                }
            }
        ]);

        res.status(200).json({
            kpi: {
                newEnquiriesToday,
                newEnquiriesWeek,
                newOrdersCount, // Month
                pendingQuotations,
                unpaidInvoicesCount,
                unpaidInvoicesAmount,
                upcomingShootsCount,
                galleryQueue,
                unreadMessages,
                activeClients,
                pendingTestimonials
            },
            actionRequired: {
                enquiriesNoReply,
                oldQuotations,
                pendingOrders,
                overdueInvoices,
                pendingTestimonialsList
            },
            pipeline: pipelineStats,
            ordersByType,
            schedule: upcomingShoots,
            revenue: {
                thisMonthBilled,
                thisMonthCollected,
                totalOutstanding
            },
            activityFeed,
            contentHealth: {
                sliderActive,
                storiesPublished,
                testimonialsPublished
            },
            galleryStats,
            userStats,
            charts: {
                monthlyRevenue,
                monthlyOrders,
                invoiceStatus
            }
        });

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
    }
};
