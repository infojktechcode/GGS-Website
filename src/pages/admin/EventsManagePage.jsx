import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Loader2, X, Save, Search } from 'lucide-react'
import { adminFetch, adminFetchAll } from '../../services/adminApi'

export default function EventsManagePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', date: '', time: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => { load() }, [search])

  async function load() {
    try {
      const data = await adminFetchAll('list-events', search ? { search } : {})
      setItems(data)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  function openNew() {
    setForm({ title: '', date: new Date().toISOString().split('T')[0], time: '', description: '' })
    setEditing('new')
    setError(''); setSuccess('')
  }

  function openEdit(item) {
    setForm({ title: item.title, date: item.date, time: item.time || '', description: item.description || '' })
    setEditing(item.id)
    setError(''); setSuccess('')
  }

  async function save() {
    if (!form.title) { setError('Title is required'); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      await adminFetch('save-event', {
        body: editing === 'new' ? form : { ...form, id: editing },
      })
      setEditing(null); setSuccess('Saved')
      setTimeout(() => setSuccess(''), 3000)
      await load()
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this event?')) return
    try {
      await adminFetch('delete-event', { body: { id } })
      setSuccess('Deleted')
      setTimeout(() => setSuccess(''), 3000)
      await load()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Events</h1>
        <button onClick={openNew} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"><Plus size={16} /> Add Event</button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">{success}</div>}

      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" />
      </div>

      {editing && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-bold">{editing === 'new' ? 'New Event' : 'Edit Event'}</h2>
            <button onClick={() => setEditing(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
          </div>
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Time</label><input value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" placeholder="e.g. 9:00 AM - 3:00 PM" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" /></div>
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
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Time</th>
            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {items.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">No events yet.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-dark">{item.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{item.time || '-'}</td>
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
