import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import sharp from 'sharp';
import {
  isSupabaseConfigured,
  getSupabaseClient,
  ensureSupabaseBucket,
  getStructuredStorageKey,
  getPublicStorageUrl,
  ADMIN_IMAGES_TABLE,
  SUPABASE_STORAGE_BUCKET,
  safeUpsertImageRow,
} from './supabaseService.ts';
import {
  PERSISTENT_DATA_DIR,
  UPLOADS_DIR,
  THUMBS_DIR,
  readDbSafe,
} from './persistentDiskService.ts';
import {
  processImageWithSharp,
  type StoredImage,
} from './imageUtils.ts';

dotenv.config();

export interface MigrationResult {
  success: boolean;
  total: number;
  migrated: number;
  skipped: number;
  errors: Array<{ id: string; error: string }>;
  details: string[];
}

/**
 * Locate raw image file buffer across local persistent storage and asset paths
 */
function findLocalImageBuffer(img: StoredImage): { buffer: Buffer; sourcePath: string } | null {
  const candidatePaths: string[] = [
    // 1. Persistent uploads directory
    path.join(UPLOADS_DIR, img.filename),
    // 2. Persistent data dir uploads
    path.join(PERSISTENT_DATA_DIR, 'uploads', img.filename),
    // 3. Fallback repository data/uploads
    path.join(process.cwd(), 'data', 'uploads', img.filename),
    // 4. Public root path if url is /images/...
    path.join(process.cwd(), 'public', img.url.replace(/^\//, '')),
    // 5. Public /images folder
    path.join(process.cwd(), 'public', 'images', img.filename),
    // 6. Project root bundle image (e.g., 1.webp, 2.webp, 3.webp)
    path.join(process.cwd(), img.filename),
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const stat = fs.statSync(p);
        if (stat.isFile() && stat.size > 0) {
          return { buffer: fs.readFileSync(p), sourcePath: p };
        }
      } catch {}
    }
  }

  return null;
}

/**
 * Verify whether an object exists in Supabase Storage
 */
async function verifyStorageObjectExists(storageKey: string): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const dir = path.dirname(storageKey);
    const filename = path.basename(storageKey);
    const { data, error } = await client.storage.from(SUPABASE_STORAGE_BUCKET).list(dir, {
      limit: 100,
      search: filename,
    });

    if (error) return false;
    return Boolean(data && data.some((item) => item.name === filename));
  } catch {
    return false;
  }
}

/**
 * Safe, idempotent migration utility from Render Persistent Disk to Supabase
 * - Does NOT delete any local persistent disk data
 * - Verifies storage and DB existence before marking migrated
 * - Preserves group, targetId, altText, order, cover
 * - Skips duplicates safely
 */
export async function runSupabaseMigration(): Promise<MigrationResult> {
  const details: string[] = [];
  const errors: Array<{ id: string; error: string }> = [];
  let migrated = 0;
  let skipped = 0;

  if (!isSupabaseConfigured()) {
    const msg = 'Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) are not configured.';
    console.error(`[Migration Error] ${msg}`);
    return {
      success: false,
      total: 0,
      migrated: 0,
      skipped: 0,
      errors: [{ id: 'ENV', error: msg }],
      details: [msg],
    };
  }

  const client = getSupabaseClient()!;

  // 1. Ensure storage bucket exists
  const bucketOk = await ensureSupabaseBucket();
  if (!bucketOk) {
    const msg = `Failed to access or create Supabase Storage bucket "${SUPABASE_STORAGE_BUCKET}".`;
    return {
      success: false,
      total: 0,
      migrated: 0,
      skipped: 0,
      errors: [{ id: 'BUCKET', error: msg }],
      details: [msg],
    };
  }

  // 2. Read local persistent images metadata (NO deletion, purely read-only)
  const localImages = readDbSafe();
  const total = localImages.length;
  details.push(`Found ${total} images in local persistent storage to process.`);
  console.log(`[Migration] Starting migration of ${total} images to Supabase...`);

  // 3. Fetch existing records from Supabase admin_images table to detect duplicates
  const existingMap = new Map<string, any>();
  try {
    const { data, error } = await client.from(ADMIN_IMAGES_TABLE).select('id, storage_key, public_url');
    if (!error && Array.isArray(data)) {
      data.forEach((row) => existingMap.set(row.id, row));
    }
  } catch (err: any) {
    details.push(`Note: Could not pre-fetch existing records (${err.message}). Will check individually.`);
  }

  // 4. Process each image idempotently
  for (const img of localImages) {
    try {
      const existingRow = existingMap.get(img.id);

      // Check if already in Supabase DB and Storage
      if (existingRow && existingRow.storage_key) {
        const fileExists = await verifyStorageObjectExists(existingRow.storage_key);
        if (fileExists) {
          skipped++;
          details.push(`[Skipped - Already Migrated] Image "${img.id}" (${img.filename}) exists in Supabase.`);
          continue;
        }
      }

      // Locate local file
      const found = findLocalImageBuffer(img);
      if (!found) {
        // If file not found on disk, record warning and skip
        const errMsg = `Local file not found for image "${img.id}" (${img.filename} at ${img.url})`;
        console.warn(`[Migration Warning] ${errMsg}`);
        errors.push({ id: img.id, error: errMsg });
        continue;
      }

      // Process image to ensure standard WebP specifications
      const isHero = (img.group || img.section) === 'home_hero';
      const processed = await processImageWithSharp(
        found.buffer,
        img.targetName || img.targetId,
        img.targetId,
        isHero
      );

      const mainStorageKey = getStructuredStorageKey(
        img.group || img.section,
        img.targetId,
        processed.filename,
        false
      );
      const thumbStorageKey = getStructuredStorageKey(
        img.group || img.section,
        img.targetId,
        processed.filename,
        true
      );

      // Upload main image
      const { error: mainUploadErr } = await client.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(mainStorageKey, processed.imageBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true,
        });

      if (mainUploadErr) {
        throw new Error(`Main image upload error: ${mainUploadErr.message}`);
      }

      // Upload thumbnail
      await client.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(thumbStorageKey, processed.thumbBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: true,
        });

      // Verify file exists in Supabase Storage before marking migrated
      const verified = await verifyStorageObjectExists(mainStorageKey);
      if (!verified) {
        throw new Error(`Storage upload verification failed for key: ${mainStorageKey}`);
      }

      const publicUrl = getPublicStorageUrl(mainStorageKey);
      const thumbPublicUrl = getPublicStorageUrl(thumbStorageKey);

      // Upsert record into admin_images database table
      const dbRow = {
        id: img.id,
        group_name: img.group || img.section,
        target_id: img.targetId,
        target_name: img.targetName || img.targetId,
        storage_key: mainStorageKey,
        public_url: publicUrl,
        thumb_storage_key: thumbStorageKey,
        thumb_public_url: thumbPublicUrl,
        alt_text: img.altText || img.alt || '',
        sort_order: typeof img.order === 'number' ? img.order : 0,
        is_cover: Boolean(img.isCover),
        width: processed.width || img.width,
        height: processed.height || img.height,
        size_kb: processed.sizeKb || img.sizeKb,
        format: 'webp',
        focal_point: img.focalPoint || null,
        created_at: img.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await safeUpsertImageRow(client, dbRow);

      if (upsertErr) {
        throw new Error(`Database upsert error: ${upsertErr.message}`);
      }

      migrated++;
      details.push(`[Migrated] Image "${img.id}" -> ${mainStorageKey} (${publicUrl})`);
      console.log(`[Migration] Successfully migrated: ${img.id} -> ${mainStorageKey}`);
    } catch (err: any) {
      console.error(`[Migration Error] Failed on image "${img.id}":`, err.message);
      errors.push({ id: img.id, error: err.message });
    }
  }

  const success = errors.length === 0;
  console.log(`[Migration Complete] Total: ${total}, Migrated: ${migrated}, Skipped: ${skipped}, Errors: ${errors.length}`);

  return {
    success,
    total,
    migrated,
    skipped,
    errors,
    details,
  };
}

// Standalone CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('--- DreamArt Events: Supabase Storage & DB Migration Utility ---');
  runSupabaseMigration()
    .then((res) => {
      console.log('Result:', JSON.stringify(res, null, 2));
      process.exit(res.success ? 0 : 1);
    })
    .catch((err) => {
      console.error('Fatal CLI migration error:', err);
      process.exit(1);
    });
}
