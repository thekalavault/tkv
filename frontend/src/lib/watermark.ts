/**
 * Utility to add watermarks to images using Canvas API
 */

export interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  opacity?: number;
  position?: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  color?: string;
}

const DEFAULT_OPTIONS: WatermarkOptions = {
  text: '© KALAVAULT',
  fontSize: 24,
  fontFamily: 'Arial, sans-serif',
  opacity: 0.5,
  position: 'bottom-right',
  color: '#FFFFFF',
};

// Global in-memory and persistent localStorage cache for processed watermarked images
const watermarkCache = new Map<string, string>();

export async function addWatermarkToImage(
  imageSrc: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = `wm_${imageSrc}_${opts.position}`;
  
  // 1. Check in-memory RAM cache
  if (watermarkCache.has(cacheKey)) {
    return watermarkCache.get(cacheKey)!;
  }

  // 2. Check persistent localStorage cache
  try {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      watermarkCache.set(cacheKey, cachedData);
      return cachedData;
    }
  } catch (e) {
    // Ignore localStorage quota errors
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Set up watermark styling
        ctx.globalAlpha = opts.opacity ?? 0.5;
        ctx.fillStyle = opts.color || '#FFFFFF';
        ctx.font = `bold ${opts.fontSize || 24}px ${opts.fontFamily || 'Arial'}`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';

        // Calculate position
        const padding = 20;
        let x = canvas.width - padding;
        let y = canvas.height - padding;

        if (opts.position === 'bottom-left') {
          ctx.textAlign = 'left';
          x = padding;
        } else if (opts.position === 'top-right') {
          ctx.textBaseline = 'top';
          y = padding;
        } else if (opts.position === 'top-left') {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          x = padding;
          y = padding;
        } else if (opts.position === 'center') {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          x = canvas.width / 2;
          y = canvas.height / 2;
        }

        // Draw watermark text
        ctx.fillText(opts.text || '© KALAVAULT', x, y);

        // Convert canvas to data URL
        const watermarkedUrl = canvas.toDataURL('image/jpeg', 0.85);
        watermarkCache.set(cacheKey, watermarkedUrl);
        try {
          localStorage.setItem(cacheKey, watermarkedUrl);
        } catch (e) {
          // Ignore quota exceeded
        }
        resolve(watermarkedUrl);
      } catch (error) {
        resolve(imageSrc);
      }
    };

    img.onerror = () => {
      resolve(imageSrc);
    };

    img.src = imageSrc;
  });
}

/**
 * Process multiple images with watermark
 */
export async function addWatermarkBatch(
  imageSrcs: string[],
  options?: WatermarkOptions
): Promise<string[]> {
  return Promise.all(
    imageSrcs.map(src => addWatermarkToImage(src, options))
  );
}
