import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/ueber-uns/', label: 'About' },
  { to: '/services/', label: 'Services' },
  { to: '/branchen/', label: 'Industries' },
  { to: '/blog/', label: 'Blog' },
  { to: '/testimonials/', label: 'Testimonials' },
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
                <NavLink to="/kontakt/" className="nav-cta">
                  Work With Us
                </NavLink>
              </li>
            </ul>

            <button
              className="nav-hamburger"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        <ul>
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} onClick={() => setOpen(false)}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/kontakt/" className="active" onClick={() => setOpen(false)}>
              Work With Us
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  )
}
