# Proposal

## Why

Surfers Lab CR needs more Google reviews to improve local SEO rankings and build trust with potential customers. A direct review link removes friction — satisfied customers can leave a review in one click instead of searching for the business on Google Maps. The review CTA currently lives only inside the TestimonialsSection, which is conditionally rendered (hidden when no reviews are loaded). Placing the CTA in always-visible locations ensures every visitor sees it.

## What Changes

- Add a Google Review link in the **Contact section** of the landing page, below the WhatsApp and Email buttons, as a subtle tertiary CTA encouraging happy customers to leave a review
- Add a Google Review link in the **Footer** component alongside the existing FAQ and Policies links, making it visible on every page of the site
- Both links open `https://search.google.com/local/writereview?placeid=ChIJ-VT2s-VVno8R-5RMA8j1qdI` in a new tab
- Both are fully bilingual (ES/EN)
- The existing review button inside `TestimonialsSection` remains unchanged
- The Navbar is **not** modified — "Reservar"/"Book Now" stays as the sole CTA

## Capabilities

### New Capabilities

- `seo/google-review-cta`: Defines the requirement that Google Review call-to-action links must be present in always-visible page locations (contact section and footer) with the correct Place ID and bilingual text.

### Modified Capabilities

_(none — no existing spec-level behavior changes)_

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx` (contact section i18n + JSX), `apps/web/src/shared/components/Footer.tsx` (add review link)
- **No new dependencies** — uses only existing imports (`ExternalLink` from lucide-react already imported in LandingPage; Footer needs no new imports beyond a standard `<a>` tag)
- **No API or database changes**
- **No breaking changes**
