import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, X, Save } from 'lucide-react'

const API = '/api/admin'

export default function NewsManagePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', date: '', category: 'General', image: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch(`${API}?action=list-news`)
      setItems(await res.json())
    } catch {} finally { setLoading(false) }
  }

  function openNew() {
    setForm({ title: '', excerpt: '', content: '', date: new Date().toISOString().split('T')[0], category: 'General', image: '' })
    setEditing('new')
  }

  function openEdit(item) {
    setForm({ title: item.title, excerpt: item.excerpt || '', content: item.content || '', date: item.date, category: item.category, image: item.image || '' })
    setEditing(item.id)
  }

  async function save() {
    setSaving(true)
    try {
      await fetch(`${API}?action=save-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing === 'new' ? form : { ...form, id: editing }),
      })
      setEditing(null); await load()
    } catch {} finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this article?')) return
    await fetch(`${API}?action=delete-news`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await load()
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">News</h1>
        <button onClick={openNew} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"><Plus size={16} /> Add News</button>
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">{editing === 'new' ? 'New Article' : 'Edit Article'}</h2>
            <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label><textarea value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
            <div className="grid grid-cols-3 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label><input value={form.image} onChange={e => setForm({...form, image: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving || !form.title} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50"><tr>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Title</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">No news articles yet.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-dark">{item.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEdit(item)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 mr-1"><Pencil size={16} /></button>
                  <button onClick={() => remove(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
