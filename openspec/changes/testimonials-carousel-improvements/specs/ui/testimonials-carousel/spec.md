# Spec Delta

## Purpose

Improves the testimonials carousel UX with navigation controls, autoplay, consistent card design, and edge fade effects.

## ADDED Requirements

### Requirement: Carousel has navigation arrows
The carousel SHALL display left and right arrow buttons for manual navigation.

#### Scenario: Arrow navigation
- **WHEN** the user clicks the right arrow
- **THEN** the carousel advances to the next slide

### Requirement: Carousel has dot indicators
The carousel SHALL display dot indicators showing the current slide position and total count.

#### Scenario: Active dot
- **WHEN** the carousel is on slide 2 of 5
- **THEN** the second dot is visually highlighted

### Requirement: Carousel auto-rotates
The carousel SHALL auto-advance every 5 seconds, pausing when the user hovers or interacts.

#### Scenario: Autoplay pause
- **WHEN** the user hovers over the carousel
- **THEN** autoplay pauses and resumes when the cursor leaves

### Requirement: Fallback cards match Google Review card design
The fallback testimonial cards SHALL use the same visual style as Google Review cards (white background, shadow, consistent typography and layout).

#### Scenario: Visual consistency
- **WHEN** Google Reviews are unavailable and fallback cards are shown
- **THEN** the cards are visually indistinguishable in style from Google Review cards

### Requirement: Carousel edges have fade effect
The carousel SHALL display gradient fade masks on the left and right edges so partially visible cards fade out smoothly.

#### Scenario: Edge visibility
- **WHEN** a card is partially visible at the carousel edge
- **THEN** it fades to transparent rather than clipping abruptly
