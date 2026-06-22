import bcrypt from 'bcrypt';
// JWT imports removed – using Supabase auth
import { SupabaseAuthService } from '../../auth/supabase.service';
// Config import removed – not needed with Supabase
import { AuthRepository } from './auth.repository';
import { prisma } from '../../shared/db/prisma';
import { ApiError } from '../../shared/errors/api-error';

const authRepository = new AuthRepository();
// JWT secrets removed – Supabase handles token signing

export class AuthService {
  async login(email: string, password: string) {
    // Authenticate via Supabase
    // Supabase sign‑in returns a session or throws an error
    const { session, user } = await SupabaseAuthService.signIn(email, password);
    if (!session) {
      throw new ApiError('Invalid credentials', 401);
    }
    // Ensure local user exists (optional sync)
    let localUser = await authRepository.findUserByEmail(email);
    if (!localUser) {
      // Create local user record if missing
      const defaultRole = await prisma.role.findFirst({ where: { name: 'customer' } });
      const roleId = defaultRole?.id ?? '';
      localUser = await authRepository.createUser({
        email,
        passwordHash: await bcrypt.hash(password, 10),
        roleId: roleId
      });
    }
    return { accessToken: session.access_token, refreshToken: session.refresh_token, user: localUser };
  }

  // Refresh token flow using Supabase
  async refresh(refreshToken: string) {
    // Use Supabase to refresh the session
    const session = await SupabaseAuthService.refreshSession(refreshToken);
    if (!session) {
      throw new ApiError('Invalid refresh token', 401);
    }
    return { accessToken: session.access_token, refreshToken: session.refresh_token };
  }


  // Refresh token flow removed – Supabase tokens are self‑contained.
  // If needed, client can request a new session via Supabase SDK on the frontend.

}
