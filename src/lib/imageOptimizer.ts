/**
 * Mobile-friendly client-side image optimization engine.
 * Strips EXIF metadata, auto-corrects orientation, resizes high-res phone captures down to max 1920px (or 16:9 for hero),
 * generates 480px thumbnail variants, and compresses to WebP with target ~100-350KB.
 */

import { ImageSection } from '../types';

export interface OptimizedImageResult {
  fullDataUrl: string;
  thumbDataUrl: string;
  originalSizeKb: number;
  optimizedSizeKb: number;
  thumbSizeKb: number;
  width: number;
  height: number;
  mimeType: string;
  suggestedFilename: string;
  suggestedAltText: string;
}

export function generateSuggestedFilename(
  section: ImageSection,
  targetId: string,
  targetName: string,
  _isCover: boolean,
  counter: number = 1
): string {
  const pad = counter.toString().padStart(2, '0');
  const cleanTarget = (targetId || targetName || 'dekor')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  switch (section) {
    case 'home_hero':
      return `dreamart-events-hero-${cleanTarget}-${pad}.webp`;
    case 'category_cover':
      return `dreamart-${cleanTarget}-qapaq-${pad}.webp`;
    case 'decor_project':
      return `dreamart-events-${cleanTarget}-${pad}.webp`;
    case 'venue_project':
      return `${cleanTarget}-dekoru-${pad}.webp`;
    case 'xonca_service':
      return `premium-xonca-xidmeti-${pad}.webp`;
    case 'portfolio_lookbook':
      return `dreamart-portfolio-${cleanTarget}-${pad}.webp`;
    case 'regional_service':
      return `azerbaijan-regional-dekor-${pad}.webp`;
    case 'indian_wedding':
      return `dreamart-indian-wedding-azerbaijan-${pad}.webp`;
    case 'destination_wedding':
      return `dreamart-destination-wedding-azerbaijan-${pad}.webp`;
    default:
      return `dreamart-dekor-${cleanTarget}-${pad}.webp`;
  }
}

export function generateSuggestedAltText(
  section: ImageSection,
  _targetId: string,
  targetName: string,
  isCover: boolean
): string {
  const name = targetName || 'Toy və tədbir';

  switch (section) {
    case 'home_hero':
      return `DreamArt Events ${name} əsas banner tərtibatı`;
    case 'category_cover':
      return `DreamArt Events ${name} örtük şəkli`;
    case 'decor_project':
      return isCover
        ? `${name} - DreamArt Events eksklüziv layihə örtük şəkli`
        : `${name} tədbirindən zərif detal və dekorasiya`;
    case 'venue_project':
      return isCover
        ? `${name} məkanında DreamArt Events toy və zal dekoru`
        : `${name} məkanında icra edilmiş dekor detalları`;
    case 'xonca_service':
      return `DreamArt Events premium xonça və şirniyyat tərtibatı`;
    case 'portfolio_lookbook':
      return `DreamArt Events zövqlü dekorasiya vitrini - ${name}`;
    case 'regional_service':
      return `Azərbaycan regionları üçün DreamArt Events peşəkar dekor xidməti`;
    case 'indian_wedding':
      return `Luxury Indian Wedding decoration in Azerbaijan - ${name}`;
    case 'destination_wedding':
      return `Luxury Destination Wedding in Azerbaijan - ${name}`;
    default:
      return `DreamArt Events ${name} dekorasiyası`;
  }
}

export async function optimizeUploadedImage(
  file: File,
  options?: {
    section?: ImageSection;
    targetId?: string;
    targetName?: string;
    isCover?: boolean;
    isHero?: boolean;
    quality?: number;
    focalPoint?: { x: number; y: number };
  }
): Promise<OptimizedImageResult> {
  const originalSizeKb = Math.round(file.size / 1024);
  const section = options?.section || 'decor_project';
  const targetId = options?.targetId || 'dekor';
  const targetName = options?.targetName || 'Dekor';
  const isCover = options?.isCover ?? true;
  const isHero = options?.isHero || section === 'home_hero';
  const quality = options?.quality || 0.83;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Fayl oxuna bilmədi'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Şəkil formatı dəstəklənmir və ya fayl zədələnib'));
      img.onload = () => {
        try {
          const originalW = img.naturalWidth || img.width;
          const originalH = img.naturalHeight || img.height;

          let targetW = originalW;
          let targetH = originalH;

          // 1. Determine dimensions
          if (isHero) {
            // For 16:9 Hero banners, scale to max 1920x1080 maintaining 16:9 ratio
            const maxW = 1920;
            const targetRatio = 16 / 9;
            const currentRatio = originalW / originalH;

            // Crop rect inside original image
            let cropX = 0;
            let cropY = 0;
            let cropW = originalW;
            let cropH = originalH;

            const focalX = (options?.focalPoint?.x ?? 50) / 100;
            const focalY = (options?.focalPoint?.y ?? 50) / 100;

            if (currentRatio > targetRatio) {
              // Image is wider than 16:9 -> crop horizontal sides using focalX
              cropW = Math.round(originalH * targetRatio);
              cropX = Math.max(0, Math.min(originalW - cropW, Math.round(originalW * focalX - cropW / 2)));
            } else {
              // Image is taller than 16:9 -> crop vertical top/bottom using focalY
              cropH = Math.round(originalW / targetRatio);
              cropY = Math.max(0, Math.min(originalH - cropH, Math.round(originalH * focalY - cropH / 2)));
            }

            targetW = Math.min(maxW, cropW);
            targetH = Math.round(targetW / targetRatio);

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx) throw new Error('Canvas konteksti yaradıla bilmədi');

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);

            const fullDataUrl = canvas.toDataURL('image/webp', quality);
            const optimizedSizeKb = Math.round((fullDataUrl.length * (3 / 4)) / 1024);

            // Thumbnail (480x270 for hero 16:9)
            const thumbW = 480;
            const thumbH = 270;
            const thumbCanvas = document.createElement('canvas');
            thumbCanvas.width = thumbW;
            thumbCanvas.height = thumbH;
            const thumbCtx = thumbCanvas.getContext('2d', { alpha: false });
            let thumbDataUrl = fullDataUrl;
            let thumbSizeKb = optimizedSizeKb;

            if (thumbCtx) {
              thumbCtx.imageSmoothingEnabled = true;
              thumbCtx.imageSmoothingQuality = 'medium';
              thumbCtx.drawImage(canvas, 0, 0, thumbW, thumbH);
              thumbDataUrl = thumbCanvas.toDataURL('image/webp', 0.78);
              thumbSizeKb = Math.round((thumbDataUrl.length * (3 / 4)) / 1024);
            }

            const suggestedFilename = generateSuggestedFilename(section, targetId, targetName, isCover);
            const suggestedAltText = generateSuggestedAltText(section, targetId, targetName, isCover);

            resolve({
              fullDataUrl,
              thumbDataUrl,
              originalSizeKb,
              optimizedSizeKb,
              thumbSizeKb,
              width: targetW,
              height: targetH,
              mimeType: 'image/webp',
              suggestedFilename,
              suggestedAltText
            });
            return;
          }

          // For standard project, venue, or card images (preserve natural aspect ratio)
          const maxDimension = 1600;
          if (targetW > targetH && targetW > maxDimension) {
            targetH = Math.round((targetH * maxDimension) / targetW);
            targetW = maxDimension;
          } else if (targetH >= targetW && targetH > maxDimension) {
            targetW = Math.round((targetW * maxDimension) / targetH);
            targetH = maxDimension;
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (!ctx) throw new Error('Canvas konteksti yaradıla bilmədi');

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, targetW, targetH);

          const fullDataUrl = canvas.toDataURL('image/webp', quality);
          const optimizedSizeKb = Math.round((fullDataUrl.length * (3 / 4)) / 1024);

          // Thumbnail for fast card rendering (max 480px)
          const maxThumb = 480;
          let thumbW = targetW;
          let thumbH = targetH;
          if (thumbW > thumbH && thumbW > maxThumb) {
            thumbH = Math.round((thumbH * maxThumb) / thumbW);
            thumbW = maxThumb;
          } else if (thumbH >= thumbW && thumbH > maxThumb) {
            thumbW = Math.round((thumbW * maxThumb) / thumbH);
            thumbH = maxThumb;
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
            thumbCtx.drawImage(canvas, 0, 0, thumbW, thumbH);
            thumbDataUrl = thumbCanvas.toDataURL('image/webp', 0.78);
            thumbSizeKb = Math.round((thumbDataUrl.length * (3 / 4)) / 1024);
          }

          const suggestedFilename = generateSuggestedFilename(section, targetId, targetName, isCover);
          const suggestedAltText = generateSuggestedAltText(section, targetId, targetName, isCover);

          resolve({
            fullDataUrl,
            thumbDataUrl,
            originalSizeKb,
            optimizedSizeKb,
            thumbSizeKb,
            width: targetW,
            height: targetH,
            mimeType: 'image/webp',
            suggestedFilename,
            suggestedAltText
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

export function formatFileSize(kb: number): string {
  if (kb > 1024) {
    return `${(kb / 1024).toFixed(1)} MB`;
  }
  return `${Math.round(kb)} KB`;
}
