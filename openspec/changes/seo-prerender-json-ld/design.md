# Design

## Context

The prerender function runs as a Vercel serverless function and returns HTML to social bots. It already has access to route metadata and Supabase for dynamic data. The client-side useSEO hook already defines the schema shapes we need to replicate server-side.

## Goals

- Add JSON-LD schemas to prerender HTML output matching what the client renders
- Keep the prerender function fast (no extra DB calls for static routes)
- Reuse the same schema structures defined in the client-side implementation

## Non-Goals

- Adding Googlebot to the prerender rewrite (Google renders JS fine, and the full SPA content is richer)
- Fetching reviews data in prerender (adds latency; reviews are best-effort from client)

## Design Decisions

### 1. Schema builder functions in prerender.ts
**Decision:** Define schema builder functions directly in prerender.ts rather than sharing code with the client hook.
**Rationale:** The prerender runs in Node.js (Vercel serverless) while useSEO runs in the browser. They use different module systems and environments. Duplicating the small schema builders is simpler than creating a shared package for ~50 lines of code.

### 2. Static FAQ data embedded in prerender
**Decision:** Embed the FAQ Q&A data directly in prerender.ts as a constant, mirroring FaqPage.tsx's faqData.
**Rationale:** The FAQ content is static and bilingual. Fetching it from a database would add unnecessary latency. The trade-off is that FAQ content changes require updating two files, but FAQ content changes rarely.

### 3. Pass schemas array to buildHtml
**Decision:** Extend buildHtml to accept an optional schemas parameter and inject them as `<script type="application/ld+json">` tags.
**Rationale:** Minimal change to existing function signature, and each route can pass route-specific schemas.

## Risks

- **Data drift:** FAQ content in prerender.ts could diverge from FaqPage.tsx. Mitigated by the OpenSpec spec noting both files must stay in sync.
