import { motion } from 'framer-motion'
import { Newspaper } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'

export default function NewsPage() {
  return (
    <>
      <SEO title="News & Events" description="Latest news and events at Glorious Group of Schools." />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.library})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">News & Events</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Stay updated with the latest happenings at our school.
          </motion.p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-md mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-light rounded-3xl p-12 shadow-lg"
          >
            <div className="w-20 h-20 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-6" aria-hidden="true">
              <Newspaper size={40} className="text-brand-blue" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-dark mb-3">No News Yet</h2>
            <p className="text-gray-600 leading-relaxed">
              News and events will appear here once published. Check back soon for updates, announcements, and stories from our school community.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
