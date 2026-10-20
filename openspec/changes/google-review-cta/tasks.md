# Tasks

## 1. Contact section — Google Review link

- [x] 1.1 Add `reviewCta` i18n key to `i18n.es.contact` with value `'¿Disfrutaste tu experiencia? Déjanos tu reseña en Google'` and to `i18n.en.contact` with value `'Enjoyed your experience? Leave us a Google review'` in `apps/web/src/pages/LandingPage.tsx`.
- [x] 1.2 Add a Google Review link below the WhatsApp/Email buttons in the contact section JSX. Use `GOOGLE_REVIEW_URL` constant (already defined in the file). Style as a subtle tertiary link with the Google "G" SVG icon and `ExternalLink` icon (already imported). Wrap in `<FadeIn>`. Verify the link renders in the browser on both `/` and `/en`.

## 2. Footer — Google Review link

- [x] 2.1 Add a bilingual Google Review link to the `<div className="flex gap-4">` in `apps/web/src/shared/components/Footer.tsx`, alongside the FAQ and Policies links. Use the `lang` variable already available from `useLanguageStore()`. ES text: `'Déjanos tu reseña'`, EN text: `'Leave us a review'`. Open in new tab with `target="_blank"` and `rel="noopener noreferrer"`. Verify the link renders in the browser footer on multiple pages.

## 3. Verification

- [x] 3.1 Run the dev server, load `/` and `/en`, and verify the contact section review link renders correctly below the WhatsApp/Email buttons with correct text per language.
- [x] 3.2 Navigate to `/galeria` and `/en/gallery` to verify the footer review link appears on non-landing pages with correct bilingual text.
- [x] 3.3 Click both review links and verify they navigate to `https://search.google.com/local/writereview?placeid=ChIJ-VT2s-VVno8R-5RMA8j1qdI` (Google Sign-in redirect expected).
