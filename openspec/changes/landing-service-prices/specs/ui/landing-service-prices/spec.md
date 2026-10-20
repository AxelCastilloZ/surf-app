# Spec Delta

## Purpose

Displays starting-from per-person prices on the landing page service cards so visitors see pricing before clicking through to the booking form.

## ADDED Requirements

### Requirement: Service cards show starting-from price

Each service card on the landing page SHALL display the minimum per-person price for that service type, fetched from `service_pricing_tiers`.

#### Scenario: Prices loaded successfully

- **WHEN** pricing data is available from `service_pricing_tiers`
- **THEN** each service card shows the minimum price formatted as "Desde $X / persona" (ES) or "From $X / person" (EN)
- **AND** the price is displayed between the description and the CTA button

#### Scenario: Prices unavailable

- **WHEN** pricing data fails to load or no active tiers exist for a service type
- **THEN** the service card renders normally without a price line (graceful degradation)

### Requirement: Prices are bilingual

Price labels SHALL switch language with the page language.

#### Scenario: Spanish display

- **WHEN** the page is in Spanish
- **THEN** the label reads "Desde $X / persona"

#### Scenario: English display

- **WHEN** the page is in English
- **THEN** the label reads "From $X / person"
