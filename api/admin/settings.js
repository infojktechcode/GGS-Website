import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    switch (req.method) {
      case 'GET': {
        const { key } = req.query
        let query = supabase.from('site_settings').select('*')
        if (key) query = query.eq('key', key)
        const { data, error } = await query
        if (error) throw error
        return res.json(data)
      }
      case 'PUT': {
        const { key, value } = req.body
        if (!key) return res.status(400).json({ error: 'key is required' })
        const { data, error } = await supabase
          .from('site_settings')
          .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
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
