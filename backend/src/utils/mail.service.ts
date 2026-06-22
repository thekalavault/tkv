// @ts-ignore
import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../shared/logger/logger';

export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    if (config.smtpHost && config.smtpHost !== 'placeholder') {
      try {
        this.transporter = nodemailer.createTransport({
          host: config.smtpHost,
          port: config.smtpPort,
          secure: config.smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: config.smtpUser,
            pass: config.smtpPass,
          },
        });
        logger.info('✅ SMTP Mailer initialized successfully');
      } catch (err) {
        logger.error({ err }, '❌ Failed to initialize SMTP Mailer');
      }
    } else {
      logger.warn('⚠️ SMTP credentials not configured. Outgoing emails will be logged to console.');
    }
  }

  async sendMail(to: string, subject: string, html: string): Promise<boolean> {
    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: config.smtpFrom,
          to,
          subject,
          html,
        });
        logger.info({ to, subject }, '📧 Email sent successfully via SMTP');
        return true;
      } catch (err) {
        logger.error({ err, to, subject }, '❌ Failed to send email via SMTP');
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

    if (this.transporter) {
      try {
        await this.transporter.sendMail({
          from: config.smtpFrom,
          to: config.adminEmail,
          replyTo: inquiry.email,
          subject,
          html,
        });
        logger.info({ email: inquiry.email, subject }, '📧 Inquiry email sent successfully to admin');
        return true;
      } catch (err) {
        logger.error({ err, email: inquiry.email, subject }, '❌ Failed to send inquiry email to admin');
        return false;
      }
    } else {
      logger.info({ inquiry, html }, '📝 [MOCK EMAIL LOGGER] Admin Inquiry generated:');
      return true;
    }
  }
}

export const mailService = new MailService();
