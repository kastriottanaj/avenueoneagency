import { Link } from 'react-router-dom'
import HeroCanvas from '../components/HeroCanvas'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'
import Testimonials from '../components/Testimonials'
import { useMagnetic } from '../lib/useMagnetic'
import Icon, { type IconName } from '../components/Icon'

const services = [
  { n: '01', title: 'Social Media Strategy', desc: 'Data-driven strategies that grow your audience and deepen community engagement.', to: '/social-media-management-nyc/' },
  { n: '02', title: 'Content Creation', desc: 'Scroll-stopping content tailored for your brand voice and platform algorithm.', to: '/hospitality-content-creation-nyc/' },
  { n: '03', title: 'Influencer Partnerships', desc: 'Curated creator collaborations that put your brand in front of the right audiences.', to: '/influencer-marketing-agency-nyc/' },
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
            <span className="hero-label">NYC Hospitality &amp; Lifestyle Agency</span>
            <h1>
              NYC social media<br />
              for <span className="highlight">hospitality</span><br />
              &amp; lifestyle brands
            </h1>
            <p className="hero-sub">
              Creator-led strategy, content and influencer partnerships for restaurants,
              boutique hotels and lifestyle brands built to be chosen.
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
              <SectionHead
                label="Who We Are"
                title={<>Strategy. Content.<br /><span className="highlight">Influence.</span></>}
              />
              <p className="section-lead" style={{ marginBottom: '2rem' }}>
                Avenue One™ is a NYC hospitality and lifestyle marketing agency blending
                strategy, content, influence and culture. We turn distinctive experiences
                into demand, from first discovery to booking or purchase.
              </p>
              <p style={{ color: 'var(--gray)', fontSize: '0.95rem' }}>
                Founded by <Link className="text-link" to="/linda-kafexholli/">Linda Kafexholli</Link> —
                global digital creator, marketing strategist, and 1M+ audience builder —
                Avenue One™ combines creative direction with real-world influence across
                the U.S. and Europe.
              </p>
              <div className="founder-actions" style={{ marginTop: '2rem' }}>
                <Link to="/about/" className="btn-primary">About Us ↗</Link>
                <Link to="/linda-kafexholli/" className="btn-outline">Meet the Founder</Link>
              </div>
            </div>
            <Reveal className="industry-cards" stagger={90}>
              {([
                { label: 'Hospitality & Hotels', icon: 'hospitality', to: '/hospitality-marketing-agency-nyc/' },
                { label: 'Fashion & Luxury', icon: 'fashion', to: '/fashion-marketing-nyc/' },
                { label: 'Beauty & Wellness', icon: 'beauty', to: '/beauty-marketing-nyc/' },
                { label: 'F&B & Restaurants', icon: 'restaurant', to: '/restaurant-marketing-nyc/' },
              ] as { label: string; icon: IconName; to: string }[]).map((item) => (
                <Link key={item.label} to={item.to} className="card-dark industry-card">
                  <div className="industry-card__icon"><Icon name={item.icon} /></div>
                  <p className="industry-card__label">{item.label}</p>
                </Link>
              ))}
            </Reveal>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────── */}
      <section className="page-section page-section--dark">
        <div className="container">
          <SectionHead
            label="What We Do"
            title={<>Brands don&apos;t need more<br />content. They need <span className="highlight">direction.</span></>}
          />
          <Reveal className="services-grid" variant="slide" stagger={85}>
            {services.map((s) => (
              <Link key={s.n} to={s.to ?? '/services/'} className="card-dark">
                <div className="card-number">{s.n}</div>
                <h3 className="service-card-title">{s.title}</h3>
                <p>{s.desc}</p>
              </Link>
            ))}
          </Reveal>
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link to="/services/" className="btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section className="page-section">
        <div className="container">
          <SectionHead label="Testimonials" title="What our clients say" />
          <Testimonials />
          <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
            <Link to="/case-studies/" className="btn-outline">View Client Results</Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="cta-band">
        <div className="container text-center">
          <Reveal variant="mask" className="mask-clip">
            <h2>Ready to build something iconic?</h2>
          </Reveal>
          <Reveal variant="rise" delay={140}>
            <p>Let&apos;s talk about your brand and what we can create together.</p>
          </Reveal>
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
