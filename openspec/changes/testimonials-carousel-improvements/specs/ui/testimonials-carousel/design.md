# Design

## Implementation Details

### File: `apps/web/src/pages/LandingPage.tsx`

**Imports added:**
- `useCallback`, `useEffect`, `useState` from React
- `Autoplay` from `embla-carousel-autoplay`
- `ChevronLeft`, `ChevronRight` from `lucide-react`

**TestimonialsSection changes:**
- Embla initialized with `Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })` plugin
- `useEmblaCarousel` now returns `emblaApi` for controlling navigation
- State: `selectedIndex` (current slide) and `scrollSnaps` (all snap positions)
- `useEffect` listens to `reInit` (for snap list) and `select` (for active index)
- Prev/next arrow buttons positioned absolutely at `left-0` / `right-0`, centered vertically
- Dot indicators rendered below the carousel when `scrollSnaps.length > 1`
- Active dot: `w-6 bg-ocean-600` (pill shape); inactive: `w-2.5 bg-slate-300`
- Edge fade: two gradient `div`s with `pointer-events-none` and `z-10`, fading from white to transparent

**New component: `FallbackCard`**
- Extracted from inline fallback rendering
- Matches `ReviewCard` layout: white bg, `shadow-sm`, `border-slate-200`, `rounded-2xl`, `p-6`
- Avatar initial circle (ocean-600 bg, same as ReviewCard)
- Country shown as `text-xs text-slate-400` (matching ReviewCard's relative_time_description style)
- 5-star static rating with same sizing as ReviewCard (14px)
- Text truncated at 150 chars like ReviewCard

### File: `apps/web/package.json`

**Dependency added:**
- `embla-carousel-autoplay`: `^8.5.2`
