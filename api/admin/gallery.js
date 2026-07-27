import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    switch (req.method) {
      case 'GET': {
        const { category } = req.query
        let query = supabase.from('gallery_images').select('*, gallery_categories(name)')
        if (category && category !== 'all') query = query.eq('category_id', category)
        const { data, error } = await query.order('sort_order', { ascending: true })
        if (error) throw error
        const { data: cats } = await supabase.from('gallery_categories').select('*').order('sort_order')
        return res.json({ images: data, categories: cats || [] })
      }
      case 'POST': {
        const { title, alt, src, category_id, sort_order } = req.body
        const { data, error } = await supabase.from('gallery_images').insert({ title, alt, src, category_id, sort_order }).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'PUT': {
        const { id, title, alt, src, category_id, sort_order } = req.body
        const { data, error } = await supabase.from('gallery_images').update({ title, alt, src, category_id, sort_order }).eq('id', id).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'DELETE': {
        const { id } = req.body
        const { error } = await supabase.from('gallery_images').delete().eq('id', id)
        if (error) throw error
        return res.json({ success: true })
      }
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
