# Design

## Context

The landing page already passes `[localBusinessSchema, ...courseSchemas]` to `useSEO()`. The `useSEO` hook injects all schemas as `<script type="application/ld+json">` tags. The FaqPage.tsx already builds a FAQPage schema from its items array — same pattern applies here.

## Decisions

### 1. Build FAQPage schema from i18n FAQ items

**Choice:** Construct a `FAQPage` schema object from `t.faq.items` and append it to the schemas array. Reuse the exact same structure as FaqPage.tsx: `@type: "FAQPage"` with `mainEntity` array of `Question` objects.

**Rationale:** Consistent with the existing FaqPage implementation. No new utilities needed.

## Risks / Trade-offs

- **Duplicate FAQ schema**: Both the landing page and `/preguntas-frecuentes` will have FAQPage schemas. Google handles this fine — each page is a separate URL with its own structured data.
