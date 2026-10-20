# Design

## Context

Service cards in LandingPage.tsx contain an icon, title, description, optional price, and a CTA button. Each service item in the i18n object has `icon`, `title`, `serviceType`, and `description` fields. The `Check` icon from lucide-react can be used for checkmarks.

## Goals / Non-Goals

**Goals:**
- Show what's included in each service at a glance
- Keep the list short (3-4 items) to avoid card bloat

**Non-Goals:**
- Detailed feature comparison between services
- Interactive expandable lists

## Decisions

### 1. Add `includes` array to each service item in i18n

**Choice:** Add an `includes: string[]` field to each service item with 3-4 short items specific to that service:

- **Surf Lessons**: Board & rash guard, 1.5-2 hours, Certified ISA instructor, Beach warm-up + water practice
- **Video Analysis**: HD session recording, Frame-by-frame review, Personalized tips, Digital copy included
- **Surf Trips**: Transport to spot, All equipment, Local guide, Snacks & water

**Rationale:** Each list highlights the unique value of that service. Items answer the most common pre-booking questions.

### 2. Compact check-list style

**Choice:** Small `Check` icon in ocean-600 color followed by text in `text-sm text-slate-600`. List placed after the price line (or after description if no price), before the CTA button. Uses `space-y-1.5` for tight spacing.

**Rationale:** Check marks convey "you get this" and are visually lightweight. Keeps cards scannable without overwhelming.

## Risks / Trade-offs

- **Card height increases**: Adding 3-4 lines per card makes cards taller. → Mitigated by using small text and tight spacing. The `flex-1` on the description already handles uneven heights in the grid.
