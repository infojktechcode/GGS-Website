import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import SchemaMarkup from '../components/common/SchemaMarkup'
import { siteContent } from '../data/siteContent'

const newsImgMap = {
  'science-fair': images.scienceFair,
  'sports-day': images.sportsDay,
  enrollment: images.enrollment,
  'music-festival': images.musicFestival,
  'tree-planting': images.treePlanting,
  debate: images.debate,
  'computer-lab': images.lab,
}

const allNews = [
  ...siteContent.latestNews,
  {
    title: 'Community Outreach: Students Plant 500 Trees',
    excerpt: 'Our environmental club led a tree-planting initiative, contributing to environmental conservation and beautifying the local community.',
    date: 'March 22, 2026',
    category: 'Community',
    image: 'tree-planting',
  },
  {
    title: 'Inter-School Debate Championship Victory',
    excerpt: 'Our debate team emerged champions at the Regional Inter-School Debate Competition, demonstrating exceptional oratory and critical thinking skills.',
    date: 'February 14, 2026',
    category: 'Achievements',
    image: 'debate',
  },
  {
    title: 'New Computer Lab Inaugurated',
    excerpt: 'A state-of-the-art computer lab with 50 workstations was officially opened, enhancing digital literacy for our students.',
    date: 'January 20, 2026',
    category: 'Announcements',
    image: 'computer-lab',
  },
]

const categories = ['All', 'Achievements', 'Events', 'Announcements', 'Community']

export default function NewsPage() {
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')

  const filtered = allNews.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.excerpt.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCat === 'All' || item.category === activeCat
    return matchSearch && matchCat
  })

  const featured = allNews[0]

  return (
    <>
      <SEO title="News & Events" description="Latest news, announcements, achievements, and upcoming events at Glorious Group of Schools." />
      <SchemaMarkup events={siteContent.upcomingEvents} />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.library})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">News & Events</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Stay updated with the latest happenings at our school.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 bg-gradient-to-r from-brand-blue/5 to-brand-green/5 rounded-3xl p-8 md:p-12 shadow-lg"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/10 text-brand-blue mb-4">Featured Article</span>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-dark mb-4">{featured.title}</h2>
              <p className="text-gray-600 max-w-3xl mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Calendar size={14} aria-hidden="true" />
                <span>{featured.date}</span>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="News categories">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  role="tab"
                  aria-selected={activeCat === cat}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCat === cat ? 'bg-brand-blue text-white shadow-lg' : 'bg-light text-gray-600 hover:bg-blue-50 hover:text-brand-blue'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search news..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-light"
                aria-label="Search news articles"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((article, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="overflow-hidden h-full">
                  <div className="h-48 overflow-hidden">
                    <img src={newsImgMap[article.image] || images.learning} alt={article.title} className="w-full h-full object-cover" loading="lazy" decoding="async" width={400} height={300} />
                  </div>
                  <div className="p-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green mb-3">{article.category}</span>
                    <h3 className="text-lg font-heading font-bold text-dark mb-2 leading-snug">{article.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} aria-hidden="true" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Upcoming Events" subtitle="Mark your calendar for these important dates." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteContent.upcomingEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center" aria-hidden="true">
                    <Calendar size={22} className="text-brand-blue" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-dark">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 ml-16">{event.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
