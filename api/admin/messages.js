import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    switch (req.method) {
      case 'GET': {
        const { archived } = req.query
        let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        if (archived === 'true') query = query.eq('is_archived', true)
        else query = query.eq('is_archived', false)
        const { data, error } = await query
        if (error) throw error
        return res.json(data)
      }
      case 'PUT': {
        const { id, is_read, is_archived } = req.body
        const { data, error } = await supabase.from('contact_messages').update({ is_read, is_archived }).eq('id', id).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'DELETE': {
        const { id } = req.body
        const { error } = await supabase.from('contact_messages').delete().eq('id', id)
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
