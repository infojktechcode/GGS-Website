import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import { SiteContentProvider } from './lib/SiteContentContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import { AnalyticsHead } from './components/common/Analytics'
import CookieConsent from './components/common/CookieConsent'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AnalyticsHead />
          <SiteContentProvider>
            <App />
          </SiteContentProvider>
          <CookieConsent />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>,
)
