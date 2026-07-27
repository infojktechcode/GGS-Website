import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import SectionHeader from '../components/common/SectionHeader'
import Card from '../components/common/Card'
import { siteContent } from '../data/siteContent'

export default function TestimonialsPage() {
  const parents = siteContent.testimonials.filter(t => t.role === 'Parent')
  const students = siteContent.testimonials.filter(t => t.role === 'Student')
  const alumni = siteContent.testimonials.filter(t => t.role === 'Alumni')

  return (
    <>
      <SEO title="Testimonials" description="Hear from parents, students, and alumni about their experience at Glorious Group of Schools." />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-green to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.group})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">Testimonials</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Hear from our community about their experiences at Glorious Group of Schools.
          </motion.p>
        </div>
      </section>

      {parents.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="What Parents Say" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {parents.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {students.length > 0 && (
        <section className="py-20 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="What Students Say" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {students.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {alumni.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="What Alumni Say" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alumni.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function TestimonialCard({ testimonial: t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="p-8 h-full">
        <Quote size={32} className="text-brand-green/20 mb-4" aria-hidden="true" />
        <div className="flex items-center gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
          {Array.from({ length: t.rating || 0 }).map((_, j) => (
            <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
          ))}
        </div>
        <blockquote className="text-gray-700 leading-relaxed italic mb-8">
          "{t.content}"
        </blockquote>
        <div className="mt-auto">
          <p className="font-semibold text-dark">{t.name}</p>
          <p className="text-sm text-brand-green font-medium">{t.role}</p>
        </div>
      </Card>
    </motion.div>
  )
}
