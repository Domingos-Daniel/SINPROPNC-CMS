-- Disable RLS and allow public read access for new tables
ALTER TABLE contact_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, add policies:
-- CREATE POLICY "Allow public read access" ON contact_info FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON menu_items FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access" ON faqs FOR SELECT USING (true);