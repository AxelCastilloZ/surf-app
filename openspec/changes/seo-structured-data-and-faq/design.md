# Design

## Context

See proposal.md — Why. The site is a React SPA on Vercel with client-side meta tag injection via `useSEO`. JSON-LD is currently a single hardcoded `SportsActivityLocation` block inside that hook. The prerender handler (`api/prerender.ts`) serves static HTML to social bots. The sitemap (`api/sitemap.xml.ts`) is generated dynamically from a static route list plus Supabase instructor data.

Key constraints from the existing code:
- `useSEO` runs in a `useEffect` and manipulates `document.head` directly — it removes and re-creates the `<script type="application/ld+json">` on every call
- All pages already call `useSEO` with `title`, `description`, `lang`, and `path`
- The i18n pattern is inline `const i18n = { es: {...}, en: {...} }` per page — no library
- Data is fetched via TanStack Query hooks wrapping `supabase-js`

## Goals / Non-Goals

**Goals:**
- Emit valid, Google-testable JSON-LD schemas per page type without adding dependencies
- Add a bilingual FAQ page following existing page patterns exactly
- Keep all structured data generation client-side (consistent with current approach)

**Non-Goals:**
- Server-side rendering or static generation of JSON-LD (would require architectural change)
- Blog or content management system
- Google Search Console integration or automated testing pipeline
- Changing the existing `SportsActivityLocation` schema structure (only extending it with `aggregateRating`)

## Decisions

### 1. Extend `useSEO` with a `schemas` parameter instead of a separate hook

**Choice:** Add an optional `schemas` prop to `useSEO` that accepts an array of JSON-LD objects. The hook injects all of them as separate `<script type="application/ld+json">` tags.

**Why over a separate hook:** Keeps SEO logic centralized. Each page already calls `useSEO` — adding schemas there avoids a second hook call and ensures cleanup happens in one place.

**Why over a single merged `@graph`:** Separate script tags are simpler to debug and are equally valid per Google's documentation.

### 2. Build schema objects in each page component, not in `useSEO`

**Choice:** Each page constructs its own schema objects (Course, Review, BreadcrumbList, etc.) and passes them to `useSEO`. The hook is a dumb injector.

**Why:** Page components already have the data (packages, reviews, instructors) via their TanStack Query hooks. Moving schema construction into `useSEO` would require passing all that data through, making the hook unwieldy.

### 3. FAQ content is a static i18n object, not database-driven

**Choice:** FAQ Q&A pairs live in a `const faqData = { es: [...], en: [...] }` object inside `FaqPage.tsx`, matching the existing i18n pattern.

**Why over a database table:** The FAQ is small (6-10 items), changes rarely, and doesn't need admin editing. A database table would add a migration, API, dashboard module, and RLS policy for negligible benefit. If the content needs to be admin-editable later, it can be migrated to a `faq_items` table.

### 4. Breadcrumb data is derived from the route path, not a config map

**Choice:** A helper function `buildBreadcrumbs(path, lang, pageTitle)` generates the BreadcrumbList items by splitting the path and mapping segments to display names.

**Why:** The route structure is flat and predictable. A lookup map would duplicate the route definitions.

## Risks / Trade-offs

- **[Client-side JSON-LD]** → Google renders JavaScript, so client-side injection works. However, if Googlebot's JS rendering changes, schemas could be missed. Mitigation: the prerender handler already serves bots static HTML — structured data could be added there in a follow-up if needed.
- **[Static FAQ content]** → Content changes require a code deploy. Mitigation: acceptable for 6-10 items that change quarterly at most. Can migrate to DB later without breaking the page structure.
- **[Multiple JSON-LD script tags per page]** → Some SEO tools flag this as a warning. Mitigation: Google explicitly documents this as valid. No ranking impact.
- **[AggregateRating from Google Reviews]** → The rating count and average are computed client-side from the filtered reviews (rating >= 4). This means the aggregateRating only reflects high-rated reviews. Mitigation: this matches what's displayed to users, so the structured data is consistent with visible content.
