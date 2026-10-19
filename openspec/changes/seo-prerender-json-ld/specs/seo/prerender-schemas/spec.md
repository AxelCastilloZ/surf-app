# Spec Delta

## Purpose

Ensures JSON-LD structured data is present in the server-rendered HTML served to social media bots and non-JS crawlers, complementing the client-side schemas already emitted by the useSEO hook.

## ADDED Requirements

### Requirement: Prerender includes SportsActivityLocation for landing pages
The prerender function SHALL include a SportsActivityLocation JSON-LD schema in the HTML served for `/` and `/en` routes.

#### Scenario: Spanish landing prerender
- **WHEN** a bot requests `/`
- **THEN** the response HTML contains a `<script type="application/ld+json">` tag with a SportsActivityLocation schema including business name, address, geo coordinates, and services

#### Scenario: English landing prerender
- **WHEN** a bot requests `/en`
- **THEN** the response HTML contains a SportsActivityLocation schema with `inLanguage: "en"`

### Requirement: Prerender includes BreadcrumbList for inner pages
The prerender function SHALL include a BreadcrumbList JSON-LD schema for gallery, booking, policies, confirm-booking, and FAQ routes.

#### Scenario: Gallery breadcrumb
- **WHEN** a bot requests `/galeria`
- **THEN** the response HTML contains a BreadcrumbList JSON-LD with items: Inicio → Galería

### Requirement: Prerender includes FAQPage schema for FAQ routes
The prerender function SHALL include a FAQPage JSON-LD schema with all Q&A pairs for `/preguntas-frecuentes` and `/en/faq`.

#### Scenario: Spanish FAQ prerender
- **WHEN** a bot requests `/preguntas-frecuentes`
- **THEN** the response HTML contains a FAQPage JSON-LD with mainEntity array containing at least 8 Question objects with Spanish text

#### Scenario: English FAQ prerender
- **WHEN** a bot requests `/en/faq`
- **THEN** the response HTML contains a FAQPage JSON-LD with mainEntity array containing at least 8 Question objects with English text

### Requirement: Prerender includes Person schema for instructor pages
The prerender function SHALL include a Person JSON-LD schema for instructor profile routes, with the instructor's name and job title.

#### Scenario: Instructor profile prerender
- **WHEN** a bot requests `/instructores/:id` for an active instructor
- **THEN** the response HTML contains a Person JSON-LD with the instructor's full_name, jobTitle, and worksFor reference
