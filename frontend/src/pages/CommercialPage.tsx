import { Link, useLocation } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
import Testimonials from '../components/Testimonials'
import { COMMERCIAL_PAGE_BY_SLUG } from '../data/commercialPages'
import NotFoundPage from './NotFoundPage'

export default function CommercialPage() {
  const slug = useLocation().pathname.replace(/^\/|\/$/g, '')
  const page = COMMERCIAL_PAGE_BY_SLUG[slug]

  if (!page) return <NotFoundPage />

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <Link to={page.breadcrumbParent.path}>{page.breadcrumbParent.label}</Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <span>{page.eyebrow}</span>
          </nav>
          <h1>
            {page.h1Lead} <span className="pink">{page.h1Accent}</span>.
          </h1>
          <p>{page.intro}</p>
          <div className="hero-actions" style={{ marginTop: '2.5rem' }}>
            <Link to="/contact/" className="btn-primary">Book a Discovery Call ↗</Link>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHead label={page.problemLabel} title={page.problemTitle} />
          <Reveal className="problem-list" variant="slide" stagger={110}>
            {page.problems.map((problem, index) => (
              <div className="problem-item" key={problem}>
                <span className="problem-num">{String(index + 1).padStart(2, '0')}</span>
                <p>{problem}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {page.slug === 'hospitality-marketing-agency-nyc' && (
        <section className="page-section">
          <div className="container">
            <SectionHead label="Client Results" title="Proof from hospitality brands" />
            <Testimonials />
          </div>
        </section>
      )}

      <section className="page-section page-section--dark">
        <div className="container">
          <SectionHead label={page.approachLabel} title={page.approachTitle} />
          <Reveal className="services-grid" variant="slide" stagger={85}>
            {page.approach.map((item, index) => (
              <div className="card-dark" key={item.title}>
                <div className="card-number">{String(index + 1).padStart(2, '0')}</div>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHead label="Best Fit" title={page.audienceTitle} />
          <Reveal className="card-grid" stagger={90}>
            {page.audiences.map((audience) => (
              <div className="card-dark" key={audience.title}>
                <h4>{audience.title}</h4>
                <p>{audience.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="page-section page-section--dark">
        <div className="container">
          <SectionHead
            label="Questions"
            title={<>What brands ask<br /><span className="highlight">before we start</span></>}
          />
          <Reveal as="dl" className="faq-list" variant="slide" stagger={70}>
            {page.faqs.map(([question, answer]) => (
              <div className="faq-item" key={question}>
                <dt>{question}</dt>
                <dd>{answer}</dd>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHead label="Explore" title="Related expertise" />
          <Reveal className="vertical-links" stagger={70}>
            {page.related.map((item) => (
              <Link className="vertical-link" to={item.path} key={item.path}>
                <span className="vertical-link__label">{item.label}</span>
                <span className="vertical-link__arrow" aria-hidden="true">↗</span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-band">
        <div className="container text-center">
          <Reveal variant="mask" className="mask-clip">
            <h2>Ready to turn attention into action?</h2>
          </Reveal>
          <Reveal variant="rise" delay={140}>
            <p>Tell us what the business needs to move. We reply within 24 hours.</p>
          </Reveal>
          <Link to="/contact/" className="btn-primary btn-invert">Start a Conversation ↗</Link>
        </div>
      </section>
    </>
  )
}
