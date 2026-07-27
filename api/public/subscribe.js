import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    const { email, name } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
    const { data, error } = await supabase.from('newsletter_subscribers').upsert({ email, name: name || '' }, { onConflict: 'email' }).select()
    if (error) throw error
    res.json({ success: true, subscriber: data[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
