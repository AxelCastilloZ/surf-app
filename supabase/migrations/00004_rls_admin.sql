-- Admin access: authenticated users with admin role
-- Uses dashboard_users table linked by auth.uid() = dashboard_user.id
-- Admin users will be created in Supabase Auth with their dashboard_users.id as auth uid

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM dashboard_users
    WHERE id = auth.uid()
      AND is_active = true
      AND role IN ('admin', 'superadmin')
  );
$$;

-- Gallery: admin full CRUD
CREATE POLICY "gallery_admin_all" ON gallery_items
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Packages: admin full CRUD
CREATE POLICY "packages_admin_all" ON packages
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Instructors: admin full CRUD
CREATE POLICY "instructors_admin_all" ON instructors
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Instructor reviews: admin can read all (delete if needed)
CREATE POLICY "instructor_reviews_admin_all" ON instructor_reviews
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Pricing tiers: admin full CRUD
CREATE POLICY "pricing_tiers_admin_all" ON service_pricing_tiers
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Site settings: admin can update
CREATE POLICY "site_settings_admin_all" ON site_settings
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Clients: admin full access
CREATE POLICY "clients_admin_all" ON clients
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Bookings: admin full access
CREATE POLICY "bookings_admin_all" ON bookings
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Booking instructors: admin full access
CREATE POLICY "booking_instructors_admin_all" ON booking_instructors
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Dashboard users: admin can read, superadmin can manage
CREATE POLICY "dashboard_users_admin_read" ON dashboard_users
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "dashboard_users_superadmin_write" ON dashboard_users
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM dashboard_users
      WHERE id = auth.uid()
        AND is_active = true
        AND role = 'superadmin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dashboard_users
      WHERE id = auth.uid()
        AND is_active = true
        AND role = 'superadmin'
    )
  );
