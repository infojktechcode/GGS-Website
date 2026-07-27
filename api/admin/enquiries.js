import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)
  try {
    switch (req.method) {
      case 'GET': {
        const { status: filterStatus, search } = req.query
        let query = supabase.from('admission_enquiries').select('*').order('created_at', { ascending: false })
        if (filterStatus && filterStatus !== 'all') query = query.eq('status', filterStatus)
        if (search) query = query.or(`parent_name.ilike.%${search}%,email.ilike.%${search}%,child_name.ilike.%${search}%`)
        const { data, error } = await query
        if (error) throw error
        return res.json(data)
      }
      case 'PUT': {
        const { id, status, notes } = req.body
        const updates = {}
        if (status) updates.status = status
        if (notes !== undefined) updates.notes = notes
        const { data, error } = await supabase.from('admission_enquiries').update(updates).eq('id', id).select()
        if (error) throw error
        return res.json(data[0])
      }
      case 'DELETE': {
        const { id } = req.body
        const { error } = await supabase.from('admission_enquiries').delete().eq('id', id)
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
