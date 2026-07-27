import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY
    )
    const { name, phone, email, subject, message } = req.body
    const { error } = await supabase.from('contact_messages').insert({
      name, phone, email, subject, message,
      created_at: new Date().toISOString(),
    })
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    res.status(500).json({ error: err.message || 'Failed to send message' })
  }
}
