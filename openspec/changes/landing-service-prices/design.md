# Design

## Context

Service cards in LandingPage.tsx display an icon, title, description, and a coral CTA button. Pricing data lives in the `service_pricing_tiers` table with columns: `service_type`, `min_participants`, `max_participants`, `price_per_person`, `is_active`. The booking form already queries this table to show price estimates. The `formatPrice` utility from `@surf-app/utils` formats currency values.

## Goals / Non-Goals

**Goals:**
- Show a "starting from" price on each service card
- Fetch pricing data efficiently with TanStack Query (consistent with other hooks)
- Degrade gracefully if pricing data is unavailable

**Non-Goals:**
- Showing tiered pricing or participant-based pricing on the landing page
- Replacing or modifying the Packages section pricing display

## Decisions

### 1. New `useServicePricing` hook

**Choice:** Create a TanStack Query hook that fetches all active `service_pricing_tiers` rows, groups by `service_type`, and returns the minimum `price_per_person` for each type as a `Record<ServiceType, number>`.

**Rationale:** Follows the existing hook pattern (usePackages, useGallery, etc.). Single query fetches all service types at once. TanStack Query handles caching and deduplication.

### 2. Price display position and style

**Choice:** Place the price between the description and the CTA button on each service card. Style: `text-lg font-bold text-coral-500` with a smaller `text-sm text-slate-500` label for "/ persona" or "/ person".

**Rationale:** Mirrors the Packages section pattern where price is shown above the CTA. Using coral for the price number draws attention and matches the existing accent color.

### 3. "Desde" / "From" prefix

**Choice:** Use i18n labels `fromPrice` ("Desde" / "From") and `perPerson` ("/ persona" / "/ person") in the services i18n block.

**Rationale:** Clean separation of translatable text. The format "Desde $85 / persona" is clear and standard in tourism/hospitality.

## Risks / Trade-offs

- **Prices may change without landing page update**: Since prices come from the database in real-time, this is actually a benefit — no hardcoded values to update.
- **Missing pricing data**: If no active tiers exist for a service type, the card simply omits the price line. No error state needed.
