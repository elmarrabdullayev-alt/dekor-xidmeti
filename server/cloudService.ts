import { Storage, Bucket } from '@google-cloud/storage';
import { Firestore, Transaction, DocumentSnapshot, QueryDocumentSnapshot } from '@google-cloud/firestore';
import path from 'path';
import fs from 'fs';
import { ManagedImage, ImageSection } from '../src/types';
import { getInitialSeedImages } from './initialImages';

// Environment variables
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME?.trim();
const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT?.trim();
const FIRESTORE_COLLECTION = process.env.FIRESTORE_COLLECTION?.trim() || 'dreamart_images';

// Local storage paths for development fallback only
const DATA_DIR = path.join(process.cwd(), 'data');
const IMAGES_DB_FILE = path.join(DATA_DIR, 'images.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const THUMBS_DIR = path.join(UPLOADS_DIR, 'thumbs');

let storageClient: Storage | null = null;
let gcsBucket: Bucket | null = null;
let firestoreClient: Firestore | null = null;
let cloudInitialized = false;

/**
 * Validate and initialize Google Cloud services.
 * In production, fails fast if GCS_BUCKET_NAME is missing or unconfigured.
 */
export function initCloudServices(): {
  isCloud: boolean;
  bucketName?: string;
  projectId?: string;
  collectionName: string;
} {
  if (IS_PRODUCTION) {
    if (!GCS_BUCKET_NAME) {
      const errorMsg =
        'FATAL PRODUCTION CONFIGURATION ERROR: GCS_BUCKET_NAME environment variable is required in production mode.\n' +
        'Local filesystem storage (public/uploads, data/images.json) is prohibited in production to prevent data loss on Cloud Run container restarts.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
  }

  if (GCS_BUCKET_NAME) {
    try {
      console.log(`[Cloud Services] Initializing Google Cloud Storage with bucket "${GCS_BUCKET_NAME}"...`);
      storageClient = new Storage({
        projectId: GOOGLE_CLOUD_PROJECT || undefined,
      });
      gcsBucket = storageClient.bucket(GCS_BUCKET_NAME);

      console.log(`[Cloud Services] Initializing Firestore (project: ${GOOGLE_CLOUD_PROJECT || 'auto-detected'})...`);
      firestoreClient = new Firestore({
        projectId: GOOGLE_CLOUD_PROJECT || undefined,
      });

      cloudInitialized = true;
      console.log('[Cloud Services] Google Cloud Storage & Firestore initialized successfully.');
      return {
        isCloud: true,
        bucketName: GCS_BUCKET_NAME,
        projectId: GOOGLE_CLOUD_PROJECT,
        collectionName: FIRESTORE_COLLECTION,
      };
    } catch (err: any) {
      if (IS_PRODUCTION) {
        console.error('FATAL: Failed to initialize Google Cloud services in production:', err);
        throw err;
      } else {
        console.warn('[DEV WARNING] Failed to initialize Google Cloud SDKs in dev. Falling back to local storage:', err.message);
        cloudInitialized = false;
      }
    }
  } else {
    console.warn(
      '[DEV WARNING] GCS_BUCKET_NAME is not set. Running in local development fallback mode.\n' +
      'All image writes will go to local disk (public/uploads and data/images.json).\n' +
      'Set GCS_BUCKET_NAME and GOOGLE_CLOUD_PROJECT in .env to test with real Cloud Storage and Firestore.'
    );
    // Ensure local dirs exist for dev fallback
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    if (!fs.existsSync(THUMBS_DIR)) fs.mkdirSync(THUMBS_DIR, { recursive: true });
  }

  return {
    isCloud: false,
    collectionName: FIRESTORE_COLLECTION,
  };
}

export function isCloudActive(): boolean {
  return cloudInitialized && !!gcsBucket && !!firestoreClient;
}

export function getStorageMode(): 'gcs_firestore' | 'local_fallback' {
  return isCloudActive() ? 'gcs_firestore' : 'local_fallback';
}

/* ==========================================================================
   LOCAL FALLBACK IMPLEMENTATION (DEV ONLY)
   ========================================================================== */

function readLocalDb(): ManagedImage[] {
  try {
    if (!fs.existsSync(IMAGES_DB_FILE)) {
      const initial = getInitialSeedImages();
      fs.writeFileSync(IMAGES_DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(IMAGES_DB_FILE, 'utf-8');
    return JSON.parse(data) as ManagedImage[];
  } catch (err) {
    console.error('Error reading local images DB:', err);
    return getInitialSeedImages();
  }
}

function writeLocalDb(images: ManagedImage[]) {
  if (IS_PRODUCTION) {
    throw new Error('ILLEGAL OPERATION: Local filesystem write is prohibited in production.');
  }
  try {
    fs.writeFileSync(IMAGES_DB_FILE, JSON.stringify(images, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local images DB:', err);
  }
}

/* ==========================================================================
   PUBLIC INTERFACES FOR IMAGES API
   ========================================================================== */

/**
 * Retrieve all images.
 * In Cloud mode: reads from Firestore collection `dreamart_images`.
 * If collection is empty, seeds it atomically with initial images.
 * In Local mode: reads from `data/images.json`.
 */
export async function getAllImages(): Promise<ManagedImage[]> {
  if (isCloudActive() && firestoreClient) {
    const colRef = firestoreClient.collection(FIRESTORE_COLLECTION);
    const snapshot = await colRef.get();

    if (snapshot.empty) {
      console.log(`[Firestore] Collection "${FIRESTORE_COLLECTION}" is empty. Seeding initial images...`);
      const seeds = getInitialSeedImages();
      const batch = firestoreClient.batch();
      for (const img of seeds) {
        const docRef = colRef.doc(img.id);
        batch.set(docRef, img);
      }
      await batch.commit();
      console.log(`[Firestore] Successfully seeded ${seeds.length} initial images.`);
      return seeds;
    }

    const images: ManagedImage[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot) => {
      images.push(doc.data() as ManagedImage);
    });

    // Sort by order ascending
    images.sort((a, b) => (a.order || 0) - (b.order || 0));
    return images;
  }

  // Local fallback
  return readLocalDb();
}

/**
 * Upload image and optional thumbnail buffer.
 * In Cloud mode: streams directly to GCS bucket with permanent cache headers.
 * In Local mode: saves to `public/uploads`.
 */
export async function saveImageFile(
  cleanFilename: string,
  imageBuffer: Buffer,
  thumbBuffer?: Buffer
): Promise<{ url: string; thumbUrl: string }> {
  if (isCloudActive() && gcsBucket) {
    const mainGcsPath = `images/${cleanFilename}`;
    const file = gcsBucket.file(mainGcsPath);

    await file.save(imageBuffer, {
      contentType: 'image/webp',
      metadata: {
        cacheControl: 'public, max-age=31536000, immutable',
        contentDisposition: 'inline',
      },
      resumable: false,
    });

    const publicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${mainGcsPath}`;
    let thumbPublicUrl = publicUrl;

    if (thumbBuffer) {
      const thumbGcsPath = `thumbs/${cleanFilename}`;
      const thumbFile = gcsBucket.file(thumbGcsPath);
      await thumbFile.save(thumbBuffer, {
        contentType: 'image/webp',
        metadata: {
          cacheControl: 'public, max-age=31536000, immutable',
          contentDisposition: 'inline',
        },
        resumable: false,
      });
      thumbPublicUrl = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/${thumbGcsPath}`;
    }

    return {
      url: publicUrl,
      thumbUrl: thumbPublicUrl,
    };
  }

  if (IS_PRODUCTION) {
    throw new Error('ILLEGAL WRITE: Cannot write files locally in production mode.');
  }

  // Local development fallback
  let targetPath = path.join(UPLOADS_DIR, cleanFilename);
  let counter = 1;
  let finalFilename = cleanFilename;
  while (fs.existsSync(targetPath)) {
    const ext = path.extname(cleanFilename);
    const nameOnly = path.basename(cleanFilename, ext);
    finalFilename = `${nameOnly}-${counter}${ext}`;
    targetPath = path.join(UPLOADS_DIR, finalFilename);
    counter++;
  }

  fs.writeFileSync(targetPath, imageBuffer);

  let thumbUrl = `/uploads/${finalFilename}`;
  if (thumbBuffer) {
    const thumbPath = path.join(THUMBS_DIR, finalFilename);
    fs.writeFileSync(thumbPath, thumbBuffer);
    thumbUrl = `/uploads/thumbs/${finalFilename}`;
  }

  return {
    url: `/uploads/${finalFilename}`,
    thumbUrl,
  };
}

/**
 * Delete a file and its thumbnail from GCS or local disk.
 */
export async function deleteStorageFile(url: string, thumbUrl?: string): Promise<void> {
  if (isCloudActive() && gcsBucket && url.includes('storage.googleapis.com')) {
    try {
      // Extract object path from GCS URL
      const bucketUrlPrefix = `https://storage.googleapis.com/${GCS_BUCKET_NAME}/`;
      if (url.startsWith(bucketUrlPrefix)) {
        const objectPath = url.substring(bucketUrlPrefix.length);
        const file = gcsBucket.file(objectPath);
        await file.delete({ ignoreNotFound: true });
        console.log(`[GCS] Successfully deleted ${objectPath}`);
      }

      if (thumbUrl && thumbUrl.startsWith(bucketUrlPrefix)) {
        const thumbObjectPath = thumbUrl.substring(bucketUrlPrefix.length);
        const thumbFile = gcsBucket.file(thumbObjectPath);
        await thumbFile.delete({ ignoreNotFound: true });
        console.log(`[GCS] Successfully deleted thumbnail ${thumbObjectPath}`);
      }
    } catch (err: any) {
      console.warn('[GCS] Delete file warning:', err.message);
    }
    return;
  }

  // Local development fallback
  if (url.startsWith('/uploads/')) {
    const fileName = path.basename(url);
    const fullPath = path.join(UPLOADS_DIR, fileName);
    if (fs.existsSync(fullPath)) {
      try { fs.unlinkSync(fullPath); } catch {}
    }
    const thumbPath = path.join(THUMBS_DIR, fileName);
    if (fs.existsSync(thumbPath)) {
      try { fs.unlinkSync(thumbPath); } catch {}
    }
  }
}

/**
 * Create a new image record.
 * In Cloud mode: executes a Firestore transaction to manage cover status and order index atomically.
 */
export async function createImageRecord(image: ManagedImage): Promise<ManagedImage> {
  if (isCloudActive() && firestoreClient) {
    const colRef = firestoreClient.collection(FIRESTORE_COLLECTION);
    const docRef = colRef.doc(image.id);

    await firestoreClient.runTransaction(async (transaction: Transaction) => {
      // If marked as cover, query all images in same section+targetId and unset isCover
      if (image.isCover) {
        const query = colRef
          .where('section', '==', image.section)
          .where('targetId', '==', image.targetId);
        const snapshot = await transaction.get(query);
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          transaction.update(doc.ref, { isCover: false });
        });
      }

      // Check existing count to verify order
      const orderQuery = colRef
        .where('section', '==', image.section)
        .where('targetId', '==', image.targetId);
      const orderSnapshot = await transaction.get(orderQuery);

      if (orderSnapshot.empty) {
        image.isCover = true;
        image.order = 1;
      } else {
        let maxOrder = 0;
        orderSnapshot.forEach((doc: QueryDocumentSnapshot) => {
          const d = doc.data() as ManagedImage;
          if ((d.order || 0) > maxOrder) maxOrder = d.order || 0;
        });
        if (!image.order || image.order <= maxOrder) {
          image.order = maxOrder + 1;
        }
      }

      transaction.set(docRef, image);
    });

    return image;
  }

  // Local development fallback
  const images = readLocalDb();
  if (image.isCover) {
    images.forEach((img) => {
      if (img.targetId === image.targetId && img.section === image.section) {
        img.isCover = false;
      }
    });
  }
  const targetImages = images.filter((img) => img.targetId === image.targetId && img.section === image.section);
  image.order = targetImages.length > 0 ? Math.max(...targetImages.map((i) => i.order || 0)) + 1 : 1;
  if (targetImages.length === 0) image.isCover = true;

  images.push(image);
  writeLocalDb(images);
  return image;
}

/**
 * Replace an existing image file and metadata.
 * Safely removes old file from GCS or local disk.
 */
export async function replaceImageRecord(
  id: string,
  newUrls: { url: string; thumbUrl: string; filename: string; sizeKb: number },
  metadata: { altText?: string; width?: number; height?: number; focalPoint?: { x: number; y: number } }
): Promise<ManagedImage> {
  if (isCloudActive() && firestoreClient) {
    const docRef = firestoreClient.collection(FIRESTORE_COLLECTION).doc(id);
    let updatedImage: ManagedImage | null = null;

    await firestoreClient.runTransaction(async (transaction: Transaction) => {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        throw new Error('Şəkil tapılmadı');
      }

      const existing = doc.data() as ManagedImage;
      const oldUrl = existing.url;
      const oldThumbUrl = existing.thumbUrl;

      const updates: Partial<ManagedImage> = {
        url: newUrls.url,
        thumbUrl: newUrls.thumbUrl,
        filename: newUrls.filename,
        sizeKb: newUrls.sizeKb,
        uploadedAt: new Date().toISOString(),
        ...(metadata.altText ? { altText: metadata.altText } : {}),
        ...(metadata.width ? { width: metadata.width } : {}),
        ...(metadata.height ? { height: metadata.height } : {}),
        ...(metadata.focalPoint ? { focalPoint: metadata.focalPoint } : {}),
      };

      transaction.update(docRef, updates);
      updatedImage = { ...existing, ...updates };

      // Safely delete old storage file if the URL changed and it is in cloud storage
      if (oldUrl && oldUrl !== newUrls.url) {
        deleteStorageFile(oldUrl, oldThumbUrl).catch((err) =>
          console.warn('[GCS] Error deleting old file during replace:', err)
        );
      }
    });

    if (!updatedImage) throw new Error('Şəkil əvəzlənərkən xəta baş verdi');
    return updatedImage;
  }

  // Local development fallback
  const images = readLocalDb();
  const existing = images.find((img) => img.id === id);
  if (!existing) throw new Error('Şəkil tapılmadı');

  const oldUrl = existing.url;
  const oldThumb = existing.thumbUrl;

  existing.url = newUrls.url;
  existing.thumbUrl = newUrls.thumbUrl;
  existing.filename = newUrls.filename;
  existing.sizeKb = newUrls.sizeKb;
  existing.uploadedAt = new Date().toISOString();
  if (metadata.altText) existing.altText = metadata.altText;
  if (metadata.width) existing.width = metadata.width;
  if (metadata.height) existing.height = metadata.height;
  if (metadata.focalPoint) existing.focalPoint = metadata.focalPoint;

  // Clean up old local file if different
  if (oldUrl && oldUrl !== newUrls.url) {
    deleteStorageFile(oldUrl, oldThumb).catch(() => {});
  }

  writeLocalDb(images);
  return existing;
}

/**
 * Update metadata (altText, filename, focalPoint)
 */
export async function updateImageMetadata(
  id: string,
  updates: { altText?: string; filename?: string; focalPoint?: { x: number; y: number } }
): Promise<ManagedImage> {
  if (isCloudActive() && firestoreClient) {
    const docRef = firestoreClient.collection(FIRESTORE_COLLECTION).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error('Şəkil tapılmadı');

    const updateFields: any = {};
    if (typeof updates.altText === 'string') updateFields.altText = updates.altText.trim();
    if (typeof updates.filename === 'string' && updates.filename.trim()) updateFields.filename = updates.filename.trim();
    if (updates.focalPoint) updateFields.focalPoint = updates.focalPoint;

    await docRef.update(updateFields);
    const refreshed = await docRef.get();
    return refreshed.data() as ManagedImage;
  }

  // Local fallback
  const images = readLocalDb();
  const existing = images.find((img) => img.id === id);
  if (!existing) throw new Error('Şəkil tapılmadı');

  if (typeof updates.altText === 'string') existing.altText = updates.altText.trim();
  if (typeof updates.filename === 'string' && updates.filename.trim()) existing.filename = updates.filename.trim();
  if (updates.focalPoint) existing.focalPoint = updates.focalPoint;

  writeLocalDb(images);
  return existing;
}

/**
 * Set Cover image using a Firestore transaction to guarantee exactly one cover per section+targetId.
 */
export async function setCoverTransactional(id: string): Promise<void> {
  if (isCloudActive() && firestoreClient) {
    const colRef = firestoreClient.collection(FIRESTORE_COLLECTION);
    const targetDocRef = colRef.doc(id);

    await firestoreClient.runTransaction(async (transaction: Transaction) => {
      const targetDoc = await transaction.get(targetDocRef);
      if (!targetDoc.exists) {
        throw new Error('Şəkil tapılmadı');
      }

      const targetData = targetDoc.data() as ManagedImage;
      const query = colRef
        .where('section', '==', targetData.section)
        .where('targetId', '==', targetData.targetId);

      const snapshot = await transaction.get(query);
      snapshot.forEach((doc: QueryDocumentSnapshot) => {
        const isThisCover = doc.id === id;
        transaction.update(doc.ref, { isCover: isThisCover });
      });
    });
    return;
  }

  // Local fallback
  const images = readLocalDb();
  const targetImage = images.find((img) => img.id === id);
  if (!targetImage) throw new Error('Şəkil tapılmadı');

  images.forEach((img) => {
    if (img.targetId === targetImage.targetId && img.section === targetImage.section) {
      img.isCover = img.id === id;
    }
  });

  writeLocalDb(images);
}

/**
 * Reorder gallery images using a Firestore transaction.
 */
export async function reorderTransactional(ids: string[]): Promise<void> {
  if (isCloudActive() && firestoreClient) {
    const colRef = firestoreClient.collection(FIRESTORE_COLLECTION);

    await firestoreClient.runTransaction(async (transaction: Transaction) => {
      for (let i = 0; i < ids.length; i++) {
        const docRef = colRef.doc(ids[i]);
        transaction.update(docRef, { order: i + 1 });
      }
    });
    return;
  }

  // Local fallback
  const images = readLocalDb();
  ids.forEach((id: string, index: number) => {
    const item = images.find((img) => img.id === id);
    if (item) {
      item.order = index + 1;
    }
  });

  writeLocalDb(images);
}

/**
 * Delete image with Firestore transaction (promoting another image to cover if needed)
 * and deleting corresponding storage files safely.
 */
export async function deleteImageTransactional(id: string): Promise<{ success: boolean; id: string }> {
  if (isCloudActive() && firestoreClient) {
    const colRef = firestoreClient.collection(FIRESTORE_COLLECTION);
    const targetDocRef = colRef.doc(id);
    let fileToDelete: { url: string; thumbUrl?: string } | null = null;

    await firestoreClient.runTransaction(async (transaction: Transaction) => {
      const doc = await transaction.get(targetDocRef);
      if (!doc.exists) {
        throw new Error('Şəkil tapılmadı');
      }

      const imgData = doc.data() as ManagedImage;
      fileToDelete = { url: imgData.url, thumbUrl: imgData.thumbUrl };

      // If this was cover, promote another image
      if (imgData.isCover) {
        const query = colRef
          .where('section', '==', imgData.section)
          .where('targetId', '==', imgData.targetId);
        const snapshot = await transaction.get(query);
        const remaining: ManagedImage[] = [];
        snapshot.forEach((d: QueryDocumentSnapshot) => {
          if (d.id !== id) remaining.push(d.data() as ManagedImage);
        });

        if (remaining.length > 0) {
          remaining.sort((a, b) => (a.order || 0) - (b.order || 0));
          const newCoverRef = colRef.doc(remaining[0].id);
          transaction.update(newCoverRef, { isCover: true });
        }
      }

      transaction.delete(targetDocRef);
    });

    // Delete from GCS after Firestore transaction commits
    if (fileToDelete) {
      await deleteStorageFile((fileToDelete as any).url, (fileToDelete as any).thumbUrl);
    }

    return { success: true, id };
  }

  // Local fallback
  const images = readLocalDb();
  const index = images.findIndex((img) => img.id === id);
  if (index === -1) throw new Error('Şəkil tapılmadı');

  const [removed] = images.splice(index, 1);
  await deleteStorageFile(removed.url, removed.thumbUrl);

  if (removed.isCover) {
    const remaining = images.filter((img) => img.targetId === removed.targetId && img.section === removed.section);
    if (remaining.length > 0) {
      remaining[0].isCover = true;
    }
  }

  writeLocalDb(images);
  return { success: true, id };
}
