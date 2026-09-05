import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import IndustriesPage from './pages/IndustriesPage'
import TestimonialsPage from './pages/TestimonialsPage'
import ContactPage from './pages/ContactPage'
import BlogListPage from './pages/BlogListPage'
import BlogDetailPage from './pages/BlogDetailPage'
import PrivacyPage from './pages/PrivacyPage'
import ImpressumPage from './pages/ImpressumPage'
import NotFoundPage from './pages/NotFoundPage'
import VerticalPage from './pages/VerticalPage'
import { VERTICALS } from './data/verticals'

/**
 * Everything below the router. The router itself is supplied by the caller so
 * the same tree renders in the browser and during build-time prerendering.
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main id="main" className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about/" element={<AboutPage />} />
            <Route path="/services/" element={<ServicesPage />} />
            <Route path="/industries/" element={<IndustriesPage />} />
            <Route path="/testimonials/" element={<TestimonialsPage />} />
            <Route path="/contact/" element={<ContactPage />} />
            <Route path="/blog/" element={<BlogListPage />} />
            <Route path="/blog/:slug/" element={<BlogDetailPage />} />
            <Route path="/privacy/" element={<PrivacyPage />} />
            <Route path="/imprint/" element={<ImpressumPage />} />
            {/* The old German slugs. Django answers these with a 301 on a hard
                load; this covers client-side navigation from stale links. */}
            <Route path="/ueber-uns/" element={<Navigate to="/about/" replace />} />
            <Route path="/branchen/" element={<Navigate to="/industries/" replace />} />
            <Route path="/kontakt/" element={<Navigate to="/contact/" replace />} />
            <Route path="/datenschutz/" element={<Navigate to="/privacy/" replace />} />
            <Route path="/impressum/" element={<Navigate to="/imprint/" replace />} />
            {/* Vertical landing pages — one route per industry, English
                keyword slugs, each with its own copy. */}
            {VERTICALS.map((v) => (
              <Route key={v.slug} path={`/${v.slug}/`} element={<VerticalPage />} />
            ))}
            {/* Was <HomePage />, which rendered the home page at every unknown
                URL. The server now returns a real 404 status for these. */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </div>
    </>
  )
}
