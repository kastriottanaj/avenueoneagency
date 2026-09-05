import { Link, useLocation } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
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
          <SectionHead label="The Problem" title={v.problemTitle} />
          <Reveal className="problem-list" variant="slide" stagger={110}>
            {v.problems.map((p, i) => (
              <div key={p} className="problem-item">
                <span className="problem-num">{String(i + 1).padStart(2, '0')}</span>
                <p>{p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Our approach ────────────────────── */}
      <section className="page-section page-section--dark">
        <div className="container">
          <SectionHead label="Our Approach" title={v.approachTitle} />
          <Reveal className="services-grid" variant="slide" stagger={85}>
            {v.approach.map((a, i) => (
              <div key={a.title} className="card-dark">
                <div className="card-number">{String(i + 1).padStart(2, '0')}</div>
                <h4>{a.title}</h4>
                <p>{a.body}</p>
              </div>
            ))}
          </Reveal>
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
          <SectionHead
            label="Questions"
            title={<>What brands ask us<br /><span className="highlight">about this</span></>}
          />
          <Reveal as="dl" className="faq-list" variant="slide" stagger={70}>
            {v.faqs.map(([q, a]) => (
              <div className="faq-item" key={q}>
                <dt>{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Sibling verticals: real internal linking ─ */}
      <section className="page-section">
        <div className="container">
          <SectionHead label="Other Industries" title="We also work with" />
          <Reveal className="vertical-links" stagger={70}>
            {others.map((o) => (
              <Link key={o.slug} to={`/${o.slug}/`} className="vertical-link">
                <span className="vertical-link__label">{o.eyebrow}</span>
                <span className="vertical-link__arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-band">
        <div className="container text-center">
          <Reveal variant="mask" className="mask-clip">
            <h2>Ready to talk about your brand?</h2>
          </Reveal>
          <Reveal variant="rise" delay={140}>
            <p>Tell us what you are trying to achieve. We reply within 24 hours.</p>
          </Reveal>
          <Link to="/contact/" className="btn-primary btn-invert">
            Get in Touch ↗
          </Link>
        </div>
      </section>
    </>
  )
}
