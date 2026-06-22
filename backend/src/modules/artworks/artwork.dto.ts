import { z } from 'zod';

export const createArtworkSchema = z.object({
  sku: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  artist: z.string().optional(),
  style: z.string().optional(),
  medium: z.string().optional(),
  yearCreated: z.number().optional(),
  dimensions: z.string().optional(),
  category: z.string().min(1),
  warehouseId: z.string().uuid().optional(),
  rentalPriceCents: z.number().int().positive(),
  replacementValue: z.number().int().positive(),
  ownerEmail: z.string().email().optional().or(z.literal('')),
  metadata: z.record(z.any()).optional(),
});

export const updateArtworkSchema = createArtworkSchema.partial();

export const createArtworkImageSchema = z.object({
  variant: z.enum(['hero', 'gallery', 'thumbnail', 'watermark']).default('gallery'),
  mimeType: z.string().min(1),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  order: z.number().int().nonnegative().default(0),
});

export type CreateArtworkDto = z.infer<typeof createArtworkSchema>;
export type UpdateArtworkDto = z.infer<typeof updateArtworkSchema>;
export type CreateArtworkImageDto = z.infer<typeof createArtworkImageSchema>;
