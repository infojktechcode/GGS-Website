import { motion } from 'framer-motion'
import { GraduationCap, Users, BookOpen, Shield, Heart, Monitor, Star } from 'lucide-react'
import { siteContent } from '../../data/siteContent'
import SectionHeader from '../common/SectionHeader'

const iconMap = {
  GraduationCap, Users, BookOpen, Shield, Heart, Monitor, Star,
}

export default function WhyChooseUs() {
  const items = siteContent.whyChooseUs
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Why Choose Glorious Group of Schools"
          subtitle="We provide an exceptional educational experience that prepares students for academic success and life."
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-5" aria-hidden="true">
                  {Icon && <Icon size={28} className="text-brand-blue" />}
                </div>
                <h3 className="text-xl font-heading font-bold text-dark mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
