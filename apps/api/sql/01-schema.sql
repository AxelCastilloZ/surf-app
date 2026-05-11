-- ============================================================
-- 01-schema.sql — Schema completo de la aplicación surf
-- Ejecutar en Supabase > SQL Editor
-- Orden de ejecución: este archivo primero, luego 02-auth.sql
-- ============================================================

-- ============================================================
-- EXTENSIONES
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid(), crypt()
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- búsquedas sin acentos (opcional)


-- ============================================================
-- FUNCIÓN TRIGGER: updated_at automático
-- Se reutiliza en todas las tablas que tienen updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- TABLA: dashboard_users
-- Usuarios del panel de administración (no son clientes)
-- Auth custom con bcrypt — NO usa Supabase Auth
-- ============================================================

CREATE TABLE IF NOT EXISTS dashboard_users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          TEXT        NOT NULL DEFAULT 'admin'
                            CHECK (role IN ('superadmin', 'admin')),
  full_name     TEXT        NOT NULL,
  is_active     BOOLEAN     NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dashboard_users_email
  ON dashboard_users (email);

CREATE OR REPLACE TRIGGER trg_dashboard_users_updated_at
  BEFORE UPDATE ON dashboard_users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: solo el service role (API backend) puede leer/escribir
ALTER TABLE dashboard_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dashboard_users: solo service role"
  ON dashboard_users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLA: packages
-- Paquetes de surf disponibles para el público
-- ============================================================

CREATE TABLE IF NOT EXISTS packages (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT        NOT NULL,              -- nombre en español
  name_en        TEXT        NOT NULL,              -- nombre en inglés
  description    TEXT        NOT NULL DEFAULT '',
  description_en TEXT        NOT NULL DEFAULT '',
  price          NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency       TEXT        NOT NULL DEFAULT 'USD',
  image_url      TEXT,
  is_active      BOOLEAN     NOT NULL DEFAULT true,
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_is_active
  ON packages (is_active);

CREATE INDEX IF NOT EXISTS idx_packages_sort_order
  ON packages (sort_order ASC);

CREATE OR REPLACE TRIGGER trg_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Público: puede leer paquetes activos
CREATE POLICY "packages: lectura pública de activos"
  ON packages
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admin (service role): acceso total
CREATE POLICY "packages: acceso total service role"
  ON packages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLA: gallery_items
-- Imágenes y videos de la galería pública
-- Archivos almacenados en Supabase Storage, bucket "gallery"
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery_items (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  url          TEXT        NOT NULL,
  storage_path TEXT,                               -- ruta en bucket 'gallery' para delete
  media_type   TEXT        NOT NULL DEFAULT 'image'
                           CHECK (media_type IN ('image', 'video')),
  category     TEXT        NOT NULL DEFAULT 'general'
                           CHECK (category IN ('lessons', 'trips', 'video_analysis', 'general')),
  alt_text     TEXT,                               -- descripción en español
  alt_text_en  TEXT,                               -- descripción en inglés
  is_visible   BOOLEAN     NOT NULL DEFAULT true,
  sort_order   INTEGER     NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Para deployments existentes: agrega la columna si no existe
-- ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS storage_path TEXT;

CREATE INDEX IF NOT EXISTS idx_gallery_items_is_visible
  ON gallery_items (is_visible);

CREATE INDEX IF NOT EXISTS idx_gallery_items_category
  ON gallery_items (category);

CREATE INDEX IF NOT EXISTS idx_gallery_items_sort_order
  ON gallery_items (sort_order ASC);

CREATE OR REPLACE TRIGGER trg_gallery_items_updated_at
  BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

-- Público: puede leer items visibles
CREATE POLICY "gallery_items: lectura pública de visibles"
  ON gallery_items
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

-- Admin (service role): acceso total
CREATE POLICY "gallery_items: acceso total service role"
  ON gallery_items
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLA: clients
-- Clientes que realizan reservas (no son usuarios del dashboard)
-- Se crean automáticamente al recibir una reserva
-- ============================================================

CREATE TABLE IF NOT EXISTS clients (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name    TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  phone        TEXT,
  country      TEXT,                              -- código ISO 3166-1 alpha-2 (ej. 'CR', 'US')
  language     TEXT        NOT NULL DEFAULT 'es'
                           CHECK (language IN ('es', 'en')),
  notes        TEXT,                              -- notas internas del admin
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No unique en email: un mismo cliente puede reservar varias veces
-- con el mismo email sin que lo forcemos a "crear cuenta"
CREATE INDEX IF NOT EXISTS idx_clients_email
  ON clients (email);

CREATE INDEX IF NOT EXISTS idx_clients_created_at
  ON clients (created_at DESC);

CREATE OR REPLACE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: solo el backend (service role) accede a datos de clientes
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients: solo service role"
  ON clients
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLA: bookings
-- Reservas de clientes para paquetes o servicios individuales
-- ============================================================

CREATE TABLE IF NOT EXISTS bookings (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relaciones
  client_id        UUID        NOT NULL REFERENCES clients (id) ON DELETE RESTRICT,
  package_id       UUID        REFERENCES packages (id) ON DELETE SET NULL,

  -- Tipo de servicio (de los tipos en packages/types)
  service_type     TEXT        NOT NULL
                               CHECK (service_type IN ('surf_lesson', 'video_analysis', 'surf_trip')),

  -- Fecha y hora de la actividad
  booking_date     DATE        NOT NULL,
  start_time       TIME        NOT NULL,
  end_time         TIME,

  -- Participantes
  participants     INTEGER     NOT NULL DEFAULT 1 CHECK (participants >= 1),

  -- Estado de la reserva
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),

  -- Precio capturado al momento de la reserva (no cambia si el paquete cambia)
  total_price      NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
  currency         TEXT        NOT NULL DEFAULT 'USD',

  -- Información adicional
  notes            TEXT,                          -- notas del cliente al reservar
  internal_notes   TEXT,                          -- notas internas del admin
  cancelled_reason TEXT,                          -- motivo de cancelación si aplica

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_client_id
  ON bookings (client_id);

CREATE INDEX IF NOT EXISTS idx_bookings_package_id
  ON bookings (package_id);

CREATE INDEX IF NOT EXISTS idx_bookings_booking_date
  ON bookings (booking_date DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings (status);

-- Índice compuesto para consultas frecuentes del dashboard: fecha + estado
CREATE INDEX IF NOT EXISTS idx_bookings_date_status
  ON bookings (booking_date DESC, status);

CREATE OR REPLACE TRIGGER trg_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: solo el backend accede
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookings: solo service role"
  ON bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- TABLA: availability
-- Define los slots de disponibilidad por servicio y fecha
-- El admin gestiona qué días/horarios están disponibles
-- ============================================================

CREATE TABLE IF NOT EXISTS availability (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tipo de servicio al que aplica este slot
  service_type     TEXT        NOT NULL
                               CHECK (service_type IN ('surf_lesson', 'video_analysis', 'surf_trip')),

  -- Fecha y horario del slot
  available_date   DATE        NOT NULL,
  start_time       TIME        NOT NULL,
  end_time         TIME        NOT NULL,

  -- Cupos
  max_participants  INTEGER    NOT NULL DEFAULT 6  CHECK (max_participants >= 1),

  -- Calculado externamente o actualizado por trigger/función
  -- No lo calculamos con subquery en cada read para performance
  booked_count      INTEGER    NOT NULL DEFAULT 0  CHECK (booked_count >= 0),

  -- Permite bloquear manualmente un slot aunque tenga cupos
  is_blocked        BOOLEAN    NOT NULL DEFAULT false,

  -- Notas para el admin (ej. "viento fuerte", "mareas bajas")
  notes             TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- No pueden existir dos slots del mismo servicio a la misma hora el mismo día
  CONSTRAINT availability_unique_slot
    UNIQUE (service_type, available_date, start_time)
);

CREATE INDEX IF NOT EXISTS idx_availability_date
  ON availability (available_date DESC);

CREATE INDEX IF NOT EXISTS idx_availability_service_date
  ON availability (service_type, available_date);

-- Índice parcial: slots disponibles (no bloqueados, con cupos libres)
CREATE INDEX IF NOT EXISTS idx_availability_open_slots
  ON availability (available_date, service_type)
  WHERE is_blocked = false;

CREATE OR REPLACE TRIGGER trg_availability_updated_at
  BEFORE UPDATE ON availability
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Público: puede consultar disponibilidad no bloqueada
CREATE POLICY "availability: lectura pública"
  ON availability
  FOR SELECT
  TO anon, authenticated
  USING (is_blocked = false);

-- Admin (service role): acceso total
CREATE POLICY "availability: acceso total service role"
  ON availability
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);


-- ============================================================
-- FUNCIÓN: actualizar booked_count en availability
-- Se ejecuta automáticamente cuando una booking cambia de estado
-- ============================================================

CREATE OR REPLACE FUNCTION sync_booked_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo sincroniza si la fecha y service_type del booking coinciden con un slot
  UPDATE availability
  SET booked_count = (
    SELECT COALESCE(SUM(b.participants), 0)
    FROM bookings b
    WHERE b.booking_date  = COALESCE(NEW.booking_date, OLD.booking_date)
      AND b.service_type  = COALESCE(NEW.service_type, OLD.service_type)
      AND b.status        NOT IN ('cancelled')
      AND b.start_time    = availability.start_time
  )
  WHERE available_date = COALESCE(NEW.booking_date, OLD.booking_date)
    AND service_type   = COALESCE(NEW.service_type, OLD.service_type);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_sync_booked_count
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION sync_booked_count();


-- ============================================================
-- VISTA: available_slots
-- Slots con cupos disponibles, útil para el widget de reservas
-- ============================================================

CREATE OR REPLACE VIEW available_slots AS
SELECT
  a.id,
  a.service_type,
  a.available_date,
  a.start_time,
  a.end_time,
  a.max_participants,
  a.booked_count,
  (a.max_participants - a.booked_count) AS spots_left,
  a.notes
FROM availability a
WHERE a.is_blocked = false
  AND a.available_date >= CURRENT_DATE
  AND a.booked_count < a.max_participants
ORDER BY a.available_date ASC, a.start_time ASC;


-- ============================================================
-- STORAGE: instrucciones para el bucket "gallery"
-- Ejecutar manualmente en Supabase > Storage > New bucket
-- ============================================================
-- Nombre del bucket : gallery
-- Public            : true (las URLs son públicas sin signed URLs)
-- Allowed MIME types: image/jpeg, image/png, image/webp, video/mp4
-- Max file size     : 10 MB para imágenes, 100 MB para videos

-- Policy de Storage (ejecutar en SQL Editor):
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('gallery', 'gallery', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "gallery: lectura pública"
--   ON storage.objects
--   FOR SELECT
--   TO anon
--   USING (bucket_id = 'gallery');
--
-- CREATE POLICY "gallery: solo service role puede subir"
--   ON storage.objects
--   FOR INSERT
--   TO service_role
--   WITH CHECK (bucket_id = 'gallery');
--
-- CREATE POLICY "gallery: solo service role puede eliminar"
--   ON storage.objects
--   FOR DELETE
--   TO service_role
--   USING (bucket_id = 'gallery');


-- ============================================================
-- SEED INICIAL: primer superadmin
-- Descomentar, cambiar email y password, y ejecutar UNA vez
-- Requiere: extensión pgcrypto habilitada (default en Supabase)
-- IMPORTANTE: bcrypt de pgcrypto y bcrypt de Node.js son compatibles
-- ============================================================

-- INSERT INTO dashboard_users (email, password_hash, role, full_name)
-- VALUES (
--   'admin@surferlabscr.com',
--   crypt('CAMBIA-ESTA-PASSWORD', gen_salt('bf', 12)),
--   'superadmin',
--   'Super Admin'
-- )
-- ON CONFLICT (email) DO NOTHING;
