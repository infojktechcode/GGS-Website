import { useState, useEffect } from 'react'
import { Trash2, Archive, Mail, Loader2, Search } from 'lucide-react'
import { adminFetch, adminFetchAll } from '../../services/adminApi'

export default function MessagesManagePage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showArchived, setShowArchived] = useState(false)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [readFilter, setReadFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => { load() }, [showArchived, search, readFilter])

  async function load() {
    try {
      const params = { archived: String(showArchived) }
      if (search) params.search = search
      if (readFilter !== 'all') params.read = readFilter
      const data = await adminFetchAll('list-messages', params)
      setMessages(data)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  async function markRead(id) {
    try {
      await adminFetch('update-message', { body: { id, is_read: true } })
      await load()
    } catch (err) { setError(err.message) }
  }

  async function toggleArchive(id, is_archived) {
    try {
      await adminFetch('update-message', { body: { id, is_archived } })
      setSelected(null); await load()
    } catch (err) { setError(err.message) }
  }

  async function remove(id) {
    if (!confirm('Delete this message?')) return
    try {
      await adminFetch('delete-message', { body: { id } })
      setSelected(null); await load()
    } catch (err) { setError(err.message) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Contact Messages</h1>
        <button onClick={() => setShowArchived(!showArchived)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${showArchived ? 'bg-gray-200 text-gray-700' : 'bg-brand-blue text-white'}`}>
          {showArchived ? 'View Active' : 'View Archived'}
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search messages..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" />
        </div>
        <div className="flex gap-2">
          {[{ value: 'all', label: 'All' }, { value: 'false', label: 'Unread' }, { value: 'true', label: 'Read' }].map(opt => (
            <button key={opt.value} onClick={() => setReadFilter(opt.value)} className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${readFilter === opt.value ? 'bg-brand-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No messages.</div>
            ) : messages.map(msg => (
              <button
                key={msg.id}
                onClick={() => { setSelected(msg); if (!msg.is_read) markRead(msg.id) }}
                className={`w-full text-left p-6 hover:bg-gray-50 transition-colors ${selected?.id === msg.id ? 'bg-blue-50' : ''} ${!msg.is_read ? 'border-l-4 border-l-brand-blue' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-dark text-sm">{msg.name}</p>
                    <p className="text-xs text-gray-400">{msg.email} · {msg.phone}</p>
                    <p className="text-sm text-gray-500 mt-1 truncate">{msg.subject || '(No subject)'}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{new Date(msg.created_at).toLocaleDateString()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          {selected ? (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-heading font-bold text-dark">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.email} · {selected.phone}</p>
                  {selected.subject && <p className="text-sm font-medium text-dark mt-2">{selected.subject}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleArchive(selected.id, !selected.is_archived)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title={selected.is_archived ? 'Unarchive' : 'Archive'}>
                    <Archive size={16} />
                  </button>
                  <button onClick={() => remove(selected.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4">{new Date(selected.created_at).toLocaleString()}</p>
              <div className="bg-light rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Mail size={40} className="mb-3" />
              <p className="text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
