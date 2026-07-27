import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import SEO from '../components/common/SEO'
import { images } from '../utils/images'
import { useSiteContent } from '../lib/SiteContentContext'

export default function GalleryPage() {
  const { galleryCategories, galleryImages } = useSiteContent()
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const filtered = activeCategory === 'all'
    ? (galleryImages || [])
    : (galleryImages || []).filter(img => img.category === activeCategory)

  const openLightbox = (index) => {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex(prev => (prev < filtered.length - 1 ? prev + 1 : 0))
  }, [filtered.length])

  const goPrev = useCallback(() => {
    setLightboxIndex(prev => (prev > 0 ? prev - 1 : filtered.length - 1))
  }, [filtered.length])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex, closeLightbox, goNext, goPrev])

  useEffect(() => {
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      <SEO title="Gallery" description="Explore our school gallery showcasing learning, events, sports, graduation, campus life, and competitions." />

      <section className="relative pt-32 pb-20 bg-gradient-to-br from-brand-blue to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: `url(${images.campus})` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-heading font-bold mb-4">Gallery</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-xl text-white/70 max-w-3xl mx-auto">
            Moments that capture the spirit and vibrancy of our school community.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 mb-12" role="tablist" aria-label="Gallery categories">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-brand-blue text-white shadow-lg'
                    : 'bg-light text-gray-600 hover:bg-blue-50 hover:text-brand-blue'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((img, i) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -6 }}
                onClick={() => openLightbox(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(i) }}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all group focus:outline-none focus:ring-2 focus:ring-brand-blue"
                tabIndex={0}
                role="button"
                aria-label={`View ${img.alt}`}
              >
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center relative overflow-hidden">
                  <img src={img.src} alt={img.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" decoding="async" width={400} height={300} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-white/70 hover:text-white z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2" aria-label="Close lightbox">
              <X size={32} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goPrev() }} className="absolute left-6 text-white/70 hover:text-white z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2" aria-label="Previous image">
              <ChevronLeft size={40} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goNext() }} className="absolute right-6 text-white/70 hover:text-white z-10 focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-2" aria-label="Next image">
              <ChevronRight size={40} />
            </button>
            <motion.div
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl max-h-[80vh] mx-4"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img src={filtered[lightboxIndex]?.src} alt={filtered[lightboxIndex]?.alt} className="w-full h-full object-cover" />
              </div>
              <p className="text-white/70 text-center mt-4 text-sm">{filtered[lightboxIndex]?.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
