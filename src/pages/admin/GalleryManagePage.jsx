import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Loader2, X, Upload } from 'lucide-react'

export default function GalleryManagePage() {
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({ title: '', alt: '', src: '', category_id: '' })
  const fileRef = useRef()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/admin?action=list-gallery')
      const data = await res.json()
      setImages(data.images || [])
      setCategories(data.categories || [])
    } catch {} finally { setLoading(false) }
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(',')[1]
        const uploadRes = await fetch('/api/admin?action=upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bucket: 'gallery', file: base64, fileName: file.name, contentType: file.type }),
        })
        const uploadData = await uploadRes.json()
        setForm(prev => ({ ...prev, src: uploadData.url }))
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch { setUploading(false) }
  }

  async function addImage() {
    if (!form.src) return
    setUploading(true)
    try {
      await fetch('/api/admin?action=save-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category_id: form.category_id ? parseInt(form.category_id) : null }),
      })
      setShowForm(false)
      setForm({ title: '', alt: '', src: '', category_id: '' })
      await load()
    } catch {} finally { setUploading(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this image?')) return
    await fetch('/api/admin?action=delete-gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await load()
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Gallery</h1>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"><Plus size={16} /> Add Image</button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">Add Image</h2>
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
              <button onClick={addImage} disabled={uploading || !form.src} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload
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
            <button onClick={() => remove(img.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" aria-label={`Delete ${img.title}`}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
