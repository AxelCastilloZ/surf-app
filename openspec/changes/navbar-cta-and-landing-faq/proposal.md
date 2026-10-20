# Proposal

## Why

The landing page lacked a persistent call-to-action for booking and did not surface frequently asked questions, both of which are standard conversion and SEO patterns used by competitors. Adding these reduces friction for new visitors and improves organic search visibility via FAQ rich snippets.

## What Changes

- **Sticky CTA button in Navbar**: A "Reservar" / "Book Now" button is added to the navbar, always visible on desktop (next to the language switcher) and prominently placed in the mobile sheet menu. Links to the booking form.
- **Inline FAQ section on LandingPage**: A section with 4 key questions (accordion style) is added between the gallery preview and the contact section. Includes a link to the full FAQ page (`/preguntas-frecuentes` / `/en/faq`). Fully bilingual ES/EN.

## Capabilities

### New Capabilities

- `ui/navbar-cta`: Persistent booking call-to-action button in the site navbar across all pages
- `ui/landing-faq`: Inline FAQ accordion section on the landing page with link to full FAQ

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/shared/components/Navbar.tsx`, `apps/web/src/pages/LandingPage.tsx`
- **Dependencies:** No new dependencies. Uses existing `<Link>` from React Router and `<details>` HTML element for accordions.
- **SEO:** FAQ content on the landing page complements the existing `/preguntas-frecuentes` page and its FAQPage schema markup.
