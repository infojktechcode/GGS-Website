import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'
import AdminLayout from './AdminLayout'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full" />
    </div>
  )

  if (!user) return <Navigate to="/admin/login" replace />

  return <AdminLayout />
}
