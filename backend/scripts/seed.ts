import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  const passwordHash = await bcrypt.hash('StrongP@ssword123', 12);
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      description: 'Platform administrator with full access',
      isAdmin: true,
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@kalavault.com' },
    update: {},
    create: {
      email: 'admin@kalavault.com',
      passwordHash,
      firstName: 'Kala',
      lastName: 'Vault',
      roleId: adminRole.id,
      status: 'active',
    },
  });

  console.log('Seed completed');
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
