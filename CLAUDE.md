# Surfers Lab CR — Monorepo

Surf school web platform (surferlabscr.com) based in Playa Guiones, Nosara, Costa Rica. Bilingual (ES default / EN).

## Tech Stack

- **Monorepo:** pnpm 9 workspaces + Turborepo
- **Frontend (web):** React 19 + Vite 6 + Tailwind CSS v4 + React Router 7
- **Dashboard:** React 19 + Vite 6 + Tailwind CSS v4 (admin panel, same stack)
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Edge Functions + pg_cron)
- **Legacy API:** NestJS 10 in `apps/api/` — kept as reference, **no longer deployed**
- **Node:** >= 20

## Monorepo Structure

```
apps/
  web/          — Public website (Vercel, surferlabscr.com)
  dashboard/    — Admin panel (Vercel)
  api/          — Legacy NestJS API (NOT deployed, reference only)
packages/
  types/        — Shared TypeScript types (ServiceType, GalleryItem, Package, etc.)
  utils/        — Shared utilities (formatPrice, slugify, truncate, constants)
  supabase/     — Supabase client factory (createSupabaseClient, createSupabaseServerClient)
  ui/           — Placeholder for shared UI components (currently empty)
  tailwind-config/ — Shared Tailwind theme (ocean/mint/sand/coral/slate palette)
supabase/
  functions/    — 9 Deno Edge Functions (see supabase/CLAUDE.md)
  migrations/   — 6 SQL migrations (RLS, pg_cron, triggers)
```

## Commands

```bash
pnpm dev          # Start all apps in dev mode (turbo)
pnpm build        # Build all apps
pnpm lint         # Lint all apps
pnpm type-check   # Type-check all apps

# Single app
pnpm --filter @surf-app/web dev
pnpm --filter @surf-app/dashboard dev
```

## Key Architecture Decisions

1. **Supabase-native backend** — The NestJS API (`apps/api/`) was fully migrated to Supabase. Frontend apps talk directly to Supabase via `supabase-js`. Business logic lives in Edge Functions. `apps/api/` stays in the repo as reference but is not deployed.

2. **Auth** — Dashboard uses Supabase Auth (`signInWithPassword`). The `dashboard_users` table stores roles. An `is_admin()` PostgreSQL function checks auth.uid() against this table for RLS policies.

3. **Booking flow** — Create (public, Edge Function) -> email confirmation token (48h expiry) -> confirm via token (Edge Function) -> admin manages status (Edge Function) -> pg_cron expires unconfirmed bookings hourly -> trigger sends expiration emails via Edge Function.

4. **Email** — Resend API, called from Edge Functions. Templates are inline HTML in each function.

5. **Google integrations** — Google Places API for reviews (cached 24h), Google Calendar API for instructor availability (service account JWT auth). Both via Edge Functions.

6. **Storage** — Supabase Storage bucket `gallery` for gallery items, instructor photos, and hero image. Dashboard uploads directly via `supabase.storage.from('gallery').upload()`.

7. **Prerendering for social bots** — Vercel rewrite rule matches bot User-Agents and routes to `/api/prerender` serverless function that returns SSR HTML with correct OG meta tags per route.

## Database (10 tables)

| Table | Purpose |
|-------|---------|
| `gallery_items` | Gallery media (images/videos), filterable by category |
| `packages` | Surf packages with ES/EN names, prices |
| `instructors` | Instructor profiles (name, bio, photo, Google Calendar ID) |
| `instructor_reviews` | Client reviews of instructors (linked to booking) |
| `service_pricing_tiers` | Per-person pricing by service type and participant count |
| `site_settings` | Key-value config (hero_image_url, hero_image_position, etc.) |
| `clients` | Booking clients (name, email, phone, country, language) |
| `bookings` | Booking records (service, date, status, confirmation token) |
| `booking_instructors` | M2M join: bookings <-> instructors |
| `dashboard_users` | Admin users (email, password_hash, role: admin/superadmin) |

## Shared Types (`packages/types`)

- `ServiceType`: `'surf_lesson' | 'video_analysis' | 'surf_trip'`
- `MediaType`: `'image' | 'video'`
- `GalleryCategory`: `'lessons' | 'trips' | 'video_analysis' | 'general'`
- `UserRole`: `'superadmin' | 'admin'`
- Interfaces: `GalleryItem`, `Package`, `DashboardUser`, `AuthResponse`, `ApiResponse<T>`, `PaginatedResponse<T>`

## Environment Variables

**Frontend (VITE_ prefix, in each app's .env):**
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase project
- `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_EMAIL` — Contact info (web only)
- `VITE_SITE_URL`, `VITE_BRAND_NAME` — Site metadata (web only)

**Supabase Edge Function Secrets (set via Supabase Dashboard):**
- `RESEND_API_KEY`, `MAIL_FROM`, `STAFF_NOTIFY_EMAIL` — Email
- `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` — Google Reviews
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — Google Calendar
- `WEB_URL` — For email links back to the site

## Deployment

- **web** → Vercel (surferlabscr.com), static SPA + serverless functions (`api/prerender.ts`, `api/sitemap.xml.ts`)
- **dashboard** → Vercel (separate project)
- **Edge Functions** → Supabase (deployed via `supabase functions deploy`)
- **Database migrations** → Applied via Supabase Dashboard or CLI

## Performance Optimizations (applied)

- Non-blocking Google Fonts loading (media="print" + onload swap)
- Hero image preload (`<link rel="preload">`) pointing to WebP version in Supabase Storage
- Logo optimized from 827KB PNG to 1.3KB WebP for navbar
- Favicon optimized from 827KB to 931B
- Explicit `width`/`height` on all `<img>` tags to prevent CLS
- Vite `manualChunks`: Supabase SDK and framer-motion split into cacheable vendor chunks
- All images below the fold use `loading="lazy"` and `decoding="async"`
- PageSpeed Mobile: 75 Performance, 100 SEO, 95 Accessibility, 96 Best Practices
