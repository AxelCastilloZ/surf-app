# Proposal

## Why

Service cards currently list a description and a price but don't explicitly show what's included in each service. Visitors wonder: "Do I get a board? Is the rash guard included? How many hours?" Adding a short bullet list of included items to each service card increases perceived value and reduces pre-booking questions. This is a standard pattern in adventure-tourism and edu-service sites.

## What Changes

- **Included items on service cards**: Each service card gets a short list of 3-4 bullet points showing what's included (e.g., "Tabla y rash guard", "1.5 - 2 horas", "Instructor certificado ISA")
- **Bilingual content**: Full ES/EN translations in the inline i18n pattern
- **Visual design**: Compact check-mark list between description/price and CTA button

## Capabilities

### New Capabilities

- `ui/landing-whats-included`: Short "what's included" bullet list on each landing page service card

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`
- **Risk:** Low — adds inline content to existing service cards, no structural changes
- **No dependency changes**
