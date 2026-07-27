import 'dotenv/config'
import express from 'express'
import { createClient } from '@supabase/supabase-js'
import serverless from 'serverless-http'

const app = express()
app.use(express.json())

const supabaseUrl = process.env.SUPABASE_URL
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY

const supabase = createClient(supabaseUrl, supabaseSecretKey)

app.post('/api/contact', async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body
    const { error } = await supabase.from('contact_messages').insert({
      name, phone, email, subject, message,
      created_at: new Date().toISOString(),
    })
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

app.post('/api/admissions/enquiry', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Failed to submit enquiry' })
  }
})

export const handler = serverless(app)
