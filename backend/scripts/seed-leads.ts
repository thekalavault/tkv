import { PrismaClient, LeadStatus, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding detailed CRM leads and activities...');

  // Find the seeded admin user to assign as owner
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@thekalavault.com' }
  });

  if (!admin) {
    console.error('Admin user not found. Please run npm run seed first!');
    process.exit(1);
  }

  // Clear existing leads to start fresh for development
  await prisma.crmActivity.deleteMany();
  await prisma.crmLead.deleteMany();

  const leadsData = [
    {
      contactName: 'Aarav Mehta',
      email: 'aarav.mehta@reliance.co.in',
      phone: '+91 98765 43210',
      companyName: 'Reliance Industries',
      status: LeadStatus.negotiation,
      source: 'Direct Referral',
      estimatedValueCents: 150000000, // ₹ 15,00,000
      pipelineStage: 'negotiation',
      nextFollowUpAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 days
      metadata: { notes: 'Interested in leasing 5 large abstract paintings for the executive suite.' }
    },
    {
      contactName: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 91234 56789',
      companyName: 'Private Collector',
      status: LeadStatus.won,
      source: 'Website Inquiry',
      estimatedValueCents: 85000000, // ₹ 8,50,000
      pipelineStage: 'won',
      nextFollowUpAt: null,
      metadata: { notes: 'Lease completed. Artworks delivered and installed on July 2nd.' }
    },
    {
      contactName: 'Eleanor Vance',
      email: 'evance@vancedesign.net',
      phone: '+1 212 555 0199',
      companyName: 'Vance Design Group',
      status: LeadStatus.proposal_sent,
      source: 'Partner Channel',
      estimatedValueCents: 42000000, // ₹ 4,20,000
      pipelineStage: 'proposal',
      nextFollowUpAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // In 5 days
      metadata: { notes: 'Sent lease proposal for residential penthouse art curation project.' }
    },
    {
      contactName: 'Vikram Malhotra',
      email: 'v.malhotra@oberoihotels.com',
      phone: '+91 99887 76655',
      companyName: 'Oberoi Hotels & Resorts',
      status: LeadStatus.contacted,
      source: 'Cold Outreach',
      estimatedValueCents: 240000000, // ₹ 24,00,000
      pipelineStage: 'contact',
      nextFollowUpAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
      metadata: { notes: 'Had an intro call. Looking for historical sculpture rentals for the lobby rotation.' }
    },
    {
      contactName: 'Kiran Patel',
      email: 'kiran.patel@adani.com',
      phone: '+91 90000 11111',
      companyName: 'Adani Headquarters',
      status: LeadStatus.new,
      source: 'Website Inquiry',
      estimatedValueCents: 120000000, // ₹ 12,00,000
      pipelineStage: 'general',
      nextFollowUpAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      metadata: { notes: 'Inquired via website form regarding Corporate flagship subscription tier.' }
    },
    {
      contactName: 'Rohan Sen',
      email: 'rohan.sen@tata.com',
      phone: '+91 88888 77777',
      companyName: 'Tata Sons Ltd',
      status: LeadStatus.lost,
      source: 'Direct Referral',
      estimatedValueCents: 180000000, // ₹ 18,00,000
      pipelineStage: 'lost',
      nextFollowUpAt: null,
      metadata: { notes: 'Decided to purchase art permanently due to budget changes. Keep in touch for next fiscal.' }
    }
  ];

  for (const data of leadsData) {
    const lead = await prisma.crmLead.create({
      data: {
        ...data,
        ownerId: admin.id
      }
    });

    // Create activities for each lead to populate timelines
    if (lead.status === LeadStatus.new) {
      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.email,
          summary: 'Received website inquiry form',
          happenedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          details: { message: lead.metadata ? (lead.metadata as any).notes : '' }
        }
      });
    }

    if (lead.status === LeadStatus.contacted || lead.status === LeadStatus.proposal_sent || lead.status === LeadStatus.negotiation || lead.status === LeadStatus.won) {
      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.email,
          summary: 'Initial website form contact received',
          happenedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          details: { message: 'Inquiry about art leasing models.' }
        }
      });

      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.call,
          summary: 'Completed introductory call',
          happenedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          details: { duration: '15 mins', outcome: 'Qualify requirements and budget.' }
        }
      });
    }

    if (lead.status === LeadStatus.proposal_sent || lead.status === LeadStatus.negotiation || lead.status === LeadStatus.won) {
      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.meeting,
          summary: 'Presented curation catalog & mockups',
          happenedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          details: { location: 'Google Meet', duration: '45 mins', notes: 'Presented curation proposal. Customer loved the abstract painting selections.' }
        }
      });
    }

    if (lead.status === LeadStatus.negotiation || lead.status === LeadStatus.won) {
      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.note,
          summary: 'Negotiating contract terms & SLA',
          happenedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          details: { notes: 'Aarav requested a 5% discount for a 2-year lease commitment.' }
        }
      });
    }

    if (lead.status === LeadStatus.won) {
      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.task,
          summary: 'Deliver & install curator pieces',
          happenedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          details: { status: 'Completed', installationNotes: 'All 5 pieces securely mounted with museum-grade security hardware.' }
        }
      });
    }

    if (lead.status === LeadStatus.lost) {
      await prisma.crmActivity.create({
        data: {
          leadId: lead.id,
          userId: admin.id,
          activityType: ActivityType.call,
          summary: 'Follow up call on proposal',
          happenedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          details: { outcome: 'Lost deal. Client decided to buy rather than lease.' }
        }
      });
    }
  }

  console.log('CRM Leads and Activities seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
