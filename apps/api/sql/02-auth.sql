-- ============================================================
-- 02-auth.sql — Tabla de usuarios del dashboard
-- Ejecutar en Supabase > SQL Editor
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

-- ============================================================
-- NOTA: El bucket de Storage "gallery" debe crearse manualmente
-- en Supabase > Storage > New bucket
-- Nombre: gallery
-- Public: true
-- ============================================================

-- ============================================================
-- Crear el primer superadmin
-- Cambia el email y la contraseña antes de ejecutar
-- La extensión pgcrypto debe estar habilitada (lo está por defecto en Supabase)
-- ============================================================

-- INSERT INTO dashboard_users (email, password_hash, role, full_name)
-- VALUES (
--   'admin@surferlabscr.com',
--   crypt('CAMBIA-ESTA-PASSWORD', gen_salt('bf', 12)),
--   'superadmin',
--   'Super Admin'
-- );
