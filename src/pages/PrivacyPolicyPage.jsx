import { motion } from 'framer-motion'
import SEO from '../components/common/SEO'

export default function PrivacyPolicyPage() {
  return (
    <>
      <SEO title="Privacy Policy" description="Privacy Policy for Glorious Group of Schools. Learn how we collect, use, and protect your personal information." />
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Privacy Policy
          </motion.h1>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
          <h2>Introduction</h2>
          <p>Glorious Group of Schools ("we," "our," or "us") is committed to protecting the privacy of our students, parents, and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>

          <h2>Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide when you fill out forms on our website, including:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Child's name and age</li>
            <li>Grade applying for</li>
            <li>Any other information you provide in your messages</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Respond to your inquiries and admission requests</li>
            <li>Process applications and registrations</li>
            <li>Send school updates and newsletters (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Data Protection</h2>
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>

          <h2>Third-Party Disclosure</h2>
          <p>We do not sell, trade, or transfer your personal information to third parties without your consent, except as required by law.</p>

          <h2>Cookies</h2>
          <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings.</p>

          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information held by us. To exercise these rights, please contact us using the information on our Contact page.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at info@gloriousschools.ac.ke or call +254 712 345 678.</p>

          <p className="text-sm text-gray-500 mt-8">Last updated: July 2026</p>
        </div>
      </section>
    </>
  )
}
