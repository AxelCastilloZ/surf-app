# Spec Delta

## Purpose

Provides a bilingual FAQ page answering common visitor questions about surf lessons, booking, cancellations, and logistics, improving organic search visibility for long-tail informational queries.

## ADDED Requirements

### Requirement: FAQ page is accessible at bilingual routes
The system SHALL serve the FAQ page at `/preguntas-frecuentes` (Spanish) and `/en/faq` (English).

#### Scenario: Spanish FAQ route
- **WHEN** a user navigates to `/preguntas-frecuentes`
- **THEN** the FAQ page renders in Spanish with all Q&A content in Spanish

#### Scenario: English FAQ route
- **WHEN** a user navigates to `/en/faq`
- **THEN** the FAQ page renders in English with all Q&A content in English

### Requirement: FAQ page includes Navbar and Footer
The system SHALL render the FAQ page with the shared Navbar and Footer components, consistent with all other public pages.

#### Scenario: Page layout
- **WHEN** the FAQ page renders
- **THEN** the Navbar appears at the top and the Footer at the bottom, matching the layout of the landing page

### Requirement: FAQ page sets SEO metadata
The system SHALL set page title, meta description, canonical URL, hreflang alternates, and Open Graph tags via the useSEO hook.

#### Scenario: Spanish SEO tags
- **WHEN** the FAQ page renders at `/preguntas-frecuentes`
- **THEN** the document title contains "Preguntas Frecuentes", the canonical URL is `https://surferlabscr.com/preguntas-frecuentes`, and hreflang alternate points to `/en/faq`

### Requirement: FAQ page is included in sitemap
The system SHALL include the FAQ page (both language versions) in the XML sitemap with hreflang annotations.

#### Scenario: Sitemap includes FAQ
- **WHEN** the sitemap is generated
- **THEN** it contains URL entries for `/preguntas-frecuentes` and `/en/faq` with reciprocal hreflang links and x-default pointing to the Spanish version

### Requirement: FAQ page is prerendered for social bots
The system SHALL return prerendered HTML with correct OG meta tags when social media bots request the FAQ page URLs.

#### Scenario: WhatsApp bot requests FAQ
- **WHEN** a request with WhatsApp User-Agent hits `/preguntas-frecuentes`
- **THEN** the prerender handler returns HTML with og:title containing "Preguntas Frecuentes" and og:description about the surf school FAQ

### Requirement: FAQ content covers core visitor questions
The system SHALL display at least 6 Q&A items covering: booking process, cancellation policy, what to bring, experience level requirements, lesson duration, and location/directions.

#### Scenario: Minimum content
- **WHEN** the FAQ page renders
- **THEN** at least 6 distinct question-answer pairs are visible, each with a question heading and an answer paragraph
