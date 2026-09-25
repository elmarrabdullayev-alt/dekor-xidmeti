-- ====================================================================
-- DreamArt Events - Supabase Postgres Schema for Admin Images
-- Target table: admin_images
-- Target storage bucket: dreamart-images (Public)
-- ====================================================================

-- 1. Create table admin_images
CREATE TABLE IF NOT EXISTS public.admin_images (
  id TEXT PRIMARY KEY,
  group_name TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_name TEXT DEFAULT '',
  storage_key TEXT NOT NULL,
  public_url TEXT NOT NULL,
  thumb_storage_key TEXT,
  thumb_public_url TEXT,
  alt_text TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_cover BOOLEAN NOT NULL DEFAULT false,
  width INTEGER,
  height INTEGER,
  size_kb INTEGER,
  format TEXT DEFAULT 'webp',
  focal_point JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for efficient lookup & ordering
CREATE INDEX IF NOT EXISTS idx_admin_images_group ON public.admin_images (group_name);
CREATE INDEX IF NOT EXISTS idx_admin_images_target ON public.admin_images (target_id);
CREATE INDEX IF NOT EXISTS idx_admin_images_order ON public.admin_images (group_name, target_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_admin_images_storage_key ON public.admin_images (storage_key);

-- 3. Storage Bucket Configuration (Run in Supabase SQL editor if needed)
-- Note: The application also attempts automatic bucket creation via Supabase API.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dreamart-images',
  'dreamart-images',
  true,
  15728640, -- 15MB limit
  ARRAY['image/webp', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 15728640,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png'];

-- 4. Public Access Policy for Storage Bucket Objects
CREATE POLICY "Public Access for dreamart-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'dreamart-images');
