import { motion } from 'framer-motion'
import SEO from '../components/common/SEO'

export default function TermsPage() {
  return (
    <>
      <SEO title="Terms & Conditions" description="Terms and Conditions for using the Glorious Group of Schools website." />
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Terms & Conditions
          </motion.h1>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray">
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using the Glorious Group of Schools website, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use our website.</p>

          <h2>Use of Website</h2>
          <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others or restrict their use of the website.</p>

          <h2>Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, images, and software, is the property of Glorious Group of Schools and is protected by applicable intellectual property laws.</p>

          <h2>Disclaimer</h2>
          <p>The information on this website is provided for general informational purposes only. While we strive to keep information accurate and up-to-date, we make no representations or warranties of any kind about the completeness, accuracy, or reliability of the information.</p>

          <h2>Limitation of Liability</h2>
          <p>Glorious Group of Schools shall not be liable for any damages arising from the use or inability to use this website or the information provided herein.</p>

          <h2>External Links</h2>
          <p>Our website may contain links to third-party websites. We have no control over and assume no responsibility for the content or practices of these websites.</p>

          <h2>Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.</p>

          <h2>Contact</h2>
          <p>For questions about these Terms & Conditions, please contact us at info@gloriousschools.ac.ke.</p>

          <p className="text-sm text-gray-500 mt-8">Last updated: July 2026</p>
        </div>
      </section>
    </>
  )
}
