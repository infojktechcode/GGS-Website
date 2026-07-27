import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Phone } from 'lucide-react'
import { usePageContent, useSiteContent } from '../../lib/SiteContentContext'
import { images } from '../../utils/images'
import Button from '../common/Button'
import SchoolLogo from '../common/SchoolLogo'

export default function HeroSection() {
  const hero = usePageContent('hero')
  const { schoolInfo } = useSiteContent()
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/95 via-brand-blue/90 to-dark/90 z-10" />
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${images.hero})` }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(10,154,52,0.3),transparent_60%)] z-10" />

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <SchoolLogo textColor="#FFFFFF" size="lg" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white mt-8 leading-tight">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mt-4 font-body max-w-xl">
              {hero.subheadline}
            </p>
            <p className="text-brand-green font-semibold text-lg mt-3 italic">
              "{schoolInfo?.motto || ''}"
            </p>
            <div className="flex flex-wrap gap-4 mt-10">
              <Button to="/admissions" variant="secondary" size="lg">
                Apply Now <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                <Calendar size={18} className="mr-2" /> Book a Tour
              </Button>
              <Button to="/contact" variant="outline" size="lg">
                <Phone size={18} className="mr-2" /> Contact Us
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 border-t-4 border-l-4 border-brand-green rounded-tl-2xl" aria-hidden="true" />
              <img
                src={images.students}
                alt="Students learning together at Glorious Group of Schools"
                className="rounded-3xl shadow-2xl w-full h-full object-cover"
                loading="eager"
                decoding="async"
                width={600}
                height={400}
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-4 border-r-4 border-brand-green rounded-br-2xl" aria-hidden="true" />
              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20" aria-hidden="true">
                <p className="text-white font-bold text-lg">15+ Years</p>
                <p className="text-white/70 text-sm">of Excellence</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20" aria-hidden="true">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-white/60">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </motion.div>
      </div>
    </section>
  )
}
