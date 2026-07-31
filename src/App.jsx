import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import SkipToContent from './components/common/SkipToContent'
import { usePageTracking } from './components/common/Analytics'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
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
import AdminLoginPage from './pages/admin/LoginPage'
import AccessDeniedPage from './pages/admin/AccessDeniedPage'
import AdminDashboard from './pages/admin/DashboardPage'
import ContentEditorPage from './pages/admin/ContentEditorPage'
import NewsManagePage from './pages/admin/NewsManagePage'
import EventsManagePage from './pages/admin/EventsManagePage'
import TestimonialsManagePage from './pages/admin/TestimonialsManagePage'
import GalleryManagePage from './pages/admin/GalleryManagePage'
import MessagesManagePage from './pages/admin/MessagesManagePage'
import EnquiriesManagePage from './pages/admin/EnquiriesManagePage'
import SubscribersManagePage from './pages/admin/SubscribersManagePage'
import SettingsPage from './pages/admin/SettingsPage'

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
  usePageTracking()
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
          <Route path="/admin/login" element={<AnimatedPage><AdminLoginPage /></AnimatedPage>} />
          <Route path="/admin/access-denied" element={<AnimatedPage><AccessDeniedPage /></AnimatedPage>} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="content" element={<ContentEditorPage />} />
            <Route path="news" element={<NewsManagePage />} />
            <Route path="events" element={<EventsManagePage />} />
            <Route path="testimonials" element={<TestimonialsManagePage />} />
            <Route path="gallery" element={<GalleryManagePage />} />
            <Route path="messages" element={<MessagesManagePage />} />
            <Route path="enquiries" element={<EnquiriesManagePage />} />
            <Route path="subscribers" element={<SubscribersManagePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
