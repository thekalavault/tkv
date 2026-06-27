import { prisma } from './src/shared/db/prisma';

async function main() {
  const leads = await prisma.crmLead.findMany();
  console.log('Total Leads:', leads.length);
  console.log(leads);
}

main().catch(console.error).finally(() => prisma.$disconnect());
