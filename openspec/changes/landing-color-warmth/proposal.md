# Proposal

## Why

The current landing page palette is heavily weighted toward cool tones (ocean turquesa + white + slate gray). The warm accent colors (coral and sand) only appear in CTA buttons and review stars respectively, making the page feel corporate rather than tropical. Adding more warmth through strategic use of coral and sand, and improving section contrast, creates a more inviting and energetic feel appropriate for a Costa Rica surf school.

## What Changes

- **Section heading accents**: Add coral-colored decorative elements (small bars or accent text) to section headings to break the monotony of all-slate titles
- **Improved section contrast**: Replace barely-visible `mist-50` alternating backgrounds with a warmer, slightly more visible tone
- **Sand/warm accents**: Use sand tones for decorative elements like value bullets, icon backgrounds, and FAQ borders
- **Service card icon backgrounds**: Shift from cold ocean-100 to warmer sand tones for visual variety
- **About section values**: Use coral/sand bullets instead of uniform coral dots

## Capabilities

### New Capabilities

- `ui/landing-color-warmth`: Visual warmth improvements to the landing page color usage, increasing presence of coral and sand accent colors across sections

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`
- **Risk:** Low — purely visual styling changes, no logic or structural modifications
- **No dependency changes**
