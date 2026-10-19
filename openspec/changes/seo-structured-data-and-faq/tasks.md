# Tasks

## 1. Extend useSEO hook to support multiple JSON-LD schemas

- [x] 1.1 Add optional `schemas?: Record<string, unknown>[]` prop to `useSEO`. On each render, remove all existing `<script type="application/ld+json">` tags and inject one per schema object plus the existing SportsActivityLocation. Verify by calling useSEO with an empty `schemas` array and confirming only the SportsActivityLocation tag is present.
- [x] 1.2 Extract the SportsActivityLocation schema construction into a standalone helper function `buildLocalBusinessSchema(...)` so pages can extend it (e.g., add aggregateRating). Verify the landing page still emits the same SportsActivityLocation JSON-LD as before.

## 2. Add BreadcrumbList schema to inner pages

- [x] 2.1 Create a helper function `buildBreadcrumbs(path: string, lang: 'es' | 'en', pageTitle: string): Record<string, unknown>` that returns a valid BreadcrumbList JSON-LD object. Verify by passing `/galeria` with lang `es` and checking the output contains two ListItems: "Inicio" → "Galería".
- [x] 2.2 Add `buildBreadcrumbs` call to GalleryPage, BookingFormPage, PoliciesPage, InstructorProfilePage, and ConfirmBookingPage, passing the result via the `schemas` prop. Verify each page's document head contains a BreadcrumbList JSON-LD with correct items.

## 3. Add Course and AggregateRating schemas to landing page

- [x] 3.1 Build `Course` JSON-LD objects from the packages data on LandingPage, one per active service type with localized name, description, provider reference, and price. Pass them via `schemas`. Verify the landing page emits Course JSON-LD objects matching the active packages.
- [x] 3.2 Compute aggregate rating from Google Reviews data (average rating and count) and add `aggregateRating` to the SportsActivityLocation schema on LandingPage. Verify: when reviews load, the SportsActivityLocation includes aggregateRating; when reviews fail, it does not.

## 4. Add Review and AggregateRating schemas to instructor pages

- [x] 4.1 On InstructorProfilePage, build `Review` JSON-LD objects from `instructor_reviews` data and compute an `AggregateRating`. Emit a Person schema with review and aggregateRating arrays via `schemas`. Verify: an instructor with reviews gets Review + AggregateRating JSON-LD; an instructor with zero reviews gets neither.

## 5. Create FAQ page

- [x] 5.1 Create `FaqPage.tsx` in `apps/web/src/pages/` with a static `faqData` i18n object containing at least 8 Q&A pairs covering: booking process, cancellation policy, what to bring, experience levels, lesson duration, location/directions, group size, and instructor certification. Render with Navbar, Footer, and useSEO. Verify the page renders all Q&A items in both languages.
- [x] 5.2 Add `FAQPage` JSON-LD schema construction in FaqPage using the rendered Q&A data, passed via `schemas`. Verify the document head contains a FAQPage JSON-LD with mainEntity array matching all displayed questions.
- [x] 5.3 Add routes `/preguntas-frecuentes` (lang="es") and `/en/faq` (lang="en") to `App.tsx` with lazy import. Verify both routes render the FAQ page in the correct language.

## 6. Register FAQ in sitemap, prerender, and SEO mappings

- [x] 6.1 Add FAQ entries to `STATIC_ROUTES` in `api/sitemap.xml.ts` with `changefreq: 'monthly'` and `priority: '0.6'`. Verify the generated sitemap XML contains `/preguntas-frecuentes` and `/en/faq` with reciprocal hreflang links.
- [x] 6.2 Add FAQ entries to `ROUTE_META` in `api/prerender.ts` with appropriate Spanish and English titles and descriptions. Verify the prerender handler returns correct OG tags for both FAQ URLs.
- [x] 6.3 Add the FAQ path mappings to `ES_TO_EN` and `EN_TO_ES` in `useSEO.ts` so hreflang alternates resolve correctly. Verify the FAQ page's hreflang alternate link points to the other language version.

## 7. Add FAQ navigation link

- [x] 7.1 Add bilingual FAQ link (`Preguntas Frecuentes` / `FAQ`) to `Footer.tsx` alongside the existing Policies link. Verify the link renders in both languages and navigates to the correct FAQ route.

## 8. Integration verification

- [x] 8.1 Run `pnpm type-check` and `pnpm build` from the monorepo root and verify both pass with zero errors.
- [x] 8.2 Start the web dev server, navigate to each modified page (landing, gallery, booking, policies, instructor profile, FAQ), and verify JSON-LD tags are present and valid using browser DevTools (check `document.querySelectorAll('script[type="application/ld+json"]')`).

## Workflow follow-up

- Archive the change after all tasks are complete and the build passes.
- Validate structured data with Google's Rich Results Test after deploying to production.
