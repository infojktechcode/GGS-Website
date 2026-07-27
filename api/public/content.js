import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
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

    res.json({
      schoolInfo: schoolInfo?.value || null,
      content: contentMap,
      news: news || [],
      events: events || [],
      testimonials: testimonials || [],
      galleryCategories: galleryCategories || [],
      galleryImages: galleryImages || [],
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
