import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB, disconnectDB } from "../config/database.js";
import Client from "../models/Client.js";
import Invoice from "../models/Invoice.js";
import Payment from "../models/Payment.js";
import Quotation from "../models/Quotation.js";
import Service from "../models/Service.js";
import User from "../models/User.js";

dotenv.config();

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const emptyCollections = async () => {
  await Promise.all([
    Client.deleteMany({}),
    Invoice.deleteMany({}),
    Payment.deleteMany({}),
    Quotation.deleteMany({}),
    Service.deleteMany({}),
    User.deleteMany({}),
  ]);
};

const seed = async () => {
  const forceReset = process.argv.includes("--force");
  const counts = await Promise.all([
    Client.estimatedDocumentCount(),
    Invoice.estimatedDocumentCount(),
    Payment.estimatedDocumentCount(),
    Quotation.estimatedDocumentCount(),
    Service.estimatedDocumentCount(),
    User.estimatedDocumentCount(),
  ]);

  const hasExistingData = counts.some((count) => count > 0);
  if (hasExistingData && !forceReset) {
    console.log("⚠️  Collections already contain data. Re-run with --force to replace it.");
    return;
  }

  if (hasExistingData && forceReset) {
    console.log("♻️  Clearing existing collections before seeding...");
    await emptyCollections();
  }

  if (!hasExistingData) {
    await emptyCollections();
  }

  const clients = await Client.insertMany([
    {
      name: "Rahul & Sneha Patil",
      email: "rahul.sneha@example.com",
      phone: "+91 99220 11001",
      address: "Bhandarkar Road",
      city: "Pune",
      state: "MH",
      zipCode: "411004",
      category: "VIP",
      tags: ["wedding", "cinematic"],
      notes: "Prefers warm grading and candid coverage.",
    },
    {
      name: "Aditi & Neel Mehta",
      email: "aditi.neel@example.com",
      phone: "+91 90040 22217",
      city: "Mumbai",
      state: "MH",
      category: "Regular",
      tags: ["sunrise", "beach"],
      notes: "Destination engagement at Aksa beach.",
    },
    {
      name: "Studio Samarth Retail",
      email: "production@studiosamarth.com",
      phone: "+91 98191 88009",
      address: "Lower Parel",
      city: "Mumbai",
      state: "MH",
      category: "Regular",
      tags: ["fashion", "lookbook"],
      notes: "Seasonal lookbooks every quarter.",
    },
  ]);

  const services = await Service.insertMany([
    {
      name: "Cinematic Wedding Films Unit",
      description: "Multiple Sony FX3 rigs, gimbal ops, and on-site editor.",
      category: "video",
      ratePerDay: 85000,
      ratePerUnit: 0,
    },
    {
      name: "Luxury Photography Crew",
      description: "Lead photographer + 2 associates + lighting tech.",
      category: "photography",
      ratePerDay: 65000,
      ratePerUnit: 0,
    },
    {
      name: "Aerial + FPV Team",
      description: "Dual drones with FPV pilot, permissions, and insurance.",
      category: "drone",
      ratePerDay: 45000,
      ratePerUnit: 0,
    },
    {
      name: "Lookbook Lighting Lab",
      description: "Profoto B10 kit, scrims, and grip assistants.",
      category: "product",
      ratePerDay: 55000,
      ratePerUnit: 0,
    },
    {
      name: "Post-Production Suite",
      description: "Retouching and color managed delivery pipeline.",
      category: "other",
      ratePerDay: 35000,
      ratePerUnit: 0,
    },
  ]);

  const serviceMap = Object.fromEntries(services.map((service) => [service.name, service]));
  const [rahulClient, aditiClient, samarthClient] = clients;

  const quotationDocs = await Quotation.insertMany([
    {
      quotationNumber: "QTN-2026-001",
      clientId: rahulClient._id,
      eventType: "Wedding",
      quotationDate: new Date("2026-01-05"),
      eventDate: new Date("2026-02-12"),
      validityDate: new Date("2026-02-01"),
      services: [
        {
          serviceId: serviceMap["Cinematic Wedding Films Unit"]._id,
          serviceName: "Cinematic Wedding Films Unit",
          quantity: 1,
          days: 3,
          ratePerDay: 85000,
          total: 255000,
        },
        {
          serviceId: serviceMap["Luxury Photography Crew"]._id,
          serviceName: "Luxury Photography Crew",
          quantity: 1,
          days: 3,
          ratePerDay: 65000,
          total: 195000,
        },
        {
          serviceId: serviceMap["Aerial + FPV Team"]._id,
          serviceName: "Aerial + FPV Team",
          quantity: 1,
          days: 2,
          ratePerDay: 45000,
          total: 90000,
        },
      ],
      subtotal: 540000,
      discount: 20000,
      discountType: "fixed",
      taxPercentage: 18,
      tax: 93600,
      grandTotal: 613600,
      paymentTerms: "40% to block dates, rest before delivery",
      status: "Accepted",
      convertedToInvoice: true,
    },
    {
      quotationNumber: "QTN-2026-002",
      clientId: aditiClient._id,
      eventType: "Pre-wedding",
      quotationDate: new Date("2026-01-12"),
      eventDate: new Date("2026-03-09"),
      validityDate: new Date("2026-02-10"),
      services: [
        {
          serviceId: serviceMap["Luxury Photography Crew"]._id,
          serviceName: "Luxury Photography Crew",
          quantity: 1,
          days: 2,
          ratePerDay: 65000,
          total: 130000,
        },
        {
          serviceId: serviceMap["Cinematic Wedding Films Unit"]._id,
          serviceName: "Cinematic Wedding Films Unit",
          quantity: 1,
          days: 2,
          ratePerDay: 85000,
          total: 170000,
        },
        {
          serviceId: serviceMap["Aerial + FPV Team"]._id,
          serviceName: "Aerial + FPV Team",
          quantity: 1,
          days: 1,
          ratePerDay: 45000,
          total: 45000,
        },
      ],
      subtotal: 345000,
      discount: 0,
      discountType: "fixed",
      taxPercentage: 18,
      tax: 62100,
      grandTotal: 407100,
      paymentTerms: "50% advance, balance within 5 days of shoot",
      status: "Sent",
      convertedToInvoice: false,
    },
    {
      quotationNumber: "QTN-2026-003",
      clientId: samarthClient._id,
      eventType: "Other",
      quotationDate: new Date("2025-12-28"),
      eventDate: new Date("2026-01-30"),
      validityDate: new Date("2026-01-15"),
      services: [
        {
          serviceId: serviceMap["Lookbook Lighting Lab"]._id,
          serviceName: "Lookbook Lighting Lab",
          quantity: 1,
          days: 2,
          ratePerDay: 55000,
          total: 110000,
        },
        {
          serviceId: serviceMap["Luxury Photography Crew"]._id,
          serviceName: "Luxury Photography Crew",
          quantity: 1,
          days: 2,
          ratePerDay: 65000,
          total: 130000,
        },
        {
          serviceId: serviceMap["Post-Production Suite"]._id,
          serviceName: "Post-Production Suite",
          quantity: 1,
          days: 3,
          ratePerDay: 35000,
          total: 105000,
        },
      ],
      subtotal: 345000,
      discount: 15000,
      discountType: "fixed",
      taxPercentage: 18,
      tax: 59400,
      grandTotal: 389400,
      paymentTerms: "30% advance to book studio, rest before final delivery",
      status: "Accepted",
      convertedToInvoice: true,
    },
  ]);

  const invoiceDocs = await Invoice.insertMany([
    {
      invoiceNumber: "INV-2026-001",
      clientId: rahulClient._id,
      quotationId: quotationDocs[0]._id,
      eventType: "Wedding",
      invoiceDate: new Date("2026-01-08"),
      eventDate: new Date("2026-02-12"),
      dueDate: new Date("2026-02-05"),
      services: quotationDocs[0].services,
      subtotal: 540000,
      discount: 20000,
      discountType: "fixed",
      taxPercentage: 18,
      tax: 93600,
      grandTotal: 613600,
      paymentStatus: "Partially Paid",
      bankDetails: {
        accountName: "Lumina Collective",
        accountNumber: "2233445566",
        ifscCode: "HDFC0000456",
        upiId: "luminaco@hdfcbank",
      },
      notes: "Balance due before final gallery hand-off.",
    },
    {
      invoiceNumber: "INV-2026-002",
      clientId: samarthClient._id,
      quotationId: quotationDocs[2]._id,
      eventType: "Other",
      invoiceDate: new Date("2026-01-02"),
      eventDate: new Date("2026-01-30"),
      dueDate: new Date("2026-01-20"),
      services: quotationDocs[2].services,
      subtotal: 345000,
      discount: 15000,
      discountType: "fixed",
      taxPercentage: 18,
      tax: 59400,
      grandTotal: 389400,
      paymentStatus: "Paid",
      bankDetails: {
        accountName: "Lumina Collective",
        accountNumber: "2233445566",
        ifscCode: "HDFC0000456",
        upiId: "luminaco@hdfcbank",
      },
      notes: "Approved by procurement. Include LUT pack with delivery.",
    },
  ]);

  await Promise.all(
    invoiceDocs.map((invoice) =>
      Quotation.findByIdAndUpdate(invoice.quotationId, {
        convertedToInvoice: true,
        invoiceId: invoice._id,
        status: "Accepted",
      })
    )
  );

  const payments = await Payment.insertMany([
    {
      invoiceId: invoiceDocs[0]._id,
      clientId: rahulClient._id,
      amount: 320000,
      paymentDate: new Date("2026-01-10"),
      paymentMethod: "UPI",
      transactionId: "UPI-AXIS-9931",
      notes: "Advance + crew block",
    },
    {
      invoiceId: invoiceDocs[0]._id,
      clientId: rahulClient._id,
      amount: 150000,
      paymentDate: new Date("2026-01-18"),
      paymentMethod: "Bank Transfer",
      transactionId: "NEFT-HDFC-5521",
      notes: "Second milestone",
    },
    {
      invoiceId: invoiceDocs[1]._id,
      clientId: samarthClient._id,
      amount: 389400,
      paymentDate: new Date("2026-01-22"),
      paymentMethod: "Bank Transfer",
      transactionId: "NEFT-ICICI-7742",
      notes: "Paid in full",
    },
  ]);

  const billedByClient = invoiceDocs.reduce((map, invoice) => {
    const id = invoice.clientId.toString();
    map.set(id, (map.get(id) ?? 0) + invoice.grandTotal);
    return map;
  }, new Map());

  const paidByClient = payments.reduce((map, payment) => {
    const id = payment.clientId.toString();
    map.set(id, (map.get(id) ?? 0) + payment.amount);
    return map;
  }, new Map());

  await Promise.all(
    clients.map((client) => {
      const id = client._id.toString();
      const totalBilled = billedByClient.get(id) ?? 0;
      const totalPaid = paidByClient.get(id) ?? 0;
      const pendingAmount = Math.max(totalBilled - totalPaid, 0);
      const category = totalBilled >= 500000 ? "VIP" : totalBilled > 0 ? "Regular" : "New Inquiry";

      return Client.findByIdAndUpdate(client._id, {
        totalBilled,
        totalPaid,
        pendingAmount,
        category,
      });
    })
  );

  const adminPassword = await bcrypt.hash("admin@123", 10);
  await User.create({
    name: "Studio Admin",
    email: "admin@lumina.studio",
    password: adminPassword,
    role: "admin",
  });

  console.log("🌱 Seed data inserted successfully.");
  console.log(
    `👉 Clients: ${clients.length}, Services: ${services.length}, Quotations: ${quotationDocs.length}, Invoices: ${invoiceDocs.length}, Payments: ${payments.length}`
  );
};

const run = async () => {
  await connectDB();
  try {
    await seed();
  } catch (error) {
    console.error("❌ Seeding failed:", error.message || error);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
    process.exit(process.exitCode ?? 0);
  }
};

run();