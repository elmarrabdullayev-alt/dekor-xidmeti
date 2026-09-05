import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import sharp, { Metadata } from 'sharp';
import { getInitialSeedImages } from './initialImages';
import { ManagedImage, ImageSection } from '../src/types';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// 1. Validate & initialize PERSISTENT_DATA_DIR
export const PERSISTENT_DATA_DIR = 
  process.env.PERSISTENT_DATA_DIR?.trim() || 
  path.join(process.cwd(), 'data-dev');

if (!process.env.PERSISTENT_DATA_DIR) {
  console.log(
    `[Storage] PERSISTENT_DATA_DIR not explicitly set. Using directory: ${PERSISTENT_DATA_DIR}.`
  );
}

// Subdirectories and file paths inside the persistent mount
export const UPLOADS_DIR = path.join(PERSISTENT_DATA_DIR, 'uploads');
export const THUMBS_DIR = path.join(UPLOADS_DIR, 'thumbs');
export const BACKUPS_DIR = path.join(PERSISTENT_DATA_DIR, 'backups');
export const IMAGES_DB_FILE = path.join(PERSISTENT_DATA_DIR, 'images.json');
export const IMAGES_TMP_FILE = path.join(PERSISTENT_DATA_DIR, 'images.json.tmp');
export const IMAGES_BACKUP_FILE = path.join(BACKUPS_DIR, 'images-last-good.json');

// Ensure persistent directories exist
function ensureDirs() {
  if (!fs.existsSync(PERSISTENT_DATA_DIR)) fs.mkdirSync(PERSISTENT_DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR, { recursive: true });
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}
ensureDirs();

// Metadata model (combines image-only admin fields + frontend compatibility)
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

// Convert Initial Seed Image to StoredImage format
function adaptInitialSeed(img: ManagedImage, index: number): StoredImage {
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

// 2. Concurrency Mutex: guarantees strictly sequential execution of all write operations
class AsyncMutex {
  private queue: Promise<any> = Promise.resolve();

  public run<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.queue.then(() => fn());
    this.queue = result.catch(() => {});
    return result;
  }
}
const dbMutex = new AsyncMutex();

// 3. Atomic JSON Writer
function atomicWriteDb(images: StoredImage[]): void {
  ensureDirs();
  const jsonContent = JSON.stringify(images, null, 2);

  // Write to temporary file with explicit fsync
  const fd = fs.openSync(IMAGES_TMP_FILE, 'w');
  fs.writeFileSync(fd, jsonContent, 'utf-8');
  fs.fsyncSync(fd);
  fs.closeSync(fd);

  // Maintain last-good backup if existing file is valid
  if (fs.existsSync(IMAGES_DB_FILE)) {
    try {
      fs.copyFileSync(IMAGES_DB_FILE, IMAGES_BACKUP_FILE);
    } catch (e) {
      console.warn('[PersistentDisk] Backup copy warning:', e);
    }
  }

  // Atomic file rename
  fs.renameSync(IMAGES_TMP_FILE, IMAGES_DB_FILE);
}

// 4. Safe Database Reader with Backup Recovery
function readDbSafe(): StoredImage[] {
  ensureDirs();

  if (!fs.existsSync(IMAGES_DB_FILE)) {
    // If main db doesn't exist, check backup
    if (fs.existsSync(IMAGES_BACKUP_FILE)) {
      try {
        const backupData = fs.readFileSync(IMAGES_BACKUP_FILE, 'utf-8');
        const parsed = JSON.parse(backupData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('[PersistentDisk] Restoring images database from images-last-good.json backup...');
          atomicWriteDb(parsed);
          return parsed;
        }
      } catch (err) {
        console.warn('[PersistentDisk] Backup corrupted, seeding fresh data:', err);
      }
    }

    // Seed database
    console.log('[PersistentDisk] Initializing persistent images.json with seed imagery...');
    const seeds = getInitialSeedImages().map((img, idx) => adaptInitialSeed(img, idx));
    atomicWriteDb(seeds);
    return seeds;
  }

  try {
    const content = fs.readFileSync(IMAGES_DB_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) throw new Error('images.json root is not an array');
    return parsed;
  } catch (err: any) {
    console.error('[PersistentDisk ERROR] images.json corrupted!', err.message);

    // Attempt backup recovery
    if (fs.existsSync(IMAGES_BACKUP_FILE)) {
      try {
        console.log('[PersistentDisk] Attempting recovery from images-last-good.json...');
        const backupData = fs.readFileSync(IMAGES_BACKUP_FILE, 'utf-8');
        const parsed = JSON.parse(backupData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('[PersistentDisk] Successfully restored from backup!');
          atomicWriteDb(parsed);
          return parsed;
        }
      } catch (backupErr: any) {
        console.error('[PersistentDisk FATAL] Backup recovery failed:', backupErr.message);
      }
    }

    // Do NOT silently wipe to seed data if corrupted in production
    throw new Error(`CRITICAL: images.json is corrupted and backup recovery failed: ${err.message}`);
  }
}

// 5. Order normalization: guarantees orders 0, 1, 2, 3... without gaps
function normalizeGroupOrders(images: StoredImage[], group: string, targetId: string) {
  const matching = images
    .filter((img) => img.group === group && img.targetId === targetId)
    .sort((a, b) => a.order - b.order);

  matching.forEach((img, idx) => {
    img.order = idx;
  });
}

// 6. Safe SEO filename generator
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

// 7. Server-Side Image Processing with Sharp
const MAX_RAW_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB limit

export interface ProcessedImage {
  filename: string;
  imageBuffer: Buffer;
  thumbBuffer: Buffer;
  width: number;
  height: number;
  format: 'webp';
  sizeKb: number;
}

export async function processImageWithSharp(
  rawBuffer: Buffer,
  hintName: string,
  targetId: string,
  isHero: boolean
): Promise<ProcessedImage> {
  // Enforce 10MB raw limit
  if (rawBuffer.length > MAX_RAW_UPLOAD_BYTES) {
    const err: any = new Error('Şəkil ölçüsü 10MB-dan çox ola bilməz (HTTP 413).');
    err.status = 413;
    throw err;
  }

  // Decode with Sharp and inspect format
  let metadata: Metadata;
  try {
    metadata = await sharp(rawBuffer).metadata();
  } catch {
    const err: any = new Error('Yüklənən fayl düzgün şəkil formatında deyil və ya zədələnib.');
    err.status = 400;
    throw err;
  }

  // Reject SVG, HTML, scripts, plain text
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

  // Resize & convert main image
  // Hero: max long edge 1920; Standard/card: max long edge 1600
  const maxEdge = isHero ? 1920 : 1600;
  const mainPipeline = sharp(rawBuffer)
    .rotate() // auto-orient from EXIF orientation
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

// 8. Public Image Service Layer

export async function getAllStoredImages(): Promise<StoredImage[]> {
  const images = readDbSafe();
  return images.sort((a, b) => a.order - b.order);
}

export async function uploadImageRecord(params: {
  rawBuffer: Buffer;
  section: ImageSection;
  targetId: string;
  targetName?: string;
  filenameHint?: string;
  altText?: string;
  isCover?: boolean;
  focalPoint?: { x: number; y: number };
}): Promise<StoredImage> {
  const isHero = params.section === 'home_hero';
  const processed = await processImageWithSharp(
    params.rawBuffer,
    params.filenameHint || `dreamart-${params.targetId}`,
    params.targetId,
    isHero
  );

  // Write processed files to disk
  const mainPath = path.join(UPLOADS_DIR, processed.filename);
  const thumbPath = path.join(THUMBS_DIR, processed.filename);
  fs.writeFileSync(mainPath, processed.imageBuffer);
  fs.writeFileSync(thumbPath, processed.thumbBuffer);

  // Mutex-protected metadata write
  return dbMutex.run(async () => {
    const images = readDbSafe();
    const shouldBeCover = Boolean(params.isCover);

    if (shouldBeCover) {
      images.forEach((img) => {
        if (img.group === params.section && img.targetId === params.targetId) {
          img.isCover = false;
        }
      });
    }

    const groupImages = images.filter(
      (img) => img.group === params.section && img.targetId === params.targetId
    );
    const nextOrder = groupImages.length; // 0-based sequential

    const isVenue = params.section === 'venue_project';
    const now = new Date().toISOString();

    const newRecord: StoredImage = {
      id: `img-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      group: params.section,
      filename: processed.filename,
      url: `/uploads/${processed.filename}`,
      thumbUrl: `/uploads/thumbs/${processed.filename}`,
      alt: params.altText?.trim() || `DreamArt Events ${params.targetName || ''}`,
      width: processed.width,
      height: processed.height,
      format: 'webp',
      isCover: shouldBeCover || groupImages.length === 0,
      order: nextOrder,
      focalPoint: params.focalPoint,
      projectId: isVenue ? undefined : params.targetId,
      venueId: isVenue ? params.targetId : undefined,
      createdAt: now,
      updatedAt: now,
      section: params.section,
      targetId: params.targetId,
      targetName: params.targetName || params.targetId,
      altText: params.altText?.trim() || `DreamArt Events ${params.targetName || ''}`,
      sizeKb: processed.sizeKb,
    };

    images.push(newRecord);
    normalizeGroupOrders(images, params.section, params.targetId);
    atomicWriteDb(images);

    return newRecord;
  });
}

export async function replaceImageRecord(
  id: string,
  rawBuffer: Buffer,
  meta: { altText?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  const existing = readDbSafe().find((img) => img.id === id);
  if (!existing) {
    const err: any = new Error('Şəkil tapılmadı');
    err.status = 404;
    throw err;
  }

  const isHero = existing.group === 'home_hero';
  const processed = await processImageWithSharp(
    rawBuffer,
    existing.filename,
    existing.targetId,
    isHero
  );

  // Write new file with unique filename
  const newMainPath = path.join(UPLOADS_DIR, processed.filename);
  const newThumbPath = path.join(THUMBS_DIR, processed.filename);
  fs.writeFileSync(newMainPath, processed.imageBuffer);
  fs.writeFileSync(newThumbPath, processed.thumbBuffer);

  // Mutex-protected metadata update
  return dbMutex.run(async () => {
    const images = readDbSafe();
    const target = images.find((img) => img.id === id);
    if (!target) {
      // Clean up orphaned new files
      try { fs.unlinkSync(newMainPath); } catch {}
      try { fs.unlinkSync(newThumbPath); } catch {}
      const err: any = new Error('Şəkil tapılmadı');
      err.status = 404;
      throw err;
    }

    const oldFilename = target.filename;

    // Update metadata
    target.filename = processed.filename;
    target.url = `/uploads/${processed.filename}`;
    target.thumbUrl = `/uploads/thumbs/${processed.filename}`;
    target.width = processed.width;
    target.height = processed.height;
    target.sizeKb = processed.sizeKb;
    target.format = 'webp';
    target.updatedAt = new Date().toISOString();
    if (meta.altText) {
      target.alt = meta.altText.trim();
      target.altText = meta.altText.trim();
    }
    if (meta.focalPoint) {
      target.focalPoint = meta.focalPoint;
    }

    atomicWriteDb(images);

    // Delete old files safely after metadata has been committed
    if (oldFilename && oldFilename !== processed.filename) {
      try { fs.unlinkSync(path.join(UPLOADS_DIR, oldFilename)); } catch {}
      try { fs.unlinkSync(path.join(THUMBS_DIR, oldFilename)); } catch {}
    }

    return target;
  });
}

export async function updateImageMetaRecord(
  id: string,
  updates: { altText?: string; filename?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  return dbMutex.run(async () => {
    const images = readDbSafe();
    const target = images.find((img) => img.id === id);
    if (!target) {
      const err: any = new Error('Şəkil tapılmadı');
      err.status = 404;
      throw err;
    }

    if (typeof updates.altText === 'string') {
      target.alt = updates.altText.trim();
      target.altText = updates.altText.trim();
    }
    if (updates.focalPoint) {
      target.focalPoint = updates.focalPoint;
    }
    target.updatedAt = new Date().toISOString();

    atomicWriteDb(images);
    return target;
  });
}

export async function setCoverRecord(id: string): Promise<void> {
  return dbMutex.run(async () => {
    const images = readDbSafe();
    const target = images.find((img) => img.id === id);
    if (!target) {
      const err: any = new Error('Şəkil tapılmadı');
      err.status = 404;
      throw err;
    }

    images.forEach((img) => {
      if (img.group === target.group && img.targetId === target.targetId) {
        img.isCover = img.id === id;
      }
    });

    atomicWriteDb(images);
  });
}

export async function reorderImagesRecord(ids: string[]): Promise<void> {
  return dbMutex.run(async () => {
    const images = readDbSafe();
    if (ids.length === 0) return;

    const first = images.find((img) => img.id === ids[0]);
    if (!first) return;

    ids.forEach((id, newIndex) => {
      const img = images.find((i) => i.id === id);
      if (img) img.order = newIndex;
    });

    normalizeGroupOrders(images, first.group, first.targetId);
    atomicWriteDb(images);
  });
}

export async function deleteImageRecord(id: string): Promise<{ success: boolean; id: string }> {
  return dbMutex.run(async () => {
    const images = readDbSafe();
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) {
      const err: any = new Error('Şəkil tapılmadı');
      err.status = 404;
      throw err;
    }

    const [deleted] = images.splice(index, 1);

    // If deleted image was cover, promote the next image
    if (deleted.isCover) {
      const remaining = images
        .filter((img) => img.group === deleted.group && img.targetId === deleted.targetId)
        .sort((a, b) => a.order - b.order);

      if (remaining.length > 0) {
        remaining[0].isCover = true;
      }
    }

    // Normalize order index: 0, 1, 2, 3...
    normalizeGroupOrders(images, deleted.group, deleted.targetId);
    atomicWriteDb(images);

    // Delete disk files
    if (deleted.filename) {
      try { fs.unlinkSync(path.join(UPLOADS_DIR, deleted.filename)); } catch {}
      try { fs.unlinkSync(path.join(THUMBS_DIR, deleted.filename)); } catch {}
    }

    return { success: true, id };
  });
}
