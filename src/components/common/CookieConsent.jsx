import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GA_TRACKING_ID, HAS_ANALYTICS } from './Analytics'
import { X } from 'lucide-react'

const STORAGE_KEY = 'ggs-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!HAS_ANALYTICS) return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
    if (GA_TRACKING_ID) {
      window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
    }
  }

  function reject() {
    localStorage.setItem(STORAGE_KEY, 'rejected')
    setVisible(false)
    if (GA_TRACKING_ID) {
      window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="mx-auto max-w-3xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1 text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">Cookie Consent</p>
              <p>
                We use cookies to improve your experience and analyze site traffic. 
                By continuing, you agree to our{' '}
                <a href="/privacy-policy" className="text-brand-blue underline hover:no-underline">Privacy Policy</a>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={reject}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-5 py-2 text-sm font-semibold text-white bg-brand-blue hover:bg-blue-700 rounded-xl transition-colors"
              >
                Accept
              </button>
            </div>
            <button
              onClick={reject}
              className="absolute top-3 right-3 sm:relative sm:top-auto sm:right-auto p-1 text-gray-400 hover:text-gray-600"
              aria-label="Close cookie consent"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
