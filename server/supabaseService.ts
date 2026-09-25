import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import type { ManagedImage, ImageSection } from '../src/types';
import type { StoredImage } from './imageUtils.ts';
import { generateSeoFilename, processImageWithSharp } from './imageUtils.ts';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_KEY = (
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_ANON_KEY
)?.trim();

export const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET?.trim() || 'dreamart-images';
export const ADMIN_IMAGES_TABLE = 'admin_images';

let supabaseClient: SupabaseClient | null = null;
let bucketVerified = false;

/**
 * Check whether Supabase environment variables are provided
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('http'));
}

/**
 * Get or initialize Supabase server client
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
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
 * Ensure Supabase storage bucket exists and is public
 */
export async function ensureSupabaseBucket(): Promise<boolean> {
  const client = getSupabaseClient();
  if (!client) return false;
  if (bucketVerified) return true;

  try {
    const { data: buckets, error } = await client.storage.listBuckets();
    if (error) {
      console.warn('[Supabase Storage] List buckets error:', error.message);
      return false;
    }

    const bucket = buckets?.find((b) => b.name === SUPABASE_STORAGE_BUCKET);
    if (!bucket) {
      console.log(`[Supabase Storage] Bucket "${SUPABASE_STORAGE_BUCKET}" not found. Creating public bucket...`);
      const { error: createErr } = await client.storage.createBucket(SUPABASE_STORAGE_BUCKET, {
        public: true,
        fileSizeLimit: 15 * 1024 * 1024,
        allowedMimeTypes: ['image/webp', 'image/jpeg', 'image/png'],
      });
      if (createErr) {
        console.warn('[Supabase Storage] Could not auto-create bucket:', createErr.message);
        return false;
      }
    }
    bucketVerified = true;
    return true;
  } catch (err: any) {
    console.warn('[Supabase Storage] ensureSupabaseBucket exception:', err.message);
    return false;
  }
}

/**
 * Get public URL for a file in Supabase Storage
 */
export function getPublicStorageUrl(storageKey: string): string {
  const client = getSupabaseClient();
  if (!client) return '';
  const { data } = client.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(storageKey);
  return data.publicUrl;
}

/**
 * Map raw database row from Supabase admin_images table to StoredImage
 */
export function mapDbRowToStoredImage(row: any): StoredImage {
  const group = row.group_name || row.group || 'general';
  const targetId = row.target_id || row.projectId || row.venueId || 'general';
  const isVenue = group === 'venue_project';

  return {
    id: row.id,
    group,
    filename: path.basename(row.storage_key || row.public_url || 'image.webp'),
    url: row.public_url,
    thumbUrl: row.thumb_public_url || row.public_url,
    alt: row.alt_text || '',
    width: row.width,
    height: row.height,
    format: row.format || 'webp',
    isCover: Boolean(row.is_cover),
    order: typeof row.sort_order === 'number' ? row.sort_order : 0,
    focalPoint: row.focal_point || undefined,
    projectId: isVenue ? undefined : targetId,
    venueId: isVenue ? targetId : undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
    section: group as ImageSection,
    targetId,
    targetName: row.target_name || targetId,
    altText: row.alt_text || '',
    sizeKb: row.size_kb,
  };
}

/**
 * Fetch all stored images from Supabase admin_images table
 */
export async function fetchSupabaseImages(): Promise<StoredImage[] | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from(ADMIN_IMAGES_TABLE)
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('[Supabase DB] Error querying admin_images table:', error.message);
      return null;
    }

    if (!Array.isArray(data)) return null;

    return data.map(mapDbRowToStoredImage);
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

  await ensureSupabaseBucket();

  const mainStorageKey = getStructuredStorageKey(params.section, params.targetId, params.filename, false);
  const thumbStorageKey = getStructuredStorageKey(params.section, params.targetId, params.filename, true);

  // 1. Upload main image to Supabase Storage
  const { error: mainUploadError } = await client.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(mainStorageKey, params.imageBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (mainUploadError) {
    throw new Error(`Supabase Storage upload failed: ${mainUploadError.message}`);
  }

  // 2. Upload thumbnail to Supabase Storage
  const { error: thumbUploadError } = await client.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(thumbStorageKey, params.thumbBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (thumbUploadError) {
    console.warn('[Supabase Storage] Thumb upload warning:', thumbUploadError.message);
  }

  // 3. Resolve public URLs
  const publicUrl = getPublicStorageUrl(mainStorageKey);
  const thumbPublicUrl = getPublicStorageUrl(thumbStorageKey);

  // 4. Determine ordering and cover status
  const { data: existingGroup } = await client
    .from(ADMIN_IMAGES_TABLE)
    .select('id, is_cover, sort_order')
    .eq('group_name', params.section)
    .eq('target_id', params.targetId);

  const shouldBeCover = Boolean(params.isCover) || !existingGroup || existingGroup.length === 0;

  if (shouldBeCover && existingGroup && existingGroup.length > 0) {
    // Unset existing cover flags in this group
    await client
      .from(ADMIN_IMAGES_TABLE)
      .update({ is_cover: false })
      .eq('group_name', params.section)
      .eq('target_id', params.targetId);
  }

  const nextOrder = existingGroup ? existingGroup.length : 0;
  const newId = `img-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const now = new Date().toISOString();

  // 5. Insert record into admin_images
  const newRow = {
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

  const { data: inserted, error: insertError } = await client
    .from(ADMIN_IMAGES_TABLE)
    .insert(newRow)
    .select()
    .single();

  if (insertError) {
    // Attempt rollback of uploaded object if DB insert failed
    await client.storage.from(SUPABASE_STORAGE_BUCKET).remove([mainStorageKey, thumbStorageKey]);
    throw new Error(`Supabase DB insert failed: ${insertError.message}`);
  }

  return mapDbRowToStoredImage(inserted || newRow);
}

/**
 * Replace safety:
 * 1. Upload new file
 * 2. Verify upload success
 * 3. Update DB record
 * 4. Only then delete old storage object
 */
export async function replaceImageInSupabase(
  id: string,
  rawBuffer: Buffer,
  meta: { altText?: string; focalPoint?: { x: number; y: number } }
): Promise<StoredImage> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  // Fetch existing DB record
  const { data: existing, error: fetchErr } = await client
    .from(ADMIN_IMAGES_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    const err: any = new Error('Şəkil tapılmadı (Supabase DB)');
    err.status = 404;
    throw err;
  }

  const isHero = existing.group_name === 'home_hero';
  const processed = await processImageWithSharp(
    rawBuffer,
    existing.target_name || existing.target_id,
    existing.target_id,
    isHero
  );

  const oldStorageKey = existing.storage_key;
  const oldThumbKey = existing.thumb_storage_key;

  const newMainStorageKey = getStructuredStorageKey(
    existing.group_name,
    existing.target_id,
    processed.filename,
    false
  );
  const newThumbStorageKey = getStructuredStorageKey(
    existing.group_name,
    existing.target_id,
    processed.filename,
    true
  );

  // 1. Upload new files
  const { error: mainUploadErr } = await client.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(newMainStorageKey, processed.imageBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  if (mainUploadErr) {
    throw new Error(`Supabase new image upload failed: ${mainUploadErr.message}`);
  }

  await client.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(newThumbStorageKey, processed.thumbBuffer, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: true,
    });

  // 2. Verify upload success
  const newPublicUrl = getPublicStorageUrl(newMainStorageKey);
  const newThumbPublicUrl = getPublicStorageUrl(newThumbStorageKey);

  if (!newPublicUrl) {
    throw new Error('Supabase storage verification failed: public URL unavailable.');
  }

  // 3. Update DB record
  const updates: any = {
    storage_key: newMainStorageKey,
    public_url: newPublicUrl,
    thumb_storage_key: newThumbStorageKey,
    thumb_public_url: newThumbPublicUrl,
    width: processed.width,
    height: processed.height,
    size_kb: processed.sizeKb,
    format: 'webp',
    updated_at: new Date().toISOString(),
  };

  if (meta.altText) {
    updates.alt_text = meta.altText.trim();
  }
  if (meta.focalPoint) {
    updates.focal_point = meta.focalPoint;
  }

  const { data: updatedRow, error: updateErr } = await client
    .from(ADMIN_IMAGES_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (updateErr) {
    // Clean up newly uploaded files on DB update error
    await client.storage.from(SUPABASE_STORAGE_BUCKET).remove([newMainStorageKey, newThumbStorageKey]);
    throw new Error(`Supabase DB update failed during replacement: ${updateErr.message}`);
  }

  // 4. Only then safely delete old storage objects
  if (oldStorageKey && oldStorageKey !== newMainStorageKey) {
    const keysToRemove = [oldStorageKey];
    if (oldThumbKey && oldThumbKey !== newThumbStorageKey) keysToRemove.push(oldThumbKey);
    await client.storage.from(SUPABASE_STORAGE_BUCKET).remove(keysToRemove);
  }

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

  // 1. Get existing record
  const { data: existing, error: fetchErr } = await client
    .from(ADMIN_IMAGES_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (fetchErr || !existing) {
    const err: any = new Error('Şəkil tapılmadı (Supabase DB)');
    err.status = 404;
    throw err;
  }

  // 2. If it was cover, promote next image
  if (existing.is_cover) {
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
  }

  // 3. Delete database record
  const { error: deleteErr } = await client
    .from(ADMIN_IMAGES_TABLE)
    .delete()
    .eq('id', id);

  if (deleteErr) {
    throw new Error(`Supabase DB delete failed: ${deleteErr.message}`);
  }

  // 4. Delete corresponding storage objects
  const keysToDelete: string[] = [];
  if (existing.storage_key) keysToDelete.push(existing.storage_key);
  if (existing.thumb_storage_key) keysToDelete.push(existing.thumb_storage_key);

  if (keysToDelete.length > 0) {
    const { error: storageRemoveErr } = await client.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .remove(keysToDelete);

    if (storageRemoveErr) {
      console.warn('[Supabase Storage] Delete storage object notice:', storageRemoveErr.message);
    }
  }

  // 5. Re-normalize group sort orders
  const { data: remaining } = await client
    .from(ADMIN_IMAGES_TABLE)
    .select('id')
    .eq('group_name', existing.group_name)
    .eq('target_id', existing.target_id)
    .order('sort_order', { ascending: true });

  if (remaining && remaining.length > 0) {
    for (let idx = 0; idx < remaining.length; idx++) {
      await client
        .from(ADMIN_IMAGES_TABLE)
        .update({ sort_order: idx })
        .eq('id', remaining[idx].id);
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
    await client
      .from(ADMIN_IMAGES_TABLE)
      .update({ sort_order: idx })
      .eq('id', ids[idx]);
  }
}

/**
 * Set cover image in Supabase
 */
export async function setCoverInSupabase(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase client is not configured.');

  const { data: target, error } = await client
    .from(ADMIN_IMAGES_TABLE)
    .select('group_name, target_id')
    .eq('id', id)
    .single();

  if (error || !target) {
    const err: any = new Error('Şəkil tapılmadı (Supabase)');
    err.status = 404;
    throw err;
  }

  // Unset all covers for this group & target
  await client
    .from(ADMIN_IMAGES_TABLE)
    .update({ is_cover: false })
    .eq('group_name', target.group_name)
    .eq('target_id', target.target_id);

  // Set cover on target
  await client
    .from(ADMIN_IMAGES_TABLE)
    .update({ is_cover: true })
    .eq('id', id);
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

  const { data: updated, error } = await client
    .from(ADMIN_IMAGES_TABLE)
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error || !updated) {
    throw new Error(`Supabase metadata update failed: ${error?.message || 'Şəkil tapılmadı'}`);
  }

  return mapDbRowToStoredImage(updated);
}
