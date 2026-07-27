import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

  try {
    const { email, password } = req.body
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) throw error
    res.json({ success: true, user: data.user.email })
  } catch (err) {
    if (err.message?.includes('already exists')) {
      return res.json({ success: true, message: 'Admin user already exists' })
    }
    res.status(500).json({ error: err.message })
  }
}
