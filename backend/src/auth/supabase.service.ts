import { createClient, SupabaseClient, AuthUser } from '@supabase/supabase-js';
import { config } from '../config';
import { ApiError } from '../shared/errors/api-error';

// Initialize Supabase client with Service Role key for server‑side operations
export const supabase: SupabaseClient = createClient(
  config.supabaseUrl,
  config.supabaseServiceRoleKey
);

export class SupabaseAuthService {
  /** Verify a JWT/access token issued by Supabase */
  static async verifyToken(token: string): Promise<AuthUser> {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      throw new ApiError('Invalid Supabase token', 401);
    }
    return data.user;
  }

  /** Email + password sign‑in */
  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      throw new ApiError('Invalid credentials', 401);
    }
    return data;
  }

  /** Email + password sign‑up */
  static async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new ApiError('Sign‑up failed', 400);
    }
    return data;
  }

  /** Send magic‑link (OTP) to email */
  static async sendMagicLink(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      throw new ApiError('Failed to send OTP', 400);
    }
    return data;
  }

  /** Social login – currently Google */
  static async signInWithProvider(provider: 'google') {
    // For server‑side we just generate the URL that the frontend should redirect to
    const { data, error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
      throw new ApiError('OAuth initiation failed', 400);
    }
    return data;
  }

  /** Refresh a Supabase session using a refresh token */
  static async refreshSession(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });
    if (error || !data?.session) {
      throw new ApiError('Invalid refresh token', 401);
    }
    return data.session;
  }
}

