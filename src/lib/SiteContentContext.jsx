import { createContext, useContext, useState, useEffect } from 'react'

const SiteContentContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || ''

export function SiteContentProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch(`${API_BASE}/api/public?action=content`)
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        setData(json)
      } catch {
        setData({ content: {}, news: [], events: [], testimonials: [], galleryImages: [], galleryCategories: [], schoolInfo: null })
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  return (
    <SiteContentContext.Provider value={{ ...data, loading, refetch: () => setLoading(true) }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext)
  if (!ctx) return { content: {}, news: [], events: [], testimonials: [], galleryImages: [], galleryCategories: [], schoolInfo: null, loading: false }
  return ctx
}

export function usePageContent(section) {
  const { content } = useSiteContent()
  return content?.[section] || {}
}
