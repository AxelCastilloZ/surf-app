# Design

## Context

The landing page uses an inline `const i18n = { es: {...}, en: {...} }` object for all text content. SEO meta tags are set via the `useSEO` hook, and structured data is injected as JSON-LD `<script>` tags. The `buildLocalBusinessSchema` function in `useSEO.ts` already includes `address` with "Nosara" and `areaServed`, but the visible page content lacks sufficient geo-keyword mentions for Google to rank the page for location-based queries. See proposal.md for full motivation.

## Goals / Non-Goals

**Goals:**
- Maximize geo-keyword density ("Nosara", "Playa Guiones", "Guanacaste", "Costa Rica") across all landing page text without triggering Google's keyword-stuffing penalty
- Reinforce both ES and EN versions equally since "surf lessons Nosara" is searched primarily in English
- Enrich structured data with additional keyword signals

**Non-Goals:**
- Creating new pages or blog content (content marketing is a separate initiative)
- Changing page layout, design, or component structure
- Modifying other pages (gallery, booking, FAQ, instructor profiles)
- Google Business Profile optimization (outside codebase scope)

## Decisions

### 1. Keyword integration strategy: natural weaving, not appending

**Choice:** Rewrite existing i18n strings to incorporate geo-keywords as natural parts of sentences rather than appending location tags.

**Rationale:** Google's helpful content system penalizes unnatural keyword insertion. A sentence like "Aprende a surfear en las olas de Playa Guiones, Nosara" reads naturally while containing three geo-keywords. Appending "(Nosara, Costa Rica)" to every paragraph would look spammy.

**Target keyword density:** 1-2% for primary terms across the full page text — well within Google's safe range.

### 2. Primary vs secondary keywords

**Choice:** Prioritize these keyword groups:
- **Primary (must appear in title, H1, meta):** "surf lessons Nosara" (EN), "clases de surf Nosara" (ES), "Playa Guiones"
- **Secondary (body text, FAQ, about):** "surf school Guiones", "Guanacaste", "Costa Rica surf", "learn to surf Nosara"
- **Long-tail (FAQ answers, descriptions):** "best surf school Nosara", "beginner surf lessons Costa Rica", "surf instructor Nosara"

**Rationale:** Primary keywords target the exact queries competitors rank for. Secondary and long-tail keywords capture related searches and build topical authority.

### 3. Hero image alt text approach

**Choice:** Set a descriptive, keyword-rich alt text via the i18n object so it differs by language:
- ES: `"Clases de surf en Playa Guiones, Nosara — Surfers Lab CR"`
- EN: `"Surf lessons at Playa Guiones, Nosara — Surfers Lab CR"`

**Rationale:** The hero image currently has `alt=""` (decorative). Since it's the first and largest image, giving it descriptive alt text helps Google Image Search and general SEO. Alt text is a strong on-page signal.

### 4. LocalBusiness schema enrichment

**Choice:** Add `keywords` and `sameAs` (Instagram, Facebook) to the existing `buildLocalBusinessSchema` output.

**Rationale:** `keywords` is a valid Schema.org property for LocalBusiness. `sameAs` links to social profiles help Google build the Knowledge Panel. Both are low-effort, high-signal additions.

### 5. Instructor photo alt text

**Choice:** Add a location-contextual alt text pattern in the JSX: `alt={inst.full_name + ' — ' + (lang === 'es' ? 'instructor de surf en Nosara' : 'surf instructor in Nosara')}`.

**Rationale:** Currently uses `alt={inst.full_name}` which misses a keyword opportunity. Adding the role and location is natural and accurate.

## Risks / Trade-offs

- **Over-optimization risk** → Mitigation: keep keyword density under 2%, vary phrasing (don't repeat the exact same phrase), use synonyms and related terms. The changes will read as natural descriptive text.
- **Content accuracy** → All location claims are factually true (the school is at Playa Guiones, Nosara). No misleading geo-targeting.
- **Translation parity** → Both ES and EN get equal keyword treatment. EN is especially important since English-language surf queries have higher global search volume.
