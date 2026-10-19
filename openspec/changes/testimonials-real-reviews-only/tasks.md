# Tasks

## 1. Remove fallback testimonials from frontend

- [x] 1.1 Remove `StaticTestimonial` type, `FallbackCard` component, and fallback data from i18n. Update `TestimonialsSection` to return `null` when no real reviews are available. Remove `fallback` prop from component.

## 2. Migrate Edge Function to Places API (New)

- [x] 2.1 Update `supabase/functions/google-reviews/index.ts` to use `places.googleapis.com/v1/places/{placeId}` endpoint with `X-Goog-Api-Key` and `X-Goog-FieldMask` headers. Map the new response format (`authorAttribution.displayName`, `text.text`, `authorAttribution.photoUri`, `relativePublishTimeDescription`, `publishTime`) to the existing `GoogleReview` interface.

## 3. Deploy Edge Function

- [x] 3.1 Deploy updated `google-reviews` function to Supabase via Dashboard editor (with CORS inlined since shared imports are not supported in the browser editor).

## 4. Configure secrets

- [x] 4.1 Set `GOOGLE_PLACES_API_KEY` and `GOOGLE_PLACE_ID` secrets in Supabase Dashboard.

## 5. Integration verification

- [x] 5.1 Run `pnpm type-check` and `pnpm build` and verify both pass.

## Notes

- Google Cloud billing is required for Places API (New) to return data. Until billing is enabled, the testimonials section will remain hidden (returns null).
- The Edge Function deployed via the Supabase Dashboard editor has CORS headers inlined. The repo version uses the shared `_shared/cors.ts` import for consistency.
