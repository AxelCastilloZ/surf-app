# Proposal: Testimonials Carousel Improvements

## Why

The testimonials section on the landing page uses Embla Carousel but lacks navigation controls — users can only drag to scroll. The fallback cards (shown when Google Reviews are unavailable) have a different visual style than the Google Review cards, creating inconsistency. There is no autoplay, and the cards clip abruptly at the edges without visual affordance.

## What Changes

### Capability: ui/testimonials-carousel

- **Navigation controls:** Add prev/next arrow buttons and dot indicators
- **Autoplay:** Auto-rotate every 5 seconds, pausing on hover/interaction
- **Visual consistency:** Unify fallback cards to match Google Review card design (white bg, shadow, same layout)
- **Edge fade:** Add gradient masks on left/right edges so partially visible cards fade out instead of clipping

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`, `apps/web/package.json` (add embla-carousel-autoplay)
- **Risk:** Low — visual/UX changes only, no data or logic changes
