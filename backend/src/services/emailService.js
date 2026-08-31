import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Sends welcome email to newly created Customer with temporary password credentials.
 */
export async function sendWelcomeEmail({ email, name, tempPassword }) {
  const mailSubject = 'Welcome to EU CBAM Tool — Account Login Credentials';
  const mailBody = `
    <h2>Welcome to the EU CBAM Calculation & Reporting Platform</h2>
    <p>Dear ${name},</p>
    <p>A new Customer account has been created for you by the Superadmin.</p>
    
    <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px; font-family: monospace; margin: 16px 0;">
      <p style="margin: 4px 0;"><strong>Login URL:</strong> http://localhost:5173/login</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
      <p style="margin: 4px 0;"><strong>Temporary Password:</strong> <span style="color: #059669; font-weight: bold;">${tempPassword}</span></p>
    </div>

    <p>Please log in and update your password on your first sign-in.</p>
    <p>Best regards,<br>EU CBAM Administration Team</p>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@cbam.eu',
        to: email,
        subject: mailSubject,
        html: mailBody,
      });
      console.log(`✉️  Welcome email sent to ${email}`);
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
    }
  } else {
    console.log(`
============================================================
📧 [WELCOME EMAIL SIMULATION (SMTP Not Configured)]
------------------------------------------------------------
To: ${email}
Subject: ${mailSubject}
Temporary Password: ${tempPassword}
------------------------------------------------------------
Log in at: http://localhost:5173/login
============================================================
    `);
  }
}
