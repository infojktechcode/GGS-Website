import { motion } from 'framer-motion'
import { Calendar, Newspaper } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import { useSiteContent } from '../lib/SiteContentContext'

export default function NewsPage() {
  const { news } = useSiteContent()
  const articles = news || []

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

      {articles.length === 0 ? (
        <section className="py-24 bg-white">
          <div className="max-w-md mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-light rounded-3xl p-12 shadow-lg">
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
      ) : (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, i) => (
                <motion.article
                  key={article.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group"
                >
                  {article.image && (
                    <div className="h-48 overflow-hidden">
                      <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/10 text-brand-blue mb-3">
                      {article.category}
                    </span>
                    <h2 className="text-lg font-heading font-bold text-dark mb-2 leading-snug">{article.title}</h2>
                    {article.excerpt && <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.excerpt}</p>}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={14} />
                      <span>{article.date}</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
