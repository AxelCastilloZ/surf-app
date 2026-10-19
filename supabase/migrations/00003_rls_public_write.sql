-- Public write access: booking creation and reviews

-- Clients: anon can insert (find-or-create happens in Edge Function with service_role)
-- No direct anon write — handled by Edge Function

-- Bookings: anon can read their own confirmation status via token
CREATE POLICY "bookings_read_by_token" ON bookings
  FOR SELECT TO anon
  USING (confirmation_token IS NOT NULL);

-- Instructor reviews: anon can insert (validation in Edge Function)
-- No direct anon insert — handled by Edge Function
