import { motion } from 'framer-motion'
import { Book, ClipboardCheck, GraduationCap, BookOpen } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import SectionHeader from '../components/common/SectionHeader'
import SchemaMarkup from '../components/common/SchemaMarkup'
import { usePageContent } from '../lib/SiteContentContext'

const levelImages = [images.classroom, images.learning, images.lab]

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'Academics', path: '/academics' },
]

export default function AcademicsPage() {
  const academics = usePageContent('academics')
  return (
    <>
      <SEO title="Academics" description="Explore our CBC curriculum from Early Years through Junior School. Academic excellence at Glorious Group of Schools." />
      <SchemaMarkup breadcrumbs={breadcrumbs} />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.classroom})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">Academics</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            A comprehensive CBC curriculum designed to nurture academic excellence and holistic development.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Curriculum Levels" subtitle="Age-appropriate, engaging, and challenging programs for every stage." />
          <div className="space-y-16">
            {academics.levels.map((level, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
              >
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-heading font-bold text-dark">{level.name}</h3>
                  <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-brand-green/10 text-brand-green mt-2 mb-4">{level.ageRange}</span>
                  <p className="text-gray-700 leading-relaxed">{level.description}</p>
                  <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                    {level.highlights.map((h, j) => (
                      <li key={j} className="flex items-center gap-2 text-gray-600">
                        <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full md:w-80 h-64 rounded-3xl overflow-hidden shadow-lg">
                  <img src={levelImages[i]} alt={`${level.name} classroom`} className="w-full h-full object-cover" loading="lazy" decoding="async" width={320} height={256} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Book, title: 'Teaching Methodology', content: academics.teachingMethodology },
              { icon: ClipboardCheck, title: 'Assessment', content: academics.assessment },
              { icon: GraduationCap, title: 'Academic Support', content: academics.academicSupport },
              { icon: BookOpen, title: 'Co-curricular Learning', content: academics.coCurricular },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4" aria-hidden="true">
                  <item.icon size={28} className="text-brand-blue" />
                </div>
                <h3 className="text-xl font-heading font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Academic Calendar Preview" subtitle="Key dates for the current academic year." />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-light rounded-3xl p-8 shadow-lg"
          >
            <div className="space-y-4">
              {[
                { term: 'Term 1', dates: 'January 8 - April 11, 2026', status: 'Completed' },
                { term: 'Term 2', dates: 'May 6 - August 8, 2026', status: 'In Progress' },
                { term: 'Term 3', dates: 'September 2 - November 27, 2026', status: 'Upcoming' },
              ].map((t, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm">
                  <div>
                    <p className="font-heading font-semibold text-dark">{t.term}</p>
                    <p className="text-sm text-gray-500">{t.dates}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    t.status === 'Completed' ? 'bg-gray-100 text-gray-500' :
                    t.status === 'In Progress' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t.status}
                    {t.status === 'Completed' ? ' ✓' : t.status === 'In Progress' ? ' ●' : ' ○'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
