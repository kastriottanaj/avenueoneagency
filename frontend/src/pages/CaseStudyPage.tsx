import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
import { CASE_STUDY_BY_SLUG } from '../data/caseStudies'
import NotFoundPage from './NotFoundPage'

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? CASE_STUDY_BY_SLUG[slug] : undefined

  if (!study) return <NotFoundPage />

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <Link to="/case-studies/">Client Results</Link>
            <span className="breadcrumb-sep" aria-hidden="true">/</span>
            <span>{study.client}</span>
          </nav>
          <span className="section-label">{study.industry} · {study.location}</span>
          <h1>{study.client}: <span className="pink">{study.headline}</span>.</h1>
          <p>{study.summary}</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Reveal className="case-study-proof">
            {study.metric && (
              <div className="case-study-proof__metric">
                <strong>{study.metric.figure}</strong>
                <span>{study.metric.label}</span>
              </div>
            )}
            <blockquote>
              <span aria-hidden="true">&ldquo;</span>{study.quote}<span aria-hidden="true">&rdquo;</span>
              <cite>{study.author}<small>{study.role}</small></cite>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section className="page-section page-section--dark">
        <div className="container">
          <SectionHead label="Documented Outcome" title="What we can verify" />
          <Reveal className="problem-list" variant="slide" stagger={90}>
            {study.verifiedOutcomes.map((outcome, index) => (
              <div className="problem-item" key={outcome}>
                <span className="problem-num">{String(index + 1).padStart(2, '0')}</span>
                <p>{outcome}</p>
              </div>
            ))}
          </Reveal>
          <p className="case-study-note">
            This page reports the client&apos;s stated outcome. We do not add a campaign
            timeline, channel mix, spend or attribution model where those details have
            not been provided for publication.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <SectionHead label="Explore" title="Related expertise" />
          <Reveal className="vertical-links" stagger={70}>
            {study.related.map((item) => (
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
          <h2>What should your next result be?</h2>
          <p>Bring us the business goal. We will map the marketing system around it.</p>
          <Link to="/contact/" className="btn-primary btn-invert">Discuss Your Project ↗</Link>
        </div>
      </section>
    </>
  )
}
