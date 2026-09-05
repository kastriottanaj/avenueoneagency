import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { VERTICALS } from '../data/verticals'
import Icon, { type IconName } from '../components/Icon'

const industries: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: 'hotel',
    title: 'Hospitality & Hotels',
    desc: 'From boutique hotels to luxury chains — we craft storytelling that fills rooms and builds brand loyalty.',
  },
  {
    icon: 'restaurant',
    title: 'Restaurants & F&B',
    desc: 'We turn dining experiences into viral moments, growing your reservation list and community simultaneously.',
  },
  {
    icon: 'fashion',
    title: 'Fashion & Luxury',
    desc: 'Editorial content and influencer strategy for fashion brands ready to stand out in a crowded market.',
  },
  {
    icon: 'beauty',
    title: 'Beauty & Wellness',
    desc: 'Authentic content creation and creator partnerships that build trust and drive conversions.',
  },
  {
    icon: 'lifestyle',
    title: 'Lifestyle & Culture',
    desc: 'We understand culture. We help lifestyle brands plug into it authentically and grow their community.',
  },
  {
    icon: 'realEstate',
    title: 'Real Estate & Development',
    desc: 'Premium visual storytelling and digital campaigns for residential and commercial real estate brands.',
  },
]

export default function IndustriesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Industries</span>
          <h1>
            We know your<br />
            <span className="pink">industry</span> inside out.
          </h1>
          <p>
            Specialist expertise across hospitality, fashion, beauty, F&amp;B, and lifestyle —
            we understand your audience before we touch your content.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="card-grid">
            {industries.map((ind, i) => {
              const vertical = VERTICALS[i]
              return (
                <Reveal key={ind.title} className="card-dark" delay={i * 55}>
                  <div className="card-icon"><Icon name={ind.icon} size={34} /></div>
                  <h4>{ind.title}</h4>
                  <p>{ind.desc}</p>
                  {vertical && (
                    <Link to={`/${vertical.slug}/`} className="card-link">
                      {vertical.navLabel} ↗
                    </Link>
                  )}
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-section page-section--dark" style={{ textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">Don&apos;t see your industry?</span>
          <h2 className="section-title">We work across all creative sectors</h2>
          <p className="section-lead" style={{ margin: '0 auto 2rem' }}>
            If your brand has a story worth telling, we want to help tell it.
          </p>
          <Link to="/contact/" className="btn-primary">Talk to Us ↗</Link>
        </div>
      </section>
    </>
  )
}
