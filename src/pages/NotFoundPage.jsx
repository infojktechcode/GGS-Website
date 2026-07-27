import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import SEO from '../components/common/SEO'
import Button from '../components/common/Button'

export default function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The page you are looking for does not exist. Return to Glorious Group of Schools homepage." />
      <div className="min-h-screen flex items-center justify-center bg-light">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="text-8xl font-heading font-bold text-brand-blue/20 mb-4">404</div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg">
              <Home size={18} className="mr-2" /> Return Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </>
  )
}
