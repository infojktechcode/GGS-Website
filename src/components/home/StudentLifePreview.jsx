import { motion } from 'framer-motion'
import { Trophy, Music, Clapperboard, FlaskConical, Crown, Users2, HandHeart, Bus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteContent } from '../../data/siteContent'
import SectionHeader from '../common/SectionHeader'

const iconMap = { Trophy, Music, Clapperboard, FlaskConical, Crown, Users2, HandHeart, Bus }

export default function StudentLifePreview() {
  const items = siteContent.studentLife.slice(0, 8)
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Student Life"
          subtitle="Beyond the classroom, our students explore talents, build character, and create lasting memories."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                whileHover={{ y: -6 }}
                className="bg-light rounded-2xl p-6 shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-green/10 flex items-center justify-center mb-4" aria-hidden="true">
                  {Icon && <Icon size={24} className="text-brand-green" />}
                </div>
                <h3 className="text-lg font-heading font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link to="/school-life" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-green transition-colors">
            Explore All Activities <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
