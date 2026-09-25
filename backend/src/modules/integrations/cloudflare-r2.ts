import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { config } from '../../config';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${config.cloudflareR2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.cloudflareR2AccessKey,
    secretAccessKey: config.cloudflareR2SecretKey,
  },
});

export class CloudflareR2Service {
  async createUploadUrl(key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: config.cloudflareR2Bucket,
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(r2Client, command, { expiresIn: 900 });
  }

  getPublicAssetUrl(key: string): string {
    if (!key) return '';
    if (key.startsWith('http://') || key.startsWith('https://')) return key;
    if (config.cloudflareR2PublicUrl) {
      const baseUrl = config.cloudflareR2PublicUrl.replace(/\/$/, '');
      const cleanKey = key.replace(/^\//, '');
      return `${baseUrl}/${cleanKey}`;
    }
    return '';
  }

  private signedUrlCache = new Map<string, { url: string; exp: number }>();

  async getSignedAssetUrl(key: string) {
    const publicUrl = this.getPublicAssetUrl(key);
    if (publicUrl) return publicUrl;

    const now = Date.now();
    const cached = this.signedUrlCache.get(key);
    if (cached && cached.exp > now) {
      return cached.url;
    }

    const command = new GetObjectCommand({
      Bucket: config.cloudflareR2Bucket,
      Key: key,
    });
    // 7 days expiration for asset viewing
    const url = await getSignedUrl(r2Client, command, { expiresIn: 604800 });
    // Cache for 6 days (leaving 1 day margin)
    this.signedUrlCache.set(key, { url, exp: now + 6 * 24 * 3600 * 1000 });
    return url;
  }
}
