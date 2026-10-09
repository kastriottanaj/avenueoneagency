import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">About Us</span>
          <h1>
            NYC-Born.<br />
            <span className="pink">Creator-Led.</span><br />
            Built for Modern Brands.
          </h1>
          <p>
            Avenue One™ is a full-service creative agency blending strategy, content,
            influence, and culture.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Reveal className="two-col-grid" stagger={150}>
            <div>
              <SectionHead
                label="Our Story"
                title={<>Where culture meets<br /><span className="highlight">strategy</span></>}
              />
              <p className="section-lead">
                Avenue One™ was founded with one mission: to help brands build iconic identities
                that resonate with culture and convert in the market.
              </p>
              <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>
                We work with hospitality, fashion, beauty, lifestyle, and F&B brands — crafting
                moments, elevating identity, and building communities with purpose. From strategy
                to content to influencer collaborations, every campaign we create is rooted in
                culture and driven by measurable results.
              </p>
            </div>
            <div>
              <span className="section-label">Our Founder</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--white)', marginBottom: '1rem' }}>
                <Link className="text-link" to="/linda-kafexholli/">Linda Kafexholli</Link>
              </h2>
              <p style={{ color: 'var(--gray-light)' }}>
                Global digital creator, marketing strategist, and 1M+ audience builder.
                Linda combines creative direction with real-world influence and deep industry
                expertise across the U.S. and Europe.
              </p>
              <p style={{ color: 'var(--gray)', marginTop: '1rem' }}>
                Her unique position as both agency founder and working creator gives Avenue One™
                an edge that traditional agencies simply can't replicate.
              </p>
              <div className="founder-actions" style={{ marginTop: '1.5rem' }}>
                <Link to="/linda-kafexholli/" className="btn-primary">Founder Profile</Link>
                <a
                  href="https://www.instagram.com/linda_kafexholli/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Instagram ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-section page-section--dark">
        <div className="container">
          <Reveal className="stat-grid" stagger={110}>
            <div className="stat-item">
              <strong>1M+</strong>
              <span>Creator Audience</span>
            </div>
            <div className="stat-item">
              <strong>50+</strong>
              <span>Brands Served</span>
            </div>
            <div className="stat-item">
              <strong>NYC & EU</strong>
              <span>Markets</span>
            </div>
            <div className="stat-item">
              <strong>2020</strong>
              <span>Founded</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-section" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">Ready?</span>
          <h2 className="section-title">Let's build something iconic</h2>
          <p className="section-lead" style={{ margin: '0 auto 2rem' }}>
            Contact us and tell us about your brand.
          </p>
          <Link to="/contact/" className="btn-primary">Work With Us ↗</Link>
        </div>
      </section>
    </>
  )
}
