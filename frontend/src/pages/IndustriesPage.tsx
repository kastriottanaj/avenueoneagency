import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { VERTICALS } from '../data/verticals'
import Icon, { type IconName } from '../components/Icon'

const industries: { icon: IconName; slug: string; title: string; desc: string }[] = [
  {
    icon: 'hotel',
    slug: 'hotel-marketing-nyc',
    title: 'Hospitality & Hotels',
    desc: 'From boutique hotels to luxury chains — we craft storytelling that fills rooms and builds brand loyalty.',
  },
  {
    icon: 'restaurant',
    slug: 'restaurant-marketing-nyc',
    title: 'Restaurants & F&B',
    desc: 'We turn dining experiences into viral moments, growing your reservation list and community simultaneously.',
  },
  {
    icon: 'fashion',
    slug: 'fashion-marketing-nyc',
    title: 'Fashion & Luxury',
    desc: 'Editorial content and influencer strategy for fashion brands ready to stand out in a crowded market.',
  },
  {
    icon: 'beauty',
    slug: 'beauty-marketing-nyc',
    title: 'Beauty & Wellness',
    desc: 'Authentic content creation and creator partnerships that build trust and drive conversions.',
  },
  {
    icon: 'lifestyle',
    slug: 'lifestyle-marketing-nyc',
    title: 'Lifestyle & Culture',
    desc: 'We understand culture. We help lifestyle brands plug into it authentically and grow their community.',
  },
  {
    icon: 'realEstate',
    slug: 'real-estate-marketing-nyc',
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
          <Reveal className="card-grid" stagger={80}>
            {industries.map((ind) => {
              const vertical = VERTICALS.find((v) => v.slug === ind.slug)
              return (
                <div key={ind.title} className="card-dark">
                  <div className="card-icon"><Icon name={ind.icon} size={34} /></div>
                  <h4>{ind.title}</h4>
                  <p>{ind.desc}</p>
                  {vertical && (
                    <Link to={`/${vertical.slug}/`} className="card-link">
                      {vertical.navLabel} ↗
                    </Link>
                  )}
                </div>
              )
            })}
          </Reveal>
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
