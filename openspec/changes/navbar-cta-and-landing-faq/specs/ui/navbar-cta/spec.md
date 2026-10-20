# Spec Delta

## Purpose

Provides a persistent booking call-to-action button in the site navbar so users always have a visible path to the booking form.

## ADDED Requirements

### Requirement: Desktop navbar displays booking CTA
The navbar SHALL display a "Reservar" (ES) or "Book Now" (EN) button on viewports at the `md` breakpoint and above, positioned after the language switcher.

#### Scenario: Desktop user sees CTA
- **WHEN** a user views any page on a viewport >= md breakpoint
- **THEN** the navbar displays a booking button labeled "Reservar" (ES) or "Book Now" (EN)

#### Scenario: CTA navigates to booking form
- **WHEN** a user clicks the navbar booking button
- **THEN** the app navigates to `/reservar` (ES) or `/en/book` (EN) based on current language

### Requirement: Mobile menu displays booking CTA
The mobile sheet menu SHALL include a prominent booking button below the navigation links.

#### Scenario: Mobile user sees CTA in menu
- **WHEN** a user opens the mobile hamburger menu on a viewport below md breakpoint
- **THEN** a booking button labeled "Reservar" (ES) or "Book Now" (EN) is displayed below the nav links

#### Scenario: Mobile CTA closes menu and navigates
- **WHEN** a user taps the booking button in the mobile menu
- **THEN** the menu closes and the app navigates to the booking form

### Requirement: CTA label follows active language
The button label SHALL match the user's selected language preference.

#### Scenario: Language switch updates CTA label
- **WHEN** the user switches language from ES to EN
- **THEN** the CTA label changes from "Reservar" to "Book Now" and the link target updates accordingly
