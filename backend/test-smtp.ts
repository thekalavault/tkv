import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testSmtp() {
  console.log('Testing SMTP connection to Resend...');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.resend.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER || 'resend',
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    const result = await transporter.verify();
    console.log('SMTP Verify Result:', result);
    
    // Test sending an email
    console.log('Attempting to send test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'ayush@example.com', // Sending to admin email
      subject: 'SMTP Test',
      text: 'This is a test email from Kala Vault SMTP checker.',
    });
    console.log('Email sent successfully!', info);
  } catch (error) {
    console.error('SMTP Error:', error);
  }
}

testSmtp();
