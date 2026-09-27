/**
 * Responsive Image Helper for DreamArt Weddings.
 * Serves optimized responsive WebP variants via the server-side /api/img engine.
 * Significantly cuts mobile network payload and speeds up LCP and FCP.
 */

export function getOptimizedImageUrl(
  url: string | undefined | null,
  width?: number,
  quality: number = 80
): string {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return url;

  // Clean existing query cache buster before passing to optimizer
  const cleanUrl = url.split('#')[0];

  if (!width) {
    return cleanUrl;
  }

  return `/api/img?url=${encodeURIComponent(cleanUrl)}&w=${width}&q=${quality}`;
}

export function getSrcSet(
  url: string | undefined | null,
  widths: number[] = [480, 768, 1200, 1600],
  quality: number = 80
): string {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) return '';

  const cleanUrl = url.split('#')[0];

  return widths
    .map((w) => `${getOptimizedImageUrl(cleanUrl, w, quality)} ${w}w`)
    .join(', ');
}
