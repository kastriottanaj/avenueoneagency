import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
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

export default function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ueber-uns/" element={<AboutPage />} />
            <Route path="/services/" element={<ServicesPage />} />
            <Route path="/branchen/" element={<IndustriesPage />} />
            <Route path="/industries/" element={<Navigate to="/branchen/" replace />} />
            <Route path="/testimonials/" element={<TestimonialsPage />} />
            <Route path="/kontakt/" element={<ContactPage />} />
            <Route path="/contact/" element={<Navigate to="/kontakt/" replace />} />
            <Route path="/blog/" element={<BlogListPage />} />
            <Route path="/blog/:slug/" element={<BlogDetailPage />} />
            <Route path="/datenschutz/" element={<PrivacyPage />} />
            <Route path="/privacy/" element={<PrivacyPage />} />
            <Route path="/impressum/" element={<ImpressumPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
