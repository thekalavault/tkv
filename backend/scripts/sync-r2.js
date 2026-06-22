const { PrismaClient } = require('@prisma/client');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const prisma = new PrismaClient();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
  }
});

function parseFilename(filename) {
  // Format: (15k)ImperialNoir.jpeg
  const match = filename.match(/\((\d+)k\)(.+)\.(.+)$/);
  if (!match) return null;
  
  const valueK = parseInt(match[1], 10);
  let titleStr = match[2];
  
  // Convert camelCase or PascalCase to words: "ImperialNoir" -> "Imperial Noir"
  titleStr = titleStr.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');
  
  return {
    value: valueK * 1000,
    title: titleStr.trim()
  };
}

async function syncR2ToDb() {
  console.log('Fetching objects from R2 bucket...');
  const command = new ListObjectsV2Command({ Bucket: process.env.CLOUDFLARE_R2_BUCKET });
  const response = await r2Client.send(command);
  const objects = response.Contents || [];
  
  console.log(`Found ${objects.length} objects in R2. Cleaning old artworks from DB...`);
  await prisma.artworkImage.deleteMany({});
  await prisma.artwork.deleteMany({});
  
  let count = 0;
  for (const obj of objects) {
    const fileKey = obj.Key;
    if (!fileKey.startsWith('artworks/')) continue;
    
    const filename = fileKey.replace('artworks/', '');
    const parsed = parseFilename(filename);
    if (!parsed) continue;
    
    // Create artwork in DB
    const created = await prisma.artwork.create({
      data: {
        sku: 'ART-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        title: parsed.title,
        artist: 'Unknown Artist',
        description: 'A beautiful ' + parsed.title,
        medium: 'Mixed Media',
        category: 'painting',
        rentalPriceCents: Math.floor(parsed.value * 0.05), // e.g. 5% of replacement value per month
        replacementValue: parsed.value,
        status: 'available',
        images: {
          create: [
            {
              fileKey: fileKey,
              variant: 'original',
              mimeType: fileKey.endsWith('png') ? 'image/png' : 'image/jpeg',
              isSecure: true
            }
          ]
        }
      }
    });
    console.log(`Imported: ${parsed.title} (Value: ${parsed.value})`);
    count++;
  }
  
  console.log(`Successfully synced ${count} artworks from R2 to the database!`);
}

syncR2ToDb()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
