-- Public read access for anonymous users (website visitors)

-- Gallery: visible items only
CREATE POLICY "gallery_public_read" ON gallery_items
  FOR SELECT TO anon, authenticated
  USING (is_visible = true);

-- Packages: active only
CREATE POLICY "packages_public_read" ON packages
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Instructors: active only
CREATE POLICY "instructors_public_read" ON instructors
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Instructor reviews: all visible
CREATE POLICY "instructor_reviews_public_read" ON instructor_reviews
  FOR SELECT TO anon, authenticated
  USING (true);

-- Pricing tiers: active only
CREATE POLICY "pricing_tiers_public_read" ON service_pricing_tiers
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- Site settings: all readable
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

-- Booking instructors: readable for joins
CREATE POLICY "booking_instructors_public_read" ON booking_instructors
  FOR SELECT TO anon, authenticated
  USING (true);
