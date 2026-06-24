import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';

export class CrmController {
  async getLeads(req: Request, res: Response) {
    try {
      const leads = await prisma.crmLead.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.json({
        success: true,
        data: leads,
      });
    } catch (err) {
      console.error('Failed to fetch CRM leads:', err);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch CRM leads',
      });
    }
  }
}
