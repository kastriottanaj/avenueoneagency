import { Link } from 'react-router-dom'

const industries = [
  {
    icon: '🏨',
    title: 'Hospitality & Hotels',
    desc: 'From boutique hotels to luxury chains — we craft storytelling that fills rooms and builds brand loyalty.',
  },
  {
    icon: '🍽',
    title: 'Restaurants & F&B',
    desc: 'We turn dining experiences into viral moments, growing your reservation list and community simultaneously.',
  },
  {
    icon: '👗',
    title: 'Fashion & Luxury',
    desc: 'Editorial content and influencer strategy for fashion brands ready to stand out in a crowded market.',
  },
  {
    icon: '✨',
    title: 'Beauty & Wellness',
    desc: 'Authentic content creation and creator partnerships that build trust and drive conversions.',
  },
  {
    icon: '🌆',
    title: 'Lifestyle & Culture',
    desc: 'We understand culture. We help lifestyle brands plug into it authentically and grow their community.',
  },
  {
    icon: '🏢',
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            {industries.map((ind) => (
              <div key={ind.title} className="card-dark">
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{ind.icon}</div>
                <h4>{ind.title}</h4>
                <p>{ind.desc}</p>
              </div>
            ))}
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
          <Link to="/kontakt/" className="btn-primary">Talk to Us ↗</Link>
        </div>
      </section>
    </>
  )
}
