import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const pages = [
  { title: 'Home', path: '/', keywords: 'home welcome glorious group of schools' },
  { title: 'About Us', path: '/about', keywords: 'about history mission vision values team staff school' },
  { title: 'Academics', path: '/academics', keywords: 'academics curriculum cbc early years junior school primary subjects' },
  { title: 'Admissions', path: '/admissions', keywords: 'admissions admission enroll register fees requirements process' },
  { title: 'School Life', path: '/school-life', keywords: 'school life activities sports clubs culture events students' },
  { title: 'Gallery', path: '/gallery', keywords: 'gallery photos pictures images events campus' },
  { title: 'News', path: '/news', keywords: 'news updates announcements events notices' },
  { title: 'Testimonials', path: '/testimonials', keywords: 'testimonials reviews feedback parents students' },
  { title: 'Contact Us', path: '/contact', keywords: 'contact address phone email location map reach' },
  { title: 'Privacy Policy', path: '/privacy-policy', keywords: 'privacy policy data cookies personal information' },
  { title: 'Terms of Service', path: '/terms', keywords: 'terms conditions service use legal' },
  { title: 'Admin Login', path: '/admin/login', keywords: 'admin login portal staff dashboard' },
]

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const q = query.toLowerCase()
    const matches = pages.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.keywords.includes(q) ||
        p.path.includes(q)
    )
    setResults(matches)
  }, [query])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[200]"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -20 }}
            className="fixed inset-x-4 top-[15vh] mx-auto max-w-xl z-[201]"
            role="dialog"
            aria-modal="true"
            aria-label="Search site"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages..."
                  className="flex-1 text-lg outline-none placeholder-gray-400 bg-transparent"
                  aria-label="Search query"
                />
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </div>
              {results.length > 0 && (
                <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
                  {results.map((page) => (
                    <li key={page.path}>
                      <Link
                        to={page.path}
                        onClick={onClose}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                        role="option"
                        aria-selected={false}
                      >
                        <Search size={16} className="text-gray-400 shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800">{page.title}</p>
                          <p className="text-xs text-gray-500">{page.path}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {query.trim() && results.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <p className="text-lg font-medium">No results found</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
              {!query.trim() && (
                <div className="p-5 text-center text-gray-400 text-sm">
                  Type to search pages. Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Esc</kbd> to close.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
