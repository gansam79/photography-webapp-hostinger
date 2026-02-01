import 'dotenv/config';
import nodemailer from 'nodemailer';

const check = async () => {
    console.log("Checking Email Config...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set (" + process.env.EMAIL_USER + ")" : "Missing");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set (Len: " + process.env.EMAIL_PASS.length + ")" : "Missing");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("Credentials missing in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        console.log("Verifying SMTP connection...");
        await transporter.verify();
        console.log("✅ SMTP Connection Verified!");

        console.log("Sending test email to self...");
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Test Email from Check Script",
            text: "It works!"
        });
        console.log("✅ Test Email Sent!");

    } catch (err) {
        console.error("❌ SMTP Connection Failed:", err.message);
        console.log("\nIf using Gmail, ensure you have:");
        console.log("1. Enabled 2-Factor Authentication (2FA).");
        console.log("2. Generated an 'App Password' (NOT your normal password).");
        console.log("3. Used that App Password in the .env file.");
    }
};

check();
