# Tasks

## 1. SEO title, meta description, and hero content

- [x] 1.1 Update `i18n.es.seo.title` and `i18n.es.seo.description` to reinforce "Nosara", "Playa Guiones", "escuela de surf", "Guanacaste". Update `i18n.en.seo.title` and `i18n.en.seo.description` to reinforce "Nosara", "Playa Guiones", "surf school", "surf lessons". Verify by inspecting `<title>` and `<meta name="description">` in the browser.
- [x] 1.2 Update `i18n.es.hero.title` and `i18n.es.hero.subtitle` to include "Playa Guiones" or "Nosara". Update `i18n.en.hero.title` and `i18n.en.hero.subtitle` to include "Nosara" and "Costa Rica". Verify hero text renders correctly in the browser.
- [x] 1.3 Add i18n keys for hero image alt text (ES: "Clases de surf en Playa Guiones, Nosara — Surfers Lab CR", EN: "Surf lessons at Playa Guiones, Nosara — Surfers Lab CR") and apply to the hero `<img>` tag. Verify `alt` attribute is non-empty in the DOM.

## 2. Service descriptions and includes

- [x] 2.1 Rewrite each service `description` in `i18n.es.services.items` to naturally include "Playa Guiones", "Nosara", or "Guanacaste". Do the same for `i18n.en.services.items`. Verify descriptions render correctly and each mentions at least one location keyword.
- [x] 2.2 Update service `includes` items where location context is natural (e.g. "Calentamiento en Playa Guiones" / "Beach warm-up at Playa Guiones"). Verify checklist items render correctly.

## 3. How It Works and About section

- [x] 3.1 Update `i18n.es.howItWorks.steps` and `i18n.en.howItWorks.steps` descriptions to reference "Playa Guiones" or "Nosara" where natural (especially step 2 "meet" step). Verify text renders correctly.
- [x] 3.2 Rewrite `i18n.es.about.mission`, `i18n.es.about.vision`, `i18n.en.about.mission`, `i18n.en.about.vision` to include "Nosara", "Playa Guiones", and "Costa Rica". Verify about section renders correctly.

## 4. FAQ answers and contact section

- [x] 4.1 Update FAQ answer text in both ES and EN to embed location keywords naturally (e.g. "en nuestra escuela en Playa Guiones, Nosara" / "at our school in Playa Guiones, Nosara"). Verify at least 3 of 4 answers contain a location keyword. Verify FAQPage JSON-LD schema reflects the updated answers.
- [x] 4.2 Update `i18n.es.contact.subtitle` and `i18n.en.contact.subtitle` to mention "Nosara" or "Playa Guiones". Verify contact section renders correctly.

## 5. Image alt text

- [x] 5.1 Update instructor photo `alt` attribute in the JSX to include role and location context: `{inst.full_name} — ${lang === 'es' ? 'instructor de surf en Nosara' : 'surf instructor in Nosara'}`. Verify alt text in DOM for each instructor card.

## 6. Structured data enrichment

- [x] 6.1 Add `keywords` property to `buildLocalBusinessSchema` in `useSEO.ts` with value `"surf lessons Nosara, surf school Guiones, Costa Rica surf, Playa Guiones surf, learn to surf Nosara, escuela de surf Nosara"`. Verify JSON-LD output includes `keywords` field.
- [x] 6.2 Add `sameAs` array to `buildLocalBusinessSchema` with Instagram and Facebook URLs. Verify JSON-LD output includes `sameAs`.
- [x] 6.3 Add `locationCreated` with Nosara/Guiones details to Course schemas in `LandingPage.tsx`. Verify each Course JSON-LD includes location data.

## 7. Verification

- [x] 7.1 Run the dev server, load both `/` and `/en`, and verify all text changes render correctly with no layout issues. Check that keyword mentions read naturally and are not repetitive.
- [x] 7.2 Verify all JSON-LD schemas (`LocalBusiness`, `Course`, `FAQPage`) contain the updated content by inspecting `<script type="application/ld+json">` tags.
