import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
import { CASE_STUDIES } from '../data/caseStudies'

export default function CaseStudiesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Client Results</span>
          <h1>
            Evidence over<br />
            <span className="pink">empty promises</span>.
          </h1>
          <p>
            Client-reported outcomes from hospitality and lifestyle brands,
            presented without invented timelines, tactics or attribution.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHead label="Selected Work" title="Results our clients report" />
          <Reveal className="case-study-list" variant="slide" stagger={120}>
            {CASE_STUDIES.map((study, index) => (
              <article className="case-study-card" key={study.slug}>
                <div className="case-study-card__meta">
                  <span className="case-study-index">{String(index + 1).padStart(2, '0')}</span>
                  <p>{study.industry}</p>
                  <span>{study.location}</span>
                </div>
                <div className="case-study-card__body">
                  {study.metric && (
                    <div className="case-study-metric">
                      <strong>{study.metric.figure}</strong>
                      <span>{study.metric.label}</span>
                    </div>
                  )}
                  <p className="section-label">{study.client}</p>
                  <h2>{study.headline}</h2>
                  <p>{study.summary}</p>
                  <Link to={`/case-studies/${study.slug}/`} className="card-link">
                    Read the verified result ↗
                  </Link>
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="page-section page-section--dark">
        <div className="container">
          <div className="two-col-grid">
            <SectionHead label="Our Standard" title="Clear about what the evidence says" />
            <div>
              <p className="section-lead">
                Strong case studies distinguish client-reported outcomes from agency
                interpretation. These pages publish only the claims clients have supplied.
              </p>
              <p>
                As richer project records become available, the same system can add the
                brief, scope, timeline, work delivered and measurement method without
                changing the page structure or URL.
              </p>
            </div>
          </div>
          <div style={{ marginTop: '3rem' }}>
            <p className="section-label">Build on these results</p>
            <Reveal className="vertical-links" stagger={70}>
              <Link to="/hospitality-marketing-agency-nyc/" className="vertical-link">
                <span className="vertical-link__label">Hospitality Marketing Agency NYC</span>
                <span className="vertical-link__arrow" aria-hidden="true">↗</span>
              </Link>
              <Link to="/hotel-marketing-nyc/" className="vertical-link">
                <span className="vertical-link__label">Hotel Marketing Agency NYC</span>
                <span className="vertical-link__arrow" aria-hidden="true">↗</span>
              </Link>
              <Link to="/influencer-marketing-agency-nyc/" className="vertical-link">
                <span className="vertical-link__label">Influencer Marketing Agency NYC</span>
                <span className="vertical-link__arrow" aria-hidden="true">↗</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container text-center">
          <h2>Ready to create a result worth documenting?</h2>
          <p>Tell us what needs to move. We reply within 24 hours.</p>
          <Link to="/contact/" className="btn-primary btn-invert">Start a Conversation ↗</Link>
        </div>
      </section>
    </>
  )
}
