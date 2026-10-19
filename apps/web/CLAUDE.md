# apps/web — Public Website

Public-facing website for Surfers Lab CR. Deployed to Vercel at surferlabscr.com.

## Stack

React 19 + Vite 6 + Tailwind CSS v4 + React Router 7 + TanStack Query + Zustand + framer-motion

## Routes (all lazy-loaded via `React.lazy`)

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` (lang="es") | Homepage: hero, instructors, services, packages, about, testimonials, gallery preview, contact |
| `/en` | `LandingPage` (lang="en") | English homepage |
| `/galeria` | `GalleryPage` (lang="es") | Full gallery with lightbox |
| `/en/gallery` | `GalleryPage` (lang="en") | English gallery |
| `/reservar` | `BookingFormPage` (lang="es") | Multi-step booking form |
| `/en/book` | `BookingFormPage` (lang="en") | English booking form |
| `/confirmar-reserva/:token` | `ConfirmBookingPage` | Booking confirmation via email token |
| `/en/confirm-booking/:token` | `ConfirmBookingPage` | English confirmation |
| `/instructores/:id` | `InstructorProfilePage` | Instructor profile + reviews |
| `/en/instructors/:id` | `InstructorProfilePage` | English instructor profile |
| `/politicas` | `PoliciesPage` | Cancellation/privacy policies |
| `/en/policies` | `PoliciesPage` | English policies |

## Data Fetching Pattern

All hooks use TanStack Query wrapping `supabase-js` calls directly (no API layer):

```
src/shared/hooks/
  useGallery.ts        — supabase.from('gallery_items').select().eq('is_visible', true)
  usePackages.ts       — supabase.from('packages').select().eq('is_active', true)
  useInstructors.ts    — supabase.from('instructors').select().eq('is_active', true)
  useInstructorReviews.ts — supabase.from('instructor_reviews').select().eq('instructor_id', id)
  useSiteSettings.ts   — supabase.from('site_settings').select().eq('key', key).single()
  useReviews.ts        — supabase.functions.invoke('google-reviews')
  useSEO.ts            — Sets document title, meta tags, OG tags dynamically
```

Booking creation calls `supabase.functions.invoke('create-booking', { body })`.
Booking confirmation calls `supabase.functions.invoke('confirm-booking', { body: { token } })`.

## Key Components

```
src/shared/components/
  Navbar.tsx           — Sticky navbar with WebP logo, mobile sheet menu, language switcher
  Footer.tsx           — Site footer
  LanguageSwitcher.tsx — ES/EN toggle, persisted in Zustand store
```

## Bilingual (i18n)

No i18n library. Each page has a `const i18n = { es: {...}, en: {...} }` object. The `lang` prop is passed from the route. Language preference is stored in `languageStore` (Zustand, persisted to localStorage).

## Vercel Configuration (`vercel.json`)

- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Cache headers for `/assets/` (immutable, 1 year)
- Bot User-Agent rewrite to `/api/prerender?path=/:path+` for social media previews
- SPA fallback: `/(.*) -> /index.html`

## Serverless Functions (`api/`)

- `api/prerender.ts` — Returns SSR HTML with correct OG meta tags per route for social media bots. Has a `ROUTE_META` map with per-path titles/descriptions. Fetches dynamic data (instructor names, etc.) from Supabase for dynamic routes.
- `api/sitemap.xml.ts` — Generates XML sitemap with all routes + dynamic instructor pages.

## UI Components (local, shadcn/ui pattern)

Located in `src/components/ui/`. Based on Radix UI primitives + class-variance-authority. Components: badge, button, card, dialog, form, input, label, navigation-menu, select, separator, sheet, textarea.

## Build & Chunking

Vite config (`vite.config.ts`) uses `manualChunks` to split:
- `vendor-supabase` — All `@supabase/*` packages (~206KB, cached separately)
- `vendor-motion` — framer-motion (~124KB, cached separately)

## Performance Notes

- Hero image URL comes from `site_settings` table (`hero_image_url` key) — currently a WebP in Supabase Storage
- `<link rel="preload">` in `index.html` for the hero image (hardcoded URL, update if hero changes)
- Google Fonts loaded non-blocking (media="print" + onload swap)
- Logo: `logo-64.webp` (1.3KB) for navbar display, `logo4k.png` (827KB) kept for OG image meta tags
- Favicon: `favicon-32.png` (931B), Apple touch icon: `apple-touch-icon.png` (7.8KB)
- All below-fold images use `loading="lazy"` + `decoding="async"` + explicit `width`/`height`

## Env Vars

```
VITE_SUPABASE_URL=https://uwvnrmjhjlzdnggljkoo.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_WHATSAPP_NUMBER=50688888888
VITE_CONTACT_EMAIL=info@surferlabscr.com
VITE_SITE_URL=https://surferlabscr.com
VITE_BRAND_NAME=Surfers Lab CR
```
