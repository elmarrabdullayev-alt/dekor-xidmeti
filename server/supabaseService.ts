import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import sharp from 'sharp';
import type { ManagedImage, ImageSection } from '../src/types';
import type { StoredImage } from './imageUtils.ts';
import { generateSeoFilename, processImageWithSharp } from './imageUtils.ts';
import { readDbSafe } from './persistentDiskService.ts';

dotenv.config();

export const ADMIN_IMAGES_TABLE = 'admin_images';

let supabaseClient: SupabaseClient | null = null;
let bucketVerified = false;

/**
 * Dynamically read and sanitize Supabase URL from environment
 */
export function getSupabaseUrl(): string {
  const raw = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

/**
 * Dynamically read and sanitize Supabase Service Role Key or API Key
 */
export function getSupabaseKey(): string {
  const raw =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

/**
 * Dynamically read and sanitize Supabase Storage Bucket name
 */
export function getSupabaseBucket(): string {
  const raw = process.env.SUPABASE_STORAGE_BUCKET || process.env.VITE_SUPABASE_STORAGE_BUCKET || 'dreamart-images';
  return raw.trim().replace(/^["']|["']$/g, '') || 'dreamart-images';
}

export const SUPABASE_STORAGE_BUCKET = getSupabaseBucket();

/**
 * Check whether Supabase environment variables are available and valid
 */
export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseKey();
  return Boolean(url && key && url.startsWith('http'));
}

/**
 * Get or initialize Supabase server client
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const url = getSupabaseUrl();
  const key = getSupabaseKey();

  if (!supabaseClient) {
    console.log(`[Supabase Service] Initializing client -> URL: ${url} | Bucket: ${getSupabaseBucket()}`);
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseClient;
}

/**
 * Generate structured storage key according to DreamArt target architecture:
 * - home/hero/...
 * - decor/{project-id}/...
 * - venues/{venue-id}/...
 * - portfolio/...
 * - about/...
 * - services/{service-id}/...
 * - regional/{page-id}/...
 * - indian-wedding/...
 * - destination-wedding/...
 */
export function getStructuredStorageKey(
  section: string,
  targetId: string,
  filename: string,
  isThumb = false
): string {
  let baseFolder = 'general';

  const cleanTarget = (targetId || '').trim().toLowerCase();
  const cleanSection = (section || '').trim().toLowerCase();

  if (cleanSection === 'home_hero' || cleanTarget.startsWith('hero-slide')) {
    baseFolder = 'home/hero';
  } else if (cleanSection === 'decor_project') {
    baseFolder = `decor/${cleanTarget || 'project'}`;
  } else if (cleanSection === 'venue_project') {
    baseFolder = `venues/${cleanTarget || 'venue'}`;
  } else if (cleanSection === 'portfolio_lookbook') {
    baseFolder = 'portfolio';
  } else if (cleanSection === 'about' || cleanTarget === 'about-main') {
    baseFolder = 'about';
  } else if (cleanTarget === 'indian-wedding') {
    baseFolder = 'indian-wedding';
  } else if (cleanTarget === 'destination-wedding') {
    baseFolder = 'destination-wedding';
  } else if (cleanSection === 'regional_service' || cleanTarget === 'regional-main') {
    if (cleanTarget === 'berde-toy-dekoru' || cleanTarget === 'berde') {
      baseFolder = 'regional/berde';
    } else if (cleanTarget === 'qebele-toy-dekoru' || cleanTarget === 'qebele') {
      baseFolder = 'regional/qebele';
    } else {
      baseFolder = `regional/${cleanTarget || 'azerbaijan'}`;
    }
  } else if (cleanSection === 'xonca_service' || cleanTarget === 'xonca-main') {
    baseFolder = 'services/xonca';
  } else if (cleanSection === 'category_cover') {
    baseFolder = `categories/${cleanTarget || 'category'}`;
  } else if (cleanSection === 'services' || cleanSection === 'service_header') {
    baseFolder = `services/${cleanTarget || 'general'}`;
  } else {
    baseFolder = `${cleanSection}/${cleanTarget || 'default'}`;
  }

  // Sanitize path
  baseFolder = baseFolder.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

  if (isThumb) {
    return `${baseFolder}/thumbs/${filename}`;
  }
  return `${baseFolder}/${filename}`;
}

/**
 * Non-blocking bucket check/creation
 */
export async function ensureSupabaseBucket(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  if (bucketVerified) return true;

  const bucketName = getSupabaseBucket();

  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      console.warn('[Supabase Storage] List buckets warning (proceeding directly):', error.message);
      bucketVerified = true;
      return true;
    }

    const bucket = buckets?.find((b) => b.name === bucketName);
    if (!bucket) {
      console.log(`[Supabase Storage] Bucket "${bucketName}" not found in list. Attempting create...`);
      const { error: createErr } = await client.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 15 * 1024 * 1024,
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
      });
      if (createErr) {
        console.warn('[Supabase Storage] Auto-create bucket notice (may already exist):', createErr.message);
      }
    }
    bucketVerified = true;
    return true;
  } catch (err: any) {
    console.warn('[Supabase Storage] ensureSupabaseBucket catch (proceeding):', err.message);
    bucketVerified = true;
    return true;
  }
}

/**
 * Get public URL for a file in Supabase Storage
 */
export function getPublicStorageUrl(storageKey: string): string {
  const client = getSupabaseClient();
  if (!client) return '';
  const bucketName = getSupabaseBucket();
  const { data } = client.storage.from(bucketName).getPublicUrl(storageKey);
  return data.publicUrl;
}

/**
 * Map raw database row from Supabase admin_images table to StoredImage
 */
export function mapDbRowToStoredImage(row: any): StoredImage {
  let group = row.group_name || row.group || row.section || 'general';
  if (group === 'category' || group === 'categories') group = 'category_cover';
  if (group === 'decor' || group === 'decors') group = 'decor_project';
  if (group === 'venue' || group === 'venues') group = 'venue_project';
  if (group === 'hero') group = 'home_hero';

  let targetId = row.target_id || row.targetId || row.projectId || row.venueId || 'general';
  if (targetId === 'xina') targetId = 'xina-dekoru';
  if (targetId === 'adgunu' || targetId === 'ad-gunu') targetId = 'ad-gunu-dekoru';

  const isVenue = group === 'venue_project';

  let url = row.public_url || row.url || '';
  if (!url && row.storage_key) {
    url = getPublicStorageUrl(row.storage_key);
  }

  let thumbUrl = row.thumb_public_url || row.thumbUrl || url;
  if (!thumbUrl && row.thumb_storage_key) {
    thumbUrl = getPublicStorageUrl(row.thumb_storage_key);
  }

  return {
    id: String(row.id),
    group,
    filename: path.basename(row.storage_key || url || 'image.webp'),
    url: url || '',
    thumbUrl: thumbUrl || url || '',
    alt: row.alt_text || row.alt || '',
    width: row.width,
    height: row.height,
    format: row.format || 'webp',
    isCover: Boolean(row.is_cover ?? row.isCover),
    order: typeof (row.sort_order ?? row.order) === 'number' ? (row.sort_order ?? row.order) : 0,
    focalPoint: row.focal_point || row.focalPoint || undefined,
    projectId: isVenue ? undefined : targetId,
    venueId: isVenue ? targetId : undefined,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    section: group as ImageSection,
    targetId,
    targetName: row.target_name || row.targetName || targetId,
    altText: row.alt_text || row.alt || '',
    sizeKb: row.size_kb || row.sizeKb,
  };
}

/**
 * Safe Upsert Helper:
 * 1. Tries full row with all metadata
 * 2. If table lacks extended columns, automatically falls back to the exact 10 core fields
 *    specified in the user's database model:
 *    (id, group_name, target_id, storage_key, public_url, alt_text, sort_order, is_cover, created_at, updated_at)
 */
export async function safeUpsertImageRow(
  client: SupabaseClient,
  fullRow: any
): Promise<{ data: any; error: any }> {
  // 1. First attempt: Full row
  const { data, error } = await client
    .from(ADMIN_IMAGES_TABLE)
    .upsert(fullRow, { onConflict: 'id' })
    .select();

  if (!error) {
    return { data: data?.[0] || fullRow, error: null };
  }

  console.warn(`[Supabase DB] Full upsert notice: ${error.message} (code: ${error.code}). Retrying with 10 core fields...`);

  // 2. Second attempt: Exact 10 core fields
  const coreRow = {
    id: fullRow.id,
    group_name: fullRow.group_name,
    target_id: fullRow.target_id,
    storage_key: fullRow.storage_key,
    public_url: fullRow.public_url,
    alt_text: fullRow.alt_text || '',
    sort_order: typeof fullRow.sort_order === 'number' ? fullRow.sort_order : 0,
    is_cover: Boolean(fullRow.is_cover),
    created_at: fullRow.created_at || new Date().toISOString(),
    updated_at: fullRow.updated_at || new Date().toISOString(),
  };

  const { data: retryData, error: retryError } = await client
    .from(ADMIN_IMAGES_TABLE)
    .upsert(coreRow, { onConflict: 'id' })
    .select();

  if (retryError) {
    console.error(`[Supabase DB ERROR] Core upsert failed: ${retryError.message} (code: ${retryError.code})`);
    return { data: null, error: retryError };
  }

  console.log(`[Supabase DB] Successfully inserted/updated image "${fullRow.id}" using core schema fields.`);
  return { data: retryData?.[0] || coreRow, error: null };
}

/**
 * Fetch all stored images from Supabase admin_images table
 */
export async function fetchSupabaseImages(): Promise<StoredImage[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    let { data, error } = await client
      .from(ADMIN_IMAGES_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[Supabase DB] Query with sort_order error, falling back to select(*):', error.message);
      const fallbackQuery = await client.from(ADMIN_IMAGES_TABLE).select('*');
      if (fallbackQuery.error) {
        console.warn('[Supabase DB] Query admin_images error:', fallbackQuery.error.message);
        return null;
      }
      data = fallbackQuery.data;
    }

    if (!Array.isArray(data) || data.length === 0) return null;

    const mapped = data.map(mapDbRowToStoredImage);
    return mapped.sort((a, b) => a.order - b.order);
  } catch (err: any) {
    console.warn('[Supabase DB] fetchSupabaseImages exception:', err.message);
    return null;
  }
}

/**
 * Upload image to Supabase Storage and register in admin_images table
 */
export async function uploadImageToSupabase(params: {
  imageBuffer: Buffer;
  thumbBuffer: Buffer;
  filename: string;
  width: number;
  height: number;
  sizeKb: number;
  section: ImageSection;
  targetId: string;
  targetName?: string;
  altText?: string;
  isCover?: boolean;
  focalPoint?: { x: number; y: number };
}): Promise<StoredImage> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  const bucketName = getSupabaseBucket();
  await ensureSupabaseBucket();

  const mainStorageKey = getStructuredStorageKey(params.section, params.targetId, params.filename, false);
  const thumbStorageKey = getStructuredStorageKey(params.section, params.targetId, params.filename, true);

  console.log(`[Supabase Upload] Uploading main file -> Bucket: "${bucketName}", Key: "${mainStorageKey}" (${params.imageBuffer.length} bytes)...`);

  // 1. Upload main image to Supabase Storage
  const { error: mainUploadError } = await client.storage
    .from(bucketName)
    .upload(mainStorageKey, params.imageBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (mainUploadError) {
    console.error(`[Supabase Storage ERROR] Main upload failed: ${mainUploadError.message}`);
    throw new Error(`Supabase Storage upload failed: ${mainUploadError.message}`);
  }

  console.log(`[Supabase Upload] Main file uploaded successfully. Uploading thumb -> "${thumbStorageKey}"...`);

  // 2. Upload thumbnail to Supabase Storage
  const { error: thumbUploadError } = await client.storage
    .from(bucketName)
    .upload(thumbStorageKey, params.thumbBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (thumbUploadError) {
    console.warn('[Supabase Storage] Thumb upload notice:', thumbUploadError.message);
  }

  // 3. Resolve public URLs
  const publicUrl = getPublicStorageUrl(mainStorageKey);
  const thumbPublicUrl = getPublicStorageUrl(thumbStorageKey);

  // 4. Determine ordering and cover status
  let nextOrder = 0;
  let shouldBeCover = Boolean(params.isCover);

  try {
    const { data: existingGroup } = await client
      .from(ADMIN_IMAGES_TABLE)
      .select('id, is_cover, sort_order')
      .eq('group_name', params.section)
      .eq('target_id', params.targetId);

    if (existingGroup && existingGroup.length > 0) {
      nextOrder = existingGroup.length;
      if (shouldBeCover) {
        await client
          .from(ADMIN_IMAGES_TABLE)
          .update({ is_cover: false })
          .eq('group_name', params.section)
          .eq('target_id', params.targetId);
      }
    } else {
      shouldBeCover = true;
    }
  } catch {}

  const newId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();

  // 5. Insert record into admin_images using schema-resilient upsert
  const fullRow = {
    id: newId,
    group_name: params.section,
    target_id: params.targetId,
    target_name: params.targetName || params.targetId,
    storage_key: mainStorageKey,
    public_url: publicUrl,
    thumb_storage_key: thumbStorageKey,
    thumb_public_url: thumbPublicUrl,
    alt_text: params.altText?.trim() || `DreamArt Events ${params.targetName || ''}`,
    sort_order: nextOrder,
    is_cover: shouldBeCover,
    width: params.width,
    height: params.height,
    size_kb: params.sizeKb,
    format: 'webp',
    focal_point: params.focalPoint || null,
    created_at: now,
    updated_at: now,
  };

  const { data: inserted, error: insertError } = await safeUpsertImageRow(client, fullRow);

  if (insertError) {
    throw new Error(`Supabase DB insert failed: ${insertError.message}`);
  }

  console.log(`[Supabase Upload] Success! Image "${newId}" saved in Storage & DB -> ${publicUrl}`);
  return mapDbRowToStoredImage(inserted || fullRow);
}

/**
 * Replace safety:
 * 1. Upload new file
 * 2. Verify upload success
 * 3. Update DB record (or insert if replacing a local disk image)
 * 4. Only then delete old storage object
 */
export async function replaceImageInSupabase(
  id: string,
  rawBuffer: Buffer,
  meta: { altText?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  const bucketName = getSupabaseBucket();
  await ensureSupabaseBucket();

  // 1. Fetch existing DB record (or fallback to local disk record if not yet in Supabase DB)
  let existingGroup = 'general';
  let existingTarget = 'general';
  let existingTargetName = '';
  let oldStorageKey: string | null = null;
  let oldThumbKey: string | null = null;

  try {
    const { data: dbItem } = await client
      .from(ADMIN_IMAGES_TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (dbItem) {
      existingGroup = dbItem.group_name;
      existingTarget = dbItem.target_id;
      existingTargetName = dbItem.target_name || '';
      oldStorageKey = dbItem.storage_key;
      oldThumbKey = dbItem.thumb_storage_key;
    }
  } catch {}

  // If not found in Supabase DB, check local disk
  if (!oldStorageKey) {
    const localImg = readDbSafe().find((img) => img.id === id);
    if (localImg) {
      existingGroup = localImg.group || localImg.section;
      existingTarget = localImg.targetId;
      existingTargetName = localImg.targetName || '';
    }
  }

  const isHero = existingGroup === 'home_hero';
  const processed = await processImageWithSharp(
    rawBuffer,
    existingTargetName || existingTarget,
    existingTarget,
    isHero
  );

  const newMainStorageKey = getStructuredStorageKey(
    existingGroup,
    existingTarget,
    processed.filename,
    false
  );
  const newThumbStorageKey = getStructuredStorageKey(
    existingGroup,
    existingTarget,
    processed.filename,
    true
  );

  console.log(`[Supabase Replace] Uploading replacement file -> Bucket: "${bucketName}", Key: "${newMainStorageKey}"...`);

  // 2. Upload new files to Supabase Storage
  const { error: mainUploadErr } = await client.storage
    .from(bucketName)
    .upload(newMainStorageKey, processed.imageBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (mainUploadErr) {
    console.error(`[Supabase Storage ERROR] Replacement upload failed: ${mainUploadErr.message}`);
    throw new Error(`Supabase new image upload failed: ${mainUploadErr.message}`);
  }

  await client.storage
    .from(bucketName)
    .upload(newThumbStorageKey, processed.thumbBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  // 3. Verify upload success
  const newPublicUrl = getPublicStorageUrl(newMainStorageKey);
  const newThumbPublicUrl = getPublicStorageUrl(newThumbStorageKey);

  if (!newPublicUrl) {
    throw new Error('Supabase storage verification failed: public URL unavailable.');
  }

  // 4. Update / Upsert DB record
  const fullRow = {
    id,
    group_name: existingGroup,
    target_id: existingTarget,
    target_name: existingTargetName,
    storage_key: newMainStorageKey,
    public_url: newPublicUrl,
    thumb_storage_key: newThumbStorageKey,
    thumb_public_url: newThumbPublicUrl,
    alt_text: meta.altText?.trim() || `DreamArt Events ${existingTargetName}`,
    width: processed.width,
    height: processed.height,
    size_kb: processed.sizeKb,
    format: 'webp',
    focal_point: meta.focalPoint || null,
    updated_at: new Date().toISOString(),
  };

  const { data: updatedRow, error: updateErr } = await safeUpsertImageRow(client, fullRow);

  if (updateErr) {
    throw new Error(`Supabase DB update failed during replacement: ${updateErr.message}`);
  }

  // 5. Only then safely delete old storage objects if they existed and differ
  if (oldStorageKey && oldStorageKey !== newMainStorageKey) {
    const keysToRemove = [oldStorageKey];
    if (oldThumbKey && oldThumbKey !== newThumbStorageKey) keysToRemove.push(oldThumbKey);
    await client.storage.from(bucketName).remove(keysToRemove);
  }

  console.log(`[Supabase Replace] Success! Image "${id}" replaced in Storage & DB -> ${newPublicUrl}`);
  return mapDbRowToStoredImage(updatedRow);
}

/**
 * Delete safety:
 * - delete database record safely
 * - delete corresponding Supabase Storage objects
 * - re-normalize orders & promote cover if needed
 */
export async function deleteImageFromSupabase(id: string): Promise<{ success: boolean; id: string }> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  const bucketName = getSupabaseBucket();

  // 1. Get existing record
  let existing: any = null;
  try {
    const { data } = await client
      .from(ADMIN_IMAGES_TABLE)
      .select('*')
      .eq('id', id)
      .single();
    existing = data;
  } catch {}

  if (!existing) {
    // If not found in DB, check local disk for storage keys
    const local = readDbSafe().find((i) => i.id === id);
    if (!local) return { success: true, id };
  }

  // 2. If it was cover, promote next image
  if (existing?.is_cover) {
    try {
      const { data: groupImgs } = await client
        .from(ADMIN_IMAGES_TABLE)
        .select('id, sort_order')
        .eq('group_name', existing.group_name)
        .eq('target_id', existing.target_id)
        .neq('id', id)
        .order('sort_order', { ascending: true });

      if (groupImgs && groupImgs.length > 0) {
        await client
          .from(ADMIN_IMAGES_TABLE)
          .update({ is_cover: true })
          .eq('id', groupImgs[0].id);
      }
    } catch {}
  }

  // 3. Delete database record
  try {
    await client.from(ADMIN_IMAGES_TABLE).delete().eq('id', id);
  } catch (err: any) {
    console.warn('[Supabase DB] Delete row notice:', err.message);
  }

  // 4. Delete corresponding storage objects
  const keysToDelete: string[] = [];
  if (existing?.storage_key) keysToDelete.push(existing.storage_key);
  if (existing?.thumb_storage_key) keysToDelete.push(existing.thumb_storage_key);

  if (keysToDelete.length > 0) {
    try {
      await client.storage.from(bucketName).remove(keysToDelete);
    } catch (err: any) {
      console.warn('[Supabase Storage] Delete object notice:', err.message);
    }
  }

  return { success: true, id };
}

/**
 * Reorder gallery images in Supabase
 */
export async function reorderImagesInSupabase(ids: string[]): Promise<void> {
  const client = getSupabaseClient();
  if (!client || ids.length === 0) return;

  for (let idx = 0; idx < ids.length; idx++) {
    try {
      await client
        .from(ADMIN_IMAGES_TABLE)
        .update({ sort_order: idx })
        .eq('id', ids[idx]);
    } catch {}
  }
}

/**
 * Set cover image in Supabase
 */
export async function setCoverInSupabase(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  try {
    const { data: target } = await client
      .from(ADMIN_IMAGES_TABLE)
      .select('group_name, target_id')
      .eq('id', id)
      .single();

    if (target) {
      await client
        .from(ADMIN_IMAGES_TABLE)
        .update({ is_cover: false })
        .eq('group_name', target.group_name)
        .eq('target_id', target.target_id);

      await client
        .from(ADMIN_IMAGES_TABLE)
        .update({ is_cover: true })
        .eq('id', id);
    }
  } catch (err: any) {
    console.warn('[Supabase DB] setCover notice:', err.message);
  }
}

/**
 * Update image metadata in Supabase
 */
export async function updateImageMetaInSupabase(
  id: string,
  updates: { altText?: string; filename?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  const dbUpdates: any = {
    updated_at: new Date().toISOString(),
  };

  if (typeof updates.altText === 'string') {
    dbUpdates.alt_text = updates.altText.trim();
  }
  if (updates.focalPoint) {
    dbUpdates.focal_point = updates.focalPoint;
  }

  // Attempt update
  const { data: updated, error } = await client
    .from(ADMIN_IMAGES_TABLE)
    .update(dbUpdates)
    .eq('id', id)
    .select();

  if (error || !updated || updated.length === 0) {
    // If focal_point column doesn't exist, retry with alt_text only
    const coreUpdates: any = {
      updated_at: new Date().toISOString(),
    };
    if (typeof updates.altText === 'string') coreUpdates.alt_text = updates.altText.trim();

    const { data: retryUpdated } = await client
      .from(ADMIN_IMAGES_TABLE)
      .update(coreUpdates)
      .eq('id', id)
      .select();

    if (retryUpdated && retryUpdated.length > 0) {
      return mapDbRowToStoredImage(retryUpdated[0]);
    }
  }

  return mapDbRowToStoredImage(updated?.[0] || dbUpdates);
}
