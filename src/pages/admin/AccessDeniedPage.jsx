import { motion } from 'framer-motion'
import { ShieldAlert } from 'lucide-react'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} className="text-red-600" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-dark mb-3">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to access this area. Contact your administrator if you believe this is a mistake.</p>
      </motion.div>
    </div>
  )
}
