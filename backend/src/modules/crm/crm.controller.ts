import { Request, Response } from 'express';
import { prisma } from '../../shared/db/prisma';
import { LeadStatus, ActivityType } from '@prisma/client';

export class CrmController {
  async getLeads(req: Request, res: Response) {
    try {
      const leads = await prisma.crmLead.findMany({
        where: { deletedAt: null },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.sendSuccess(leads, 'CRM leads retrieved successfully');
    } catch (err) {
      console.error('Failed to fetch CRM leads:', err);
      res.sendError('Failed to fetch CRM leads', 500);
    }
  }

  async getLeadById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lead = await prisma.crmLead.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          activities: {
            orderBy: {
              happenedAt: 'desc',
            },
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!lead || lead.deletedAt) {
        return res.sendError('Lead not found', 404);
      }

      res.sendSuccess(lead, 'Lead details retrieved successfully');
    } catch (err) {
      console.error('Failed to fetch lead details:', err);
      res.sendError('Failed to fetch lead details', 500);
    }
  }

  async createLead(req: Request, res: Response) {
    try {
      const {
        contactName,
        email,
        phone,
        companyName,
        status,
        source,
        estimatedValueCents,
        pipelineStage,
        nextFollowUpAt,
        metadata,
        ownerId,
      } = req.body;

      if (!contactName || !email) {
        return res.sendError('Contact name and email are required', 400);
      }

      // Check if owner user exists
      let validOwnerId = ownerId || null;
      if (ownerId) {
        const ownerExists = await prisma.user.findUnique({ where: { id: ownerId } });
        if (!ownerExists) {
          validOwnerId = null;
        }
      }

      const lead = await prisma.crmLead.create({
        data: {
          contactName,
          email,
          phone: phone || null,
          companyName: companyName || null,
          status: (status as LeadStatus) || LeadStatus.new,
          source: source || 'Website Inquiry',
          estimatedValueCents: estimatedValueCents ? Number(estimatedValueCents) : null,
          pipelineStage: pipelineStage || 'general',
          nextFollowUpAt: nextFollowUpAt ? new Date(nextFollowUpAt) : null,
          ownerId: validOwnerId,
          metadata: metadata || {},
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.sendSuccess(lead, 'Lead created successfully', 201);
    } catch (err) {
      console.error('Failed to create lead:', err);
      res.sendError('Failed to create lead', 500);
    }
  }

  async updateLead(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        contactName,
        email,
        phone,
        companyName,
        status,
        source,
        estimatedValueCents,
        pipelineStage,
        nextFollowUpAt,
        metadata,
        ownerId,
      } = req.body;

      const leadExists = await prisma.crmLead.findUnique({ where: { id } });
      if (!leadExists || leadExists.deletedAt) {
        return res.sendError('Lead not found', 404);
      }

      let validOwnerId = ownerId;
      if (ownerId === '') {
        validOwnerId = null;
      } else if (ownerId) {
        const ownerExists = await prisma.user.findUnique({ where: { id: ownerId } });
        if (!ownerExists) {
          validOwnerId = undefined; // do not update ownerId if it is invalid
        }
      }

      const updatedLead = await prisma.crmLead.update({
        where: { id },
        data: {
          contactName: contactName !== undefined ? contactName : undefined,
          email: email !== undefined ? email : undefined,
          phone: phone !== undefined ? (phone || null) : undefined,
          companyName: companyName !== undefined ? (companyName || null) : undefined,
          status: status !== undefined ? (status as LeadStatus) : undefined,
          source: source !== undefined ? source : undefined,
          estimatedValueCents: estimatedValueCents !== undefined ? (estimatedValueCents ? Number(estimatedValueCents) : null) : undefined,
          pipelineStage: pipelineStage !== undefined ? pipelineStage : undefined,
          nextFollowUpAt: nextFollowUpAt !== undefined ? (nextFollowUpAt ? new Date(nextFollowUpAt) : null) : undefined,
          ownerId: validOwnerId !== undefined ? validOwnerId : undefined,
          metadata: metadata !== undefined ? metadata : undefined,
        },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.sendSuccess(updatedLead, 'Lead updated successfully');
    } catch (err) {
      console.error('Failed to update lead:', err);
      res.sendError('Failed to update lead', 500);
    }
  }

  async getActivities(req: Request, res: Response) {
    try {
      const { id: leadId } = req.params;
      const activities = await prisma.crmActivity.findMany({
        where: { leadId },
        orderBy: {
          happenedAt: 'desc',
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      res.sendSuccess(activities, 'Lead activities retrieved successfully');
    } catch (err) {
      console.error('Failed to fetch lead activities:', err);
      res.sendError('Failed to fetch lead activities', 500);
    }
  }

  async createActivity(req: Request, res: Response) {
    try {
      const { id: leadId } = req.params;
      const { activityType, summary, happenedAt, details } = req.body;
      const userId = (req as any).user?.id;

      if (!activityType || !summary) {
        return res.sendError('Activity type and summary are required', 400);
      }

      if (!userId) {
        return res.sendError('User authentication required', 401);
      }

      const leadExists = await prisma.crmLead.findUnique({ where: { id: leadId } });
      if (!leadExists || leadExists.deletedAt) {
        return res.sendError('Lead not found', 404);
      }

      const activity = await prisma.crmActivity.create({
        data: {
          leadId,
          userId,
          activityType: activityType as ActivityType,
          summary,
          happenedAt: happenedAt ? new Date(happenedAt) : new Date(),
          details: details || {},
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      // Update lead's updatedAt field as well
      await prisma.crmLead.update({
        where: { id: leadId },
        data: { updatedAt: new Date() }
      });

      res.sendSuccess(activity, 'CRM activity logged successfully', 201);
    } catch (err) {
      console.error('Failed to log CRM activity:', err);
      res.sendError('Failed to log CRM activity', 500);
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const leads = await prisma.crmLead.findMany({
        where: { deletedAt: null },
      });

      let totalPipelineValueCents = 0;
      let wonValueCents = 0;
      const statusCounts: Record<string, number> = {
        new: 0,
        contacted: 0,
        proposal_sent: 0,
        negotiation: 0,
        won: 0,
        lost: 0,
      };

      leads.forEach((lead) => {
        const val = lead.estimatedValueCents || 0;
        statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
        
        if (lead.status === 'won') {
          wonValueCents += val;
        } else if (lead.status !== 'lost') {
          totalPipelineValueCents += val;
        }
      });

      const activeLeadsCount = leads.filter(
        (l) => l.status !== 'won' && l.status !== 'lost'
      ).length;

      const closedLeads = leads.filter(
        (l) => l.status === 'won' || l.status === 'lost'
      );
      const wonLeads = leads.filter((l) => l.status === 'won');
      const winRate = closedLeads.length > 0 ? wonLeads.length / closedLeads.length : 0;

      // Calculate monthly conversion trends or source breakdowns
      const sourceCounts: Record<string, number> = {};
      leads.forEach((lead) => {
        const src = lead.source || 'Website Inquiry';
        sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      });

      res.sendSuccess(
        {
          totalPipelineValueCents,
          wonValueCents,
          activeLeadsCount,
          winRate,
          statusCounts,
          sourceCounts,
        },
        'CRM statistics calculated successfully'
      );
    } catch (err) {
      console.error('Failed to calculate CRM stats:', err);
      res.sendError('Failed to calculate CRM stats', 500);
    }
  }
}
