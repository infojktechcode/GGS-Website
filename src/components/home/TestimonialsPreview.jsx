import { motion } from 'framer-motion'
import { Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteContent } from '../../data/siteContent'
import SectionHeader from '../common/SectionHeader'
import Card from '../common/Card'

export default function TestimonialsPreview() {
  const testimonials = siteContent.testimonials.slice(0, 3)
  return (
    <section className="py-20 bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Parents & Students Say"
          subtitle="Hear from our community about their experience at Glorious Group of Schools."
        />
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-8 h-full">
                <div className="flex items-center gap-1 mb-4" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating || 0 }).map((_, j) => (
                    <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-6 italic">
                  "{t.content}"
                </blockquote>
                <div>
                  <p className="font-semibold text-dark">{t.name}</p>
                  <p className="text-sm text-brand-green">{t.role}</p>
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
          <Link to="/testimonials" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-green transition-colors">
            Read More Testimonials <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
