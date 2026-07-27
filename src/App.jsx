import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SkipToContent from './components/common/SkipToContent'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import AcademicsPage from './pages/AcademicsPage'
import AdmissionsPage from './pages/AdmissionsPage'
import SchoolLifePage from './pages/SchoolLifePage'
import GalleryPage from './pages/GalleryPage'
import NewsPage from './pages/NewsPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import NotFoundPage from './pages/NotFoundPage'

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <>
      <SkipToContent />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<AnimatedPage><HomePage /></AnimatedPage>} />
            <Route path="about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
            <Route path="academics" element={<AnimatedPage><AcademicsPage /></AnimatedPage>} />
            <Route path="admissions" element={<AnimatedPage><AdmissionsPage /></AnimatedPage>} />
            <Route path="school-life" element={<AnimatedPage><SchoolLifePage /></AnimatedPage>} />
            <Route path="gallery" element={<AnimatedPage><GalleryPage /></AnimatedPage>} />
            <Route path="news" element={<AnimatedPage><NewsPage /></AnimatedPage>} />
            <Route path="testimonials" element={<AnimatedPage><TestimonialsPage /></AnimatedPage>} />
            <Route path="contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
            <Route path="privacy-policy" element={<AnimatedPage><PrivacyPolicyPage /></AnimatedPage>} />
            <Route path="terms" element={<AnimatedPage><TermsPage /></AnimatedPage>} />
          </Route>
          <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
