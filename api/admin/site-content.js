import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    switch (req.method) {
      case 'GET': {
        const { section } = req.query
        let query = supabase.from('site_content').select('*')
        if (section) query = query.eq('section', section)
        const { data, error } = await query
        if (error) throw error
        return res.json(data)
      }
      case 'PUT': {
        const { section, data: contentData } = req.body
        if (!section) return res.status(400).json({ error: 'section is required' })
        const { data, error } = await supabase
          .from('site_content')
          .upsert({ section, data: contentData, updated_at: new Date().toISOString() }, { onConflict: 'section' })
          .select()
        if (error) throw error
        return res.json(data[0])
      }
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
