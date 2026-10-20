# Design

## Context

The landing page starts with a full-viewport hero section, followed by Instructors. Adding badges between the hero and the first content section provides an immediate trust signal after the emotional hero impact. Icons from lucide-react (Shield, Users, Star, Award) are available.

## Goals / Non-Goals

**Goals:**
- Instant trust signals visible without scrolling past the first screen
- Compact, non-intrusive design that complements the hero

**Non-Goals:**
- Dynamic data (live review counts, etc.) — these are static trust signals
- Links from the badges to other pages

## Decisions

### 1. Four trust badges

**Choice:** Four badges with icons:
1. **Shield + "ISA Certificados" / "ISA Certified"** — Instructor certification
2. **Users + "500+ Estudiantes" / "500+ Students"** — Social proof via volume
3. **Star + "4.9 Google Rating"** — External validation (same in both languages)
4. **Award + "#1 en Nosara" / "#1 in Nosara"** — Location authority

**Rationale:** Covers the four pillars of trust: expertise (certification), popularity (volume), external validation (reviews), and local authority (market position).

### 2. Placement and style

**Choice:** A `bg-ocean-600` strip with white text and icons, placed between hero and the first section. Grid of 2x2 on mobile, 4-column on desktop. Each badge: icon + bold value + label.

**Rationale:** Ocean-600 creates a visual anchor that separates the hero from content sections. Dark background with white text ensures badges are scannable and distinct from the sand/white content sections below.

## Risks / Trade-offs

- **Static numbers may become outdated**: "500+ Students" and "4.9 Google Rating" are hardcoded. → Acceptable for now; these change slowly and can be updated manually. Dynamic fetching would add complexity for minimal benefit.
