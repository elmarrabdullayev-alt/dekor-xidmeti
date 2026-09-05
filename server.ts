import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { ManagedImage, ImageSection } from './src/types';
import {
  initCloudServices,
  isCloudActive,
  getStorageMode,
  getAllImages,
  saveImageFile,
  createImageRecord,
  replaceImageRecord,
  updateImageMetadata,
  setCoverTransactional,
  reorderTransactional,
  deleteImageTransactional,
} from './server/cloudService';

dotenv.config();

const PORT = 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dreamart_secret_session_key_2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dreamart2026';

// Initialize Cloud Services (Cloud Storage + Firestore)
// In production mode, this enforces GCS_BUCKET_NAME and fails fast if missing.
const cloudConfig = initCloudServices();

// Auth token utilities
function createAuthToken(): string {
  const nonce = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now().toString();
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(`${nonce}:${timestamp}`).digest('hex');
  return `${nonce}.${timestamp}.${sig}`;
}

function verifyAuthToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [nonce, timestamp, sig] = parts;
  const age = Date.now() - parseInt(timestamp, 10);
  // Valid for 7 days
  if (isNaN(age) || age > 7 * 24 * 60 * 60 * 1000 || age < 0) return false;
  const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(`${nonce}:${timestamp}`).digest('hex');
  return sig === expectedSig;
}

// Auth middleware for protected admin endpoints
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const customToken = req.headers['x-admin-token'] as string;
  const token = headerToken || customToken;

  if (!token || !verifyAuthToken(token)) {
    return res.status(401).json({ error: 'İcazəsiz müraciət. Zəhmət olmasa daxil olun.' });
  }
  next();
}

// Filename sanitizer helper
function sanitizeFileName(name: string, targetId: string): string {
  let clean = name
    .toLowerCase()
    .replace(/[^a-z0-9\-_.]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!clean.endsWith('.webp')) {
    clean = clean.replace(/\.[^/.]+$/, '') + '.webp';
  }
  if (!clean || clean === '.webp') {
    clean = `dreamart-${targetId || 'img'}-${Date.now()}.webp`;
  }
  return clean;
}

async function startServer() {
  const app = express();

  // Allow high-res WebP image payloads up to 25MB
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Static uploads directory (only used for local development fallback)
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', express.static(uploadsDir));

  // 1. Health check & Cloud Storage status
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      storageMode: getStorageMode(),
      cloudActive: isCloudActive(),
      bucket: cloudConfig.bucketName || null,
      project: cloudConfig.projectId || null,
    });
  });

  // 2. Admin Auth API
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Şifrə daxil edilməlidir' });
    }

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Daxil edilən şifrə yanlışdır' });
    }

    const token = createAuthToken();
    return res.json({ success: true, token, user: 'admin' });
  });

  app.get('/api/admin/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    if (!token || !verifyAuthToken(token)) {
      return res.status(401).json({ authenticated: false });
    }
    return res.json({ authenticated: true });
  });

  app.post('/api/admin/logout', (_req, res) => {
    return res.json({ success: true });
  });

  // 3. Public Images API (reads from Firestore in cloud mode)
  app.get('/api/images', async (_req, res) => {
    try {
      const images = await getAllImages();
      res.json(images);
    } catch (err: any) {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: 'Şəkilləri oxuyarkən xəta baş verdi' });
    }
  });

  // 4. Protected: Upload new image (stores in GCS & Firestore in cloud mode)
  app.post('/api/images/upload', requireAdminAuth, async (req, res) => {
    try {
      const {
        section,
        targetId,
        targetName,
        filename,
        altText,
        isCover,
        imageBase64,
        thumbBase64,
        width,
        height,
        focalPoint,
      } = req.body;

      if (!section || !targetId || !imageBase64) {
        return res.status(400).json({ error: 'Bütün vacib parametrlər (section, targetId, imageBase64) tələb olunur.' });
      }

      // Extract base64 buffer
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      let thumbBuffer: Buffer | undefined = undefined;
      if (thumbBase64) {
        const thumbData = thumbBase64.replace(/^data:image\/\w+;base64,/, '');
        thumbBuffer = Buffer.from(thumbData, 'base64');
      }

      // Sanitize filename
      const cleanFilename = sanitizeFileName(filename || `dreamart-${targetId}`, targetId);

      // Save file to GCS (production) or local disk (dev fallback)
      const { url, thumbUrl } = await saveImageFile(cleanFilename, imageBuffer, thumbBuffer);

      const newImage: ManagedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        url,
        thumbUrl,
        filename: cleanFilename,
        altText: altText || `DreamArt Events ${targetName || ''}`,
        section: section as ImageSection,
        targetId,
        targetName: targetName || targetId,
        isCover: Boolean(isCover),
        order: 1, // Will be computed inside transactional record creation
        width: width || undefined,
        height: height || undefined,
        focalPoint: focalPoint || undefined,
        sizeKb: Math.round(imageBuffer.length / 1024),
        format: 'webp',
        uploadedAt: new Date().toISOString(),
      };

      const created = await createImageRecord(newImage);
      return res.status(201).json(created);
    } catch (err: any) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Şəkil saxlanılarkən xəta baş verdi: ' + (err.message || '') });
    }
  });

  // 5. Protected: Replace existing image (updates GCS and Firestore)
  app.post('/api/images/:id/replace', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { imageBase64, thumbBase64, filename, altText, width, height, focalPoint } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Yeni şəkil faylı tələb olunur.' });
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      let thumbBuffer: Buffer | undefined = undefined;
      if (thumbBase64) {
        const thumbData = thumbBase64.replace(/^data:image\/\w+;base64,/, '');
        thumbBuffer = Buffer.from(thumbData, 'base64');
      }

      const cleanFilename = sanitizeFileName(filename || `dreamart-replace-${Date.now()}`, 'replace');
      const { url, thumbUrl } = await saveImageFile(cleanFilename, imageBuffer, thumbBuffer);

      const updated = await replaceImageRecord(
        id,
        {
          url,
          thumbUrl,
          filename: cleanFilename,
          sizeKb: Math.round(imageBuffer.length / 1024),
        },
        { altText, width, height, focalPoint }
      );

      return res.json(updated);
    } catch (err: any) {
      console.error('Replace error:', err);
      return res.status(500).json({ error: 'Şəkil əvəzlənərkən xəta baş verdi: ' + (err.message || '') });
    }
  });

  // 6. Protected: Update image metadata (altText, filename, focalPoint)
  app.put('/api/images/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { altText, filename, focalPoint } = req.body;

      const updated = await updateImageMetadata(id, { altText, filename, focalPoint });
      return res.json(updated);
    } catch (err: any) {
      console.error('Metadata update error:', err);
      return res.status(500).json({ error: 'Yenilənmə xətası: ' + (err.message || '') });
    }
  });

  // 7. Protected: Set image as Cover (Firestore transactional guarantee)
  app.post('/api/images/:id/cover', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await setCoverTransactional(id);
      return res.json({ success: true, coverId: id });
    } catch (err: any) {
      console.error('Cover update error:', err);
      return res.status(500).json({ error: 'Qapaq şəkli təyin edilərkən xəta: ' + (err.message || '') });
    }
  });

  // 8. Protected: Reorder gallery images (Firestore transactional batch)
  app.post('/api/images/reorder', requireAdminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Şəkil ID-ləri massiv şəklində göndərilməlidir.' });
      }

      await reorderTransactional(ids);
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Reorder error:', err);
      return res.status(500).json({ error: 'Sıralama xətası: ' + (err.message || '') });
    }
  });

  // 9. Protected: Delete image (Firestore transaction + GCS cleanup)
  app.delete('/api/images/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteImageTransactional(id);
      return res.json(result);
    } catch (err: any) {
      console.error('Delete error:', err);
      return res.status(500).json({ error: 'Silinmə zamanı xəta baş verdi: ' + (err.message || '') });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DreamArt Events Server running on port ${PORT}`);
  });
}

startServer();
