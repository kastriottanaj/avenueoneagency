import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import Faq from '../components/Faq'

const services = [
  {
    n: '01',
    title: 'Social Media Strategy',
    desc: 'Data-driven strategies tailored to your brand that grow your audience, deepen community engagement, and hit measurable KPIs.',
    to: '/social-media-management-nyc/',
  },
  {
    n: '02',
    title: 'Content Creation',
    desc: 'Scroll-stopping content — photography, video, copy — crafted for your brand voice and optimized for each platform\u2019s algorithm.',
    to: '/hospitality-content-creation-nyc/',
  },
  {
    n: '03',
    title: 'Influencer Partnerships',
    desc: 'Curated creator collaborations and UGC direction that put your brand in front of the right audiences at the right moment.',
    to: '/influencer-marketing-agency-nyc/',
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
    to: '/hospitality-marketing-agency-nyc/',
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
            Social media &amp; creator<br />
            marketing built to <span className="pink">convert</span>.
          </h1>
          <p>Strategy, content and distribution for hospitality and lifestyle brands in New York City.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Reveal className="services-grid" variant="slide" stagger={70}>
            {services.map((s) => (
              <div key={s.n} className="card-dark">
                <div className="card-number">{s.n}</div>
                <h4>{s.title}</h4>
                <div>
                  <p>{s.desc}</p>
                  {s.to && <Link to={s.to} className="card-link">Explore this service ↗</Link>}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <Faq />

      <section className="cta-band">
        <div className="container text-center">
          <Reveal variant="mask" className="mask-clip">
            <h2>Not sure where to start?</h2>
          </Reveal>
          <Reveal variant="rise" delay={140}>
            <p>Let&apos;s talk. We&apos;ll figure out exactly what your brand needs.</p>
          </Reveal>
          <Link
            to="/contact/"
            className="btn-primary btn-invert"
          >
            Get a Free Consultation ↗
          </Link>
        </div>
      </section>
    </>
  )
}
