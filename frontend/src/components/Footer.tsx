import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-light pt-4 mt-5 border-top">
      <div className="container text-center text-md-start">
        <div className="row">
          <div className="col-md-8 mb-3">
            <h6 className="text-uppercase fw-bold">Navigation</h6>
            <ul className="list-unstyled d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
              <li><Link to="/ueber-uns/" className="text-decoration-none text-light">About Us</Link></li>
              <li><Link to="/services/" className="text-decoration-none text-light">Services</Link></li>
              <li><Link to="/branchen/" className="text-decoration-none text-light">Industries</Link></li>
              <li><Link to="/blog/" className="text-decoration-none text-light">Blog</Link></li>
              <li><Link to="/testimonials/" className="text-decoration-none text-light">Testimonials</Link></li>
              <li><Link to="/kontakt/" className="text-decoration-none text-light">Contact</Link></li>
              <li><Link to="/impressum/" className="text-decoration-none text-light">Imprint</Link></li>
              <li><Link to="/datenschutz/" className="text-decoration-none text-light">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="col-md-4 text-md-end text-center mt-3 mt-md-0">
            <small>
              &copy; {year} Avenue One Agency – Social Media Marketing &amp; Influencer Partnerships
            </small>
          </div>
        </div>
      </div>
    </footer>
  )
}
