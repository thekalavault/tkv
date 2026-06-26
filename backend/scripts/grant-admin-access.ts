import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function grantAdminAccess() {
  const email = process.argv[2];

  if (!email) {
    console.error('Please provide an email address. Example: npx ts-node scripts/grant-admin-access.ts user@example.com');
    process.exit(1);
  }

  try {
    // 1. Ensure the 'admin' role exists
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Platform administrator with full access',
        isAdmin: true,
      },
    });

    // 2. Find the user first to provide a better error message if they don't exist
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`Error: User with email '${email}' not found in the database.`);
      console.error('Make sure they have already signed up and that your DATABASE_URL is pointing to the correct environment (Production vs Local).');
      process.exit(1);
    }

    // 3. Update the user's role to admin
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        roleId: adminRole.id,
      },
    });

    console.log(`\u2705 Successfully granted admin access to ${updatedUser.email}.`);
    console.log(`They can now access the admin dashboard.`);
  } catch (err) {
    console.error(`\u274C Failed to grant admin access:`, err);
  } finally {
    await prisma.$disconnect();
  }
}

grantAdminAccess();
