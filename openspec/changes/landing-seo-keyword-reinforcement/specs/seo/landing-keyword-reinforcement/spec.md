# Spec Delta

## Purpose

Ensures the landing page content, meta tags, alt text, and structured data contain sufficient geo-keyword density for "Nosara", "Playa Guiones", "Guanacaste", and "Costa Rica" to rank for location-based surf queries.

## ADDED Requirements

### Requirement: SEO title and meta description contain primary geo-keywords

The landing page title tag SHALL include "Nosara" and "surf" in both ES and EN. The meta description SHALL include "Playa Guiones", "Nosara", and "Costa Rica".

#### Scenario: Spanish landing page meta tags

- **WHEN** a search engine crawls the Spanish landing page (`/`)
- **THEN** the `<title>` contains "Nosara" and a surf-related term, and the meta description contains "Playa Guiones", "Nosara", and "Costa Rica"

#### Scenario: English landing page meta tags

- **WHEN** a search engine crawls the English landing page (`/en`)
- **THEN** the `<title>` contains "Nosara" and "surf lessons" or "surf school", and the meta description contains "Playa Guiones", "Nosara", and "Costa Rica"

### Requirement: Hero section contains location keywords

The hero title and subtitle SHALL reference the geographic location naturally, mentioning "Nosara", "Playa Guiones", or "Costa Rica".

#### Scenario: Spanish hero content

- **WHEN** a user views the Spanish landing page hero
- **THEN** the hero title or subtitle mentions "Playa Guiones" or "Nosara" alongside surf-related terms

#### Scenario: English hero content

- **WHEN** a user views the English landing page hero
- **THEN** the hero title or subtitle mentions "Nosara" and "Costa Rica" alongside surf-related terms

### Requirement: Service descriptions reference location

Each service card description SHALL mention the location ("Nosara", "Playa Guiones", or "Guanacaste") at least once.

#### Scenario: Service cards include location context

- **WHEN** a user views any service card on the landing page
- **THEN** its description text includes at least one location keyword ("Nosara", "Playa Guiones", or "Guanacaste")

### Requirement: FAQ answers embed location keywords

FAQ answer text SHALL include location keywords where contextually natural without altering the factual content of the answer.

#### Scenario: FAQ answers mention location

- **WHEN** a search engine reads the FAQ section's structured data
- **THEN** at least 3 of the 4 FAQ answers contain "Nosara", "Playa Guiones", or "Guanacaste"

### Requirement: Hero image has descriptive alt text with keywords

The hero image SHALL have a non-empty `alt` attribute containing location and activity keywords.

#### Scenario: Hero image alt attribute

- **WHEN** a search engine indexes the landing page
- **THEN** the hero `<img>` tag has an `alt` attribute containing "surf" and "Nosara" or "Playa Guiones"

### Requirement: About section references location

The about section mission and vision text SHALL mention "Nosara" or "Playa Guiones" and "Costa Rica".

#### Scenario: About section geo-keywords

- **WHEN** a user reads the about section
- **THEN** both mission and vision paragraphs mention "Costa Rica" and at least one mentions "Nosara" or "Playa Guiones"

### Requirement: Contact section mentions location

The contact section subtitle SHALL reference the business location.

#### Scenario: Contact subtitle with location

- **WHEN** a user views the contact section
- **THEN** the subtitle text includes "Nosara", "Playa Guiones", or "Guanacaste"

### Requirement: LocalBusiness schema includes keywords

The LocalBusiness JSON-LD schema SHALL include a `keywords` field with primary search terms.

#### Scenario: Schema keywords present

- **WHEN** a search engine reads the LocalBusiness JSON-LD
- **THEN** the schema includes a `keywords` property containing "surf lessons Nosara", "surf school Guiones", and "Costa Rica surf"
