import express, { type Request, type Response, type NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import sharp from 'sharp';
import { createServer as createViteServer } from 'vite';
import {
  PERSISTENT_DATA_DIR,
  UPLOADS_DIR,
  IMAGES_DB_FILE,
  getAllStoredImages,
  uploadImageRecord,
  replaceImageRecord,
  updateImageMetaRecord,
  setCoverRecord,
  reorderImagesRecord,
  deleteImageRecord,
} from './server/persistentDiskService.ts';
import { resolveRouteSeo, injectHeadSeo } from './server/seoRouteResolver.ts';
import {
  isSupabaseConfigured,
  SUPABASE_STORAGE_BUCKET,
  ADMIN_IMAGES_TABLE,
} from './server/supabaseService.ts';
import { runSupabaseMigration } from './server/migrateToSupabase.ts';

dotenv.config();

const PORT = 3000;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dreamart2026';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dreamart-dev-session-key-strictly-dev-only-2026';

// Safe environment logging
if (IS_PRODUCTION) {
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('[NOTICE] ADMIN_PASSWORD environment variable not set. Using default credentials.');
  }
  if (!process.env.SESSION_SECRET) {
    console.warn('[NOTICE] SESSION_SECRET environment variable not set. Using fallback secret.');
  }
}

// Active session revocation store for immediate session invalidation on logout
const revokedSessions = new Set<string>();

function createSession(): string {
  const sessionId = crypto.randomBytes(24).toString('hex');
  const timestamp = Date.now().toString();
  const secret = SESSION_SECRET || 'dreamart-dev-session-key-strictly-dev-only-2026';
  const sig = crypto.createHmac('sha256', secret).update(`${sessionId}:${timestamp}`).digest('hex');
  return `${sessionId}.${timestamp}.${sig}`;
}

function verifySession(token: string | undefined | null): boolean {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [sessionId, timestamp, sig] = parts;
  const age = Date.now() - parseInt(timestamp, 10);
  // Valid for 7 days
  if (isNaN(age) || age > 7 * 24 * 60 * 60 * 1000 || age < 0) return false;
  const secret = SESSION_SECRET || 'dreamart-dev-session-key-strictly-dev-only-2026';
  const expectedSig = crypto.createHmac('sha256', secret).update(`${sessionId}:${timestamp}`).digest('hex');
  if (sig !== expectedSig) return false;
  return !revokedSessions.has(sessionId);
}

function invalidateSession(token: string | undefined | null): void {
  if (!token || typeof token !== 'string') return;
  const parts = token.split('.');
  if (parts.length >= 1) {
    revokedSessions.add(parts[0]);
  }
}

// Cookie configuration:
// - Google AI Studio preview: served in cross-site iframe over HTTPS -> requires SameSite=None, Secure, Partitioned
// - Production (Render): served as top-level first-party application -> requires SameSite=Lax, Secure
function getSessionCookieOptions(): express.CookieOptions {
  if (IS_PRODUCTION) {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
  }
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    partitioned: true,
  };
}

function getClearCookieOptions(): express.CookieOptions {
  if (IS_PRODUCTION) {
    return {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    };
  }
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
    partitioned: true,
  };
}

// Auth middleware for protected admin endpoints: checks httpOnly cookie
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.dreamart_admin_session;
  const hasCookieHeader = Boolean(req.headers.cookie);
  const hasSessionCookie = Boolean(cookieToken);
  const isValid = Boolean(cookieToken && verifySession(cookieToken));

  console.log(`[Auth Debug] requireAdminAuth -> ${req.method} ${req.path} | hasCookieHeader: ${hasCookieHeader} | hasSessionCookie: ${hasSessionCookie} | authorized: ${isValid}`);

  if (!isValid) {
    return res.status(401).json({ error: 'İcazəsiz müraciət. Zəhmət olmasa daxil olun.' });
  }
  next();
}

async function startServer() {
  const app = express();

  // Recognize proxy headers from Cloud Run and Render load balancers
  app.set('trust proxy', 1);

  // CORS Middleware for cross-origin or iframe requests with credentials
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With');
    }
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(cookieParser());
  // Allow high-res uploads up to 15MB in JSON body parser (10MB limit enforced on raw file)
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // 11. Public Image Delivery: Expose only persistent uploads directory with 1-year cache
  app.use(
    '/uploads',
    express.static(UPLOADS_DIR, {
      maxAge: '1y',
      immutable: true,
    })
  );

  // Health check
  app.get('/api/health', (_req, res) => {
    const dbOk = fs.existsSync(IMAGES_DB_FILE);
    const uploadsOk = fs.existsSync(UPLOADS_DIR);
    let sharpAvailable = false;
    try {
      sharpAvailable = typeof sharp === 'function';
    } catch {}

    const isSupabase = isSupabaseConfigured();

    res.json({
      status: 'ok',
      serverTime: new Date().toISOString(),
      storageMode: isSupabase ? 'supabase_storage' : (IS_PRODUCTION ? 'render_persistent_disk' : 'dev_persistent_disk'),
      supabaseConnected: isSupabase,
      storageBucket: SUPABASE_STORAGE_BUCKET,
      databaseTable: ADMIN_IMAGES_TABLE,
      dualReadFallbackActive: true,
      persistentDataDirConfigured: Boolean(process.env.PERSISTENT_DATA_DIR),
      imagesDbAccessible: dbOk,
      uploadsDirAccessible: uploadsOk,
      sharpAvailable,
      oldStoragePreserved: true,
    });
  });

  // Admin Login: issues secure httpOnly cookie (no token in JSON body)
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body || {};
    if (!password || typeof password !== 'string') {
      console.log('[Auth Debug] login -> 400 missing password');
      return res.status(400).json({ error: 'Şifrə daxil edilməlidir' });
    }

    const expected = ADMIN_PASSWORD;
    const isMatch = (expected && password === expected) || (!IS_PRODUCTION && password === 'dreamart2026');
    if (!isMatch) {
      console.log('[Auth Debug] login -> 401 incorrect password');
      return res.status(401).json({ error: 'Daxil edilən şifrə yanlışdır' });
    }

    const token = createSession();
    res.cookie('dreamart_admin_session', token, getSessionCookieOptions());

    console.log('[Auth Debug] login -> 200 success (Set-Cookie issued)');
    return res.json({ success: true, authenticated: true });
  });

  // Admin Session Verify (uses httpOnly cookie)
  app.get('/api/admin/verify', (req, res) => {
    const cookieToken = req.cookies?.dreamart_admin_session;
    const isValid = Boolean(cookieToken && verifySession(cookieToken));
    console.log(`[Auth Debug] verify -> hasSessionCookie: ${Boolean(cookieToken)} | valid: ${isValid}`);
    if (!isValid) {
      return res.status(401).json({ authenticated: false });
    }
    return res.json({ authenticated: true });
  });

  // Admin Logout: immediately invalidates session and clears cookie
  app.post('/api/admin/logout', (req, res) => {
    const cookieToken = req.cookies?.dreamart_admin_session;
    console.log(`[Auth Debug] logout -> hadSessionCookie: ${Boolean(cookieToken)}`);
    invalidateSession(cookieToken);
    res.clearCookie('dreamart_admin_session', getClearCookieOptions());
    return res.json({ success: true });
  });

  // Protected: Safe Idempotent Migration to Supabase
  app.post('/api/admin/migrate-to-supabase', requireAdminAuth, async (_req, res) => {
    try {
      console.log('[Migration] Triggering safe migration from persistent storage to Supabase...');
      const result = await runSupabaseMigration();
      return res.json(result);
    } catch (err: any) {
      console.error('[Migration Error]:', err);
      return res.status(500).json({ error: err.message || 'Miqrasiya zamanı xəta baş verdi' });
    }
  });

  // Public Images API: reads from persistent images.json
  app.get('/api/images', async (_req, res) => {
    try {
      const images = await getAllStoredImages();
      res.json(images);
    } catch (err: any) {
      console.error('Error fetching images:', err);
      res.status(500).json({ error: 'Şəkilləri oxuyarkən xəta baş verdi' });
    }
  });

  // Protected: Upload new image (validated and processed by Sharp)
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
        focalPoint,
      } = req.body;

      if (!section || !targetId || !imageBase64) {
        return res.status(400).json({ error: 'Bütün vacib parametrlər (section, targetId, imageBase64) tələb olunur.' });
      }

      // Extract raw buffer from base64
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const rawBuffer = Buffer.from(base64Data, 'base64');

      // Check upload limit: 10MB raw (return 413 if oversized)
      if (rawBuffer.length > 10 * 1024 * 1024) {
        return res.status(413).json({ error: 'Şəkil ölçüsü 10MB-dan çox ola bilməz (HTTP 413).' });
      }

      const created = await uploadImageRecord({
        rawBuffer,
        section,
        targetId,
        targetName,
        filenameHint: filename,
        altText,
        isCover,
        focalPoint,
      });

      return res.status(201).json(created);
    } catch (err: any) {
      console.error('Upload error:', err);
      const statusCode = err.status || 500;
      return res.status(statusCode).json({ error: err.message || 'Şəkil saxlanılarkən xəta baş verdi' });
    }
  });

  // Protected: Replace existing image (processed by Sharp, old file cleaned up)
  app.post('/api/images/:id/replace', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[Auth Debug] replace image -> target id: ${id} | authorized: true`);
      const { imageBase64, altText, focalPoint } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Yeni şəkil faylı tələb olunur.' });
      }

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const rawBuffer = Buffer.from(base64Data, 'base64');

      if (rawBuffer.length > 10 * 1024 * 1024) {
        return res.status(413).json({ error: 'Şəkil ölçüsü 10MB-dan çox ola bilməz (HTTP 413).' });
      }

      const updated = await replaceImageRecord(id, rawBuffer, { altText, focalPoint });
      return res.json(updated);
    } catch (err: any) {
      console.error('Replace error:', err);
      const statusCode = err.status || 500;
      return res.status(statusCode).json({ error: err.message || 'Şəkil əvəzlənərkən xəta baş verdi' });
    }
  });

  // Protected: Update image metadata
  app.put('/api/images/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { altText, filename, focalPoint } = req.body;

      const updated = await updateImageMetaRecord(id, { altText, filename, focalPoint });
      return res.json(updated);
    } catch (err: any) {
      console.error('Metadata update error:', err);
      const statusCode = err.status || 500;
      return res.status(statusCode).json({ error: err.message || 'Yenilənmə xətası' });
    }
  });

  // Protected: Set Cover image (normalized and atomic)
  app.post('/api/images/:id/cover', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await setCoverRecord(id);
      return res.json({ success: true, coverId: id });
    } catch (err: any) {
      console.error('Cover update error:', err);
      const statusCode = err.status || 500;
      return res.status(statusCode).json({ error: err.message || 'Qapaq şəkli təyin edilərkən xəta' });
    }
  });

  // Protected: Reorder gallery images (normalized: 0, 1, 2, 3...)
  app.post('/api/images/reorder', requireAdminAuth, async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Şəkil ID-ləri massiv şəklində göndərilməlidir.' });
      }

      await reorderImagesRecord(ids);
      return res.json({ success: true });
    } catch (err: any) {
      console.error('Reorder error:', err);
      const statusCode = err.status || 500;
      return res.status(statusCode).json({ error: err.message || 'Sıralama xətası' });
    }
  });

  // Protected: Delete image (cleans up files, normalizes orders, promotes cover if needed)
  app.delete('/api/images/:id', requireAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await deleteImageRecord(id);
      return res.json(result);
    } catch (err: any) {
      console.error('Delete error:', err);
      const statusCode = err.status || 500;
      return res.status(statusCode).json({ error: err.message || 'Silinmə zamanı xəta baş verdi' });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const seoData = resolveRouteSeo(url);
        const html = injectHeadSeo(template, seoData);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) return next();
      try {
        const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const seoData = resolveRouteSeo(url);
        const html = injectHeadSeo(template, seoData);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e) {
        next(e);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DreamArt Events Server running on port ${PORT}`);
    console.log(`[Storage] Mode: ${IS_PRODUCTION ? 'Render Persistent Disk' : 'Development Persistent Disk'}`);
    console.log(`[Storage] Path: ${PERSISTENT_DATA_DIR}`);
  });
}

startServer();
