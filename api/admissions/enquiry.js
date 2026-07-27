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
    const { name, phone, email, childName, childAge, grade, message } = req.body
    const { error } = await supabase.from('admission_enquiries').insert({
      parent_name: name,
      phone, email,
      child_name: childName,
      child_age: parseInt(childAge),
      grade_applying: grade,
      message,
      created_at: new Date().toISOString(),
    })
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error('Admission form error:', err)
    res.status(500).json({ error: err.message || 'Failed to submit enquiry' })
  }
}
