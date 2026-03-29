import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/static/core/css/img/avenueone.png" alt="Avenue One Agency" className="footer-logo" />
            <p>
              NYC-born creative agency. Strategy. Content. Influence. Growth.
              Creator-led. Built for modern brands.
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
            <h6>Navigation</h6>
            <ul>
              <li><Link to="/ueber-uns/">About Us</Link></li>
              <li><Link to="/services/">Services</Link></li>
              <li><Link to="/branchen/">Industries</Link></li>
              <li><Link to="/blog/">Blog</Link></li>
              <li><Link to="/testimonials/">Testimonials</Link></li>
              <li><Link to="/kontakt/">Contact</Link></li>
              <li><Link to="/impressum/">Imprint</Link></li>
              <li><Link to="/datenschutz/">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <small>&copy; {year} Avenue One Agency™ — All rights reserved</small>
          <small>
            <a href="mailto:info@avenueoneagency.com" style={{ color: 'var(--gray)' }}>
              info@avenueoneagency.com
            </a>
          </small>
        </div>
      </div>
    </footer>
  )
}
