import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional().default('redis://localhost:6379'),

  SUPABASE_URL: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  CLOUDFLARE_R2_ACCOUNT_ID: z.string().optional().default('placeholder'),
  CLOUDFLARE_R2_BUCKET: z.string().optional().default('placeholder'),
  CLOUDFLARE_R2_ACCESS_KEY: z.string().optional().default('placeholder'),
  CLOUDFLARE_R2_SECRET_KEY: z.string().optional().default('placeholder'),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().optional(),
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.string().optional(),
  FRONTEND_URL: z.string().url().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  ZOHO_SIGN_CLIENT_ID: z.string().optional(),
  ZOHO_SIGN_CLIENT_SECRET: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),
  // SMTP Configuration
  SMTP_HOST: z.string().optional().default('placeholder'),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional().default('Kala Vault <no-reply@thekalavault.com>'),
  ADMIN_EMAIL: z.string().optional().default('admin@thekalavault.com'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:');
  parsed.error.errors.forEach((err) => {
    console.error(`  - ${err.path.join('.')}: ${err.message}`);
  });
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}



export const config = {
  databaseUrl: parsed.data.DATABASE_URL,
  redisUrl: parsed.data.REDIS_URL,

  cloudflareR2AccountId: parsed.data.CLOUDFLARE_R2_ACCOUNT_ID,
  cloudflareR2Bucket: parsed.data.CLOUDFLARE_R2_BUCKET,
  cloudflareR2AccessKey: parsed.data.CLOUDFLARE_R2_ACCESS_KEY,
  cloudflareR2SecretKey: parsed.data.CLOUDFLARE_R2_SECRET_KEY,
  cloudflareR2PublicUrl: parsed.data.CLOUDFLARE_R2_PUBLIC_URL,
  nodeEnv: parsed.data.NODE_ENV,
  port: parsed.data.PORT ? Number(parsed.data.PORT) : 4000,
  frontendUrl: parsed.data.FRONTEND_URL,
  razorpayKeyId: parsed.data.RAZORPAY_KEY_ID,
  razorpayKeySecret: parsed.data.RAZORPAY_KEY_SECRET,
  zohoSignClientId: parsed.data.ZOHO_SIGN_CLIENT_ID,
  zohoSignClientSecret: parsed.data.ZOHO_SIGN_CLIENT_SECRET,
  logLevel: parsed.data.LOG_LEVEL,
  supabaseUrl: parsed.data.SUPABASE_URL,
  supabaseAnonKey: parsed.data.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: parsed.data.SUPABASE_SERVICE_ROLE_KEY,
  // SMTP exports
  smtpHost: parsed.data.SMTP_HOST,
  smtpPort: Number(parsed.data.SMTP_PORT),
  smtpUser: parsed.data.SMTP_USER,
  smtpPass: parsed.data.SMTP_PASS,
  smtpFrom: parsed.data.SMTP_FROM,
  adminEmail: parsed.data.ADMIN_EMAIL,
};
