import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-image">
          <img
            src="/static/core/css/img/newyork.jpeg"
            alt="New York City"
          />
        </div>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Avenue One Agency –<br />
              Building iconic brands through strategy, content and influence
            </h1>
            <p>
              Full-Service social media &amp; marketing agency helping brands grow with
              strategy, content &amp; ads.
            </p>
            <Link to="/kontakt/" className="hero-btn">
              Let's work together
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-5">
        <div className="container text-center">
          <h2 className="mb-3">Who we are</h2>
          <p className="lead mx-auto" style={{ maxWidth: 800 }}>
            Avenue One™ is a NYC-born creative agency blending strategy, content, influence,
            and culture. We help brands stand out with storytelling that resonates and campaigns
            that convert.
          </p>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">What do we do?</h2>
          <p className="lead mx-auto" style={{ maxWidth: 800 }}>
            We specialize in social media strategy, content creation, influencer partnerships,
            and brand development for hospitality, fashion, beauty, lifestyle, and F&amp;B brands.
            Our work is rooted in culture and driven by results.
          </p>
          <p className="mx-auto" style={{ maxWidth: 800 }}>
            Founded by Linda Kafexholli — global digital creator, marketing strategist, and 1M+
            audience — Avenue One™ combines creative direction with real-world influence and
            industry expertise across the U.S. and Europe.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">How we work</h2>
          <p className="mx-auto" style={{ maxWidth: 800 }}>
            We partner with hospitality, fashion, beauty, lifestyle, and F&amp;B brands to craft
            moments, elevate identity, and build communities with purpose.
          </p>
          <p className="mx-auto" style={{ maxWidth: 800 }}>
            From strategy to content to influencer collaborations, we create campaigns that
            resonate and convert. We blend creativity with data-driven insights to deliver
            measurable results and lasting impact.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-5" style={{ backgroundColor: 'var(--light-peach)' }}>
        <div className="container text-center">
          <h2 className="mb-4">Why Avenue One Agency</h2>
          <ul className="list-unstyled mx-auto" style={{ maxWidth: 600, textAlign: 'left' }}>
            <li className="mb-2">✔️ &nbsp; Social media strategy &amp; content development</li>
            <li className="mb-2">✔️ &nbsp; Influencer partnerships &amp; UGC direction</li>
            <li className="mb-2">✔️ &nbsp; Brand identity &amp; creative direction</li>
            <li className="mb-2">✔️ &nbsp; Campaign production &amp; storytelling</li>
            <li className="mb-2">✔️ &nbsp; Hospitality &amp; lifestyle marketing</li>
            <li className="mb-2">✔️ &nbsp; NYC, Paris &amp; global creator collaborations</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 className="mb-3">Ready for transformation?</h2>
          <p className="mb-4">Contact us for a free consultation.</p>
          <Link
            to="/kontakt/"
            className="btn btn-lg text-white"
            style={{ backgroundColor: 'var(--vivid-orange)' }}
          >
            Contact us now
          </Link>
        </div>
      </section>
    </>
  )
}
