import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    switch (req.method) {
      case 'GET': {
        const { data, error } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
        if (error) throw error
        return res.json(data)
      }
      case 'POST': {
        const { email, name } = req.body
        const { data, error } = await supabase.from('newsletter_subscribers').upsert({ email, name }, { onConflict: 'email' }).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'DELETE': {
        const { id } = req.body
        const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id)
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
