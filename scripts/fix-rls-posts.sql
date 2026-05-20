-- Fix RLS policies for posts and pages tables
-- Run this in Supabase SQL Editor if you get RLS violation errors

-- ========================================
-- POSTS table policies
-- ========================================

-- Enable RLS on posts (if not already)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "posts_select_public" ON posts;
DROP POLICY IF EXISTS "posts_all_admin" ON posts;
DROP POLICY IF EXISTS "posts_select_admin" ON posts;
DROP POLICY IF EXISTS "posts_insert_admin" ON posts;
DROP POLICY IF EXISTS "posts_update_admin" ON posts;
DROP POLICY IF EXISTS "posts_delete_admin" ON posts;

-- Public read: only published posts
CREATE POLICY "posts_select_public" ON posts
  FOR SELECT USING (is_published = true);

-- Admin read: authenticated users can read all posts (including drafts)
CREATE POLICY "posts_select_admin" ON posts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Admin insert: authenticated users can create posts
CREATE POLICY "posts_insert_admin" ON posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admin update: authenticated users can update posts
CREATE POLICY "posts_update_admin" ON posts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin delete: authenticated users can delete posts
CREATE POLICY "posts_delete_admin" ON posts
  FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- PAGES table policies
-- ========================================

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pages_select_public" ON pages;
DROP POLICY IF EXISTS "pages_all_admin" ON pages;
DROP POLICY IF EXISTS "pages_select_admin" ON pages;
DROP POLICY IF EXISTS "pages_insert_admin" ON pages;
DROP POLICY IF EXISTS "pages_update_admin" ON pages;
DROP POLICY IF EXISTS "pages_delete_admin" ON pages;

CREATE POLICY "pages_select_public" ON pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "pages_select_admin" ON pages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "pages_insert_admin" ON pages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "pages_update_admin" ON pages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "pages_delete_admin" ON pages
  FOR DELETE USING (auth.role() = 'authenticated');

-- ========================================
-- SETTINGS table policies (admin only)
-- ========================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "settings_all_admin" ON settings;
DROP POLICY IF EXISTS "settings_select_admin" ON settings;
DROP POLICY IF EXISTS "settings_insert_admin" ON settings;
DROP POLICY IF EXISTS "settings_update_admin" ON settings;

CREATE POLICY "settings_select_admin" ON settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "settings_insert_admin" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "settings_update_admin" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ========================================
-- SECTIONS table policies
-- ========================================

ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sections_select_public" ON sections;
DROP POLICY IF EXISTS "sections_all_admin" ON sections;

CREATE POLICY "sections_select_public" ON sections
  FOR SELECT USING (true);

CREATE POLICY "sections_all_admin" ON sections
  FOR ALL USING (auth.role() = 'authenticated');
