import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

  try {
    const { bucket, file, fileName, contentType } = req.body
    if (!bucket || !file) return res.status(400).json({ error: 'bucket and file are required' })

    const buffer = Buffer.from(file, 'base64')
    const ext = fileName?.split('.').pop() || 'png'
    const path = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const { data, error } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: contentType || 'image/png',
      upsert: false,
    })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)

    res.json({ url: publicUrl, path })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
