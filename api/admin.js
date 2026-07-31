import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

function json(res, data, status = 200) { return res.status(status).json(data) }

export default async function handler(req, res) {
  const { action } = req.query

  try {
    switch (action) {
      // ===== NEWS =====
      case 'list-news': {
        const { search: q, category: cat, published: pub } = req.query
        let query = supabase.from('news').select('*').order('created_at', { ascending: false })
        if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
        if (cat) query = query.eq('category', cat)
        if (pub === 'true') query = query.eq('published', true)
        else if (pub === 'false') query = query.eq('published', false)
        const { data, error } = await query
        if (error) throw error
        return json(res, data || [])
      }
      case 'toggle-publish-news': {
        const { id, published } = req.body
        const { data, error } = await supabase.from('news').update({ published, updated_at: new Date().toISOString() }).eq('id', id).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'save-news': {
        const { id, title, excerpt, content, date, category, image, published } = req.body
        if (id) {
          const { data, error } = await supabase.from('news').update({ title, excerpt, content, date, category, image, published, updated_at: new Date().toISOString() }).eq('id', id).select()
          if (error) throw error
          return json(res, data[0])
        }
        const { data, error } = await supabase.from('news').insert({ title, excerpt, content, date, category, image, published }).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'delete-news': {
        const { error } = await supabase.from('news').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== EVENTS =====
      case 'list-events': {
        const { search: q, featured } = req.query
        let query = supabase.from('events').select('*').order('date', { ascending: true })
        if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
        if (featured === 'true') query = query.eq('featured', true)
        const { data, error } = await query
        if (error) throw error
        return json(res, data || [])
      }
      case 'save-event': {
        const { id, title, date, time, description } = req.body
        if (id) {
          const { data, error } = await supabase.from('events').update({ title, date, time, description, updated_at: new Date().toISOString() }).eq('id', id).select()
          if (error) throw error
          return json(res, data[0])
        }
        const { data, error } = await supabase.from('events').insert({ title, date, time, description }).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'delete-event': {
        const { error } = await supabase.from('events').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== TESTIMONIALS =====
      case 'list-testimonials': {
        const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
        if (error) throw error
        return json(res, data || [])
      }
      case 'save-testimonial': {
        const { id, name, role, content, rating } = req.body
        if (id) {
          const { data, error } = await supabase.from('testimonials').update({ name, role, content, rating, updated_at: new Date().toISOString() }).eq('id', id).select()
          if (error) throw error
          return json(res, data[0])
        }
        const { data, error } = await supabase.from('testimonials').insert({ name, role, content, rating }).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'delete-testimonial': {
        const { error } = await supabase.from('testimonials').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== GALLERY =====
      case 'list-gallery': {
        const { category } = req.query
        let query = supabase.from('gallery_images').select('*, gallery_categories(name)')
        if (category && category !== 'all') query = query.eq('category_id', category)
        const { data: images, error: imgErr } = await query.order('sort_order', { ascending: true })
        if (imgErr) throw imgErr
        const { data: cats, error: catErr } = await supabase.from('gallery_categories').select('*').order('sort_order')
        if (catErr) throw catErr
        return json(res, { images: images || [], categories: cats || [] })
      }
      case 'save-gallery': {
        const { id, title, alt, src, category_id, sort_order } = req.body
        if (id) {
          const { data, error } = await supabase.from('gallery_images').update({ title, alt, src, category_id, sort_order }).eq('id', id).select()
          if (error) throw error
          return json(res, data[0])
        }
        const { data, error } = await supabase.from('gallery_images').insert({ title, alt, src, category_id, sort_order }).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'delete-gallery': {
        const { error } = await supabase.from('gallery_images').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== MESSAGES =====
      case 'list-messages': {
        const { archived, search: q, read } = req.query
        let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        if (archived === 'true') query = query.eq('is_archived', true)
        else query = query.eq('is_archived', false)
        if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%,message.ilike.%${q}%`)
        if (read === 'true') query = query.eq('is_read', true)
        else if (read === 'false') query = query.eq('is_read', false)
        const { data, error } = await query
        if (error) throw error
        return json(res, data || [])
      }
      case 'update-message': {
        const { id, is_read, is_archived } = req.body
        const { data, error } = await supabase.from('contact_messages').update({ is_read, is_archived }).eq('id', id).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'delete-message': {
        const { error } = await supabase.from('contact_messages').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== ENQUIRIES =====
      case 'list-enquiries': {
        const { status: s, search } = req.query
        let query = supabase.from('admission_enquiries').select('*').order('created_at', { ascending: false })
        if (s && s !== 'all') query = query.eq('status', s)
        if (search) query = query.or(`parent_name.ilike.%${search}%,email.ilike.%${search}%,child_name.ilike.%${search}%`)
        const { data, error } = await query
        if (error) throw error
        return json(res, data || [])
      }
      case 'update-enquiry': {
        const { id, status, notes } = req.body
        const updates = {}
        if (status) updates.status = status
        if (notes !== undefined) updates.notes = notes
        const { data, error } = await supabase.from('admission_enquiries').update(updates).eq('id', id).select()
        if (error) throw error
        return json(res, data[0])
      }
      case 'delete-enquiry': {
        const { error } = await supabase.from('admission_enquiries').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== SUBSCRIBERS =====
      case 'list-subscribers': {
        const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
        if (error) throw error
        return json(res, data || [])
      }
      case 'delete-subscriber': {
        const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', req.body.id)
        if (error) throw error
        return json(res, { success: true })
      }

      // ===== SITE CONTENT =====
      case 'list-content': {
        const { section } = req.query
        let query = supabase.from('site_content').select('*')
        if (section) query = query.eq('section', section)
        const { data, error } = await query
        if (error) throw error
        return json(res, data || [])
      }
      case 'save-content': {
        const { section, data: contentData } = req.body
        const { data, error } = await supabase.from('site_content').upsert({ section, data: contentData, updated_at: new Date().toISOString() }, { onConflict: 'section' }).select()
        if (error) throw error
        return json(res, data[0])
      }

      // ===== SETTINGS =====
      case 'get-settings': {
        const { key } = req.query
        let query = supabase.from('site_settings').select('*')
        if (key) query = query.eq('key', key)
        const { data, error } = await query
        if (error) throw error
        return json(res, data || [])
      }
      case 'save-settings': {
        const { key, value } = req.body
        const { data, error } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select()
        if (error) throw error
        return json(res, data[0])
      }

      // ===== UPLOAD =====
      case 'upload': {
        const { bucket, file, fileName, contentType } = req.body
        if (!bucket || !file) return json(res, { error: 'bucket and file are required' }, 400)
        const buffer = Buffer.from(file, 'base64')
        const ext = fileName?.split('.').pop() || 'png'
        const path = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, buffer, { contentType: contentType || 'image/png' })
        if (uploadErr) throw uploadErr
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
        return json(res, { url: publicUrl, path })
      }

      // ===== SETUP =====
      case 'setup': {
        const { email, password } = req.body
        const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
        if (error) throw error
        await supabase.from('admin_roles').upsert(
          { user_id: data.user.id, role: 'super_admin' },
          { onConflict: 'user_id' }
        )
        return json(res, { success: true, user: data.user.email })
      }

      case 'seed': {
        const tables = ['site_content', 'gallery_categories', 'gallery_images', 'contact_messages', 'admission_enquiries', 'newsletter_subscribers', 'site_settings', 'admin_roles', 'news', 'events', 'testimonials']
        let refreshed = false
        const pgConnStr = process.env.PG_CONNECTION_STRING
        if (pgConnStr) { try { const pg = await import('pg').then(m => m.default); const pool = new pg.Pool({ connectionString: pgConnStr, max: 1, connectionTimeoutMillis: 5000 }); const c = await pool.connect(); await c.query('SELECT supabase_pgrest.refresh_schema_cache()'); c.release(); await pool.end(); refreshed = true } catch {} }
        const missingTables = []
        for (const t of tables) {
          const { error } = await supabase.from(t).select('id').limit(1)
          if (error) missingTables.push(t)
        }
        if (missingTables.length > 0) {
          return json(res, { success: false, missingTables, refreshed, fix: 'https://supabase.com/dashboard/project/mowhkxvmntoomljvrosb/sql/new' })
        }
        const seedContent = [
          { section: 'hero', data: { headline: "Shaping Tomorrow's Leaders Today", subheadline: 'Where academic excellence meets character development in a nurturing Christian environment.' } },
          { section: 'welcome', data: { title: 'Welcome to Glorious Group of Schools', paragraphs: ['At Glorious Group of Schools, we believe every child is a unique gift with unlimited potential. Since our founding, we have been dedicated to providing an exceptional educational experience that nurtures intellectual curiosity, moral integrity, and creative expression.', 'Our CBC-aligned curriculum, combined with dedicated teachers and a supportive community, creates an environment where students thrive academically, socially, and spiritually. We partner with parents to raise confident, compassionate, and capable individuals ready to make a positive impact on the world.'] } },
          { section: 'why_choose_us', data: { items: [{ title: 'Academic Excellence', description: 'Consistent top performance in national examinations with a focus on mastery of the CBC curriculum.', icon: 'GraduationCap' }, { title: 'Qualified Teachers', description: 'Highly trained, experienced, and dedicated educators who inspire a love for learning.', icon: 'Users' }, { title: 'Holistic Learning', description: 'Balanced development through academics, sports, arts, and character education.', icon: 'BookOpen' }, { title: 'Safe Environment', description: 'Secure, well-maintained campus with modern facilities and round-the-clock supervision.', icon: 'Shield' }, { title: 'Christian Values', description: 'Strong moral foundation rooted in Christian principles and ethical teaching.', icon: 'Heart' }, { title: 'Technology Integration', description: 'Modern digital tools and resources integrated into everyday learning experiences.', icon: 'Monitor' }, { title: 'Student-Centered Learning', description: 'Personalized attention with small class sizes and differentiated instruction.', icon: 'Star' }] } },
          { section: 'stats', data: { items: [{ label: 'Students', value: 1200, suffix: '+' }, { label: 'Teachers', value: 85, suffix: '+' }, { label: 'Graduation Rate', value: 99, suffix: '%' }, { label: 'Years of Excellence', value: 15, suffix: '+' }, { label: 'Awards Won', value: 25, suffix: '+' }] } },
          { section: 'student_life', data: { items: [{ title: 'Sports', description: 'Football, athletics, swimming, volleyball, basketball, and more.', icon: 'Trophy' }, { title: 'Music', description: 'Choir, band, instrumental lessons, and annual music festivals.', icon: 'Music' }, { title: 'Drama', description: 'Theatre productions, debate, storytelling, and public speaking.', icon: 'Clapperboard' }, { title: 'STEM', description: 'Science fairs, coding clubs, robotics, and innovation challenges.', icon: 'FlaskConical' }, { title: 'Leadership', description: 'Student council, prefects, peer mentoring, and leadership camps.', icon: 'Crown' }, { title: 'Clubs & Societies', description: 'Journalism, environment, chess, art, and many more clubs.', icon: 'Users2' }, { title: 'Community Service', description: 'Outreach programs, charity drives, and environmental conservation.', icon: 'HandHeart' }, { title: 'Educational Trips', description: 'Field trips, academic tours, and outdoor learning experiences.', icon: 'Bus' }] } },
          { section: 'about', data: { story: 'Glorious Group of Schools was founded in 2011 with a vision to provide quality, values-based education to the community. What started as a small nursery school with just 15 students has grown into a thriving educational institution serving over 1,200 students from Early Years through Junior School.', mission: 'To provide holistic, Christ-centered education that nurtures academic excellence, critical thinking, moral integrity, and a lifelong love for learning in a safe, supportive environment.', vision: 'To be a leading center of academic excellence and character formation, producing well-rounded, God-fearing leaders who positively transform their communities and the world.', coreValues: [{ title: 'Excellence', description: 'We pursue the highest standards in everything we do.' }, { title: 'Integrity', description: 'We uphold honesty, transparency, and moral uprightness.' }, { title: 'Faith', description: 'We anchor our lives in Christian values and principles.' }, { title: 'Respect', description: 'We value every individual and treat others with dignity.' }, { title: 'Teamwork', description: 'We achieve more together through collaboration and unity.' }, { title: 'Innovation', description: 'We embrace creativity and positive change.' }], principalMessage: { name: 'Dr. Jane Wambui', title: 'Principal, Glorious Group of Schools', content: 'Dear Parents, Students, and Friends, It is with great joy and gratitude that I welcome you to Glorious Group of Schools. For over a decade, we have been dedicated to nurturing young minds and shaping character in a Christ-centered environment.' }, milestones: [{ year: '2011', title: 'School Founded', description: 'Glorious Group of Schools opened its doors with 15 students.' }, { year: '2013', title: 'First Graduation', description: 'First cohort of students completed their primary education.' }, { year: '2016', title: 'Junior School Launch', description: 'Expanded to offer Junior School education.' }, { year: '2018', title: 'Excellence Award', description: 'Recognized as top-performing school in the region.' }, { year: '2020', title: 'Digital Transformation', description: 'Integrated technology across all learning areas.' }, { year: '2023', title: '1,200+ Students', description: 'Milestone enrollment with expanded campus facilities.' }], leadershipTeam: [{ name: 'Dr. Jane Wambui', role: 'Principal' }, { name: 'Mr. Samuel Omondi', role: 'Deputy Principal' }, { name: 'Mrs. Faith Nyambura', role: 'Head of Academics' }, { name: 'Mr. Daniel Kiprop', role: 'Head of Administration' }] } },
          { section: 'academics', data: { levels: [{ name: 'Early Years (Pre-Primary)', ageRange: 'Ages 3 - 5', description: 'Our Early Years program provides a warm, stimulating environment where young learners develop foundational skills through play-based learning, sensory activities, and guided exploration.', highlights: ['Play-based learning', 'Language development', 'Motor skills', 'Socialization', 'Creative arts', 'Biblical foundation'] }, { name: 'Primary School (Grades 1 - 6)', ageRange: 'Ages 6 - 12', description: 'Our Primary program builds on foundational skills with a comprehensive CBC curriculum.', highlights: ['CBC curriculum', 'Integrated learning', 'Character education', 'Sports & arts', 'Technology', 'Community service'] }, { name: 'Junior School (Grades 7 - 9)', ageRange: 'Ages 12 - 15', description: 'Junior School prepares students for the transition to senior secondary education with an enhanced academic program.', highlights: ['Advanced CBC curriculum', 'Leadership development', 'Career guidance', 'STEM focus', 'Debate & public speaking', 'Community outreach'] }], teachingMethodology: 'Our teaching methodology is built on a learner-centered approach that combines direct instruction with inquiry-based learning.', assessment: 'We use a continuous assessment approach including formative assessments, summative evaluations, portfolio assessments, and practical demonstrations.', academicSupport: 'We offer remedial classes, enrichment programs, tutoring, learning resources, counseling, and individualized learning plans.', coCurricular: 'Learning extends beyond the classroom through sports, music, drama, debate, science fairs, art exhibitions, educational trips, community service, and clubs.' } },
          { section: 'admissions', data: { process: [{ step: 1, title: 'Inquiry & Visit', description: 'Contact us or visit our campus to learn about our programs and facilities.' }, { step: 2, title: 'Submit Application', description: 'Complete the application form and submit required documents.' }, { step: 3, title: 'Entrance Assessment', description: 'Students undergo a simple assessment to determine placement.' }, { step: 4, title: 'Admission Offer', description: 'Successful candidates receive an admission letter and fee structure.' }, { step: 5, title: 'Acceptance & Registration', description: 'Pay fees and complete registration to secure your child\'s place.' }], requirements: ['Completed application form', 'Birth certificate (copy)', 'Previous school report cards (last 2 terms)', 'Transfer letter from previous school', '2 passport-size photographs', 'Immunization records', 'Medical report'], faqs: [{ q: 'What is the age requirement for Early Years?', a: 'Children must be at least 3 years old by January 1st of the admission year for Pre-Primary 1, and 4 years old for Pre-Primary 2.' }, { q: 'What is the student-to-teacher ratio?', a: 'We maintain a favorable student-to-teacher ratio of approximately 20:1 to ensure personalized attention.' }, { q: 'Are there scholarship opportunities?', a: 'Yes, we offer merit-based and need-based scholarships for deserving students.' }, { q: 'What extracurricular activities are available?', a: 'We offer a wide range of activities including sports, music, drama, STEM club, debate, journalism, environment club, and more.' }, { q: 'Is the school affiliated with any specific denomination?', a: 'Glorious Group of Schools is a Christian school that welcomes families from all backgrounds while upholding Christian values and principles.' }] } },
        ]
        const resultMap = {}
        for (const item of seedContent) {
          try {
            const { error } = await supabase.from('site_content').upsert(item, { onConflict: 'section' })
            resultMap[item.section] = { ok: !error, error: error?.message || null }
          } catch (e) { resultMap[item.section] = { error: e.message } }
        }
        const catSeeds = [
          { name: 'All', slug: 'all', sort_order: 0 },
          { name: 'Learning', slug: 'learning', sort_order: 1 },
          { name: 'Events', slug: 'events', sort_order: 2 },
          { name: 'Sports', slug: 'sports', sort_order: 3 },
          { name: 'Graduation', slug: 'graduation', sort_order: 4 },
          { name: 'Campus Life', slug: 'campus', sort_order: 5 },
          { name: 'Competitions', slug: 'competitions', sort_order: 6 },
        ]
        for (const cat of catSeeds) {
          try { await supabase.from('gallery_categories').upsert(cat, { onConflict: 'slug' }) } catch {}
        }
        try {
          await supabase.from('site_settings').upsert({ key: 'school_info', value: { name: 'Glorious Group of Schools', motto: 'Education is the key for a better tomorrow', shortDescription: 'Providing quality CBC education from Early Years to Junior School.', address: '123 Glorious Avenue, Off Mombasa Road, Nairobi, Kenya', phones: ['+254 712 345 678', '+254 734 567 890'], emails: ['info@gloriousschools.ac.ke', 'admissions@gloriousschools.ac.ke'], officeHours: 'Monday - Friday: 7:30 AM - 4:30 PM | Saturday: 8:00 AM - 12:00 PM', emergencyContacts: ['+254 722 111 222 (Security)', '+254 733 333 444 (Health Center)'], socialMedia: { facebook: 'https://facebook.com/gloriousgroupofschools', twitter: 'https://twitter.com/gloriousschools', instagram: 'https://instagram.com/gloriousgroupofschools', youtube: 'https://youtube.com/@gloriousschools', linkedin: 'https://linkedin.com/company/glorious-group-of-schools' } } }, { onConflict: 'key' })
        } catch {}
        return json(res, { success: true, results: resultMap })
      }

      case 'db-status': {
        const tables = ['site_content', 'gallery_categories', 'gallery_images', 'contact_messages', 'admission_enquiries', 'newsletter_subscribers', 'site_settings', 'admin_roles', 'news', 'events', 'testimonials']
        const status = {}
        for (const table of tables) {
          try {
            const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
            const schemaError = error?.message
            const realCount = schemaError ? 0 : (count ?? 0)
            status[table] = { exists: !schemaError, count: realCount, error: schemaError || null }
          } catch (e) {
            status[table] = { exists: false, error: e.message }
          }
        }
        return json(res, status)
      }

      // ===== RECENT ACTIVITY (for dashboard) =====
      case 'recent-activity': {
        const results = await Promise.allSettled([
          supabase.from('news').select('id,title,created_at,published').order('created_at', { ascending: false }).limit(5),
          supabase.from('events').select('id,title,date,created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('contact_messages').select('id,name,subject,created_at,is_read').order('created_at', { ascending: false }).limit(5),
          supabase.from('admission_enquiries').select('id,parent_name,child_name,status,created_at').order('created_at', { ascending: false }).limit(5),
        ])
        return json(res, {
          news: results[0].status === 'fulfilled' ? results[0].value.data || [] : [],
          events: results[1].status === 'fulfilled' ? results[1].value.data || [] : [],
          messages: results[2].status === 'fulfilled' ? results[2].value.data || [] : [],
          enquiries: results[3].status === 'fulfilled' ? results[3].value.data || [] : [],
        })
      }

      default:
        return json(res, { error: 'Unknown action' }, 400)
    }
  } catch (err) {
    if (err.message?.includes('already exists')) return json(res, { success: true, message: 'Already exists' })
    return json(res, { error: err.message }, 500)
  }
}
