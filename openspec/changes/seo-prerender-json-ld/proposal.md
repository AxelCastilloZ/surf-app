# Proposal: Add JSON-LD Structured Data to Prerender Function

## Why

The Vercel prerender function (`api/prerender.ts`) serves static HTML to social bots (WhatsApp, Slack, Twitter, Facebook, Telegram, Discord, LinkedIn, Pinterest) but only includes Open Graph meta tags. JSON-LD structured data is currently only rendered client-side via the `useSEO` hook, meaning any crawler that does not execute JavaScript misses all structured data schemas.

Adding JSON-LD to the prerender output ensures structured data is available server-side for all consumers, following the belt-and-suspenders approach recommended by Google for SPAs.

## What Changes

### Capability: seo/prerender-schemas

Embed route-specific JSON-LD schemas in the HTML returned by the prerender serverless function:

- **Landing pages** (`/`, `/en`): SportsActivityLocation schema with business info
- **Inner pages** (gallery, booking, policies, FAQ): BreadcrumbList schema
- **FAQ pages** (`/preguntas-frecuentes`, `/en/faq`): FAQPage schema with all Q&A pairs
- **Instructor pages** (`/instructores/:id`, `/en/instructors/:id`): Person schema with instructor data

## Impact

- **Files modified:** `apps/web/api/prerender.ts`
- **Risk:** Low — additive change to existing HTML output, no client-side impact
- **Dependencies:** None — all data is already available in the prerender context or can be fetched from Supabase
