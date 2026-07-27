import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

const sections = [
  { id: 'hero', label: 'Hero Section', fields: [
    { key: 'headline', label: 'Headline', type: 'text' },
    { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
  ]},
  { id: 'welcome', label: 'Welcome Section', fields: [
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'paragraphs', label: 'Paragraphs', type: 'list' },
  ]},
  { id: 'why_choose_us', label: 'Why Choose Us', fields: [
    { key: 'items', label: 'Items (JSON array)', type: 'json' },
  ]},
  { id: 'stats', label: 'Statistics', fields: [
    { key: 'items', label: 'Stats (JSON array)', type: 'json' },
  ]},
  { id: 'student_life', label: 'Student Life', fields: [
    { key: 'items', label: 'Activities (JSON array)', type: 'json' },
  ]},
  { id: 'about', label: 'About Page', fields: [
    { key: 'story', label: 'Our Story', type: 'textarea' },
    { key: 'mission', label: 'Mission', type: 'textarea' },
    { key: 'vision', label: 'Vision', type: 'textarea' },
    { key: 'coreValues', label: 'Core Values (JSON)', type: 'json' },
    { key: 'milestones', label: 'Milestones (JSON)', type: 'json' },
  ]},
  { id: 'academics', label: 'Academics Page', fields: [
    { key: 'levels', label: 'Levels (JSON)', type: 'json' },
    { key: 'teachingMethodology', label: 'Teaching Methodology', type: 'textarea' },
    { key: 'assessment', label: 'Assessment', type: 'textarea' },
    { key: 'academicSupport', label: 'Academic Support', type: 'textarea' },
    { key: 'coCurricular', label: 'Co-Curricular', type: 'textarea' },
  ]},
  { id: 'admissions', label: 'Admissions Page', fields: [
    { key: 'process', label: 'Process (JSON)', type: 'json' },
    { key: 'requirements', label: 'Requirements (JSON array)', type: 'json' },
    { key: 'faqs', label: 'FAQs (JSON)', type: 'json' },
  ]},
]

export default function ContentEditorPage() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [openSection, setOpenSection] = useState('hero')
  const [success, setSuccess] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      const res = await fetch('/api/admin/site-content')
      const data = await res.json()
      const map = {}
      data.forEach(item => { map[item.section] = item.data })
      setContent(map)
    } catch {} finally { setLoading(false) }
  }

  function updateField(section, key, value) {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }))
  }

  function updateJsonField(section, key, value) {
    try { updateField(section, key, JSON.parse(value)) }
    catch { updateField(section, key, value) }
  }

  function renderValue(section, key, value) {
    if (value === undefined || value === null) return ''
    if (Array.isArray(value) || typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  async function saveSection(sectionId) {
    setSaving(true)
    setSuccess('')
    try {
      await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: sectionId, data: content[sectionId] || {} }),
      })
      setSuccess(`${sectionId} saved!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch {} finally { setSaving(false) }
  }

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-brand-blue" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-heading font-bold text-dark">Site Content Editor</h1>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm">{success}</div>
      )}

      <div className="space-y-4">
        {sections.map(section => (
          <motion.div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
              className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
            >
              <h2 className="text-lg font-heading font-bold text-dark">{section.label}</h2>
              {openSection === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {openSection === section.id && (
              <div className="px-6 pb-6 space-y-4">
                {section.fields.map(field => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={renderValue(section.id, field.key, content[section.id]?.[field.key])}
                        onChange={e => updateField(section.id, field.key, e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm font-mono"
                      />
                    ) : field.type === 'json' ? (
                      <textarea
                        value={renderValue(section.id, field.key, content[section.id]?.[field.key])}
                        onChange={e => updateJsonField(section.id, field.key, e.target.value)}
                        rows={6}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm font-mono"
                      />
                    ) : field.type === 'list' ? (
                      <textarea
                        value={renderValue(section.id, field.key, content[section.id]?.[field.key])}
                        onChange={e => updateField(section.id, field.key, e.target.value.split('\n').filter(Boolean))}
                        rows={3}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm font-mono"
                      />
                    ) : (
                      <input
                        value={renderValue(section.id, field.key, content[section.id]?.[field.key])}
                        onChange={e => updateField(section.id, field.key, e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      />
                    )}
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => saveSection(section.id)}
                    disabled={saving}
                    className="px-4 py-2 bg-brand-blue text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save {section.label}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
