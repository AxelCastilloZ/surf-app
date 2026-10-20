# Tasks

## 1. Create useServicePricing hook

- [x] 1.1 Create `apps/web/src/shared/hooks/useServicePricing.ts` with a TanStack Query hook that fetches all active `service_pricing_tiers`, groups by `service_type`, and returns `Record<string, number>` mapping each service type to its minimum `price_per_person`.

## 2. Add i18n labels

- [x] 2.1 Add `fromPrice` ("Desde" / "From") and `perPerson` ("/ persona" / "/ person") to the `services` i18n block in both ES and EN objects in LandingPage.tsx.

## 3. Display prices on service cards

- [x] 3.1 Import `useServicePricing` in LandingPage, call it in the component, and add a price line between the description `<p>` and the CTA `<Link>` on each service card. Show `fromPrice + formatPrice(price, 'USD') + perPerson` when a price exists for that service type. Skip the line gracefully when no price is available.

## 4. Verification

- [x] 4.1 Visual review in browser: confirm prices appear on service cards, display correctly in both ES/EN, and degrade gracefully if no data.
