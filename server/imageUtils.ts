import crypto from 'crypto';
import sharp, { type Metadata } from 'sharp';
import type { ManagedImage, ImageSection } from '../src/types';

export interface StoredImage {
  id: string;
  group: string; // section name
  filename: string;
  url: string;
  thumbUrl?: string;
  alt: string;
  width?: number;
  height?: number;
  format: 'webp' | 'jpeg' | 'png';
  isCover: boolean;
  order: number; // 0, 1, 2, 3...
  focalPoint?: { x: number; y: number };
  projectId?: string; // targetId for projects/categories
  venueId?: string; // targetId if venue
  createdAt: string;
  updatedAt: string;

  // Frontend compatibility fields
  section: ImageSection;
  targetId: string;
  targetName: string;
  altText: string;
  sizeKb?: number;
}

export interface ProcessedImage {
  filename: string;
  imageBuffer: Buffer;
  thumbBuffer: Buffer;
  width: number;
  height: number;
  format: 'webp';
  sizeKb: number;
}

/**
 * Concurrency Mutex: guarantees strictly sequential execution of write operations
 */
export class AsyncMutex {
  private queue: Promise<any> = Promise.resolve();

  public run<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.queue.then(() => fn());
    this.queue = result.catch(() => {});
    return result;
  }
}

/**
 * Convert Initial Seed Image to StoredImage format
 */
export function adaptInitialSeed(img: ManagedImage, index: number): StoredImage {
  const isVenue = img.section === 'venue_project';
  const now = new Date().toISOString();
  return {
    id: img.id,
    group: img.section,
    filename: img.filename,
    url: img.url,
    thumbUrl: img.thumbUrl || img.url,
    alt: img.altText,
    width: img.width,
    height: img.height,
    format: img.format || 'webp',
    isCover: img.isCover,
    order: index,
    focalPoint: img.focalPoint,
    projectId: isVenue ? undefined : img.targetId,
    venueId: isVenue ? img.targetId : undefined,
    createdAt: img.uploadedAt || now,
    updatedAt: now,
    section: img.section,
    targetId: img.targetId,
    targetName: img.targetName,
    altText: img.altText,
    sizeKb: img.sizeKb || 120,
  };
}

/**
 * Order normalization: guarantees orders 0, 1, 2, 3... without gaps
 */
export function normalizeGroupOrders(images: StoredImage[], group: string, targetId: string) {
  const matching = images
    .filter((img) => img.group === group && img.targetId === targetId)
    .sort((a, b) => a.order - b.order);

  matching.forEach((img, idx) => {
    img.order = idx;
  });
}

/**
 * Safe SEO filename generator
 */
export function generateSeoFilename(hint: string, targetId: string): string {
  let base = (hint || targetId || 'dreamart')
    .toLowerCase()
    .replace(/^img[-_0-9]+/i, '')
    .replace(/^dsc[-_0-9]+/i, '')
    .replace(/\.[^/.]+$/, '');

  // Azerbaijani character transliteration
  const azMap: Record<string, string> = {
    ə: 'e', ı: 'i', ö: 'o', ü: 'u', ç: 'c', ş: 's', ğ: 'g',
  };
  base = base.replace(/[əıöüçşğ]/g, (c) => azMap[c] || c);
  base = base.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  if (!base || base.length < 3) {
    base = `dreamart-${targetId || 'foto'}`.replace(/[^a-z0-9]+/g, '-');
  }

  // 6-character hex suffix to prevent collisions
  const suffix = crypto.randomBytes(3).toString('hex');
  return `${base}-${suffix}.webp`;
}

const MAX_RAW_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB limit

/**
 * Server-Side Image Processing with Sharp
 * WebP conversion, hero max 1920px, standard max 1600px, thumb ~480px
 */
export async function processImageWithSharp(
  rawBuffer: Buffer,
  hintName: string,
  targetId: string,
  isHero: boolean
): Promise<ProcessedImage> {
  if (rawBuffer.length > MAX_RAW_UPLOAD_BYTES) {
    const err: any = new Error('Şəkil ölçüsü 10MB-dan çox ola bilməz (HTTP 413).');
    err.status = 413;
    throw err;
  }

  let metadata: Metadata;
  try {
    metadata = await sharp(rawBuffer).metadata();
  } catch {
    const err: any = new Error('Yüklənən fayl düzgün şəkil formatında deyil və ya zədələnib.');
    err.status = 400;
    throw err;
  }

  const allowed = ['jpeg', 'jpg', 'png', 'webp', 'heif', 'heic'];
  const detectedFormat = metadata.format?.toLowerCase();
  if (!detectedFormat || !allowed.includes(detectedFormat)) {
    const err: any = new Error(
      `Dəstəklənməyən şəkil formatı: ${detectedFormat || 'naməlum'}. Yalnız JPG, PNG və WebP qəbul olunur.`
    );
    err.status = 400;
    throw err;
  }

  if (!metadata.width || !metadata.height || metadata.width < 20 || metadata.height < 20) {
    const err: any = new Error('Şəkil ölçüləri (eni/hündürlüyü) qeyri-kafidir.');
    err.status = 400;
    throw err;
  }

  const filename = generateSeoFilename(hintName, targetId);

  // Hero: max long edge 1920; Standard/card: max long edge 1600
  const maxEdge = isHero ? 1920 : 1600;
  const mainPipeline = sharp(rawBuffer)
    .rotate()
    .resize({
      width: maxEdge,
      height: maxEdge,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 4 });

  const { data: imageBuffer, info: mainInfo } = await mainPipeline.toBuffer({ resolveWithObject: true });

  // Generate thumbnail: ~480px max edge
  const thumbPipeline = sharp(rawBuffer)
    .rotate()
    .resize({
      width: 480,
      height: 480,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 3 });

  const thumbBuffer = await thumbPipeline.toBuffer();

  return {
    filename,
    imageBuffer,
    thumbBuffer,
    width: mainInfo.width,
    height: mainInfo.height,
    format: 'webp',
    sizeKb: Math.round(imageBuffer.length / 1024),
  };
}
