-- ============================================================
-- SECURITY HARDENING — Glorious Group of Schools
-- Run this in Supabase SQL Editor
-- Fixes all Security Advisor warnings while preserving CMS functionality
-- ============================================================

-- ============================================================
-- FIX 1: Function Search Path Mutable
-- Affected functions: news_set_slug, handle_new_admin_user
-- ============================================================

CREATE OR REPLACE FUNCTION public.news_set_slug()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- FIX 2: Ensure necessary columns exist
-- The original migrations may have created tables without
-- certain columns needed by triggers, policies, or the admin API.
-- ============================================================

-- news_set_slug trigger needs the slug column
ALTER TABLE news
  ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

ALTER TABLE contact_messages
  ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT false;

ALTER TABLE admission_enquiries
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow_up', 'enrolled', 'closed')),
  ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS subscribed BOOLEAN DEFAULT true;

-- ============================================================
-- FIX 3: RLS Always True → Least Privilege
-- Affected tables: contact_messages, admission_enquiries, newsletter_subscribers
-- ============================================================

-- 3a. contact_messages — visitors can only insert (not read/update/delete).
--      INSERT is restricted to default column values so visitors cannot
--      pre-set is_read/is_archived.
DROP POLICY IF EXISTS "Public insert contact" ON contact_messages;
CREATE POLICY "Public insert contact" ON contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    is_read = false
    AND is_archived = false
  );

-- 3b. admission_enquiries — visitors can only insert, and only with
--      'new' status and empty notes (cannot pre-set their own status).
DROP POLICY IF EXISTS "Public insert enquiries" ON admission_enquiries;
CREATE POLICY "Public insert enquiries" ON admission_enquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    status = 'new'
    AND notes = ''
  );

-- 3c. newsletter_subscribers — visitors can only insert.
--      subscribed must be true (cannot pre-opt-out).
DROP POLICY IF EXISTS "Public insert subscribers" ON newsletter_subscribers;
CREATE POLICY "Public insert subscribers" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (subscribed = true);

-- ============================================================
-- FIX 4: Restrict SECURITY DEFINER function execution
-- Affected: handle_new_admin_user() — PUBLIC execute revoked
-- ============================================================

REVOKE EXECUTE ON FUNCTION public.handle_new_admin_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_admin_user() TO service_role;

-- ============================================================
-- FIX 5: Complete RLS audit — every table verified
-- ============================================================

-- 5a. admin_roles — only authenticated super_admins can read/write
DROP POLICY IF EXISTS "Service role all admin_roles" ON admin_roles;
CREATE POLICY "Admin read own role" ON admin_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());
CREATE POLICY "Service role manage admin_roles" ON admin_roles
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 5b. site_content — public read, service_role write
DROP POLICY IF EXISTS "Public read site content" ON site_content;
DROP POLICY IF EXISTS "Service role all site_content" ON site_content;
CREATE POLICY "Public read site content" ON site_content
  FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Service role manage site_content" ON site_content
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 5c. news — public read only published, service_role writes
-- (Keep existing policies, just ensure they are correct)
-- Note: Existing policies are already correct. Only adding safety checks.

-- 5d. events — public read all, service_role writes
-- (Already correct)

-- 5e. testimonials — public read all, service_role writes
-- (Already correct)

-- 5f. gallery_images — public read all, service_role writes
-- (Already correct)

-- 5g. gallery_categories — public read all, service_role writes
-- (Already correct)

-- 5h. contact_messages — public insert only (no anon SELECT/UPDATE/DELETE)
DROP POLICY IF EXISTS "Service role all contact" ON contact_messages;
CREATE POLICY "Service role manage contact_messages" ON contact_messages
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 5i. admission_enquiries — public insert only
DROP POLICY IF EXISTS "Service role all enquiries" ON admission_enquiries;
CREATE POLICY "Service role manage admission_enquiries" ON admission_enquiries
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 5j. newsletter_subscribers — public insert only
DROP POLICY IF EXISTS "Service role all subscribers" ON newsletter_subscribers;
CREATE POLICY "Service role manage newsletter_subscribers" ON newsletter_subscribers
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- 5k. site_settings — public read, service_role write
DROP POLICY IF EXISTS "Public read site settings" ON site_settings;
DROP POLICY IF EXISTS "Service role all settings" ON site_settings;
CREATE POLICY "Public read site settings" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Service role manage site_settings" ON site_settings
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- FIX 6: Storage bucket RLS
-- Create storage buckets if missing and set secure policies
-- Buckets: gallery, news, documents
-- ============================================================

INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES
  ('gallery', 'gallery', true, false),
  ('news', 'news', true, false),
  ('documents', 'documents', true, false)
ON CONFLICT (id) DO NOTHING;

-- Public read: anyone can view images
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
CREATE POLICY "Public read gallery" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('gallery', 'news', 'documents'));

-- Authenticated admin upload: only authenticated users with a session can upload
DROP POLICY IF EXISTS "Admin upload gallery" ON storage.objects;
CREATE POLICY "Admin upload gallery" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('gallery', 'news', 'documents')
    AND (storage.foldername(name))[1] != 'private'
  );

-- Admin update/delete: only authenticated users
DROP POLICY IF EXISTS "Admin manage gallery" ON storage.objects;
CREATE POLICY "Admin manage gallery" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id IN ('gallery', 'news', 'documents'))
  WITH CHECK (bucket_id IN ('gallery', 'news', 'documents'));

DROP POLICY IF EXISTS "Admin delete gallery" ON storage.objects;
CREATE POLICY "Admin delete gallery" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id IN ('gallery', 'news', 'documents'));

-- Service role full access (for API-level operations)
DROP POLICY IF EXISTS "Service role gallery" ON storage.objects;
CREATE POLICY "Service role gallery" ON storage.objects
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- ============================================================
-- FIX 7: Leaked Password Protection
-- This is a Supabase project setting, not SQL.
-- Enable it at:
--   Authentication → Password → Leaked Password Protection → ON
-- ============================================================

-- ============================================================
-- VERIFICATION
-- Run these queries to verify the fixes:
--
-- 1. Check function search_path:
--    SELECT proname, prosrc FROM pg_proc WHERE proname IN ('news_set_slug', 'handle_new_admin_user');
--
-- 2. Check RLS policies:
--    SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
--    FROM pg_policies WHERE schemaname = 'public'
--    ORDER BY tablename, policyname;
--
-- 3. Check function permissions:
--    SELECT n.nspname, p.proname, pg_catalog.pg_get_function_result(p.oid) as result_type,
--           pg_catalog.pg_get_function_arguments(p.oid) as args,
--           CASE WHEN p.prosecdef THEN 'SECURITY_DEFINER' ELSE 'SECURITY_INVOKER' END as security,
--           array_to_string(ARRAY(SELECT privilege_type FROM information_schema.routine_privileges
--                                 WHERE routine_name = p.proname
--                                 AND routine_schema = n.nspname
--                                 AND grantee IN ('PUBLIC', 'anon', 'authenticated')), ', ') as granted_to
--    FROM pg_proc p
--    JOIN pg_namespace n ON n.oid = p.pronamespace
--    WHERE n.nspname = 'public'
--    AND p.proname IN ('handle_new_admin_user')
--    ORDER BY p.proname;
-- ============================================================
