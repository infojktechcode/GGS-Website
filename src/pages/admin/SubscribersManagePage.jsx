import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Download, Loader2, Mail } from 'lucide-react'

export default function SubscribersManagePage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/admin?action=list-subscribers')
      setSubscribers(await res.json())
    } catch {} finally { setLoading(false) }
  }

  async function remove(id) {
    if (!confirm('Remove this subscriber?')) return
    await fetch('/api/admin?action=delete-subscriber', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await load()
  }

  function exportCSV() {
    const header = 'Email,Name,Subscribed,Date\n'
    const rows = subscribers.map(s => `${s.email},${s.name || ''},${s.subscribed},${s.created_at}`).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'subscribers.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Newsletter Subscribers</h1>
        <button onClick={exportCSV} disabled={subscribers.length === 0} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">No subscribers yet.</td></tr>
            ) : subscribers.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-gray-400" />
                    <span className="text-sm font-medium text-dark">{s.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{s.name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-400">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => remove(s.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-400 mt-4">{subscribers.length} total subscriber{subscribers.length !== 1 ? 's' : ''}</p>
    </div>
  )
}
