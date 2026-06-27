import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

async function testResend() {
  console.log('Testing connection to Resend API...');
  
  const apiKey = process.env.RESEND_API_KEY || process.env.SMTP_PASS;
  if (!apiKey) {
    console.error('No Resend API Key found in environment variables.');
    return;
  }
  
  const resend = new Resend(apiKey);

  try {
    console.log('Attempting to send test email via Resend API...');
    const data = await resend.emails.send({
      from: process.env.SMTP_FROM || 'onboarding@resend.dev',
      to: process.env.ADMIN_EMAIL || 'ayush@example.com',
      subject: 'Resend SDK Test',
      html: '<p>This is a test email sent from the Kala Vault using the official Resend SDK.</p>',
    });

    console.log('Email sent successfully!');
    console.log('Response ID:', data.id);
  } catch (error) {
    console.error('Resend API Error:', error);
  }
}

testResend();
