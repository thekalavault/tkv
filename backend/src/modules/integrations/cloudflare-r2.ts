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

  async getSignedAssetUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: config.cloudflareR2Bucket,
      Key: key,
    });
    return getSignedUrl(r2Client, command, { expiresIn: 900 });
  }
}
