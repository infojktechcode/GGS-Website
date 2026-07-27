import { motion } from 'framer-motion'
import { usePageContent, useSiteContent } from '../../lib/SiteContentContext'
import { images } from '../../utils/images'
import SectionHeader from '../common/SectionHeader'

export default function WelcomeSection() {
  const welcome = usePageContent('welcome')
  const { schoolInfo } = useSiteContent()
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={welcome.title} subtitle="Discover what makes our school a special place for your child's growth and development." />
        <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-4 text-gray-700 leading-relaxed">
              {welcome.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-brand-green/10 flex items-center justify-center" aria-hidden="true">
                <svg className="w-7 h-7 text-brand-green" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-dark">Our Motto</p>
                <p className="text-brand-green font-medium italic">"{schoolInfo?.motto || ''}"</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -top-4 -right-4 w-full h-full bg-brand-blue/5 rounded-3xl" aria-hidden="true" />
            <img
              src={images.schoolBuilding}
              alt="Glorious Group of Schools - modern school building with beautiful campus"
              className="rounded-3xl shadow-xl relative w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              width={600}
              height={400}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
