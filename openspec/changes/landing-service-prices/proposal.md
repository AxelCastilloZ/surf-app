# Proposal

## Why

Service cards on the landing page show descriptions and a "Book" CTA but no pricing. Visitors must click through to the booking form to discover costs, creating friction and drop-off. Competitor analysis showed that displaying "starting from" prices directly on service cards increases transparency and trust, reducing the number of clicks to a booking decision.

## What Changes

- **"Starting from" prices on service cards**: Each service card displays the minimum per-person price fetched from `service_pricing_tiers`, shown as "Desde $X / persona" (ES) or "From $X / person" (EN)
- **New data hook**: `useServicePricing` hook queries `service_pricing_tiers` for minimum prices grouped by service type
- **i18n labels**: New `fromPrice` and `perPerson` translation keys

## Capabilities

### New Capabilities

- `ui/landing-service-prices`: Display starting-from per-person prices on landing page service cards

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`, new `apps/web/src/shared/hooks/useServicePricing.ts`
- **Risk:** Low — adds a price display, no changes to booking logic
- **No dependency changes**
