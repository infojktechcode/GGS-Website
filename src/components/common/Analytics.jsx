import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const GTM_ID = import.meta.env.VITE_GTM_ID

function gtag(...args) {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(args)
  }
}

export function AnalyticsHead() {
  useEffect(() => {
    if (!GA_ID && !GTM_ID) return

    window.dataLayer = window.dataLayer || []

    gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      wait_for_update: 500,
    })

    if (GA_ID) {
      const gtagScript = document.createElement('script')
      gtagScript.async = true
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
      document.head.appendChild(gtagScript)
    }

    if (GTM_ID) {
      const gtmScript = document.createElement('script')
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`
      document.head.appendChild(gtmScript)
    }

    gtag('js', new Date())
    if (GA_ID) gtag('config', GA_ID, { send_page_view: false })
  }, [])

  return null
}

export function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    if (GA_ID) {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      })
    }
  }, [location])
}

export function trackEvent(action, category, label, value) {
  if (GA_ID) {
    gtag('event', action, { event_category: category, event_label: label, value })
  }
}

export function trackFormSubmit(formName) {
  trackEvent('form_submit', 'engagement', formName)
}

export function trackOutboundLink(url) {
  trackEvent('click', 'outbound', url)
}

export const GA_TRACKING_ID = GA_ID
export const HAS_ANALYTICS = !!(GA_ID || GTM_ID)
