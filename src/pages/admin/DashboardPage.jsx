import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Newspaper, Calendar, MessageSquare, TrendingUp, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [newsRes, eventsRes, testimonialsRes, messagesRes] = await Promise.all([
          supabase.from('news').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        ])
        setStats({
          news: newsRes.count || 0,
          events: eventsRes.count || 0,
          testimonials: testimonialsRes.count || 0,
          messages: messagesRes.count || 0,
        })
      } catch { setStats({ news: 0, events: 0, testimonials: 0, messages: 0 }) }
      finally { setLoading(false) }
    }
    loadStats()
  }, [])

  const cards = [
    { label: 'News Articles', value: stats?.news ?? '-', icon: Newspaper, color: 'bg-blue-500' },
    { label: 'Upcoming Events', value: stats?.events ?? '-', icon: Calendar, color: 'bg-green-500' },
    { label: 'Testimonials', value: stats?.testimonials ?? '-', icon: MessageSquare, color: 'bg-purple-500' },
    { label: 'Contact Messages', value: stats?.messages ?? '-', icon: TrendingUp, color: 'bg-orange-500' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-brand-blue" />
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-dark mb-8">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className={`w-12 h-12 rounded-xl ${card.color} bg-opacity-10 flex items-center justify-center mb-4`}>
              <card.icon size={24} className="text-white" />
            </div>
            <p className="text-3xl font-heading font-bold text-dark">{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
