import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteContent } from '../../lib/SiteContentContext'
import SectionHeader from '../common/SectionHeader'
import Card from '../common/Card'

export default function EventsPreview() {
  const { events = [] } = useSiteContent()
  const displayEvents = events.slice(0, 4)
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Upcoming Events"
          subtitle="Stay connected with the latest happenings at our school."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {displayEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="p-6 flex items-start gap-4" hover={true}>
                <div className="w-16 h-16 rounded-xl bg-brand-blue/10 flex flex-col items-center justify-center shrink-0" aria-hidden="true">
                  <Calendar size={20} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-dark">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <Calendar size={14} aria-hidden="true" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                    <Clock size={14} aria-hidden="true" />
                    <span>{event.time}</span>
                  </div>
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
          <Link to="/news" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:text-brand-green transition-colors">
            View Full Calendar <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
