# Spec Delta

## Purpose

Emits page-specific JSON-LD structured data so search engines can render rich results (FAQ accordions, review stars, course cards, breadcrumb trails) for the surf school website.

## ADDED Requirements

### Requirement: Landing page emits Course schemas
The system SHALL emit one `Course` JSON-LD object per active service type (surf_lesson, video_analysis, surf_trip) on the landing page, including name, description, provider, and price range.

#### Scenario: Three services active
- **WHEN** the landing page renders with three active service types
- **THEN** three `Course` JSON-LD objects are present in the document head, each with `@type: "Course"`, a localized name, description, and `provider` referencing the SportsActivityLocation

#### Scenario: Language switch
- **WHEN** the user views the English landing page at `/en`
- **THEN** Course names and descriptions use English values from the packages data

### Requirement: Landing page emits AggregateRating
The system SHALL include an `aggregateRating` property in the `SportsActivityLocation` JSON-LD when Google Reviews data is available, with `ratingValue`, `reviewCount`, and `bestRating`.

#### Scenario: Reviews loaded
- **WHEN** the Google Reviews hook returns reviews with an average rating of 4.8 from 25 reviews
- **THEN** the SportsActivityLocation JSON-LD includes `aggregateRating` with `ratingValue: 4.8`, `reviewCount: 25`, `bestRating: 5`

#### Scenario: Reviews unavailable
- **WHEN** the Google Reviews hook returns no data or errors
- **THEN** the SportsActivityLocation JSON-LD omits the `aggregateRating` property entirely

### Requirement: Instructor pages emit Review and AggregateRating schemas
The system SHALL emit `Review` JSON-LD objects for each instructor review and an `AggregateRating` on instructor profile pages, using data from the `instructor_reviews` table.

#### Scenario: Instructor with reviews
- **WHEN** an instructor profile page loads with 5 reviews averaging 4.6 stars
- **THEN** the document head contains a JSON-LD with `@type: "Person"`, an `aggregateRating` with `ratingValue: 4.6` and `reviewCount: 5`, and a `review` array with 5 `Review` objects each containing `author`, `reviewRating`, and `reviewBody`

#### Scenario: Instructor with no reviews
- **WHEN** an instructor profile page loads with zero reviews
- **THEN** no Review or AggregateRating JSON-LD is emitted for that instructor

### Requirement: Inner pages emit BreadcrumbList schema
The system SHALL emit a `BreadcrumbList` JSON-LD on every page except the landing page, with a trail from Home to the current page.

#### Scenario: Gallery page breadcrumb in Spanish
- **WHEN** the user visits `/galeria`
- **THEN** the document head contains a BreadcrumbList JSON-LD with items: `[{name: "Inicio", url: "https://surferlabscr.com/"}, {name: "Galería", url: "https://surferlabscr.com/galeria"}]`

#### Scenario: Instructor profile breadcrumb in English
- **WHEN** the user visits `/en/instructors/abc123`
- **THEN** the BreadcrumbList includes: Home → Instructors → [Instructor Name]

### Requirement: FAQPage schema emitted on FAQ page
The system SHALL emit a `FAQPage` JSON-LD on the FAQ page containing all question/answer pairs rendered on that page.

#### Scenario: FAQ page with 8 questions
- **WHEN** the FAQ page renders with 8 Q&A items in the current language
- **THEN** the document head contains a FAQPage JSON-LD with 8 `mainEntity` items, each with `@type: "Question"`, `name`, and `acceptedAnswer` with `@type: "Answer"` and `text`
