const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
  }
});

client.send(new ListObjectsV2Command({ Bucket: process.env.CLOUDFLARE_R2_BUCKET }))
  .then(res => console.log(JSON.stringify(res.Contents || [], null, 2)))
  .catch(console.error);
