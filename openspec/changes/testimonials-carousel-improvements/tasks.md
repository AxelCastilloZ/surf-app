# Tasks

## 1. Install autoplay plugin

- [x] 1.1 Add `embla-carousel-autoplay` to `apps/web` dependencies. Verify it installs and resolves.

## 2. Add navigation controls and autoplay

- [x] 2.1 Configure Embla with autoplay plugin (5s delay, stop on interaction, resume on mouse leave). Add prev/next arrow buttons and dot indicators using Embla's API (`scrollPrev`, `scrollNext`, `scrollTo`, `selectedScrollSnap`, `scrollSnapList`). Verify arrows navigate slides and dots reflect the active position.

## 3. Unify card design

- [x] 3.1 Refactor fallback cards to use the same layout as ReviewCard (white bg, shadow, consistent spacing/typography). Add a generic avatar initial and static 5-star rating to match the Google Review card structure. Verify fallback cards are visually consistent with Google Review cards.

## 4. Add edge fade effect

- [x] 4.1 Add CSS gradient masks on left and right edges of the carousel container so partially visible cards fade to transparent. Verify the fade is visible when cards extend beyond the viewport.

## 5. Integration verification

- [x] 5.1 Run `pnpm type-check` and `pnpm build` and verify both pass.
- [x] 5.2 Start dev server and verify all carousel improvements visually.
