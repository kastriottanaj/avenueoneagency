import { Link } from 'react-router-dom'
import HeroCanvas from '../components/HeroCanvas'
import Reveal from '../components/Reveal'
import { useMagnetic } from '../lib/useMagnetic'

const services = [
  { n: '01', title: 'Social Media Strategy', desc: 'Data-driven strategies that grow your audience and deepen community engagement.' },
  { n: '02', title: 'Content Creation', desc: 'Scroll-stopping content tailored for your brand voice and platform algorithm.' },
  { n: '03', title: 'Influencer Partnerships', desc: 'Curated creator collaborations that put your brand in front of the right audiences.' },
  { n: '04', title: 'Brand Identity', desc: 'Creative direction that builds iconic, recognizable brand aesthetics.' },
  { n: '05', title: 'Campaign Production', desc: 'End-to-end campaign storytelling — from concept to publish.' },
  { n: '06', title: 'AEO Optimization', desc: 'Optimized for AI engines like ChatGPT, Perplexity & Google AI Overview.' },
]

const marqueeItems = [
  'Social Media Strategy', 'Content Creation', 'Influencer Partnerships',
  'Brand Development', 'Campaign Production', 'NYC & Global',
  'Social Media Strategy', 'Content Creation', 'Influencer Partnerships',
  'Brand Development', 'Campaign Production', 'NYC & Global',
]

export default function HomePage() {
  const ctaRef = useMagnetic<HTMLAnchorElement>()

  return (
    <>
      {/* ── HERO ─────────────────────────────── */}
      <section className="hero">
        <HeroCanvas />
        <div className="hero-bg-gradient" />
        <div className="container">
          <div className="hero-content">
            <span className="hero-label">NYC-Born Creative Agency</span>
            <h1>
              Building <span className="highlight">iconic</span><br />
              brands through<br />
              strategy &amp; influence
            </h1>
            <p className="hero-sub">
              Full-service social media &amp; marketing agency helping brands grow
              with strategy, content &amp; creator partnerships.
            </p>
            <div className="hero-actions">
              <Link ref={ctaRef} to="/contact/" className="btn-primary">
                Let's Work Together ↗
              </Link>
              <Link to="/services/" className="btn-outline">
                Our Services
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────── */}
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── STATS ────────────────────────────── */}
      <section className="page-section page-section--dark">
        <div className="container">
          <Reveal className="stat-grid">
            <div className="stat-item">
              <strong>1M+</strong>
              <span>Creator Audience</span>
            </div>
            <div className="stat-item">
              <strong>50+</strong>
              <span>Brands Served</span>
            </div>
            <div className="stat-item">
              <strong>NYC</strong>
              <span>Based &amp; Global</span>
            </div>
            <div className="stat-item">
              <strong>5★</strong>
              <span>Client Rating</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHO WE ARE ───────────────────────── */}
      <section className="page-section">
        <div className="container">
          <Reveal className="who-we-are-grid">
            <div>
              <span className="section-label">Who We Are</span>
              <h2 className="section-title">
                Strategy. Content.<br />
                <span className="highlight">Influence.</span>
              </h2>
              <p className="section-lead" style={{ marginBottom: '2rem' }}>
                Avenue One™ is a NYC-born creative agency blending strategy, content,
                influence, and culture. We help brands stand out with storytelling that
                resonates and campaigns that convert.
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>
                Founded by Linda Kafexholli — global digital creator, marketing strategist,
                and 1M+ audience — Avenue One™ combines creative direction with real-world
                influence across the U.S. and Europe.
              </p>
              <Link to="/about/" className="btn-primary" style={{ marginTop: '2rem' }}>
                About Us ↗
              </Link>
            </div>
            <div className="industry-cards">
              {[
                { label: 'Hospitality & Hotels', icon: '🏨' },
                { label: 'Fashion & Luxury', icon: '👗' },
                { label: 'Beauty & Wellness', icon: '✨' },
                { label: 'F&B & Restaurants', icon: '🍽' },
              ].map((item) => (
                <div key={item.label} className="card-dark industry-card">
                  <div className="industry-card__icon" aria-hidden="true">{item.icon}</div>
                  <p className="industry-card__label">{item.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────── */}
      <section className="page-section page-section--dark">
        <div className="container">
          <div style={{ marginBottom: '3rem' }}>
            <span className="section-label">What We Do</span>
            <h2 className="section-title">
              Brands don't need more<br />
              content. They need <span className="highlight">direction.</span>
            </h2>
          </div>
          <div className="services-grid">
            {services.map((s, i) => (
              <Reveal key={s.n} className="card-dark" delay={i * 60}>
                <div className="card-number">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link to="/services/" className="btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section className="page-section">
        <div className="container">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title" style={{ marginBottom: '2.5rem' }}>
            What our clients say
          </h2>
          <Reveal className="testimonials-grid">
            <div className="testimonial-card">
              <blockquote>
                "Through Avenue One Agency, we were able to streamline our services, increase
                local visibility and improve customer engagement — increasing booking rate by 25%."
              </blockquote>
              <cite>Edwin Kornmann Rudi — Faralda Crane Hotel</cite>
            </div>
            <div className="testimonial-card">
              <blockquote>
                "Social Media Marketing services provided by Avenue One Agency helped us increase
                our online presence and customer engagement significantly."
              </blockquote>
              <cite>Fregi Mathew, Chef — Chatti New York</cite>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="cta-band">
        <div className="container text-center">
          <h2>
            Ready to build something iconic?
          </h2>
          <p>
            Let's talk about your brand and what we can create together.
          </p>
          <Link
            to="/contact/"
            className="btn-primary btn-invert"
          >
            Start a Project ↗
          </Link>
        </div>
      </section>
    </>
  )
}
