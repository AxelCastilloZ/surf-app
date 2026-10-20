# Design

## Context

The Navbar (`apps/web/src/shared/components/Navbar.tsx`) is a shared sticky component used across all pages. It uses Radix UI Sheet for the mobile menu and Zustand `languageStore` for language state. The LandingPage (`apps/web/src/pages/LandingPage.tsx`) has an inline `i18n` object for bilingual content and uses `FadeIn` wrappers for scroll-triggered animations. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Add a booking CTA to the navbar that is always visible regardless of scroll position
- Surface the 4 most conversion-relevant FAQ questions directly on the landing page
- Maintain full ES/EN bilingual support

**Non-Goals:**
- Restructuring the existing FAQ page or its schema.org markup
- Adding FAQ schema.org markup to the landing page (the dedicated FaqPage already has FAQPage schema)
- Changing the navbar's overall layout or mobile menu structure

## Decisions

### 1. CTA placement: after language switcher (desktop), after nav links (mobile)

**Choice:** Desktop CTA sits inside the same flex container as the LanguageSwitcher. Mobile CTA is a full-width button between the nav links and the language footer in the Sheet.

**Rationale:** Placing the CTA at the end of the navbar follows the natural reading flow (nav → language → action). On mobile, a full-width button below nav links is the most tappable target. Alternative considered: floating FAB button — rejected because it would overlap content and add visual clutter.

### 2. FAQ uses native `<details>` element, not a custom accordion

**Choice:** Reuse the same `<details>` + `<summary>` pattern already used in FaqPage.tsx.

**Rationale:** Consistent UX with the dedicated FAQ page, zero JS for expand/collapse, accessible by default. Alternative: Radix Accordion — adds bundle size for no benefit since the existing pattern works well.

### 3. Curated 4-question subset, not all 8

**Choice:** Show only 4 questions on the landing page with a "view all" link.

**Rationale:** Keeps the landing page focused. The 4 selected questions address the most common booking objections: experience required, what to bring, duration, and certifications. The full 8-question list remains on the dedicated FAQ page.

## Risks / Trade-offs

- **Content duplication**: The 4 FAQ items are duplicated between LandingPage.tsx and FaqPage.tsx i18n objects. → Acceptable for now; extracting shared FAQ data would add indirection for a small dataset. If FAQ content grows, consider a shared data file.
- **No FAQ schema on landing page**: Google may not surface FAQ rich snippets from the landing page. → The dedicated FaqPage already has FAQPage schema markup. Adding it to the landing page too could cause duplicate structured data issues.
