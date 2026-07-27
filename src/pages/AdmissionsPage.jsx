import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, FileText, Download, Send, ChevronDown, Loader2, AlertCircle } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import SectionHeader from '../components/common/SectionHeader'
import Button from '../components/common/Button'
import SchemaMarkup from '../components/common/SchemaMarkup'
import { siteContent } from '../data/siteContent'
import { sendAdmissionEnquiry } from '../services/api'

export default function AdmissionsPage() {
  const { admissions } = siteContent
  const [openFaq, setOpenFaq] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', childName: '', childAge: '', grade: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Full name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email format'
    if (!form.childName.trim()) newErrors.childName = 'Child\'s name is required'
    if (!form.childAge) newErrors.childAge = 'Child\'s age is required'
    if (!form.grade) newErrors.grade = 'Please select a grade'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validate()
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    setLoading(true)
    try {
      await sendAdmissionEnquiry(form)
      setSubmitted(true)
    } catch {
      setApiError('Something went wrong. Please try again or call us directly.')
    } finally {
      setLoading(false)
    }
  }

  const grades = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9']

  return (
    <>
      <SEO title="Admissions" description="Apply to Glorious Group of Schools. Learn about our admission process, requirements, and enroll your child today." />
      <SchemaMarkup faqs={admissions.faqs} />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.group})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">Admissions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Begin your child's journey with us. A simple, transparent admission process.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Admission Process" subtitle="Follow these simple steps to enroll your child." />
          <div className="grid md:grid-cols-5 gap-6">
            {admissions.process.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-heading font-bold text-brand-blue">{step.step}</span>
                </div>
                {i < admissions.process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-brand-blue/20" aria-hidden="true" />
                )}
                <h3 className="text-lg font-heading font-bold text-dark mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-heading font-bold text-dark mb-6">Requirements</h3>
              <ul className="space-y-3">
                {admissions.requirements.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle size={20} className="text-brand-green shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button href="/admission-form.html" variant="secondary">
                  <Download size={18} className="mr-2" /> Download Admission Form
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-heading font-bold text-dark mb-6">Required Documents</h3>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <ul className="space-y-3">
                  {[
                    { icon: FileText, text: 'Birth certificate (certified copy)' },
                    { icon: FileText, text: 'Previous school report cards (last 2 terms)' },
                    { icon: FileText, text: 'Transfer letter from previous school' },
                    { icon: FileText, text: '2 passport-size photographs' },
                    { icon: FileText, text: 'Immunization records' },
                    { icon: FileText, text: 'Medical report from recognized hospital' },
                  ].map((doc, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <doc.icon size={18} className="text-brand-blue shrink-0" aria-hidden="true" />
                      <span className="text-sm">{doc.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Admission Enquiry" subtitle="Fill out the form below and our admissions team will get back to you." />
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 bg-green-50 rounded-3xl" role="alert">
              <CheckCircle size={64} className="mx-auto text-brand-green mb-4" aria-hidden="true" />
              <h3 className="text-2xl font-heading font-bold text-dark mb-2">Enquiry Submitted Successfully!</h3>
              <p className="text-gray-600">Thank you for your interest. Our admissions team will contact you within 24 hours.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-light rounded-3xl p-8 md:p-12 shadow-lg"
              noValidate
            >
              {apiError && (
                <div className="flex items-center gap-3 p-4 mb-6 bg-red-50 text-red-700 rounded-xl" role="alert">
                  <AlertCircle size={20} />
                  <span className="text-sm">{apiError}</span>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="admission-name" className="block text-sm font-medium text-gray-700 mb-2">Your Full Name *</label>
                  <input id="admission-name" type="text" name="name" value={form.name} onChange={handleChange} required className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white ${errors.name ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'admission-name-error' : undefined} />
                  {errors.name && <p id="admission-name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="admission-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input id="admission-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} required className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white ${errors.phone ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'admission-phone-error' : undefined} />
                  {errors.phone && <p id="admission-phone-error" className="text-red-500 text-xs mt-1" role="alert">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="admission-email" className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input id="admission-email" type="email" name="email" value={form.email} onChange={handleChange} required className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white ${errors.email ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'admission-email-error' : undefined} />
                  {errors.email && <p id="admission-email-error" className="text-red-500 text-xs mt-1" role="alert">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="admission-child-name" className="block text-sm font-medium text-gray-700 mb-2">Child's Full Name *</label>
                  <input id="admission-child-name" type="text" name="childName" value={form.childName} onChange={handleChange} required className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white ${errors.childName ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.childName} aria-describedby={errors.childName ? 'admission-child-name-error' : undefined} />
                  {errors.childName && <p id="admission-child-name-error" className="text-red-500 text-xs mt-1" role="alert">{errors.childName}</p>}
                </div>
                <div>
                  <label htmlFor="admission-child-age" className="block text-sm font-medium text-gray-700 mb-2">Child's Age *</label>
                  <input id="admission-child-age" type="number" name="childAge" value={form.childAge} onChange={handleChange} required min="2" max="18" className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white ${errors.childAge ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.childAge} aria-describedby={errors.childAge ? 'admission-child-age-error' : undefined} />
                  {errors.childAge && <p id="admission-child-age-error" className="text-red-500 text-xs mt-1" role="alert">{errors.childAge}</p>}
                </div>
                <div>
                  <label htmlFor="admission-grade" className="block text-sm font-medium text-gray-700 mb-2">Grade Applying For *</label>
                  <select id="admission-grade" name="grade" value={form.grade} onChange={handleChange} required className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white ${errors.grade ? 'border-red-400' : 'border-gray-200'}`} aria-invalid={!!errors.grade} aria-describedby={errors.grade ? 'admission-grade-error' : undefined}>
                    <option value="">Select Grade</option>
                    {grades.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.grade && <p id="admission-grade-error" className="text-red-500 text-xs mt-1" role="alert">{errors.grade}</p>}
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="admission-message" className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
                <textarea id="admission-message" name="message" value={form.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue bg-white" />
              </div>
              <div className="mt-8">
                <Button variant="primary" size="lg" type="submit" disabled={loading}>
                  {loading ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Send size={18} className="mr-2" />}
                  {loading ? 'Submitting...' : 'Submit Enquiry'}
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      <section className="py-20 bg-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Frequently Asked Questions" />
          <div className="space-y-4">
            {admissions.faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-heading font-semibold text-dark pr-4">{faq.q}</span>
                  <ChevronDown size={20} className={`text-gray-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  hidden={openFaq !== i}
                >
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
