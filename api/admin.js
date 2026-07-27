import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY)

function json(res, data, status = 200) { return res.status(status).json(data) }

export default async function handler(req, res) {
  const { action } = req.query

  try {
    switch (action) {
      // ===== NEWS =====
      case 'list-news': {
        const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false })
        return json(res, data)
      }
      case 'save-news': {
        const { id, title, excerpt, content, date, category, image, published } = req.body
        if (id) {
          const { data } = await supabase.from('news').update({ title, excerpt, content, date, category, image, published, updated_at: new Date().toISOString() }).eq('id', id).select()
          return json(res, data[0])
        }
        const { data } = await supabase.from('news').insert({ title, excerpt, content, date, category, image }).select()
        return json(res, data[0])
      }
      case 'delete-news': {
        await supabase.from('news').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== EVENTS =====
      case 'list-events': {
        const { data } = await supabase.from('events').select('*').order('date', { ascending: true })
        return json(res, data)
      }
      case 'save-event': {
        const { id, title, date, time, description } = req.body
        if (id) {
          const { data } = await supabase.from('events').update({ title, date, time, description, updated_at: new Date().toISOString() }).eq('id', id).select()
          return json(res, data[0])
        }
        const { data } = await supabase.from('events').insert({ title, date, time, description }).select()
        return json(res, data[0])
      }
      case 'delete-event': {
        await supabase.from('events').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== TESTIMONIALS =====
      case 'list-testimonials': {
        const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
        return json(res, data)
      }
      case 'save-testimonial': {
        const { id, name, role, content, rating } = req.body
        if (id) {
          const { data } = await supabase.from('testimonials').update({ name, role, content, rating, updated_at: new Date().toISOString() }).eq('id', id).select()
          return json(res, data[0])
        }
        const { data } = await supabase.from('testimonials').insert({ name, role, content, rating }).select()
        return json(res, data[0])
      }
      case 'delete-testimonial': {
        await supabase.from('testimonials').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== GALLERY =====
      case 'list-gallery': {
        const { category } = req.query
        let query = supabase.from('gallery_images').select('*, gallery_categories(name)')
        if (category && category !== 'all') query = query.eq('category_id', category)
        const { data: images } = await query.order('sort_order', { ascending: true })
        const { data: cats } = await supabase.from('gallery_categories').select('*').order('sort_order')
        return json(res, { images, categories: cats || [] })
      }
      case 'save-gallery': {
        const { id, title, alt, src, category_id, sort_order } = req.body
        if (id) {
          const { data } = await supabase.from('gallery_images').update({ title, alt, src, category_id, sort_order }).eq('id', id).select()
          return json(res, data[0])
        }
        const { data } = await supabase.from('gallery_images').insert({ title, alt, src, category_id, sort_order }).select()
        return json(res, data[0])
      }
      case 'delete-gallery': {
        await supabase.from('gallery_images').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== MESSAGES =====
      case 'list-messages': {
        const { archived } = req.query
        let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
        if (archived === 'true') query = query.eq('is_archived', true)
        else query = query.eq('is_archived', false)
        const { data } = await query
        return json(res, data)
      }
      case 'update-message': {
        const { id, is_read, is_archived } = req.body
        const { data } = await supabase.from('contact_messages').update({ is_read, is_archived }).eq('id', id).select()
        return json(res, data[0])
      }
      case 'delete-message': {
        await supabase.from('contact_messages').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== ENQUIRIES =====
      case 'list-enquiries': {
        const { status: s, search } = req.query
        let q = supabase.from('admission_enquiries').select('*').order('created_at', { ascending: false })
        if (s && s !== 'all') q = q.eq('status', s)
        if (search) q = q.or(`parent_name.ilike.%${search}%,email.ilike.%${search}%,child_name.ilike.%${search}%`)
        const { data } = await q
        return json(res, data)
      }
      case 'update-enquiry': {
        const { id, status, notes } = req.body
        const updates = {}
        if (status) updates.status = status
        if (notes !== undefined) updates.notes = notes
        const { data } = await supabase.from('admission_enquiries').update(updates).eq('id', id).select()
        return json(res, data[0])
      }
      case 'delete-enquiry': {
        await supabase.from('admission_enquiries').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== SUBSCRIBERS =====
      case 'list-subscribers': {
        const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false })
        return json(res, data)
      }
      case 'delete-subscriber': {
        await supabase.from('newsletter_subscribers').delete().eq('id', req.body.id)
        return json(res, { success: true })
      }

      // ===== SITE CONTENT =====
      case 'list-content': {
        const { section } = req.query
        let q = supabase.from('site_content').select('*')
        if (section) q = q.eq('section', section)
        const { data } = await q
        return json(res, data)
      }
      case 'save-content': {
        const { section, data: contentData } = req.body
        const { data } = await supabase.from('site_content').upsert({ section, data: contentData, updated_at: new Date().toISOString() }, { onConflict: 'section' }).select()
        return json(res, data[0])
      }

      // ===== SETTINGS =====
      case 'get-settings': {
        const { key } = req.query
        let q = supabase.from('site_settings').select('*')
        if (key) q = q.eq('key', key)
        const { data } = await q
        return json(res, data)
      }
      case 'save-settings': {
        const { key, value } = req.body
        const { data } = await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' }).select()
        return json(res, data[0])
      }

      // ===== UPLOAD =====
      case 'upload': {
        const { bucket, file, fileName, contentType } = req.body
        if (!bucket || !file) return json(res, { error: 'bucket and file are required' }, 400)
        const buffer = Buffer.from(file, 'base64')
        const ext = fileName?.split('.').pop() || 'png'
        const path = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
        const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, buffer, { contentType: contentType || 'image/png' })
        if (uploadErr) throw uploadErr
        const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
        return json(res, { url: publicUrl, path })
      }

      // ===== SETUP =====
      case 'setup': {
        const { email, password } = req.body
        const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true })
        if (error) throw error
        return json(res, { success: true, user: data.user.email })
      }

      case 'db-status': {
        const tables = ['site_content', 'gallery_categories', 'gallery_images', 'contact_messages', 'admission_enquiries', 'newsletter_subscribers', 'site_settings', 'admin_roles', 'news', 'events', 'testimonials']
        const status = {}
        for (const table of tables) {
          try {
            const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
            status[table] = { exists: true, count: count ?? 0 }
          } catch {
            status[table] = { exists: false }
          }
        }
        return json(res, status)
      }

      default:
        return json(res, { error: 'Unknown action' }, 400)
    }
  } catch (err) {
    if (err.message?.includes('already exists')) return json(res, { success: true, message: 'Already exists' })
    return json(res, { error: err.message }, 500)
  }
}
