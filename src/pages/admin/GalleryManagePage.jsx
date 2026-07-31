import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, X, Upload, Save } from 'lucide-react'
import { adminFetch, adminFetchAll, adminUpload } from '../../services/adminApi'

export default function GalleryManagePage() {
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', alt: '', src: '', category_id: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileRef = useRef()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await adminFetchAll('list-gallery')
      setImages(data.images || [])
      setCategories(data.categories || [])
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  function openAdd() {
    setForm({ title: '', alt: '', src: '', category_id: '' })
    setEditingId(null)
    setShowForm(true)
    setError(''); setSuccess('')
  }

  function openEdit(img) {
    setForm({ title: img.title || '', alt: img.alt || '', src: img.src, category_id: String(img.category_id || '') })
    setEditingId(img.id)
    setShowForm(true)
    setError(''); setSuccess('')
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await adminUpload('gallery', file)
      setForm(prev => ({ ...prev, src: url }))
      setSuccess('Image uploaded')
    } catch (err) { setError(err.message) } finally { setUploading(false) }
  }

  async function save() {
    if (!form.src) { setError('Image is required'); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const body = editingId
        ? { ...form, id: editingId, category_id: form.category_id ? parseInt(form.category_id) : null }
        : { ...form, category_id: form.category_id ? parseInt(form.category_id) : null }
      await adminFetch('save-gallery', { body })
      setShowForm(false)
      setForm({ title: '', alt: '', src: '', category_id: '' })
      setEditingId(null)
      setSuccess(editingId ? 'Updated' : 'Added')
      setTimeout(() => setSuccess(''), 3000)
      await load()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this image?')) return
    try {
      await adminFetch('delete-gallery', { body: { id } })
      setSuccess('Deleted')
      setTimeout(() => setSuccess(''), 3000)
      await load()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Gallery</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"><Plus size={16} /> Add Image</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">{success}</div>}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">{editingId ? 'Edit Image' : 'Add Image'}</h2>
            <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue">
                  <option value="">None</option>
                  {categories.filter(c => c.slug !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
              <input value={form.alt} onChange={e => setForm({...form, alt: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input type="file" ref={fileRef} onChange={handleFileSelect} accept="image/*" className="w-full" />
              {uploading && <p className="text-sm text-brand-blue mt-1">Uploading...</p>}
              {form.src && <img src={form.src} alt="Preview" className="w-32 h-24 object-cover rounded-xl mt-2" />}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving || !form.src} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : editingId ? <Save size={14} /> : <Upload size={14} />}
                {saving ? 'Saving...' : editingId ? 'Update' : 'Upload'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">No images yet.</div>
        ) : images.map(img => (
          <div key={img.id} className="group relative bg-white rounded-xl overflow-hidden shadow-md">
            <div className="aspect-[4/3] bg-gray-100">
              <img src={img.src} alt={img.alt || img.title} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-dark truncate">{img.title || 'Untitled'}</p>
              <p className="text-xs text-gray-400">{img.gallery_categories?.name || 'No category'}</p>
            </div>
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(img)} className="p-1.5 bg-blue-500 text-white rounded-lg" aria-label={`Edit ${img.title}`}>
                <Pencil size={14} />
              </button>
              <button onClick={() => remove(img.id)} className="p-1.5 bg-red-500 text-white rounded-lg" aria-label={`Delete ${img.title}`}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
