import { Request, Response } from 'express';
import { mailService } from '../../utils/mail.service';
import { ApiError } from '../../shared/errors/api-error';
import { prisma } from '../../shared/db/prisma';

export class SupportController {
  async submitInquiry(req: Request, res: Response) {
    const { fullName, email, phone, entity, interest, message } = req.body;

    if (!fullName || !email || !interest || !message) {
      throw new ApiError('Missing required fields: fullName, email, interest, and message are required.', 400);
    }
    try {
      await prisma.crmLead.create({
        data: {
          contactName: fullName,
          email,
          phone,
          companyName: entity,
          source: 'Website Inquiry',
          pipelineStage: interest,
          metadata: { message }
        }
      });
    } catch (err) {
      console.error('Failed to create CRM lead from inquiry:', err);
      // We still want to send the email even if DB fails
    }

    const success = await mailService.sendInquiryEmail({
      fullName,
      email,
      phone,
      entity,
      interest,
      message,
    });

    if (!success) {
      throw new ApiError('Failed to send email inquiry. Please try again later.', 500);
    }

    res.json({
      success: true,
      message: 'Inquiry received and email sent successfully.',
    });
  }
}
