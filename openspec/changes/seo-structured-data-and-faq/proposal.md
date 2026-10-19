# Proposal

## Why

The site currently has a single JSON-LD schema (`SportsActivityLocation`) injected client-side by `useSEO`. Google supports richer result types — FAQ accordions, review stars, course carousels, breadcrumb trails — that increase click-through rate for local and travel queries. Adding structured data and a dedicated FAQ page targets the high-intent keywords ("surf lessons nosara", "surf school costa rica") where rich results make the biggest ranking difference.

## What Changes

- **Expand JSON-LD structured data** in the `useSEO` hook to emit page-specific schemas:
  - `FAQPage` on the new FAQ route and optionally on the landing page FAQ section
  - `Course` on the landing page services section (one per service type)
  - `Review` / `AggregateRating` on instructor profile pages (from `instructor_reviews`)
  - `BreadcrumbList` on all inner pages (gallery, booking, instructors, policies, FAQ)
- **Add a bilingual FAQ page** (`/preguntas-frecuentes` / `/en/faq`) with common questions about surf lessons, booking, cancellations, and logistics. Content sourced from a static i18n object (same pattern as existing pages).
- **Register the new routes** in the router, sitemap generator, prerender handler, and `robots.txt`.
- **Add `AggregateRating` to the `SportsActivityLocation`** schema on the landing page using Google Reviews data already fetched.

## Capabilities

### New Capabilities
- `seo/structured-data`: Rich JSON-LD schemas (FAQPage, Course, Review, AggregateRating, BreadcrumbList) emitted per page type
- `seo/faq-page`: Bilingual FAQ page with static Q&A content, integrated into routing, sitemap, and prerender

### Modified Capabilities
<!-- No existing specs to modify — project has no prior specs -->

## Impact

- **`apps/web/src/shared/hooks/useSEO.ts`** — Refactor JSON-LD generation to accept page-specific schema data instead of always emitting only `SportsActivityLocation`
- **`apps/web/src/App.tsx`** — Add routes for `/preguntas-frecuentes` and `/en/faq`
- **`apps/web/src/pages/`** — New `FaqPage.tsx` component
- **`apps/web/src/pages/LandingPage.tsx`** — Pass `Course` and `AggregateRating` data to SEO hook
- **`apps/web/src/pages/InstructorProfilePage.tsx`** — Pass `Review` + `AggregateRating` data to SEO hook
- **`apps/web/api/prerender.ts`** — Add FAQ route to `ROUTE_META`
- **`apps/web/api/sitemap.xml.ts`** — Add FAQ route to `STATIC_ROUTES`
- **`apps/web/public/robots.txt`** — No changes needed (FAQ is public)
- **`apps/web/vercel.json`** — No changes needed (bot rewrite already covers all paths)
- **No new dependencies** — All schemas are plain JSON objects
- **No database changes** — FAQ content is static; reviews and ratings already exist in the DB
