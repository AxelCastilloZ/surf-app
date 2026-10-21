-- Blog posts table for SEO content marketing
CREATE TABLE blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  title_en text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  excerpt_en text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  meta_description_en text NOT NULL DEFAULT '',
  keywords text NOT NULL DEFAULT '',
  cover_image text,
  cover_image_alt text NOT NULL DEFAULT '',
  cover_image_alt_en text NOT NULL DEFAULT '',
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public: read published posts only
CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

-- Admin: full CRUD
CREATE POLICY "blog_posts_admin_all" ON blog_posts
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();
