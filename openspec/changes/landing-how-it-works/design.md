# Design

## Context

The landing page sections alternate between `bg-white` and `bg-sand-100`. The current order is: Hero → Instructors (white) → Services (sand) → Packages (white) → About (sand) → Testimonials (sand) → Gallery (white) → FAQ (sand) → Contact (white). Each section heading uses `font-display text-3xl font-bold text-slate-900` with a coral accent bar. The Services section at line 373 ends at line 401, followed by Packages at line 405.

## Goals / Non-Goals

**Goals:**
- Show visitors exactly what to expect after booking, in 3 clear steps
- Use a visual design that feels like a natural part of the page
- Keep it concise — no more than 3 steps with short descriptions

**Non-Goals:**
- Adding interactive elements or animations beyond FadeIn
- Linking steps to other pages (the CTA at the bottom handles conversion)
- Creating a separate component file — section stays inline in LandingPage.tsx

## Decisions

### 1. Three-step process: Book → Meet & Gear Up → Surf!

**Choice:** Three steps that cover the complete experience:
1. **Reserva tu clase / Book Your Lesson** — Choose your service and pick a date online
2. **Nos encontramos / Meet & Gear Up** — Meet at Playa Guiones, get equipment and beach briefing
3. **¡A surfear! / Hit the Waves!** — Get in the water with your instructor and ride your first wave

**Rationale:** Three is the ideal number for process steps — simple to scan, easy to remember. Covers the key anxiety points: how to book, what happens on arrival, what the experience is like.

### 2. Placement between Services and Packages

**Choice:** Insert after Services (sand-100) and before Packages (white). The new section gets `bg-white` to maintain alternation.

**Rationale:** Natural flow: "Here's what we offer" → "Here's how it works" → "Here are the packages/prices". The user learns what's available, then how easy it is, then sees pricing — reducing drop-off before the booking decision.

### 3. Numbered cards with icons

**Choice:** Three cards in a horizontal row (stacked on mobile), each with a large number (1-3) in coral, a lucide icon, a title, and a 1-2 sentence description. Use `CalendarCheck`, `Users`, and `Waves` icons from lucide-react (already imported or available).

**Rationale:** Numbers create a clear sequence. Icons add visual interest and aid scanning. Cards match the existing service card style for consistency.

## Risks / Trade-offs

- **Section count is growing**: The landing page already has 9 sections. Adding another could feel long. → Mitigated by keeping the section compact (no large visuals, just 3 concise cards) and its placement improves flow rather than adding weight.
