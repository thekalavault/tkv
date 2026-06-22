import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import Redis from 'ioredis';
// @ts-ignore
import nodemailer from 'nodemailer';
import { prisma } from '../db/prisma';
import { config } from '../../config';
import { razorpayClient } from '../../modules/integrations/razorpay';

export async function verifyConnections() {
  console.log('\n==================================================');
  console.log('       🔍 VERIFYING 3RD PARTY CONNECTIONS       ');
  console.log('==================================================\n');

  // 1. PostgreSQL Database (Prisma)
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database (PostgreSQL/Prisma) -> Connected successfully');
  } catch (err: any) {
    console.error('❌ Database (PostgreSQL/Prisma) -> FAILED connection check:', err.message);
  }

  // 2. Redis
  if (config.redisUrl && config.redisUrl !== 'placeholder') {
    let redis: Redis | undefined;
    try {
      redis = new Redis(config.redisUrl, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
        connectTimeout: 2000,
      });
      // Swallow errors to avoid unhandled exception logs polluting the terminal
      redis.on('error', () => {});
      await redis.ping();
      console.log('✅ Redis Cache & Queue        -> Connected successfully');
    } catch (err: any) {
      console.error('❌ Redis Cache & Queue        -> FAILED connection check:', err.message || err);
    } finally {
      if (redis) {
        try {
          redis.disconnect();
        } catch (_) {}
      }
    }
  } else {
    console.log('⚠️ Redis Cache & Queue        -> Not configured');
  }

  // 3. Cloudflare R2
  if (config.cloudflareR2AccountId && config.cloudflareR2AccountId !== 'placeholder') {
    try {
      const r2Client = new S3Client({
        region: 'auto',
        endpoint: `https://${config.cloudflareR2AccountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: config.cloudflareR2AccessKey,
          secretAccessKey: config.cloudflareR2SecretKey,
        },
      });
      await r2Client.send(new ListObjectsV2Command({ Bucket: config.cloudflareR2Bucket, MaxKeys: 1 }));
      console.log('✅ Cloudflare R2 Storage      -> Connected successfully');
    } catch (err: any) {
      console.error('❌ Cloudflare R2 Storage      -> FAILED connection check:', err.message);
    }
  } else {
    console.log('⚠️ Cloudflare R2 Storage      -> Not configured');
  }

  // 5. Razorpay Payments
  if (
    process.env.RAZORPAY_KEY_ID &&
    process.env.RAZORPAY_KEY_ID !== 'placeholder' &&
    process.env.RAZORPAY_KEY_ID !== 'your_razorpay_key_id'
  ) {
    try {
      await razorpayClient.payments.all({ count: 1 });
      console.log('✅ Razorpay Payments          -> Connected successfully');
    } catch (err: any) {
      console.error('❌ Razorpay Payments          -> FAILED connection check:', err.message || err || 'Unknown error');
    }
  } else {
    console.log('⚠️ Razorpay Payments          -> Not configured');
  }

  // 6. Zoho Sign
  if (
    process.env.ZOHO_SIGN_CLIENT_ID &&
    process.env.ZOHO_SIGN_CLIENT_ID !== 'placeholder' &&
    process.env.ZOHO_SIGN_CLIENT_ID !== 'your_zoho_client_id'
  ) {
    console.log('✅ Zoho Sign Integration      -> Configured successfully');
  } else {
    console.log('⚠️ Zoho Sign Integration      -> Not configured');
  }

  // 7. SMTP Mailer
  if (config.smtpHost && config.smtpHost !== 'placeholder') {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      });
      await transporter.verify();
      console.log('✅ SMTP Mail Service          -> Connected successfully');
    } catch (err: any) {
      console.error('❌ SMTP Mail Service          -> FAILED connection check:', err.message);
    }
  } else {
    console.log('⚠️ SMTP Mail Service          -> Not configured (Mock/Dev Mode)');
  }

  console.log('\n==================================================\n');
}
