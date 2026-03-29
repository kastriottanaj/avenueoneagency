import { Link } from 'react-router-dom'

const services = [
  {
    n: '01',
    title: 'Social Media Strategy',
    desc: 'Data-driven strategies tailored to your brand that grow your audience, deepen community engagement, and hit measurable KPIs.',
  },
  {
    n: '02',
    title: 'Content Creation',
    desc: 'Scroll-stopping content — photography, video, copy — crafted for your brand voice and optimized for each platform\u2019s algorithm.',
  },
  {
    n: '03',
    title: 'Influencer Partnerships',
    desc: 'Curated creator collaborations and UGC direction that put your brand in front of the right audiences at the right moment.',
  },
  {
    n: '04',
    title: 'Brand Identity & Creative Direction',
    desc: 'We build iconic, recognizable brand aesthetics from visual identity to tone of voice — everything that makes you memorable.',
  },
  {
    n: '05',
    title: 'Campaign Production & Storytelling',
    desc: 'End-to-end campaign management: concept, production, execution, and analysis. We tell stories that move people to act.',
  },
  {
    n: '06',
    title: 'Hospitality & Lifestyle Marketing',
    desc: 'Specialist expertise in hotels, restaurants, F&B and luxury lifestyle brands — we understand your audience deeply.',
  },
  {
    n: '07',
    title: 'Advertising & Paid Media',
    desc: 'AI-driven ad targeting, creative strategy, and budget optimization across Meta, TikTok, Google, and beyond.',
  },
  {
    n: '08',
    title: 'AEO — AI Engine Optimization',
    desc: 'Optimize your brand for ChatGPT, Perplexity, and Google AI Overview — the new frontier of discoverability.',
  },
]

export default function ServicesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Services</span>
          <h1>
            Everything your brand<br />
            needs to <span className="pink">dominate</span>.
          </h1>
          <p>Full-service creative and marketing solutions for modern brands.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {services.map((s) => (
              <div key={s.n} className="card-dark">
                <div className="card-number">{s.n}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="page-section"
        style={{
          background: 'linear-gradient(135deg, var(--pink) 0%, #a0103e 100%)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'white',
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
            }}
          >
            Not sure where to start?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem' }}>
            Let's talk. We'll figure out exactly what your brand needs.
          </p>
          <Link
            to="/kontakt/"
            className="btn-primary"
            style={{ background: 'white', color: 'var(--pink)' }}
          >
            Get a Free Consultation ↗
          </Link>
        </div>
      </section>
    </>
  )
}
