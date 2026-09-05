import { Link, useLocation } from 'react-router-dom'
import Reveal from '../components/Reveal'
import NotFoundPage from './NotFoundPage'
import { VERTICAL_BY_SLUG, VERTICALS } from '../data/verticals'

/**
 * One component, six pages — but every word of copy is per-vertical. Six pages
 * sharing a layout is a template; six pages sharing copy would be doorway
 * pages, which Google demotes.
 */
export default function VerticalPage() {
  // Routes are registered per explicit slug rather than as `/:slug/`, which
  // would swallow every unknown top-level URL and stop the 404 route matching.
  const slug = useLocation().pathname.replace(/^\/|\/$/g, '')
  const v = VERTICAL_BY_SLUG[slug]

  if (!v) return <NotFoundPage />

  const others = VERTICALS.filter((o) => o.slug !== v.slug)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <Link to="/industries/">Industries</Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <span>{v.eyebrow}</span>
          </nav>
          <h1>
            {v.h1Lead} <span className="pink">{v.h1Accent}</span>.
          </h1>
          <p>{v.intro}</p>
          <div className="hero-actions" style={{ marginTop: '2.5rem' }}>
            <Link to="/contact/" className="btn-primary">
              Start a Conversation ↗
            </Link>
          </div>
        </div>
      </section>

      {/* ── The problem ─────────────────────── */}
      <section className="page-section">
        <div className="container">
          <span className="section-label">The Problem</span>
          <h2 className="section-title">{v.problemTitle}</h2>
          <div className="problem-list">
            {v.problems.map((p, i) => (
              <Reveal key={p} className="problem-item" delay={i * 60}>
                <span className="problem-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our approach ────────────────────── */}
      <section className="page-section page-section--dark">
        <div className="container">
          <span className="section-label">Our Approach</span>
          <h2 className="section-title">{v.approachTitle}</h2>
          <div className="services-grid">
            {v.approach.map((a, i) => (
              <Reveal key={a.title} className="card-dark" delay={i * 60}>
                <div className="card-number">{String(i + 1).padStart(2, '0')}</div>
                <h4>{a.title}</h4>
                <p>{a.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Proof, where we genuinely have it ─ */}
      {v.proof && (
        <section className="page-section">
          <div className="container">
            <span className="section-label">Client Result</span>
            <div className="testimonial-card" style={{ maxWidth: '46rem' }}>
              <blockquote>{v.proof.quote}</blockquote>
              <cite>
                {v.proof.author}
                <span style={{ color: 'var(--gray)', fontWeight: 400, marginLeft: '0.5rem' }}>
                  — {v.proof.role}
                </span>
              </cite>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ─────────────────────────────── */}
      <section className="page-section page-section--dark">
        <div className="container">
          <span className="section-label">Questions</span>
          <h2 className="section-title">
            What brands ask us<br />
            <span className="highlight">about this</span>
          </h2>
          <dl className="faq-list">
            {v.faqs.map(([q, a], i) => (
              <Reveal key={q} className="faq-item" delay={i * 40}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Sibling verticals: real internal linking ─ */}
      <section className="page-section">
        <div className="container">
          <span className="section-label">Other Industries</span>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>
            We also work with
          </h2>
          <div className="vertical-links">
            {others.map((o) => (
              <Link key={o.slug} to={`/${o.slug}/`} className="vertical-link">
                <span className="vertical-link__label">{o.eyebrow}</span>
                <span className="vertical-link__arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container text-center">
          <h2>Ready to talk about your brand?</h2>
          <p>Tell us what you are trying to achieve. We reply within 24 hours.</p>
          <Link to="/contact/" className="btn-primary btn-invert">
            Get in Touch ↗
          </Link>
        </div>
      </section>
    </>
  )
}
