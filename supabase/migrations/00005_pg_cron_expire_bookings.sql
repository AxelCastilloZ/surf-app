-- Enable pg_cron and pg_net extensions
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Schedule: every hour, expire pending bookings whose token has expired
select cron.schedule(
  'expire-pending-bookings',
  '0 * * * *',
  $$
    UPDATE bookings
    SET status = 'expired', updated_at = now()
    WHERE status = 'pending'
      AND token_expires_at < now()
  $$
);
