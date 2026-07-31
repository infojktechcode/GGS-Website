import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2 } from 'lucide-react'
import { adminFetch, adminFetchAll, adminUpload } from '../../services/adminApi'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seo, setSeo] = useState({ title: '', description: '' })
  const [uploading, setUploading] = useState({ logo: false, favicon: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const logoRef = useRef()
  const faviconRef = useRef()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const [info, seoData] = await Promise.all([
        adminFetchAll('get-settings', { key: 'school_info' }),
        adminFetchAll('get-settings', { key: 'seo' }),
      ])
      setSettings(info[0]?.value || {})
      setSeo(seoData[0]?.value || { title: '', description: '' })
    } catch (err) { setError(err.message) } finally { setLoading(false) }
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

  async function handleLogoUpload(e, type) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(prev => ({ ...prev, [type]: true }))
    try {
      const url = await adminUpload('documents', file)
      handleChange(type === 'logo' ? 'logoUrl' : 'faviconUrl', url)
      setSuccess(`${type === 'logo' ? 'Logo' : 'Favicon'} uploaded`)
    } catch (err) { setError(err.message) } finally { setUploading(prev => ({ ...prev, [type]: false })) }
  }

  async function save() {
    setSaving(true); setError(''); setSuccess('')
    try {
      await Promise.all([
        adminFetch('save-settings', { body: { key: 'school_info', value: settings } }),
        adminFetch('save-settings', { body: { key: 'seo', value: seo } }),
      ])
      setSuccess('Settings saved')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) { setError(err.message) } finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Settings</h1>
        <button onClick={save} disabled={saving} className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save All
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm">{success}</div>}

      <div className="space-y-6 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-lg font-heading font-bold text-dark mb-6">School Information</h2>
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
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-lg font-heading font-bold text-dark mb-6">Branding</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
              {settings?.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-16 mb-2 object-contain" />}
              <input type="file" ref={logoRef} onChange={e => handleLogoUpload(e, 'logo')} accept="image/*" className="text-sm" />
              {uploading.logo && <Loader2 size={14} className="animate-spin text-brand-blue mt-1" />}
              <input value={settings?.logoUrl || ''} onChange={e => handleChange('logoUrl', e.target.value)} placeholder="Or paste image URL" className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Favicon</label>
              {settings?.faviconUrl && <img src={settings.faviconUrl} alt="Favicon" className="h-10 mb-2 object-contain" />}
              <input type="file" ref={faviconRef} onChange={e => handleLogoUpload(e, 'favicon')} accept="image/*" className="text-sm" />
              {uploading.favicon && <Loader2 size={14} className="animate-spin text-brand-blue mt-1" />}
              <input value={settings?.faviconUrl || ''} onChange={e => handleChange('faviconUrl', e.target.value)} placeholder="Or paste image URL" className="w-full mt-2 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-lg font-heading font-bold text-dark mb-6">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Title</label>
              <input value={seo.title || ''} onChange={e => setSeo(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Meta Description</label>
              <textarea value={seo.description || ''} onChange={e => setSeo(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-lg font-heading font-bold text-dark mb-4">Social Media</h2>
          <div className="grid grid-cols-2 gap-4">
            {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map(platform => (
              <div key={platform}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{platform}</label>
                <input value={settings?.socialMedia?.[platform] || ''} onChange={e => handleChange('socialMedia', { ...settings?.socialMedia, [platform]: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
