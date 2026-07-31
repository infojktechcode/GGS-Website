import { Outlet } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import WhatsAppButton from '../components/common/WhatsAppButton'
import SchemaMarkup from '../components/common/SchemaMarkup'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-light">
      <SchemaMarkup />
      <Navbar />
      <main id="main-content" aria-label="Main content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
