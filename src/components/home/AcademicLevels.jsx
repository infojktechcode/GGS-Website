import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { usePageContent } from '../../lib/SiteContentContext'
import SectionHeader from '../common/SectionHeader'

const levelColors = [
  { border: 'border-t-brand-green', icon: 'text-brand-green', bg: 'bg-green-100 text-green-700' },
  { border: 'border-t-brand-blue', icon: 'text-brand-blue', bg: 'bg-blue-100 text-blue-700' },
  { border: 'border-t-purple-600', icon: 'text-purple-600', bg: 'bg-purple-100 text-purple-700' },
]

const levels = [
  { name: 'Early Years', age: 'Ages 3 - 5' },
  { name: 'Primary School', age: 'Ages 6 - 12' },
  { name: 'Junior School', age: 'Ages 12 - 15' },
]

export default function AcademicLevels() {
  const academics = usePageContent('academics')
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Academic Excellence"
          subtitle="We offer a comprehensive CBC curriculum designed to nurture every student's potential."
        />
        <div className="grid md:grid-cols-3 gap-8">
          {levels.map((level, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className={`bg-light rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-t-4 ${levelColors[i].border}`}
            >
              <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-5" aria-hidden="true">
                <BookOpen size={28} className={levelColors[i].icon} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-dark mb-2">{level.name}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${levelColors[i].bg} mb-4`}>{level.age}</span>
              <p className="text-gray-600 leading-relaxed">
                {academics?.levels?.[i]?.description || ''}
              </p>
              <ul className="mt-4 space-y-2">
                {academics?.levels?.[i]?.highlights?.map((h, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" aria-hidden="true" />
                    {h}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
