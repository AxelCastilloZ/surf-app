-- Trigger function: when a booking status changes to 'expired',
-- call the send-expiration-emails Edge Function via pg_net
create or replace function notify_booking_expired()
returns trigger
language plpgsql
security definer
as $$
declare
  edge_function_url text;
  service_role_key text;
begin
  if NEW.status = 'expired' and (OLD.status is distinct from 'expired') then
    edge_function_url := current_setting('app.settings.supabase_url', true)
      || '/functions/v1/send-expiration-emails';
    service_role_key := current_setting('app.settings.service_role_key', true);

    -- Fire and forget via pg_net
    perform net.http_post(
      url := edge_function_url,
      body := jsonb_build_object('booking_id', NEW.id),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      )
    );
  end if;
  return NEW;
end;
$$;

create trigger on_booking_expired
  after update of status on bookings
  for each row
  execute function notify_booking_expired();
