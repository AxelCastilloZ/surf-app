# Design

## Context

The landing page uses a well-structured alternating section layout with `bg-white` and `bg-mist-50` backgrounds. All section headings are `text-slate-900`. Service icons use `bg-ocean-100 text-ocean-600`. The coral palette is only used on CTA buttons, and sand only on review stars. See proposal.md for motivation.

## Goals / Non-Goals

**Goals:**
- Add visible warmth to the landing page without a full redesign
- Increase usage of coral and sand colors beyond just buttons and stars
- Make section alternation more visually distinct

**Non-Goals:**
- Changing the core brand palette or Tailwind config
- Redesigning the page layout or component structure
- Modifying the Navbar, Footer, or other shared components

## Decisions

### 1. Add coral accent bars under section headings

**Choice:** Add a small centered coral bar (`w-16 h-1 bg-coral-500 rounded-full`) below each section `<h2>`. This is a common pattern that adds warmth without being heavy.

**Rationale:** Subtle but effective. Jireh Adventure uses colored accent elements on headings too. Alternative: colored heading text — rejected because it reduces readability and fights with the Playfair Display serif font.

### 2. Warm up alternating backgrounds from mist-50 to sand-100

**Choice:** Replace `bg-mist-50` with `bg-sand-100` (`#fef9ee`) for alternating sections. This is a warm cream/sand tone that evokes beach sand.

**Rationale:** `mist-50` (#f0fafa) is almost indistinguishable from white. `sand-100` provides visible contrast while staying soft. It ties the background to the surf/beach theme.

### 3. Warm up service card icon backgrounds

**Choice:** Change service card icon containers from `bg-ocean-100 text-ocean-600` to `bg-coral-100 text-coral-600` (using `bg-orange-50` since coral-100 doesn't exist in the palette, or `bg-[#fff7ed]`).

**Rationale:** Breaks the ocean-blue monotony and creates visual variety. The coral icons complement the coral CTA buttons below them.

### 4. Use sand/coral for decorative elements

**Choice:** Change the values bullets in the About section from `bg-coral-500` (already coral, good) to alternating warm colors. Change FAQ section border accents.

**Rationale:** Small touches that accumulate into an overall warmer feel.

## Risks / Trade-offs

- **Sand-100 may be too warm on some monitors**: The yellow tint could feel off-brand. → Mitigated by using the lightest sand tone (#fef9ee), which is nearly white with a warm cast.
- **Coral overuse**: Too much coral could clash. → Limited to small accent elements (bars, icon backgrounds), not large surfaces.
