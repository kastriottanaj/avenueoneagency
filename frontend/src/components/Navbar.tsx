import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            <img
              src="/static/core/css/img/avenueone.png"
              alt="Avenue One Agency"
              className="logo-img"
            />
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/ueber-uns/">About Us</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/services/">Services</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/branchen/">Industries</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/blog/">Blog</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/testimonials/">Testimonials</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/kontakt/">Contact</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
