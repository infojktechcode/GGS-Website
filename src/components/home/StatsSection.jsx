import { motion } from 'framer-motion'
import { siteContent } from '../../data/siteContent'
import { images } from '../../utils/images'
import AnimatedCounter from '../common/AnimatedCounter'

export default function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-blue-800" />
      <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.hero})` }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">Our School By the Numbers</h2>
          <p className="text-white/70 mt-3 max-w-2xl mx-auto">A testament to our commitment to quality education and community impact.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {siteContent.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
            >
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              <p className="text-white/80 mt-2 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
