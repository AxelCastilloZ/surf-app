# Spec Delta

## Purpose

Adds a concise list of included items to each service card on the landing page, increasing perceived value and reducing pre-booking questions.

## ADDED Requirements

### Requirement: Service cards display included items

Each service card on the landing page SHALL display a short list of items included in that service.

#### Scenario: User views a service card

- **WHEN** a user views a service card on the landing page
- **THEN** the card displays 3-4 bullet points with check icons listing what's included
- **AND** the list appears between the description/price and the CTA button

### Requirement: Included items are bilingual

The included items list SHALL be available in both Spanish and English.

#### Scenario: Language switch

- **WHEN** the user switches between ES and EN
- **THEN** the included items update to the selected language
