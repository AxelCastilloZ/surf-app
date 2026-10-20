# Spec Delta

## Purpose

Ensures Google Review call-to-action links are present in always-visible page locations so visitors can leave a review regardless of whether the testimonials section is rendered.

## ADDED Requirements

### Requirement: Contact section displays a Google Review link

The landing page contact section SHALL display a bilingual link that opens the Google review form for the business Place ID in a new browser tab.

#### Scenario: Spanish landing page contact review link

- **WHEN** a user views the contact section on the Spanish landing page (`/`)
- **THEN** a link with text "Déjanos tu reseña en Google" is visible below the WhatsApp and Email buttons
- **AND** the link opens `https://search.google.com/local/writereview?placeid=ChIJ-VT2s-VVno8R-5RMA8j1qdI` in a new tab

#### Scenario: English landing page contact review link

- **WHEN** a user views the contact section on the English landing page (`/en`)
- **THEN** a link with text "Leave us a Google review" is visible below the WhatsApp and Email buttons
- **AND** the link opens the same Google review URL in a new tab

### Requirement: Footer displays a Google Review link on all pages

The site footer SHALL display a bilingual link to the Google review form, visible on every page of the site.

#### Scenario: Spanish footer review link

- **WHEN** a user views the footer on any page with language set to Spanish
- **THEN** a "Déjanos tu reseña" link is visible alongside the FAQ and Policies links
- **AND** the link opens the Google review URL in a new tab

#### Scenario: English footer review link

- **WHEN** a user views the footer on any page with language set to English
- **THEN** a "Leave us a review" link is visible alongside the FAQ and Policies links
- **AND** the link opens the Google review URL in a new tab

### Requirement: Review links open externally with correct attributes

All Google Review links SHALL open in a new tab with `rel="noopener noreferrer"` for security.

#### Scenario: Link attributes

- **WHEN** a Google Review link is rendered in the contact section or footer
- **THEN** the `<a>` element has `target="_blank"` and `rel="noopener noreferrer"`
