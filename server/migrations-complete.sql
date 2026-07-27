-- ============================================
-- COMPLETE CMS MIGRATION — Glorious Group of Schools
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. ADMIN ROLES (maps auth.users to roles)
CREATE TABLE IF NOT EXISTS admin_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SITE CONTENT (hero, welcome, stats, about, academics, etc.)
CREATE TABLE IF NOT EXISTS site_content (
  id BIGSERIAL PRIMARY KEY,
  section TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NEWS
CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  date DATE DEFAULT CURRENT_DATE,
  category TEXT DEFAULT 'General',
  image TEXT DEFAULT '',
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  time TEXT DEFAULT '',
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT '',
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GALLERY
CREATE TABLE IF NOT EXISTS gallery_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id BIGSERIAL PRIMARY KEY,
  title TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  src TEXT NOT NULL,
  category_id INTEGER REFERENCES gallery_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADMISSION ENQUIRIES
CREATE TABLE IF NOT EXISTS admission_enquiries (
  id BIGSERIAL PRIMARY KEY,
  parent_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  child_name TEXT DEFAULT '',
  child_age INTEGER DEFAULT 0,
  grade_applying TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'follow_up', 'enrolled', 'closed')),
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. NEWSLETTER SUBSCRIBERS
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ POLICIES (anon users can read published content)
CREATE POLICY "Public read news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read gallery categories" ON gallery_categories FOR SELECT USING (true);
CREATE POLICY "Public read site content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);

-- SERVICE ROLE POLICIES (API endpoints use service_role)
CREATE POLICY "Service role all admin_roles" ON admin_roles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all site_content" ON site_content FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all news" ON news FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all events" ON events FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all testimonials" ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all gallery" ON gallery_images FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all gallery categories" ON gallery_categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all contact" ON contact_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all enquiries" ON admission_enquiries FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all subscribers" ON newsletter_subscribers FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role all settings" ON site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Allow public INSERT on contact, enquiries, subscribers (for the public forms)
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert enquiries" ON admission_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public insert subscribers" ON newsletter_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ============================================
-- SEED DATA
-- ============================================

-- Gallery categories
INSERT INTO gallery_categories (name, slug, sort_order) VALUES
  ('All', 'all', 0),
  ('Learning', 'learning', 1),
  ('Events', 'events', 2),
  ('Sports', 'sports', 3),
  ('Graduation', 'graduation', 4),
  ('Campus Life', 'campus', 5),
  ('Competitions', 'competitions', 6)
ON CONFLICT (slug) DO NOTHING;

-- Site settings
INSERT INTO site_settings (key, value) VALUES
('school_info', '{
  "name": "Glorious Group of Schools",
  "motto": "Education is the key for a better tomorrow",
  "shortDescription": "Providing quality CBC education from Early Years to Junior School. We nurture academic excellence, character development, and holistic growth in every student.",
  "address": "123 Glorious Avenue, Off Mombasa Road, Nairobi, Kenya",
  "phones": ["+254 712 345 678", "+254 734 567 890"],
  "emails": ["info@gloriousschools.ac.ke", "admissions@gloriousschools.ac.ke"],
  "officeHours": "Monday - Friday: 7:30 AM - 4:30 PM | Saturday: 8:00 AM - 12:00 PM",
  "emergencyContacts": ["+254 722 111 222 (Security)", "+254 733 333 444 (Health Center)"],
  "socialMedia": {
    "facebook": "https://facebook.com/gloriousgroupofschools",
    "twitter": "https://twitter.com/gloriousschools",
    "instagram": "https://instagram.com/gloriousgroupofschools",
    "youtube": "https://youtube.com/@gloriousschools",
    "linkedin": "https://linkedin.com/company/glorious-group-of-schools"
  }
}') ON CONFLICT (key) DO NOTHING;

-- Site content (all dynamic page content)
INSERT INTO site_content (section, data) VALUES
('hero', '{
  "headline": "Shaping Tomorrow''s Leaders Today",
  "subheadline": "Where academic excellence meets character development in a nurturing Christian environment."
}'),
('welcome', '{
  "title": "Welcome to Glorious Group of Schools",
  "paragraphs": [
    "At Glorious Group of Schools, we believe every child is a unique gift with unlimited potential. Since our founding, we have been dedicated to providing an exceptional educational experience that nurtures intellectual curiosity, moral integrity, and creative expression.",
    "Our CBC-aligned curriculum, combined with dedicated teachers and a supportive community, creates an environment where students thrive academically, socially, and spiritually. We partner with parents to raise confident, compassionate, and capable individuals ready to make a positive impact on the world."
  ]
}'),
('why_choose_us', '{
  "items": [
    {"title": "Academic Excellence", "description": "Consistent top performance in national examinations with a focus on mastery of the CBC curriculum.", "icon": "GraduationCap"},
    {"title": "Qualified Teachers", "description": "Highly trained, experienced, and dedicated educators who inspire a love for learning.", "icon": "Users"},
    {"title": "Holistic Learning", "description": "Balanced development through academics, sports, arts, and character education.", "icon": "BookOpen"},
    {"title": "Safe Environment", "description": "Secure, well-maintained campus with modern facilities and round-the-clock supervision.", "icon": "Shield"},
    {"title": "Christian Values", "description": "Strong moral foundation rooted in Christian principles and ethical teaching.", "icon": "Heart"},
    {"title": "Technology Integration", "description": "Modern digital tools and resources integrated into everyday learning experiences.", "icon": "Monitor"},
    {"title": "Student-Centered Learning", "description": "Personalized attention with small class sizes and differentiated instruction.", "icon": "Star"}
  ]
}'),
('stats', '{
  "items": [
    {"label": "Students", "value": 1200, "suffix": "+"},
    {"label": "Teachers", "value": 85, "suffix": "+"},
    {"label": "Graduation Rate", "value": 99, "suffix": "%"},
    {"label": "Years of Excellence", "value": 15, "suffix": "+"},
    {"label": "Awards Won", "value": 25, "suffix": "+"}
  ]
}'),
('student_life', '{
  "items": [
    {"title": "Sports", "description": "Football, athletics, swimming, volleyball, basketball, and more.", "icon": "Trophy"},
    {"title": "Music", "description": "Choir, band, instrumental lessons, and annual music festivals.", "icon": "Music"},
    {"title": "Drama", "description": "Theatre productions, debate, storytelling, and public speaking.", "icon": "Clapperboard"},
    {"title": "STEM", "description": "Science fairs, coding clubs, robotics, and innovation challenges.", "icon": "FlaskConical"},
    {"title": "Leadership", "description": "Student council, prefects, peer mentoring, and leadership camps.", "icon": "Crown"},
    {"title": "Clubs & Societies", "description": "Journalism, environment, chess, art, and many more clubs.", "icon": "Users2"},
    {"title": "Community Service", "description": "Outreach programs, charity drives, and environmental conservation.", "icon": "HandHeart"},
    {"title": "Educational Trips", "description": "Field trips, academic tours, and outdoor learning experiences.", "icon": "Bus"}
  ]
}'),
('about', '{
  "story": "Glorious Group of Schools was founded in 2011 with a vision to provide quality, values-based education to the community. What started as a small nursery school with just 15 students has grown into a thriving educational institution serving over 1,200 students from Early Years through Junior School. Our journey has been marked by a steadfast commitment to academic excellence, character formation, and holistic child development. Today, we stand as a beacon of quality education, recognized for our outstanding performance, innovative teaching methods, and nurturing school culture.",
  "mission": "To provide holistic, Christ-centered education that nurtures academic excellence, critical thinking, moral integrity, and a lifelong love for learning in a safe, supportive environment.",
  "vision": "To be a leading center of academic excellence and character formation, producing well-rounded, God-fearing leaders who positively transform their communities and the world.",
  "coreValues": [
    {"title": "Excellence", "description": "We pursue the highest standards in everything we do."},
    {"title": "Integrity", "description": "We uphold honesty, transparency, and moral uprightness."},
    {"title": "Faith", "description": "We anchor our lives in Christian values and principles."},
    {"title": "Respect", "description": "We value every individual and treat others with dignity."},
    {"title": "Teamwork", "description": "We achieve more together through collaboration and unity."},
    {"title": "Innovation", "description": "We embrace creativity and positive change."}
  ],
  "principalMessage": {
    "name": "Dr. Jane Wambui",
    "title": "Principal, Glorious Group of Schools",
    "content": "Dear Parents, Students, and Friends, It is with great joy and gratitude that I welcome you to Glorious Group of Schools. For over a decade, we have been dedicated to nurturing young minds and shaping character in a Christ-centered environment. Education is not merely about passing examinations; it is about preparing children for life. Our dedicated team of teachers works tirelessly to create a stimulating, supportive, and safe learning environment where every child can discover their God-given talents and reach their full potential. I invite you to explore our website, visit our campus, and experience the Glorious difference. Together, let us raise the next generation of leaders who will shine brightly and make a positive difference in our world."
  },
  "milestones": [
    {"year": "2011", "title": "School Founded", "description": "Glorious Group of Schools opened its doors with 15 students."},
    {"year": "2013", "title": "First Graduation", "description": "First cohort of students completed their primary education."},
    {"year": "2016", "title": "Junior School Launch", "description": "Expanded to offer Junior School education."},
    {"year": "2018", "title": "Excellence Award", "description": "Recognized as top-performing school in the region."},
    {"year": "2020", "title": "Digital Transformation", "description": "Integrated technology across all learning areas."},
    {"year": "2023", "title": "1,200+ Students", "description": "Milestone enrollment with expanded campus facilities."}
  ],
  "leadershipTeam": [
    {"name": "Dr. Jane Wambui", "role": "Principal"},
    {"name": "Mr. Samuel Omondi", "role": "Deputy Principal"},
    {"name": "Mrs. Faith Nyambura", "role": "Head of Academics"},
    {"name": "Mr. Daniel Kiprop", "role": "Head of Administration"}
  ]
}'),
('academics', '{
  "levels": [
    {"name": "Early Years (Pre-Primary)", "ageRange": "Ages 3 - 5", "description": "Our Early Years program provides a warm, stimulating environment where young learners develop foundational skills through play-based learning, sensory activities, and guided exploration. We focus on social-emotional development, early literacy, numeracy, and creative expression.", "highlights": ["Play-based learning", "Language development", "Motor skills", "Socialization", "Creative arts", "Biblical foundation"]},
    {"name": "Primary School (Grades 1 - 6)", "ageRange": "Ages 6 - 12", "description": "Our Primary program builds on foundational skills with a comprehensive CBC curriculum. Students develop critical thinking, problem-solving abilities, and a love for learning through engaging lessons, hands-on activities, and collaborative projects.", "highlights": ["CBC curriculum", "Integrated learning", "Character education", "Sports & arts", "Technology", "Community service"]},
    {"name": "Junior School (Grades 7 - 9)", "ageRange": "Ages 12 - 15", "description": "Junior School prepares students for the transition to senior secondary education with an enhanced academic program, leadership opportunities, career guidance, and mentorship. Students explore subjects in greater depth while developing independent learning skills.", "highlights": ["Advanced CBC curriculum", "Leadership development", "Career guidance", "STEM focus", "Debate & public speaking", "Community outreach"]}
  ],
  "teachingMethodology": "Our teaching methodology is built on a learner-centered approach that combines direct instruction with inquiry-based learning, collaborative projects, and real-world applications. We use differentiated instruction to meet diverse learning needs, integrate technology across subjects, and regularly assess student progress to inform instruction.",
  "assessment": "We use a continuous assessment approach including formative assessments, summative evaluations, portfolio assessments, practical demonstrations, and projects. We track each student''s progress and provide regular feedback to parents through report cards, parent-teacher conferences, and progress reports.",
  "academicSupport": "We offer remedial classes, enrichment programs, tutoring, learning resources, counseling, and individualized learning plans for students who need additional support or challenge.",
  "coCurricular": "Learning extends beyond the classroom through sports, music, drama, debate, science fairs, art exhibitions, educational trips, community service, and clubs."
}'),
('admissions', '{
  "process": [
    {"step": 1, "title": "Inquiry & Visit", "description": "Contact us or visit our campus to learn about our programs and facilities."},
    {"step": 2, "title": "Submit Application", "description": "Complete the application form and submit required documents."},
    {"step": 3, "title": "Entrance Assessment", "description": "Students undergo a simple assessment to determine placement."},
    {"step": 4, "title": "Admission Offer", "description": "Successful candidates receive an admission letter and fee structure."},
    {"step": 5, "title": "Acceptance & Registration", "description": "Pay fees and complete registration to secure your child''s place."}
  ],
  "requirements": [
    "Completed application form",
    "Birth certificate (copy)",
    "Previous school report cards (last 2 terms)",
    "Transfer letter from previous school",
    "2 passport-size photographs",
    "Immunization records",
    "Medical report"
  ],
  "faqs": [
    {"q": "What is the age requirement for Early Years?", "a": "Children must be at least 3 years old by January 1st of the admission year for Pre-Primary 1, and 4 years old for Pre-Primary 2."},
    {"q": "What is the student-to-teacher ratio?", "a": "We maintain a favorable student-to-teacher ratio of approximately 20:1 to ensure personalized attention."},
    {"q": "Are there scholarship opportunities?", "a": "Yes, we offer merit-based and need-based scholarships for deserving students. Please contact the admissions office for details."},
    {"q": "What extracurricular activities are available?", "a": "We offer a wide range of activities including sports, music, drama, STEM club, debate, journalism, environment club, and more."},
    {"q": "Is the school affiliated with any specific denomination?", "a": "Glorious Group of Schools is a Christian school that welcomes families from all backgrounds while upholding Christian values and principles."}
  ]
}')
ON CONFLICT (section) DO NOTHING;

-- Seed news slug trigger
CREATE OR REPLACE FUNCTION news_set_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(md5(random()::text), 1, 6);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_news_set_slug ON news;
CREATE TRIGGER trg_news_set_slug
  BEFORE INSERT ON news
  FOR EACH ROW
  EXECUTE FUNCTION news_set_slug();

-- Function to auto-assign admin role when a user signs up via setup API
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_roles (user_id, role)
  VALUES (NEW.id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin_user();
