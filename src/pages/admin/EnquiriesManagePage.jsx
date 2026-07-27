import { useState, useEffect } from 'react'
import { Search, Loader2, ChevronDown } from 'lucide-react'

const statuses = ['all', 'new', 'contacted', 'follow_up', 'enrolled', 'closed']

export default function EnquiriesManagePage() {
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  useEffect(() => { load() }, [statusFilter, search])

  async function load() {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin?action=list-enquiries&${params}`)
      setEnquiries(await res.json())
    } catch {} finally { setLoading(false) }
  }

  async function updateStatus(id, status) {
    await fetch('/api/admin?action=update-enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    await load()
  }

  const unread = enquiries.filter(e => e.status === 'new').length

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Admission Enquiries {unread > 0 && <span className="text-sm font-normal text-brand-blue">({unread} new)</span>}</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, or child..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${statusFilter === s ? 'bg-brand-blue text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'follow_up' ? 'Follow Up' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Parent</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Child</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Grade</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No enquiries.</td></tr>
              ) : enquiries.map(eq => (
                <tr key={eq.id} className={`hover:bg-gray-50 ${eq.status === 'new' ? 'bg-blue-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-dark">{eq.parent_name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{eq.child_name} ({eq.child_age}yrs)</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{eq.email}</p>
                    <p className="text-xs text-gray-400">{eq.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{eq.grade_applying || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      eq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      eq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                      eq.status === 'follow_up' ? 'bg-purple-100 text-purple-700' :
                      eq.status === 'enrolled' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>{eq.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(eq.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative group inline-block">
                      <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronDown size={16} /></button>
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[140px] hidden group-hover:block z-10">
                        {statuses.filter(s => s !== 'all').map(s => (
                          <button key={s} onClick={() => updateStatus(eq.id, s)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${eq.status === s ? 'text-brand-blue font-semibold' : 'text-gray-600'}`}>
                            {s === 'follow_up' ? 'Follow Up' : s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
