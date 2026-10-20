# Proposal

## Why

The landing page explains what services are offered but not how the experience works step-by-step. First-time visitors, especially those who have never taken a surf lesson, face uncertainty: "What happens after I book? Do I need to bring anything? Where do I meet?" A clear "How it works" section reduces friction and builds confidence, directly increasing booking conversion. Competitor analysis (jirehadventure.com) confirmed this is a standard pattern in adventure-tourism sites.

## What Changes

- **New "How it works" section**: A 3-step visual process (Book → Meet & Gear Up → Surf!) placed between Services and Packages on the landing page
- **Bilingual content**: Full ES/EN translations following the existing inline i18n pattern
- **Visual design**: Numbered step cards with icons, connected by a subtle visual flow, using the existing warm palette (coral accents, sand backgrounds)

## Capabilities

### New Capabilities

- `ui/landing-how-it-works`: A step-by-step process section on the landing page showing how the surf lesson experience works, from booking to surfing

### Modified Capabilities

_None._

## Impact

- **Files modified:** `apps/web/src/pages/LandingPage.tsx`
- **Risk:** Low — adds a new section, no changes to existing sections or logic
- **No dependency changes**
