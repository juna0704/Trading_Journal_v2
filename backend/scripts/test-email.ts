import nodemailer from "nodemailer";
import { env } from "../src/config";

async function testConnection() {
  console.log("--- Starting SMTP Connection Test ---");

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // True for 465, false for 587
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
    // Adding these helps catch specific handshake issues
    logger: true,
    debug: true,
  });

  try {
    // This is the core testing method
    await transporter.verify();
    console.log("✅ Success: Server is ready to take our messages!");
  } catch (error) {
    console.error("❌ Connection failed!");
    console.error(error);
  }
}

testConnection();
