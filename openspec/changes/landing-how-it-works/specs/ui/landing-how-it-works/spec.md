# Spec Delta

## Purpose

Adds a visual step-by-step process section to the landing page that guides visitors through the surf lesson experience, reducing uncertainty and encouraging bookings.

## ADDED Requirements

### Requirement: Landing page displays a "How it works" process section

The landing page SHALL display a section with numbered steps explaining the booking-to-surfing process, placed between the Services and Packages sections.

#### Scenario: User views the how-it-works section

- **WHEN** a user scrolls to the "How it works" section on the landing page
- **THEN** they see 3 clearly numbered steps with icons, titles, and short descriptions
- **AND** each step uses the FadeIn animation consistent with other sections

### Requirement: How-it-works section is fully bilingual

The section content SHALL be available in both Spanish and English, following the inline i18n pattern.

#### Scenario: User views in Spanish

- **WHEN** the page language is Spanish
- **THEN** the section heading is "Cómo Funciona" and step descriptions are in Spanish

#### Scenario: User views in English

- **WHEN** the page language is English
- **THEN** the section heading is "How It Works" and step descriptions are in English

### Requirement: Section follows the established visual pattern

The section SHALL use the same design tokens (coral accents, sand backgrounds, Playfair Display headings) and alternating background pattern as other landing page sections.

#### Scenario: Visual consistency

- **WHEN** a user views the how-it-works section
- **THEN** it has a coral accent bar under the heading, consistent typography, and a background that fits the alternating white/sand-100 pattern
