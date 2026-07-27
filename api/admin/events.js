import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

  try {
    switch (req.method) {
      case 'GET': {
        const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })
        if (error) throw error
        return res.json(data)
      }
      case 'POST': {
        const { title, date, time, description } = req.body
        const { data, error } = await supabase.from('events').insert({ title, date, time, description }).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'PUT': {
        const { id, title, date, time, description } = req.body
        const { data, error } = await supabase.from('events').update({ title, date, time, description, updated_at: new Date().toISOString() }).eq('id', id).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'DELETE': {
        const { id } = req.body
        const { error } = await supabase.from('events').delete().eq('id', id)
        if (error) throw error
        return res.json({ success: true })
      }
      default:
        return res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error('Events API error:', err)
    res.status(500).json({ error: err.message })
  }
}
