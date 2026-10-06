import { Link } from 'react-router-dom'
import { VERTICALS } from '../data/verticals'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/static/core/css/img/avenueone.png" alt="Avenue One Agency" className="footer-logo" />
            <p>
              Creator-led social media and marketing for hospitality and lifestyle
              brands in New York City and beyond.
            </p>
            <a
              href="https://www.instagram.com/avenueone.agency/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ marginTop: '1.25rem', fontSize: '0.8rem', padding: '0.6rem 1.25rem' }}
            >
              ↗ Instagram
            </a>
          </div>

          <div className="footer-links">
            <h6>Industries</h6>
            <ul>
              <li><Link to="/hospitality-marketing-agency-nyc/">Hospitality</Link></li>
              {VERTICALS.map((v) => (
                <li key={v.slug}>
                  <Link to={`/${v.slug}/`}>{v.footerLabel}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-links">
            <h6>Services</h6>
            <ul>
              <li><Link to="/social-media-management-nyc/">Social Media</Link></li>
              <li><Link to="/influencer-marketing-agency-nyc/">Influencer Marketing</Link></li>
              <li><Link to="/hospitality-content-creation-nyc/">Content Creation</Link></li>
              <li><Link to="/services/">All Services</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h6>Navigation</h6>
            <ul>
              <li><Link to="/about/">About Us</Link></li>
              <li><Link to="/services/">Services</Link></li>
              <li><Link to="/industries/">Industries</Link></li>
              <li><Link to="/blog/">Blog</Link></li>
              <li><Link to="/testimonials/">Testimonials</Link></li>
              <li><Link to="/contact/">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <small>&copy; {year} Avenue One Agency™</small>
          <nav className="footer-legal" aria-label="Legal">
            <Link to="/imprint/">Imprint</Link>
            <Link to="/privacy/">Privacy Policy</Link>
            <a href="mailto:avenueoneagency@gmail.com">avenueoneagency@gmail.com</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
