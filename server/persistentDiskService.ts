import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';
import { getInitialSeedImages } from './initialImages.ts';
import type { ManagedImage, ImageSection } from '../src/types';
import {
  type StoredImage,
  type ProcessedImage,
  AsyncMutex,
  adaptInitialSeed,
  normalizeGroupOrders,
  generateSeoFilename,
  processImageWithSharp,
} from './imageUtils.ts';
import {
  isSupabaseConfigured,
  fetchSupabaseImages,
  uploadImageToSupabase,
  replaceImageInSupabase,
  deleteImageFromSupabase,
  reorderImagesInSupabase,
  setCoverInSupabase,
  updateImageMetaInSupabase,
} from './supabaseService.ts';

// Re-export shared types and helpers for backwards compatibility
export {
  StoredImage,
  ProcessedImage,
  AsyncMutex,
  adaptInitialSeed,
  normalizeGroupOrders,
  generateSeoFilename,
  processImageWithSharp,
};

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

const dbMutex = new AsyncMutex();

// 2. Atomic JSON Writer (Preserves local persistent disk intact)
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

// 3. Safe Database Reader with Backup Recovery
export function readDbSafe(): StoredImage[] {
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

    throw new Error(`CRITICAL: images.json is corrupted and backup recovery failed: ${err.message}`);
  }
}

// 4. Dual-Read Strategy:
// Primary: Supabase (when configured and records exist)
// Fallback: Existing Render Persistent Disk
export async function getAllStoredImages(): Promise<StoredImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabaseImages = await fetchSupabaseImages();
      if (supabaseImages && supabaseImages.length > 0) {
        // Dual-read transition: check if local disk has images not yet in Supabase
        const localImages = readDbSafe();
        const supabaseIds = new Set(supabaseImages.map((img) => img.id));
        const missingFromSupabase = localImages.filter((img) => !supabaseIds.has(img.id));

        if (missingFromSupabase.length > 0) {
          console.log(
            `[Dual-Read] Supabase primary (${supabaseImages.length}) + local fallback (${missingFromSupabase.length} unmigrated).`
          );
          return [...supabaseImages, ...missingFromSupabase].sort((a, b) => a.order - b.order);
        }
        return supabaseImages.sort((a, b) => a.order - b.order);
      }
    } catch (err: any) {
      console.warn('[Dual-Read] Supabase fetch error, using persistent disk fallback:', err.message);
    }
  }

  // Fallback: Render Persistent Disk
  const images = readDbSafe();
  return images.sort((a, b) => a.order - b.order);
}

// 5. Upload Image Record (Primary: Supabase if configured + Local Disk Backup)
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

  // Write processed files to disk (keeps local storage backup intact)
  const mainPath = path.join(UPLOADS_DIR, processed.filename);
  const thumbPath = path.join(THUMBS_DIR, processed.filename);
  fs.writeFileSync(mainPath, processed.imageBuffer);
  fs.writeFileSync(thumbPath, processed.thumbBuffer);

  // Mutex-protected metadata write to local disk
  const localRecord = await dbMutex.run(async () => {
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
    const nextOrder = groupImages.length;

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

  // If Supabase is configured, upload to Supabase Storage & DB
  if (isSupabaseConfigured()) {
    try {
      const supabaseRecord = await uploadImageToSupabase({
        imageBuffer: processed.imageBuffer,
        thumbBuffer: processed.thumbBuffer,
        filename: processed.filename,
        width: processed.width,
        height: processed.height,
        sizeKb: processed.sizeKb,
        section: params.section,
        targetId: params.targetId,
        targetName: params.targetName,
        altText: params.altText,
        isCover: params.isCover,
        focalPoint: params.focalPoint,
      });
      return supabaseRecord;
    } catch (err: any) {
      console.warn('[Upload] Supabase upload failed, falling back to local persistent record:', err.message);
    }
  }

  return localRecord;
}

// 6. Replace Image Record (Adheres to Replace Safety)
export async function replaceImageRecord(
  id: string,
  rawBuffer: Buffer,
  meta: { altText?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  let supabaseRecord: StoredImage | null = null;
  if (isSupabaseConfigured()) {
    try {
      supabaseRecord = await replaceImageInSupabase(id, rawBuffer, meta);
    } catch (err: any) {
      console.warn('[Replace] Supabase replace notice:', err.message);
    }
  }

  // Also replace in local disk so local backup is preserved
  const existing = readDbSafe().find((img) => img.id === id);
  if (!existing && !supabaseRecord) {
    const err: any = new Error('Şəkil tapılmadı');
    err.status = 404;
    throw err;
  }

  if (existing) {
    const isHero = existing.group === 'home_hero';
    const processed = await processImageWithSharp(
      rawBuffer,
      existing.filename,
      existing.targetId,
      isHero
    );

    const newMainPath = path.join(UPLOADS_DIR, processed.filename);
    const newThumbPath = path.join(THUMBS_DIR, processed.filename);
    fs.writeFileSync(newMainPath, processed.imageBuffer);
    fs.writeFileSync(newThumbPath, processed.thumbBuffer);

    await dbMutex.run(async () => {
      const images = readDbSafe();
      const target = images.find((img) => img.id === id);
      if (target) {
        const oldFilename = target.filename;

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

        if (oldFilename && oldFilename !== processed.filename) {
          try { fs.unlinkSync(path.join(UPLOADS_DIR, oldFilename)); } catch {}
          try { fs.unlinkSync(path.join(THUMBS_DIR, oldFilename)); } catch {}
        }
      }
    });
  }

  return supabaseRecord || (await getAllStoredImages()).find((i) => i.id === id)!;
}

// 7. Update Image Meta Record
export async function updateImageMetaRecord(
  id: string,
  updates: { altText?: string; filename?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  let supabaseRecord: StoredImage | null = null;
  if (isSupabaseConfigured()) {
    try {
      supabaseRecord = await updateImageMetaInSupabase(id, updates);
    } catch (err: any) {
      console.warn('[Meta] Supabase update notice:', err.message);
    }
  }

  const localRecord = await dbMutex.run(async () => {
    const images = readDbSafe();
    const target = images.find((img) => img.id === id);
    if (!target) {
      if (supabaseRecord) return supabaseRecord;
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

  return supabaseRecord || localRecord;
}

// 8. Set Cover Record
export async function setCoverRecord(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await setCoverInSupabase(id);
    } catch (err: any) {
      console.warn('[Cover] Supabase setCover notice:', err.message);
    }
  }

  return dbMutex.run(async () => {
    const images = readDbSafe();
    const target = images.find((img) => img.id === id);
    if (!target) {
      return;
    }

    images.forEach((img) => {
      if (img.group === target.group && img.targetId === target.targetId) {
        img.isCover = img.id === id;
      }
    });

    atomicWriteDb(images);
  });
}

// 9. Reorder Images Record
export async function reorderImagesRecord(ids: string[]): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await reorderImagesInSupabase(ids);
    } catch (err: any) {
      console.warn('[Reorder] Supabase reorder notice:', err.message);
    }
  }

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

// 10. Delete Image Record (Adheres to Delete Safety)
export async function deleteImageRecord(id: string): Promise<{ success: boolean; id: string }> {
  if (isSupabaseConfigured()) {
    try {
      await deleteImageFromSupabase(id);
    } catch (err: any) {
      console.warn('[Delete] Supabase delete notice:', err.message);
    }
  }

  return dbMutex.run(async () => {
    const images = readDbSafe();
    const index = images.findIndex((img) => img.id === id);
    if (index === -1) {
      return { success: true, id };
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
