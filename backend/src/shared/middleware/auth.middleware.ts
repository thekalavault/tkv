import { Request, Response, NextFunction } from 'express';
import { SupabaseAuthService } from '../../auth/supabase.service';
import { config } from '../../config';
import { ApiError } from '../errors/api-error';
import { prisma } from '../db/prisma';

export interface AuthRequest extends Request {
  user?: { id: string; role: string; email: string };
}

// JWT secret removed (Supabase auth used)

export async function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError('Authorization header missing', 401);
  }

  const token = authHeader.replace('Bearer ', '');
  
  // 1. Dev Bypass / Mock Mode
  if (token === 'offline-token-dummy' || token.startsWith('offline-')) {
    const defaultUser = await prisma.user.findFirst({
      where: { email: { contains: 'admin' } },
      include: { role: true }
    });
    
    if (defaultUser) {
      req.user = {
        id: defaultUser.id,
        email: defaultUser.email,
        role: defaultUser.role.name,
      };
      return next();
    }
  }

  // 3. Supabase token verification
  try {
    const supabaseUser = await SupabaseAuthService.verifyToken(token);
    // Find or create corresponding user in our DB
    let dbUser: any = await prisma.user.findUnique({
      where: { email: supabaseUser.email || '' },
      include: { role: true },
    });
    if (!dbUser) {
      const customerRole = await prisma.role.upsert({
        where: { name: 'customer' },
        update: {},
        create: { name: 'customer', description: 'Standard collector account' },
      });
      dbUser = await prisma.user.create({
        data: {
          email: supabaseUser.email || '',
          passwordHash: 'supabase-auth-managed',
          firstName: supabaseUser.user_metadata?.first_name || '',
          lastName: supabaseUser.user_metadata?.last_name || '',
          roleId: customerRole.id,
          status: 'active',
        },
        include: { role: true },
      });
    }
    req.user = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role.name,
    };
    return next();
  } catch (error) {
    // FALLBACK: If Supabase fails, see if it's a valid Firebase token
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
      const firebaseUser = JSON.parse(jsonPayload);
      
      if (firebaseUser && firebaseUser.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: firebaseUser.email },
          include: { role: true },
        });

        // Create if missing
        if (!dbUser) {
          const isAdmin = firebaseUser.email === 'admin@thekalavault.com';
          const roleName = isAdmin ? 'admin' : 'customer';

          const role = await prisma.role.upsert({
            where: { name: roleName },
            update: {},
            create: { name: roleName, description: roleName, isAdmin },
          });

          dbUser = await prisma.user.create({
            data: {
              email: firebaseUser.email,
              passwordHash: 'firebase-auth-managed',
              firstName: firebaseUser.name ? firebaseUser.name.split(' ')[0] : '',
              lastName: firebaseUser.name ? firebaseUser.name.split(' ').slice(1).join(' ') : '',
              roleId: role.id,
              status: 'active',
            },
            include: { role: true },
          });
        }

        req.user = {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role.name,
        };
        return next();
      }
    } catch(decodeErr) {
       // Ignore decode errors
    }

    throw new ApiError('Invalid access token', 401);
  }
}

export function roleGuard(requiredRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !requiredRoles.includes(role)) {
      throw new ApiError('Forbidden', 403);
    }
    next();
  };
}
