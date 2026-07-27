-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  category TEXT DEFAULT 'General',
  image TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  time TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (true);

CREATE POLICY "Service role manages news" ON news FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages events" ON events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages testimonials" ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages site_settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO site_settings (key, value) VALUES ('school_info', '{
  "name": "Glorious Group of Schools",
  "motto": "Education is the key for a better tomorrow",
  "description": "Providing quality CBC education from Early Years to Junior School."
}') ON CONFLICT (key) DO NOTHING;
