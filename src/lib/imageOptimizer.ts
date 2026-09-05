/**
 * Mobile-friendly client-side image optimization engine.
 * Strips EXIF metadata, resizes high-res phone captures down to max 1920px,
 * generates 600px thumbnail variants, and compresses to WebP with target ~100-350KB.
 */

export interface OptimizedImageResult {
  fullDataUrl: string;
  thumbDataUrl: string;
  originalSizeKb: number;
  optimizedSizeKb: number;
  thumbSizeKb: number;
  width: number;
  height: number;
  mimeType: string;
  seoFilename: string;
}

export async function optimizeUploadedImage(
  file: File,
  desiredFilename?: string,
  maxDimension: number = 1920,
  quality: number = 0.82
): Promise<OptimizedImageResult> {
  const originalSizeKb = Math.round(file.size / 1024);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Fayl oxuna bilmədi'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Şəkil yüklənə bilmədi'));
      img.onload = () => {
        try {
          // Calculate scale for full image
          let { width, height } = img;
          const maxLongEdge = maxDimension;

          if (width > height && width > maxLongEdge) {
            height = Math.round((height * maxLongEdge) / width);
            width = maxLongEdge;
          } else if (height >= width && height > maxLongEdge) {
            width = Math.round((width * maxLongEdge) / height);
            height = maxLongEdge;
          }

          // Canvas 1: Full optimized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) throw new Error('Canvas konteksti yaradıla bilmədi');

          // High quality image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Support WebP, fallback to JPEG
          let mime = 'image/webp';
          let fullDataUrl = canvas.toDataURL('image/webp', quality);
          if (!fullDataUrl.startsWith('data:image/webp')) {
            mime = 'image/jpeg';
            fullDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Approx size in KB
          const optimizedSizeKb = Math.round((fullDataUrl.length * (3 / 4)) / 1024);

          // Canvas 2: Thumbnail variant for fast cards loading (max 600px)
          const thumbMax = 600;
          let thumbW = width;
          let thumbH = height;
          if (thumbW > thumbH && thumbW > thumbMax) {
            thumbH = Math.round((thumbH * thumbMax) / thumbW);
            thumbW = thumbMax;
          } else if (thumbH >= thumbW && thumbH > thumbMax) {
            thumbW = Math.round((thumbW * thumbMax) / thumbH);
            thumbH = thumbMax;
          }

          const thumbCanvas = document.createElement('canvas');
          thumbCanvas.width = thumbW;
          thumbCanvas.height = thumbH;
          const thumbCtx = thumbCanvas.getContext('2d', { alpha: false });
          let thumbDataUrl = fullDataUrl;
          let thumbSizeKb = optimizedSizeKb;

          if (thumbCtx) {
            thumbCtx.imageSmoothingEnabled = true;
            thumbCtx.imageSmoothingQuality = 'medium';
            thumbCtx.drawImage(img, 0, 0, thumbW, thumbH);
            thumbDataUrl = thumbCanvas.toDataURL(mime, 0.78);
            thumbSizeKb = Math.round((thumbDataUrl.length * (3 / 4)) / 1024);
          }

          const seoFilename = desiredFilename
            ? (desiredFilename.endsWith('.webp') ? desiredFilename : `${desiredFilename}.webp`)
            : `dekor-${Date.now()}.webp`;

          resolve({
            fullDataUrl,
            thumbDataUrl,
            originalSizeKb,
            optimizedSizeKb,
            thumbSizeKb,
            width,
            height,
            mimeType: mime,
            seoFilename
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export interface ProcessedImage {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  filename: string;
}

export function formatFileSize(bytesOrKb: number): string {
  if (bytesOrKb > 1024 * 10) {
    // If passed bytes
    return `${(bytesOrKb / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (bytesOrKb > 1024) {
    return `${(bytesOrKb / 1024).toFixed(1)} MB`;
  }
  return `${Math.round(bytesOrKb)} KB`;
}

export async function processUploadedImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    targetFilename?: string;
  }
): Promise<ProcessedImage> {
  const result = await optimizeUploadedImage(
    file,
    options?.targetFilename,
    options?.maxWidth || 1600,
    options?.quality || 0.84
  );

  const origBytes = file.size;
  const compBytes = result.optimizedSizeKb * 1024;
  const savedPercentage = Math.max(0, Math.round(((origBytes - compBytes) / origBytes) * 100));

  return {
    dataUrl: result.fullDataUrl,
    originalSize: origBytes,
    compressedSize: compBytes,
    savedPercentage,
    filename: result.seoFilename
  };
}
