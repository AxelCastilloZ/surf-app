# Tasks

## 1. Harden Zod schema validation

- [x] 1.1 Add `.refine()` to `booking_date` field to reject past dates, using the existing `t.errors.pastDate` i18n message and `getTodayStr()` helper.
- [x] 1.2 Add `.max(10)` to `participants` field to enforce the same limit as the HTML input.
