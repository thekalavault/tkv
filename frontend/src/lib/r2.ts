/**
 * Returns the full URL for an image hosted on your public Cloudflare R2 bucket.
 * Make sure to set VITE_R2_PUBLIC_URL in your environment variables.
 * 
 * @param filename The name of the file in your R2 bucket (e.g., 'artwork-1.jpg')
 * @param fallbackUrl An optional fallback URL to return if the environment variable is not set
 */
export function getR2ImageUrl(filename: string, fallbackUrl?: string): string {
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  
  if (filename.startsWith('/uploads/')) {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
    return `${apiBaseUrl}${filename}`;
  }

  return fallbackUrl || filename;
}
