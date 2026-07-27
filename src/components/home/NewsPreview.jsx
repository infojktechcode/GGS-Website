import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../lib/SiteContentContext'
import SectionHeader from '../common/SectionHeader'
import Card from '../common/Card'

export default function NewsPreview() {
  const { news = [] } = useSiteContent()
  const displayNews = news.slice(0, 3)
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Latest News"
          subtitle="Keep up with the achievements, events, and announcements from our school community."
        />
        <div className="grid md:grid-cols-3 gap-8">
          {displayNews.map((article, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="overflow-hidden h-full">
                <div className="h-48 overflow-hidden">
                  <img src={article.image || ''} alt={article.title} className="w-full h-full object-cover" loading="lazy" decoding="async" width={400} height={300} />
                </div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-heading font-bold text-dark mb-2 leading-snug">{article.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={14} aria-hidden="true" />
                    <span>{article.date}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/news" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-green transition-colors">
            View All News <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
