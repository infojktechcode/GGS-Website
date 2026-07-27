import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Button from '../common/Button'

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green to-green-700" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
          Ready to Join Our School Community?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Give your child the gift of quality education in a nurturing, values-based environment. Enroll today and be part of the Glorious family.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button to="/admissions" variant="outline" size="lg">
            Apply Now <ArrowRight size={20} className="ml-2" />
          </Button>
          <Button to="/contact" variant="primary" size="lg">
            Schedule a Visit
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
