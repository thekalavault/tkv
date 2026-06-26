import 'dotenv/config';
import { supabase } from '../src/auth/supabase.service';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = 'admin7@tkv.com';
  const password = 'artstartshere@7';

  try {
    // 1. Ensure user exists in Supabase with correct password
    // Use admin api to update if exists, or create
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.log('Error listing users, attempting normal signup', listError);
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError && !signUpError.message.includes('already')) {
         throw signUpError;
      }
    } else {
       const existing = usersData.users.find(u => u.email === email);
       if (existing) {
         console.log('User found in Supabase. Updating password...');
         await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
       } else {
         console.log('User not found in Supabase. Creating...');
         const { error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
         });
         if (error) throw error;
       }
    }
    
    // 2. Ensure role "admin" exists
    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: {
        name: 'admin',
        description: 'Platform administrator with full access',
        isAdmin: true,
      },
    });

    // 3. Create or Update user in Prisma
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        roleId: adminRole.id,
      },
      create: {
        email,
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        roleId: adminRole.id,
        status: 'active',
      },
    });

    console.log('Admin user credentials configured successfully');
  } catch (err) {
    console.error('Failed to create admin', err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
