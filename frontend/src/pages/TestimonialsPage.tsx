import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Testimonials from '../components/Testimonials'

export default function TestimonialsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Testimonials</span>
          <h1>
            What our clients<br />
            <span className="pink">say about us</span>.
          </h1>
          <p>Real results from real brands we have worked with.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Testimonials />


          <Reveal
            className="card-dark"
            style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}
          >
            <h3 style={{ color: 'var(--white)', marginBottom: '0.75rem' }}>
              More testimonials coming soon
            </h3>
            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
              We are constantly growing our client base. Want to be next?
            </p>
            <Link to="/contact/" className="btn-primary">
              Start a Project ↗
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
