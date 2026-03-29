export default function ImpressumPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Legal</span>
          <h1>Imprint</h1>
        </div>
      </section>
      <section className="page-section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="card-dark" style={{ padding: '2.5rem' }}>
            <p style={{ color: 'var(--white)', marginBottom: '0.25rem' }}>
              <strong>Avenue One Agency™</strong>
            </p>
            <p>New York City<br />United States of America</p>

            <p style={{ marginTop: '1.5rem' }}>
              <span style={{ color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Represented by
              </span>
              <br />
              <strong style={{ color: 'var(--white)' }}>Linda Kafexholli</strong>
              <span style={{ color: 'var(--gray)' }}> — Founder</span>
            </p>

            <p style={{ marginTop: '1.5rem' }}>
              <span style={{ color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Contact
              </span>
              <br />
              <a href="tel:+19177178150" style={{ color: 'var(--white)', display: 'block', marginTop: '0.25rem' }}>
                +1 (917) 717-8150
              </a>
              <a href="mailto:avenueoneagency@gmail.com" style={{ color: 'var(--pink)', display: 'block', marginTop: '0.25rem' }}>
                avenueoneagency@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
