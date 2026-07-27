import { motion } from 'framer-motion'

export default function SectionHeader({ title, subtitle, light = false, centered = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 ${light ? 'text-white' : 'text-dark'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-lg md:text-xl max-w-3xl ${centered ? 'mx-auto' : ''} ${light ? 'text-white/80' : 'text-gray-600'}`}>
          {subtitle}
        </p>
      )}
      <div className={`w-20 h-1 bg-brand-green mt-6 rounded-full ${centered ? 'mx-auto' : ''}`} />
    </motion.div>
  )
}
