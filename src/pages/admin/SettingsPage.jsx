import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch('/api/admin?action=get-settings&key=school_info')
      const data = await res.json()
      setSettings(data[0]?.value || {})
    } catch {} finally { setLoading(false) }
  }

  function handleChange(field, value) {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  function handlePhones(value) {
    handleChange('phones', value.split('\n').filter(Boolean))
  }

  function handleEmails(value) {
    handleChange('emails', value.split('\n').filter(Boolean))
  }

  async function save() {
    setSaving(true)
    try {
      await fetch('/api/admin?action=save-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'school_info', value: settings }),
      })
    } catch {} finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Settings</h1>
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} className="bg-white rounded-2xl p-8 shadow-lg max-w-3xl">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
              <input value={settings?.name || ''} onChange={e => handleChange('name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Motto</label>
              <input value={settings?.motto || ''} onChange={e => handleChange('motto', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea value={settings?.shortDescription || ''} onChange={e => handleChange('shortDescription', e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input value={settings?.address || ''} onChange={e => handleChange('address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Numbers (one per line)</label>
              <textarea value={(settings?.phones || []).join('\n')} onChange={e => handlePhones(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Emails (one per line)</label>
              <textarea value={(settings?.emails || []).join('\n')} onChange={e => handleEmails(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
            <input value={settings?.officeHours || ''} onChange={e => handleChange('officeHours', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contacts (one per line)</label>
            <textarea value={(settings?.emergencyContacts || []).join('\n')} onChange={e => handleChange('emergencyContacts', e.target.value.split('\n').filter(Boolean))} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
          </div>
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-heading font-bold text-dark mb-4">Social Media</h3>
            <div className="grid grid-cols-2 gap-4">
              {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(platform => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                  <input value={settings?.socialMedia?.[platform] || ''} onChange={e => handleChange('socialMedia', { ...settings?.socialMedia, [platform]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
