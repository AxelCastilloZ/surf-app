# Proposal

## Why

The site surferlabscr.com does not appear in Google's first 20 pages for competitive keywords like "surf lessons Nosara" or "surf school Guiones". While the brand search ("Surfers Lab CR") ranks #1, the landing page content does not mention "Nosara", "Playa Guiones", or "Guanacaste" frequently enough for Google to associate the page with location-based surf queries. Reinforcing these geo-keywords and surf-related terms naturally throughout the i18n content, meta tags, image alt text, and structured data will improve topical relevance without triggering keyword-stuffing penalties.

## What Changes

- **SEO title & meta description**: Enrich with primary keywords ("Nosara", "Playa Guiones", "surf school", "surf lessons") in both ES and EN
- **Hero section**: Add location keywords to title and subtitle (e.g. "Surf en Playa Guiones, Nosara" / "Surf Lessons in Nosara, Costa Rica")
- **Service descriptions**: Weave in location references naturally (e.g. "en las olas de Playa Guiones" / "on the waves of Playa Guiones, Nosara")
- **Service includes items**: Add location context where natural (e.g. "Calentamiento en Playa Guiones")
- **How It Works steps**: Add location mentions (e.g. "Te recibimos en Playa Guiones, Nosara")
- **About section**: Reinforce "Nosara", "Guanacaste", "Costa Rica" in mission and vision text
- **FAQ answers**: Embed location keywords naturally in responses (e.g. "en nuestra escuela en Playa Guiones, Nosara")
- **Contact subtitle**: Mention location
- **Hero image alt text**: Change from empty alt to descriptive keyword-rich alt text
- **Instructor photo alt text**: Add location context via i18n pattern
- **Gallery image alt text pattern**: Ensure images reference "surf Nosara"
- **LocalBusiness schema**: Add `additionalType`, `keywords`, and `sameAs` properties
- **Course schemas**: Add `locationCreated` with Nosara/Guiones details

## Capabilities

### New Capabilities

- `seo/landing-keyword-reinforcement`: Geo-keyword density in landing page content, meta tags, alt text, and structured data targeting "surf lessons Nosara", "surf school Guiones", "surf Costa Rica" and related terms

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx` (i18n content, alt texts, schema enrichment), `apps/web/src/shared/hooks/useSEO.ts` (LocalBusiness schema keywords)
- **Risk:** Low — text-only content changes, no structural/layout changes
- **No dependency changes**
