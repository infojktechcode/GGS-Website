import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

function json(res, data, status = 200) { return res.status(status).json(data) }

export default async function handler(req, res) {
  const { action } = req.query

  try {
    switch (action) {
      case 'content': {
        const [
          { data: schoolInfo },
          { data: siteContent },
          { data: news },
          { data: events },
          { data: testimonials },
          { data: galleryCategories },
          { data: galleryImages },
        ] = await Promise.all([
          supabase.from('site_settings').select('value').eq('key', 'school_info').single(),
          supabase.from('site_content').select('*'),
          supabase.from('news').select('*').eq('published', true).order('date', { ascending: false }).limit(50),
          supabase.from('events').select('*').order('date', { ascending: true }).limit(50),
          supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
          supabase.from('gallery_categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }),
        ])
        const contentMap = {}
        if (siteContent) siteContent.forEach(row => { contentMap[row.section] = row.data })
        return json(res, {
          schoolInfo: schoolInfo?.value || null,
          content: contentMap,
          news: news || [],
          events: events || [],
          testimonials: testimonials || [],
          galleryCategories: galleryCategories || [],
          galleryImages: galleryImages || [],
        })
      }

      case 'subscribe': {
        const { email, name } = req.body
        if (!email) return json(res, { error: 'Email is required' }, 400)
        const { data } = await supabase.from('newsletter_subscribers').upsert({ email, name: name || '' }, { onConflict: 'email' }).select()
        return json(res, { success: true, subscriber: data[0] })
      }

      case 'contact': {
        const { name, phone, email, subject, message } = req.body
        const { error } = await supabase.from('contact_messages').insert({ name, phone, email, subject, message })
        if (error) throw error
        return json(res, { success: true })
      }

      case 'admission-enquiry': {
        const { name, phone, email, childName, childAge, grade, message } = req.body
        const { error } = await supabase.from('admission_enquiries').insert({
          parent_name: name, phone, email, child_name: childName,
          child_age: parseInt(childAge), grade_applying: grade, message,
        })
        if (error) throw error
        return json(res, { success: true })
      }

      default:
        return json(res, { error: 'Unknown action' }, 400)
    }
  } catch (err) {
    return json(res, { error: err.message }, 500)
  }
}
