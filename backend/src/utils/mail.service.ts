import { Resend } from 'resend';
import { config } from '../config';
import { logger } from '../shared/logger/logger';

export class MailService {
  private resend: Resend | null = null;

  constructor() {
    if (config.resendApiKey && config.resendApiKey !== 'placeholder') {
      try {
        this.resend = new Resend(config.resendApiKey);
        logger.info('✅ Resend Mailer initialized successfully');
      } catch (err) {
        logger.error({ err }, '❌ Failed to initialize Resend Mailer');
      }
    } else {
      logger.warn('⚠️ Resend API key not configured. Outgoing emails will be logged to console.');
    }
  }

  async sendMail(to: string, subject: string, html: string, replyTo?: string): Promise<boolean> {
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: config.smtpFrom,
          to,
          subject,
          html,
          replyTo,
        });
        logger.info({ to, subject }, '📧 Email sent successfully via Resend');
        return true;
      } catch (err) {
        logger.error({ err, to, subject }, '❌ Failed to send email via Resend');
        return false;
      }
    } else {
      // Fallback logging for local development
      logger.info({ to, subject, html }, '📝 [MOCK EMAIL LOGGER] Email generated:');
      return true;
    }
  }

  async sendWelcomeEmail(to: string, name: string): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #d4af37;">
        <h2 style="color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.1em;">Welcome to The Kala Vault</h2>
        <p>Dear ${name},</p>
        <p>Your member account is active. You can now access your curated portfolio, private acquisitions, and schedule bespoke curation sessions.</p>
        <hr style="border: none; border-top: 1px solid #d4af37; margin: 24px 0;" />
        <p style="font-size: 11px; color: #666;">© 2026 The Kala Vault. All Rights Reserved.</p>
      </div>
    `;
    return this.sendMail(to, 'Welcome to The Kala Vault', html);
  }

  async sendLoginNotification(to: string, email: string): Promise<boolean> {
    const html = `
      <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #d4af37;">
        <h2 style="color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.1em;">New Login Detected</h2>
        <p>Hello,</p>
        <p>A new login was recorded for your account <strong>${email}</strong> on ${new Date().toLocaleString()}.</p>
        <hr style="border: none; border-top: 1px solid #d4af37; margin: 24px 0;" />
        <p style="font-size: 11px; color: #666;">© 2026 The Kala Vault. All Rights Reserved.</p>
      </div>
    `;
    return this.sendMail(to, 'Security Alert: New Login Notification', html);
  }

  async sendInquiryEmail(inquiry: {
    fullName: string;
    email: string;
    phone?: string;
    entity?: string;
    interest: string;
    message: string;
  }): Promise<boolean> {
    const subject = `New Kala Vault Inquiry: ${inquiry.interest.toUpperCase()}`;
    const html = `
      <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #d4af37; background-color: #fafafa;">
        <h2 style="color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #d4af37; padding-bottom: 12px; font-weight: normal;">New Inquiry Received</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px; color: #555;">Name:</td>
            <td style="padding: 8px 0; color: #1a1a1a;">${inquiry.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
            <td style="padding: 8px 0; color: #1a1a1a;"><a href="mailto:${inquiry.email}" style="color: #d4af37; text-decoration: none;">${inquiry.email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Phone:</td>
            <td style="padding: 8px 0; color: #1a1a1a;">${inquiry.phone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Organization:</td>
            <td style="padding: 8px 0; color: #1a1a1a;">${inquiry.entity || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #555;">Interest Type:</td>
            <td style="padding: 8px 0; color: #1a1a1a; text-transform: capitalize;">${inquiry.interest.replace('-', ' ')}</td>
          </tr>
        </table>
        <div style="margin-top: 24px; padding: 16px; background-color: #ffffff; border-left: 4px solid #d4af37; border-top: 1px solid #eee; border-right: 1px solid #eee; border-bottom: 1px solid #eee;">
          <h4 style="margin-top: 0; color: #555; font-weight: bold;">Message:</h4>
          <p style="color: #1a1a1a; line-height: 1.6; white-space: pre-wrap; margin-bottom: 0;">${inquiry.message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #d4af37; margin: 24px 0;" />
        <p style="font-size: 11px; color: #888; text-align: center;">© 2026 The Kala Vault. Inquiry System.</p>
      </div>
    `;

    return this.sendMail(config.adminEmail, subject, html, inquiry.email);
  }
}

export const mailService = new MailService();
