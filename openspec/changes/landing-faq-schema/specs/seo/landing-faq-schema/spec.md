# Spec Delta

## Purpose

Adds FAQPage structured data to the landing page so Google can display FAQ rich snippets from the homepage.

## ADDED Requirements

### Requirement: Landing page emits FAQPage JSON-LD

The landing page SHALL include a FAQPage schema.org JSON-LD script containing the inline FAQ items.

#### Scenario: Google crawls the landing page

- **WHEN** a search engine crawls the landing page
- **THEN** the page includes a `<script type="application/ld+json">` with `@type: "FAQPage"` and `mainEntity` containing each FAQ question and answer
