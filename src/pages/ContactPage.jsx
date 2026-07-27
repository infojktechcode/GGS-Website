import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader2, Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import Button from '../components/common/Button'
import { useSiteContent } from '../lib/SiteContentContext'
import { sendContactForm } from '../services/api'

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/gloriousgroupofschools', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/gloriousschools', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/gloriousgroupofschools', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com/@gloriousschools', label: 'YouTube' },
  { icon: Linkedin, href: 'https://linkedin.com/company/glorious-group-of-schools', label: 'LinkedIn' },
]

export default function ContactPage() {
  const { schoolInfo } = useSiteContent()
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format'
    if (!form.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setStatus('error')
      return
    }
    setLoading(true)
    try {
      await sendContactForm(form)
      setStatus('success')
    } catch {
      setApiError('Something went wrong. Please try again or call us directly.')
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO title="Contact Us" description="Get in touch with Glorious Group of Schools. Contact us for admissions, inquiries, or to schedule a campus visit." />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.campus2})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            We would love to hear from you. Reach out with any questions or to schedule a visit.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-2">
              <h3 className="text-2xl font-heading font-bold text-dark mb-6">Send Us a Message</h3>
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 rounded-3xl p-12 text-center" role="alert">
                  <CheckCircle size={64} className="mx-auto text-brand-green mb-4" aria-hidden="true" />
                  <h4 className="text-xl font-heading font-bold text-dark mb-2">Message Sent Successfully!</h4>
                  <p className="text-gray-600">Thank you for reaching out. We will respond within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  {(status === 'error' || apiError) && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl" role="alert">
                      <AlertCircle size={20} />
                      <span className="text-sm">{apiError || 'Please fix the errors below.'}</span>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-light ${errors.name ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
                      {errors.name && <p id="contact-name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input id="contact-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-light ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'contact-phone-error' : undefined} />
                      {errors.phone && <p id="contact-phone-error" className="text-red-500 text-xs mt-1" role="alert">{errors.phone}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-light ${errors.email ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
                      {errors.email && <p id="contact-email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input id="contact-subject" type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-light" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea id="contact-message" name="message" value={form.message} onChange={handleChange} rows={5} className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-light ${errors.message ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
                    {errors.message && <p id="contact-message-error" className="text-red-500 text-xs mt-1" role="alert">{errors.message}</p>}
                  </div>
                  <Button variant="primary" size="lg" type="submit" disabled={loading}>
                    {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Send size={18} className="mr-2" />}
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-8">
              <div className="bg-light rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-heading font-bold text-dark mb-6">Contact Information</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0" aria-hidden="true">
                      <MapPin size={18} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">Address</p>
                      <p className="text-gray-600 text-sm">{schoolInfo?.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0" aria-hidden="true">
                      <Phone size={18} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">Phone</p>
                      {(schoolInfo?.phones || []).map((p, i) => <p key={i} className="text-gray-600 text-sm">{p}</p>)}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center shrink-0" aria-hidden="true">
                      <Mail size={18} className="text-brand-blue" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">Email</p>
                      {(schoolInfo?.emails || []).map((e, i) => <p key={i} className="text-gray-600 text-sm">{e}</p>)}
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center shrink-0" aria-hidden="true">
                      <Clock size={18} className="text-brand-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-dark text-sm">Office Hours</p>
                      <p className="text-gray-600 text-sm">{schoolInfo?.officeHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-light rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-heading font-bold text-dark mb-4">Emergency Contacts</h3>
                <div className="space-y-3">
                  {(schoolInfo?.emergencyContacts || []).map((ec, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
                      <span className="text-gray-600">{ec}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-light rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-heading font-bold text-dark mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-xl bg-brand-blue/10 hover:bg-brand-blue flex items-center justify-center text-brand-blue hover:text-white transition-all"
                      aria-label={label}
                    >
                      <Icon size={18} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="h-96 bg-gray-200 relative">
        <iframe
          title="School Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63820.83735401551!2d36.821945!3d-1.292066!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f173c8a0b0b0b%3A0x0!2sNairobi%2C+Kenya!5e0!3m2!1sen!2s!4v1"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
      </section>
    </>
  )
}
