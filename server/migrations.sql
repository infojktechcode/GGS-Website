-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admission_enquiries (
  id BIGSERIAL PRIMARY KEY,
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_age INT,
  grade_applying TEXT NOT NULL,
  message TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert contact_messages"
  ON contact_messages FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can insert admission_enquiries"
  ON admission_enquiries FOR INSERT
  TO service_role
  WITH CHECK (true);
