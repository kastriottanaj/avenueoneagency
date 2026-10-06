import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="page-hero">
      <div className="container">
        <span className="section-label">Error 404</span>
        <h1>
          This page<br />
          doesn&apos;t <span className="pink">exist</span>.
        </h1>
        <p>
          The link may be out of date, or the address mistyped. Everything else is
          still where you left it.
        </p>
        <div className="hero-actions" style={{ marginTop: '2rem' }}>
          <Link to="/" className="btn-primary">Back to Home ↗</Link>
          <Link to="/contact/" className="btn-outline">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}
