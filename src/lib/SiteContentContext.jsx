import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { siteContent } from '../data/siteContent'

const SiteContentContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || ''

const empty = { content: {}, news: [], events: [], testimonials: [], galleryImages: [], galleryCategories: [], schoolInfo: null }

export function SiteContentProvider({ children }) {
  const [data, setData] = useState({ ...empty, content: siteContent || {}, schoolInfo: siteContent?.schoolInfo || null })
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/public?action=content`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData({ ...empty, ...json, content: { ...siteContent, ...json.content } })
    } catch {
      setData({ ...empty, content: siteContent || {}, schoolInfo: siteContent?.schoolInfo || null })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return (
    <SiteContentContext.Provider value={{ ...data, loading, refetch: fetchAll }}>
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
