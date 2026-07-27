import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../lib/auth'

import {
  LayoutDashboard, Newspaper, Calendar, Star, Image as ImageIcon,
  Users, Mail, Settings, LogOut, Menu, Home, UserPlus, BookOpen
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Site Content', path: '/admin/content', icon: BookOpen },
  { label: 'News', path: '/admin/news', icon: Newspaper },
  { label: 'Events', path: '/admin/events', icon: Calendar },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Star },
  { label: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
  { label: 'Enquiries', path: '/admin/enquiries', icon: Users },
  { label: 'Subscribers', path: '/admin/subscribers', icon: UserPlus },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto overflow-y-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <Link to="/admin" className="text-lg font-heading font-bold text-brand-blue">GGS Admin</Link>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = item.path === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-blue text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <Link to="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              <Home size={18} />
              View Site
            </Link>
            <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100" aria-label="Open sidebar">
            <Menu size={20} />
          </button>
          <div className="flex-1" />
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={location.pathname}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
