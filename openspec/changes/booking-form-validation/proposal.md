# Proposal: Booking form Zod validation hardening

## Why

The booking form's Zod schema had validation gaps that could allow invalid data to reach the backend:
- `booking_date` accepted any non-empty string, including past dates. The `pastDate` error messages existed in both languages but were unused.
- `participants` had `min(1)` but no `max()`, so users could bypass the HTML `max=10` attribute and submit arbitrarily large group sizes.

## What Changes

### Capability: ui/booking-form

- **Future date validation:** Added `.refine()` to `booking_date` that checks `val >= getTodayStr()`, using the existing `t.errors.pastDate` message.
- **Max participants:** Added `.max(10)` to the `participants` field to match the HTML input constraint.

## Impact

- **Files modified:** `apps/web/src/pages/BookingFormPage.tsx`
- **Risk:** Low — adds server-side-like validation to the client form; no data model changes.
