import { motion } from 'framer-motion'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import SectionHeader from '../components/common/SectionHeader'
import { usePageContent } from '../lib/SiteContentContext'

const iconMap = {
  Trophy: '🏆', Music: '🎵', Clapperboard: '🎭', FlaskConical: '🔬',
  Crown: '👑', Users2: '👥', HandHeart: '🤝', Bus: '🚌',
}

export default function SchoolLifePage() {
  return (
    <>
      <SEO title="School Life" description="Explore student life at Glorious Group of Schools. Sports, music, drama, STEM, clubs, and more." />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-green to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.sports})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">School Life</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Beyond the classroom, our students discover passions, build character, and create memories.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Activities & Programs" subtitle="A rich variety of opportunities for every student to explore and excel." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(usePageContent('student_life').items || []).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ y: -8 }}
                className="bg-light rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-5" aria-hidden="true">{iconMap[item.icon] || '⭐'}</div>
                <h3 className="text-xl font-heading font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl font-heading font-bold text-dark mb-6">Student Welfare</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                At Glorious Group of Schools, the well-being of every student is our top priority. We provide comprehensive guidance and counseling services, a dedicated health center with qualified nurses, nutritious meal programs, and a safe, inclusive environment where every child feels valued and supported. Our pastoral care system ensures that each student has a mentor who monitors their academic progress, social development, and emotional well-being.
              </p>
              <ul className="space-y-3">
                {['Guidance and counseling services', 'School health center with qualified nurse', 'Nutritious and balanced meal program', 'Safe and secure campus environment', 'Pastoral care and mentorship', 'Anti-bullying programs'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-3xl font-heading font-bold text-dark mb-6">Character Development</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Character development is integral to our educational philosophy. Through daily devotionals, Christian Religious Education, community service, and leadership programs, we instill values of integrity, responsibility, respect, and compassion. We believe that academic success and strong character go hand in hand in preparing students for a purposeful life.
              </p>
              <ul className="space-y-3">
                {['Daily devotionals and worship', 'Christian values integration', 'Leadership training programs', 'Community service initiatives', 'Peer mentoring programs', 'Ethics and life skills education'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-brand-blue shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
