import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Newspaper, Calendar, Star, Image as ImageIcon, Mail, Users,
  UserPlus, Settings, Loader2
} from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin?action=db-status')
        const json = await res.json()
        setStats({
          news: json.news?.count || 0,
          events: json.events?.count || 0,
          testimonials: json.testimonials?.count || 0,
          messages: json.contact_messages?.count || 0,
          images: json.gallery_images?.count || 0,
          enquiries: json.admission_enquiries?.count || 0,
          subscribers: json.newsletter_subscribers?.count || 0,
        })
      } catch {
        setStats({ news: 0, events: 0, testimonials: 0, messages: 0, images: 0, enquiries: 0, subscribers: 0 })
      } finally { setLoading(false) }
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'News Articles', value: stats?.news, icon: Newspaper, color: 'bg-blue-500', bgColor: 'bg-blue-50' },
    { label: 'Upcoming Events', value: stats?.events, icon: Calendar, color: 'bg-emerald-500', bgColor: 'bg-emerald-50' },
    { label: 'Testimonials', value: stats?.testimonials, icon: Star, color: 'bg-purple-500', bgColor: 'bg-purple-50' },
    { label: 'Gallery Images', value: stats?.images, icon: ImageIcon, color: 'bg-pink-500', bgColor: 'bg-pink-50' },
    { label: 'Messages', value: stats?.messages, icon: Mail, color: 'bg-orange-500', bgColor: 'bg-orange-50' },
    { label: 'New Enquiries', value: stats?.enquiries, icon: Users, color: 'bg-rose-500', bgColor: 'bg-rose-50' },
    { label: 'Subscribers', value: stats?.subscribers, icon: UserPlus, color: 'bg-teal-500', bgColor: 'bg-teal-50' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-brand-blue" />
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">Welcome to your CMS dashboard. Manage all your content from one place.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center mb-4`}>
              <card.icon size={24} className={card.color} />
            </div>
            <p className="text-3xl font-heading font-bold text-dark">{card.value ?? '-'}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-brand-blue rounded-2xl p-8 text-white">
        <h2 className="text-xl font-heading font-bold mb-2">Quick Actions</h2>
        <p className="text-white/70 mb-6">Common tasks to manage your website content.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Add News', href: '/admin/news', icon: Newspaper },
            { label: 'Add Event', href: '/admin/events', icon: Calendar },
            { label: 'Upload Photo', href: '/admin/gallery', icon: ImageIcon },
            { label: 'Edit Homepage', href: '/admin/content', icon: Settings },
          ].map((action, i) => (
            <a key={i} href={action.href} className="flex items-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
              <action.icon size={20} />
              <span className="font-medium text-sm">{action.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
