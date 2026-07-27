import { motion } from 'framer-motion'
import { Target, Eye, Heart, Quote } from 'lucide-react'
import SEO from '../components/common/SEO'
import SectionHeader from '../components/common/SectionHeader'
import SchemaMarkup from '../components/common/SchemaMarkup'
import { images } from '../utils/images'
import { usePageContent } from '../lib/SiteContentContext'

const milestones = [
  { year: '2011', title: 'School Founded', description: 'Glorious Group of Schools opened its doors with 15 students.' },
  { year: '2013', title: 'First Graduation', description: 'First cohort of students completed their primary education.' },
  { year: '2016', title: 'Junior School Launch', description: 'Expanded to offer Junior School education.' },
  { year: '2018', title: 'Excellence Award', description: 'Recognized as top-performing school in the region.' },
  { year: '2020', title: 'Digital Transformation', description: 'Integrated technology across all learning areas.' },
  { year: '2023', title: '1,200+ Students', description: 'Milestone enrollment with expanded campus facilities.' },
]

const leadershipTeam = [
  { name: 'Dr. Jane Wambui', role: 'Principal', image: images.teachers },
  { name: 'Mr. Samuel Omondi', role: 'Deputy Principal', image: images.teachers },
  { name: 'Mrs. Faith Nyambura', role: 'Head of Academics', image: images.teachers },
  { name: 'Mr. Daniel Kiprop', role: 'Head of Administration', image: images.teachers },
]

const breadcrumbs = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
]

export default function AboutPage() {
  const about = usePageContent('about')
  return (
    <>
      <SEO title="About Us" description="Learn about Glorious Group of Schools' history, mission, vision, values, and leadership team." />
      <SchemaMarkup breadcrumbs={breadcrumbs} />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.campus})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">
            About Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Discover our story, values, and commitment to excellence in education.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Story" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-gray-700 leading-relaxed text-lg"
          >
            <p>{about.story}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-10 shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5" aria-hidden="true">
                <Target size={28} className="text-brand-blue" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-dark mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">{about.mission}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-10 shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-5" aria-hidden="true">
                <Eye size={28} className="text-brand-green" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-dark mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">{about.vision}</p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Core Values" subtitle="The principles that guide everything we do." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {about.coreValues.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-light rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-4" aria-hidden="true">
                  <Heart size={24} className="text-brand-blue" />
                </div>
                <h3 className="text-xl font-heading font-bold text-dark mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Principal's Message" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 md:p-12"
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="shrink-0">
                <img src={images.teachers} alt="Dr. Jane Wambui, Principal" className="w-32 h-32 rounded-2xl object-cover shadow-lg" loading="lazy" decoding="async" width={128} height={128} />
              </div>
              <div>
                <Quote size={32} className="text-brand-green/30 mb-4" aria-hidden="true" />
                <blockquote className="text-gray-700 leading-relaxed italic">{about.principalMessage.content}</blockquote>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-heading font-bold text-dark text-lg">{about.principalMessage.name}</p>
                  <p className="text-brand-green">{about.principalMessage.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Leadership Team" subtitle="Meet the dedicated professionals guiding our school." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="text-center"
              >
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden shadow-lg mb-4">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" decoding="async" width={160} height={160} />
                </div>
                <h3 className="text-lg font-heading font-bold text-dark">{member.name}</h3>
                <p className="text-brand-green text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Our Journey" subtitle="Key milestones in our school's history." />
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-brand-blue/20" aria-hidden="true" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-20"
                >
                  <div className="absolute left-4 top-1 w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-white text-sm font-bold shadow-md" aria-hidden="true">
                    {m.year.slice(2)}
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <span className="text-sm font-bold text-brand-blue">{m.year}</span>
                    <h3 className="text-lg font-heading font-bold text-dark mt-1">{m.title}</h3>
                    <p className="text-gray-600 mt-1">{m.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
