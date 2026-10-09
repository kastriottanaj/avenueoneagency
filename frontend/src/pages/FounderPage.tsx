import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import SectionHead from '../components/SectionHead'

const proof = [
  {
    brand: 'Revolve',
    evidence: 'Explicit disclosure: #Ad',
    context: 'Fashion creator partnership and stadium storytelling.',
    href: 'https://www.instagram.com/linda_kafexholli/p/DZk4-ujG3bz/',
  },
  {
    brand: 'Pandora',
    evidence: 'Explicit disclosure: #PandoraPartner',
    context: 'Personalised jewellery story built around an engraved keepsake.',
    href: 'https://www.instagram.com/linda_kafexholli/reel/Ddj_1O8qKr0/',
  },
  {
    brand: 'RingConn',
    evidence: 'Avenue One credited in caption',
    context: 'Concept-to-result smart-ring content produced with the agency.',
    href: 'https://www.instagram.com/linda_kafexholli/reel/DdHJVUZunY1/',
  },
  {
    brand: 'Revolve — Summer in the City',
    evidence: 'Avenue One credited in caption',
    context: 'New York fashion film with production and edit credits.',
    href: 'https://www.instagram.com/linda_kafexholli/reel/Dd4mQzsKeCX/',
  },
  {
    brand: 'Sisu Clinic',
    evidence: 'Public offer code: LINDA75',
    context: 'A first-person beauty and wellness treatment diary.',
    href: 'https://www.instagram.com/linda_kafexholli/reel/DaLDM7TuCG1/',
  },
  {
    brand: 'Brooklyn Mazzat',
    evidence: 'Public offer code: LINDA10',
    context: 'Local restaurant discovery told through family, place and food.',
    href: 'https://www.instagram.com/linda_kafexholli/reel/DXcbBZxkTF0/',
  },
]

const pillars = [
  {
    number: '01',
    title: 'Hospitality discovery',
    body: 'Restaurant, hotel and New York experience stories built around the details that make someone save, share, visit or book.',
  },
  {
    number: '02',
    title: 'Fashion, beauty & wellness',
    body: 'Personal style and first-person product storytelling that keeps the creator voice intact while making the brand memorable.',
  },
  {
    number: '03',
    title: 'Creator partnerships',
    body: 'Campaign concepts that connect a clear brand brief with platform-native pacing, disclosure and an audience-relevant point of view.',
  },
  {
    number: '04',
    title: 'Founder-led strategy',
    body: 'A working creator’s perspective applied to Avenue One strategy, production, creator selection and campaign direction.',
  },
]

export default function FounderPage() {
  return (
    <>
      <section className="page-hero founder-hero">
        <div className="container founder-hero__grid">
          <div>
            <span className="section-label">Founder Profile</span>
            <h1>
              Linda<br />
              <span className="pink">Kafexholli</span>
            </h1>
            <p>
              Founder and Chief Creative Officer of Avenue One™. A New York-based
              digital creator and marketing strategist building the bridge between
              brand direction and the way people actually discover culture online.
            </p>
            <div className="founder-actions">
              <a
                href="https://www.instagram.com/linda_kafexholli/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                View Instagram ↗
              </a>
              <Link to="/contact/" className="btn-outline">Work With Avenue One</Link>
            </div>
          </div>

          <aside className="founder-signature" aria-label="Linda Kafexholli profile summary">
            <span className="founder-signature__monogram" aria-hidden="true">LK</span>
            <div className="founder-signature__rule" />
            <dl>
              <div><dt>Public audience</dt><dd>1.1M+</dd></div>
              <div><dt>Based in</dt><dd>New York City</dd></div>
              <div><dt>Focus</dt><dd>Hospitality &amp; lifestyle</dd></div>
            </dl>
            <small>Public profile details observed October 2026.</small>
          </aside>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <Reveal className="founder-story" stagger={130}>
            <div>
              <SectionHead
                label="Creator to Creative Director"
                title={<>The audience is not a claim.<br />It is a <span className="highlight">working laboratory.</span></>}
              />
            </div>
            <div className="founder-story__copy">
              <p className="section-lead">
                Linda’s creator practice gives Avenue One a direct view into what earns
                attention, what feels forced and what turns a moment into demand.
              </p>
              <p>
                Her public work moves between New York hospitality, fashion, beauty,
                wellness and cultural events. That range informs how the agency briefs
                creators, directs content and builds campaigns that can live naturally
                in a feed without losing strategic intent.
              </p>
              <p>
                The result is a founder-led model: strategy is shaped by current platform
                behaviour, then translated into a repeatable system for the client’s own brand.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-section page-section--dark">
        <div className="container">
          <SectionHead
            label="Editorial Territories"
            title={<>Four connected <span className="highlight">content pillars.</span></>}
          />
          <Reveal className="founder-pillars" stagger={85}>
            {pillars.map((pillar) => (
              <article key={pillar.number} className="founder-pillar">
                <span>{pillar.number}</span>
                <h2>{pillar.title}</h2>
                <p>{pillar.body}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="founder-proof-head">
            <SectionHead
              label="Selected Public Evidence"
              title={<>Partnership signals,<br /><span className="highlight">clearly labelled.</span></>}
            />
            <p>
              These examples link to public posts. We distinguish explicit partnership
              disclosures, offer codes and Avenue One production credits from ordinary
              mentions; a tag alone is not presented as a paid brand deal.
            </p>
          </div>

          <Reveal className="founder-proof" stagger={70}>
            {proof.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="founder-proof__item"
              >
                <span className="founder-proof__evidence">{item.evidence}</span>
                <h2>{item.brand}</h2>
                <p>{item.context}</p>
                <span className="founder-proof__link">View public post ↗</span>
              </a>
            ))}
          </Reveal>

          <p className="founder-proof-note">
            Selected creator work is shown as public evidence and does not imply that every
            featured brand is an Avenue One client.
          </p>
        </div>
      </section>

      <section className="page-section page-section--dark">
        <div className="container founder-close">
          <div>
            <span className="section-label">Founder-Led, Built for Brands</span>
            <h2 className="section-title">Turn cultural attention into a brand system.</h2>
          </div>
          <div>
            <p className="section-lead">
              Explore the strategy, content and creator services Linda leads through Avenue One.
            </p>
            <div className="founder-actions">
              <Link to="/services/" className="btn-primary">Explore Services</Link>
              <Link to="/case-studies/" className="btn-outline">See Client Results</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
