import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react'
import { useSiteContent } from '../../lib/SiteContentContext'
import { navLinks } from '../../data/navigation'
import SchoolLogo from '../common/SchoolLogo'

const socialIcons = [
  { label: 'Facebook', href: 'https://facebook.com/gloriousgroupofschools', initial: 'F' },
  { label: 'Twitter', href: 'https://twitter.com/gloriousschools', initial: 'T' },
  { label: 'Instagram', href: 'https://instagram.com/gloriousgroupofschools', initial: 'I' },
  { label: 'YouTube', href: 'https://youtube.com/@gloriousschools', initial: 'Y' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/glorious-group-of-schools', initial: 'L' },
]

export default function Footer() {
  const { schoolInfo = {} } = useSiteContent()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState('idle')

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!newsletterEmail) return
    try {
      const res = await fetch('/api/public/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      if (res.ok) {
        setNewsletterStatus('success')
        setNewsletterEmail('')
      } else {
        setNewsletterStatus('error')
      }
    } catch {
      setNewsletterStatus('error')
    }
    setTimeout(() => setNewsletterStatus('idle'), 5000)
  }

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <SchoolLogo textColor="#FFFFFF" size="sm" />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed">{schoolInfo?.shortDescription || ''}</p>
            <p className="mt-3 text-brand-green font-semibold text-sm italic">"{schoolInfo?.motto || ''}"</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h3 className="text-lg font-heading font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-gray-400 hover:text-brand-green transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h3 className="text-lg font-heading font-bold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin size={16} className="mt-1 shrink-0 text-brand-green" aria-hidden="true" />
                <span>{schoolInfo?.address || ''}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone size={16} className="shrink-0 text-brand-green" aria-hidden="true" />
                <div>
                  {(schoolInfo?.phones || []).map((p, i) => <span key={i} className="block">{p}</span>)}
                </div>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail size={16} className="shrink-0 text-brand-green" aria-hidden="true" />
                <div>
                  {(schoolInfo?.emails || []).map((e, i) => <span key={i} className="block">{e}</span>)}
                </div>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <Clock size={16} className="mt-1 shrink-0 text-brand-green" aria-hidden="true" />
                <span>{schoolInfo?.officeHours || ''}</span>
              </li>
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <h3 className="text-lg font-heading font-bold mb-6">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, news, and event invitations.</p>
            {newsletterStatus === 'success' ? (
              <div className="flex items-center gap-2 text-brand-green text-sm">
                <CheckCircle size={16} />
                <span>Subscribed successfully!</span>
              </div>
            ) : newsletterStatus === 'error' ? (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <span>Subscription failed. Try again.</span>
              </div>
            ) : (
              <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
                <label htmlFor="footer-newsletter-email" className="sr-only">Email address for newsletter</label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  placeholder="Your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green text-sm"
                  required
                  autoComplete="email"
                />
                <button type="submit" className="px-6 py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-green-600 transition-colors text-sm">
                  Subscribe
                </button>
              </form>
            )}
          </motion.div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Glorious Group of Schools. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Powered by <a href="https://github.com/infojktechcode" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:text-green-400 transition-colors">Jk-Tech-Code</a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Privacy Policy</Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms" className="text-gray-500 hover:text-brand-green text-sm transition-colors">Terms & Conditions</Link>
          </div>
          <div className="flex items-center gap-3">
            {socialIcons.map(({ label, href, initial }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/10 hover:bg-brand-green transition-colors text-gray-400 hover:text-white"
                aria-label={label}
              >
                <span aria-hidden="true">{initial}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
