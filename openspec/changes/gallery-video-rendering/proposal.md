# Proposal: Fix gallery video rendering

## Why

Video items in the gallery grid were rendered using `<img src={videoUrl}>`, which produced broken images since browsers cannot display a video file as an image. The lightbox (yet-another-react-lightbox with the Video plugin) handled videos correctly, but the grid thumbnails did not.

## What Changes

### Capability: ui/gallery-grid

- **Video thumbnail:** Replaced `<img>` with `<video>` element for video items in `GalleryCard`. Uses `muted`, `playsInline`, and `preload="metadata"` so the browser renders the first frame as a static thumbnail without autoplaying or downloading the full file.
- **Image items unchanged:** Non-video items continue using `<img>` with lazy loading.

## Impact

- **Files modified:** `apps/web/src/pages/GalleryPage.tsx`
- **Risk:** Low — only affects how video thumbnails display in the grid. Lightbox behavior is unchanged.
