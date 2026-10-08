import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about/', label: 'About' },
  { to: '/services/', label: 'Services' },
  { to: '/industries/', label: 'Industries' },
  { to: '/blog/', label: 'Blog' },
  { to: '/case-studies/', label: 'Results' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <div className="container">
          <nav className="nav-inner">
            <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
              <img src="/static/core/css/img/avenueone.png" alt="Avenue One Agency" />
            </Link>

            <ul className="nav-links">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} end={l.end}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/contact/" className="nav-cta">
                  Work With Us
                </NavLink>
              </li>
            </ul>

            <button
              className="nav-hamburger"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span />
              <span />
              <span />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div id="mobile-menu" className={`nav-mobile ${open ? 'open' : ''}`}>
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/contact/" className="active" onClick={() => setOpen(false)}>
              Work With Us
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  )
}
