# Proposal

## Why

The landing page has an inline FAQ section with 4 questions, but lacks FAQPage schema.org markup. The full FAQ page (`/preguntas-frecuentes`) already has this schema and can generate Google rich snippets. Adding the same markup to the homepage FAQ enables rich snippets from the homepage — which has more authority and traffic than the dedicated FAQ page.

## What Changes

- **FAQPage schema on landing**: Build a FAQPage JSON-LD schema from the inline FAQ items and append it to the existing schemas array passed to `useSEO()`

## Capabilities

### New Capabilities

- `seo/landing-faq-schema`: FAQPage structured data on the landing page for Google rich snippets

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`
- **Risk:** Very low — adds a JSON-LD script tag, no visual changes
- **No dependency changes**
