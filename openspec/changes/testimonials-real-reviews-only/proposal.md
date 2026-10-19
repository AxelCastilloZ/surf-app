# Proposal: Show testimonials only with real Google Reviews

## Why

The testimonials section was displaying hardcoded fake reviews as a fallback when Google Reviews were unavailable. Showing fabricated testimonials is misleading and undermines trust. The section should only appear when real reviews from Google are available.

Additionally, the Supabase Edge Function `google-reviews` was using the legacy Google Places API endpoint which has been deprecated. It needs to be migrated to the Places API (New) which uses a different endpoint and response format.

## What Changes

### Capability: ui/testimonials-section

- **Remove fallback testimonials:** The section returns `null` (renders nothing) when Google Reviews fail to load or return empty
- **Remove static testimonial data:** Delete hardcoded fake reviews from i18n and the `FallbackCard` component
- **Simplify component props:** `TestimonialsSection` no longer accepts a `fallback` prop

### Capability: backend/google-reviews

- **Migrate to Places API (New):** Update Edge Function from `maps.googleapis.com/maps/api/place/details/json` to `places.googleapis.com/v1/places/{placeId}`
- **New request format:** Use `X-Goog-Api-Key` and `X-Goog-FieldMask` headers instead of query parameters
- **Map new response format:** Transform the new API response structure to match the existing `GoogleReview` interface expected by the frontend

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`, `supabase/functions/google-reviews/index.ts`
- **Risk:** Low — testimonials section simply hides when reviews are unavailable
- **Prerequisite:** Google Cloud billing must be enabled for Places API (New) to work. Until then, the section remains hidden.
