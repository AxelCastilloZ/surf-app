# Spec Delta

## Purpose

Displays a curated subset of frequently asked questions on the landing page to reduce booking friction and improve SEO via inline FAQ content.

## ADDED Requirements

### Requirement: Landing page displays FAQ section
The landing page SHALL include a FAQ section with 4 questions in accordion format, positioned between the gallery preview and the contact section.

#### Scenario: FAQ section is visible on landing page
- **WHEN** a user scrolls down the landing page past the gallery preview
- **THEN** a "Preguntas Frecuentes" (ES) or "Frequently Asked Questions" (EN) section is displayed with 4 expandable questions

### Requirement: FAQ items are expandable accordions
Each FAQ item SHALL use a native `<details>` accordion that expands to reveal the answer when clicked.

#### Scenario: User expands a FAQ item
- **WHEN** a user clicks on a FAQ question
- **THEN** the answer expands below the question and the "+" icon rotates to indicate the open state

#### Scenario: User collapses a FAQ item
- **WHEN** a user clicks on an already-expanded FAQ question
- **THEN** the answer collapses and the icon returns to its default state

### Requirement: FAQ section links to full FAQ page
The FAQ section SHALL include a link to the complete FAQ page below the accordion items.

#### Scenario: User navigates to full FAQ
- **WHEN** a user clicks "Ver todas las preguntas" (ES) or "View all questions" (EN)
- **THEN** the app navigates to `/preguntas-frecuentes` (ES) or `/en/faq` (EN)

### Requirement: FAQ content is bilingual
All FAQ questions, answers, and labels SHALL be displayed in the user's selected language.

#### Scenario: FAQ displays in English
- **WHEN** the user's language is set to EN
- **THEN** all FAQ content, section title, and link text are displayed in English
