import { Link } from 'react-router-dom'

const testimonials = [
  {
    quote:
      'Through Avenue One Agency, we were able to streamline our services, increase local visibility and improve customer engagement — increasing our booking rate by 25%.',
    author: 'Edwin Kornmann Rudi',
    role: 'Faralda Crane Hotel',
  },
  {
    quote:
      'Social Media Marketing services provided by Avenue One Agency helped us increase our online presence and customer engagement significantly.',
    author: 'Fregi Mathew',
    role: 'Chef, Chatti New York',
  },
]

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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem',
            }}
          >
            {testimonials.map((t) => (
              <div key={t.author} className="testimonial-card">
                <div style={{ color: 'var(--pink)', fontSize: '2rem', marginBottom: '1rem' }}>
                  &ldquo;
                </div>
                <blockquote>{t.quote}</blockquote>
                <cite>
                  {t.author}
                  <span style={{ color: 'var(--gray)', fontWeight: 400, marginLeft: '0.5rem' }}>
                    — {t.role}
                  </span>
                </cite>
              </div>
            ))}
          </div>

          <div
            className="card-dark"
            style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}
          >
            <h3 style={{ color: 'var(--white)', marginBottom: '0.75rem' }}>
              More testimonials coming soon
            </h3>
            <p style={{ color: 'var(--gray)', marginBottom: '2rem' }}>
              We are constantly growing our client base. Want to be next?
            </p>
            <Link to="/kontakt/" className="btn-primary">
              Start a Project ↗
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
