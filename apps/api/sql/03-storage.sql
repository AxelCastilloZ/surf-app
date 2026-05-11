-- ============================================================
-- 03-storage.sql — Políticas de Storage y columna storage_path
-- Bucket "gallery" creado manualmente en Supabase en Mayo 2026
-- como bucket público (public: true).
-- ============================================================


-- ============================================================
-- STORAGE POLICIES — bucket "gallery"
-- Ejecutar en Supabase > SQL Editor
-- ============================================================

-- 1. Lectura pública (anon puede ver cualquier objeto del bucket)
CREATE POLICY "gallery: lectura pública"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'gallery');

-- 2. Upload: solo el service role (API backend con SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "gallery: solo service role puede subir"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'gallery');

-- 3. Reemplazar archivo existente (upsert): solo service role
CREATE POLICY "gallery: solo service role puede actualizar"
  ON storage.objects
  FOR UPDATE
  TO service_role
  USING (bucket_id = 'gallery');

-- 4. Eliminar: solo service role
CREATE POLICY "gallery: solo service role puede eliminar"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'gallery');


-- ============================================================
-- ALTER TABLE gallery_items — columna storage_path
-- Necesario si la tabla fue creada antes de 01-schema.sql v2
-- (deployments anteriores a Mayo 2026)
-- Si ejecutaste 01-schema.sql desde cero, la columna ya existe.
-- ============================================================

ALTER TABLE gallery_items
  ADD COLUMN IF NOT EXISTS storage_path TEXT;


-- ============================================================
-- ÍNDICE sobre storage_path
-- Útil para el DELETE: busca por storage_path al eliminar
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_gallery_items_storage_path
  ON gallery_items (storage_path)
  WHERE storage_path IS NOT NULL;


-- ============================================================
-- INSTRUCCIONES DE EJECUCIÓN
-- ============================================================
-- Orden recomendado (si no se ha ejecutado antes):
--   1. 01-schema.sql   → crea todas las tablas, triggers, vistas
--   2. 02-auth.sql     → seed del primer superadmin (opcional)
--   3. 03-storage.sql  → este archivo
--
-- Si la tabla gallery_items ya existe sin storage_path:
--   → Solo ejecutar el ALTER TABLE de arriba (ver nota abajo)
--
-- Si gallery_items fue creada con 01-schema.sql actualizado:
--   → El ALTER TABLE es idempotente (ADD COLUMN IF NOT EXISTS),
--     se puede ejecutar igualmente sin riesgo.
-- ============================================================
