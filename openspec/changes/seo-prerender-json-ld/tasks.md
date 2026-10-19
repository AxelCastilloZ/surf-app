# Tasks

## 1. Extend buildHtml to support JSON-LD schemas

- [x] 1.1 Add an optional `schemas?: Record<string, unknown>[]` parameter to `buildHtml`. For each schema, inject a `<script type="application/ld+json">` tag in the `<head>`. Verify by passing an empty array and confirming no script tags are added.

## 2. Add SportsActivityLocation schema to landing routes

- [x] 2.1 Create a `buildLocalBusinessSchema(description, lang)` function in prerender.ts that returns the SportsActivityLocation JSON-LD object (matching the client-side version). Pass it to buildHtml for `/` and `/en` routes. Verify the prerender HTML for `/` contains a valid SportsActivityLocation JSON-LD.

## 3. Add BreadcrumbList schema to inner page routes

- [x] 3.1 Create a `buildBreadcrumbs(path, lang, pageTitle)` function in prerender.ts. Add breadcrumbs to gallery, booking, policies, confirm-booking, and FAQ routes by mapping ROUTE_META entries to their breadcrumb data. Verify the prerender HTML for `/galeria` contains a BreadcrumbList JSON-LD.

## 4. Add FAQPage schema to FAQ routes

- [x] 4.1 Embed bilingual FAQ data (matching FaqPage.tsx's faqData) as a constant in prerender.ts. Build a FAQPage JSON-LD schema and pass it alongside BreadcrumbList for `/preguntas-frecuentes` and `/en/faq`. Verify the prerender HTML contains a FAQPage JSON-LD with mainEntity array.

## 5. Add Person schema to instructor routes

- [x] 5.1 Extend the instructor prerender branch to build a Person JSON-LD schema using the already-fetched instructor data (full_name, bio). Pass it to buildHtml. Verify the prerender HTML for an instructor route contains a Person JSON-LD.

## 6. Integration verification

- [x] 6.1 Run `pnpm type-check` and `pnpm build` from the monorepo root and verify both pass with zero errors.

## Workflow follow-up

- Archive the change after all tasks are complete and the build passes.
