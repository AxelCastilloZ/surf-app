# supabase/ — Backend (Edge Functions + Database)

All backend logic runs on Supabase: Edge Functions (Deno), RLS policies, pg_cron, and database triggers. This replaced the NestJS API (`apps/api/`).

## Edge Functions (9 functions)

All functions are in `functions/` and share utilities from `functions/_shared/`.

### Public (no auth required)

| Function | Method | Description |
|----------|--------|-------------|
| `create-booking` | POST | Creates booking: upserts client, calculates price from `service_pricing_tiers`, generates confirmation token (48h expiry), sends confirmation email to client + notification to staff via Resend |
| `confirm-booking` | POST | Validates confirmation token, marks booking as confirmed, sets `confirmed_at` |
| `google-reviews` | GET | Proxies Google Places API, filters reviews with rating >= 4, returns max 10, caches 24 hours in-memory |
| `create-instructor-review` | POST | Validates that booking is completed and assigned to the instructor, then inserts review |

### Admin (requires Supabase Auth, verified via `is_admin()`)

| Function | Method | Description |
|----------|--------|-------------|
| `update-booking-status` | POST | Updates booking status with transition validation. Sends status-change email to client (completed/cancelled). Requires admin auth |
| `assign-instructors` | POST | Assigns instructor IDs to a booking (replaces existing). Requires admin auth |
| `admin-create-user` | POST | Creates a new dashboard user in Supabase Auth + `dashboard_users` table. Requires admin auth, uses service_role client |
| `check-instructor-availability` | POST | Checks Google Calendar availability for instructors assigned to a booking. Uses service account JWT auth |

### Triggered (not called directly)

| Function | Trigger | Description |
|----------|---------|-------------|
| `send-expiration-emails` | pg_cron + pg_net (hourly) | When pg_cron marks bookings as expired, a database trigger calls this function via pg_net to send expiration notification emails |

## Shared Utilities (`functions/_shared/`)

```typescript
// supabase.ts
createServiceClient()  // service_role key, bypasses RLS
createAnonClient()     // anon key, respects RLS

// cors.ts
corsHeaders            // Access-Control headers for surferlabscr.com
handleCors(req)        // Returns OPTIONS response if preflight

// resend.ts
sendEmail({ to, subject, html })  // Via Resend API
getStaffEmail()                    // From STAFF_NOTIFY_EMAIL secret
getWebUrl()                        // From WEB_URL secret
```

## Database Migrations (`migrations/`)

Applied in order:

1. `00001_enable_rls.sql` — Enables RLS on all 10 tables
2. `00002_rls_public_read.sql` — Public SELECT policies (anon + authenticated) for gallery, packages, instructors, reviews, pricing, settings, booking_instructors. Filters by `is_visible`/`is_active` where applicable
3. `00003_rls_public_write.sql` — Public SELECT on bookings WHERE confirmation_token IS NOT NULL (for token-based confirmation page)
4. `00004_rls_admin.sql` — Creates `is_admin()` helper function that checks `auth.uid()` against `dashboard_users` table. Grants full CRUD to admin on all tables. Superadmin-only write on `dashboard_users`
5. `00005_pg_cron_expire_bookings.sql` — Enables `pg_cron` and `pg_net` extensions. Schedules hourly job: `UPDATE bookings SET status = 'expired' WHERE status = 'pending' AND token_expires_at < now()`
6. `00006_trigger_expiration_emails.sql` — Creates trigger function that calls `send-expiration-emails` Edge Function via `net.http_post()` when a booking's status changes to `'expired'`

## RLS Summary

| Role | Can do |
|------|--------|
| `anon` | SELECT on public tables (gallery, packages, instructors, reviews, pricing, settings) with visibility filters. SELECT bookings by confirmation_token |
| `authenticated` | Same as anon, plus whatever Edge Functions do with service_role client |
| `admin` (via `is_admin()`) | Full CRUD on all tables except `dashboard_users` |
| `superadmin` | Full CRUD on everything including `dashboard_users` |

The `is_admin()` function:
```sql
CREATE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.dashboard_users
    WHERE id = auth.uid() AND is_active = true AND role IN ('admin','superadmin')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

## Booking Status Flow

```
pending → confirmed → completed
pending → expired (by pg_cron)
pending → cancelled
confirmed → cancelled
confirmed → completed
```

Each transition triggers appropriate emails via Edge Functions.

## Secrets (set in Supabase Dashboard → Edge Functions → Secrets)

```
RESEND_API_KEY          — Resend API key for transactional emails
MAIL_FROM               — Sender address (e.g., noreply@surferlabscr.com)
STAFF_NOTIFY_EMAIL      — Staff notification recipient
WEB_URL                 — https://surferlabscr.com (for email links)
GOOGLE_PLACES_API_KEY   — Google Places API key (reviews)
GOOGLE_PLACE_ID         — Google Place ID for the surf school
GOOGLE_SERVICE_ACCOUNT_EMAIL       — Google service account email (Calendar API)
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY — Google service account private key (Calendar API)
```

## Deploying Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy a specific function
supabase functions deploy create-booking

# Set a secret
supabase secrets set RESEND_API_KEY=re_xxxxx
```

## CORS

Edge Functions allow requests from `https://surferlabscr.com` only (configured in `_shared/cors.ts`). Local development on `localhost` will get CORS errors for Edge Function calls — this is expected.
