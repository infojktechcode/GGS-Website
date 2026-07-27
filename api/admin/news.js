import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

  try {
    switch (req.method) {
      case 'GET': {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false })
        if (error) throw error
        return res.json(data)
      }
      case 'POST': {
        const { title, excerpt, content, date, category, image } = req.body
        const { data, error } = await supabase.from('news').insert({ title, excerpt, content, date, category, image }).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'PUT': {
        const { id, title, excerpt, content, date, category, image, published } = req.body
        const { data, error } = await supabase.from('news').update({ title, excerpt, content, date, category, image, published, updated_at: new Date().toISOString() }).eq('id', id).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'DELETE': {
        const { id } = req.body
        const { error } = await supabase.from('news').delete().eq('id', id)
        if (error) throw error
        return res.json({ success: true })
      }
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error('News API error:', err)
    res.status(500).json({ error: err.message })
  }
}
