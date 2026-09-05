import { Link } from 'react-router-dom'

/**
 * The previous policy was a translated German template: it cited the TMG (a
 * German statute superseded in 2024), ran to under 200 words, and disclosed
 * neither Google Analytics nor the Meta Pixel — both of which run on every
 * page. This replaces it with a disclosure that matches what the site
 * actually does under the law that actually applies.
 *
 * REVIEW REQUIRED: this is an accurate technical description of the site's
 * data handling, not legal advice. A US privacy attorney should review it
 * before it is relied on, and the placeholders below must be filled in.
 */

const UPDATED = 'September 1, 2026'
const CONTACT_EMAIL = 'avenueoneagency@gmail.com'

const h2 = {
  color: 'var(--white)',
  marginTop: '2.5rem',
  fontSize: '1.35rem',
} as const

export default function PrivacyPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Legal</span>
          <h1>Privacy Policy</h1>
        </div>
      </section>

      <section className="page-section">
        <div className="container" style={{ maxWidth: '720px' }}>
          <p style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>
            Last updated: {UPDATED}
          </p>

          <p className="section-lead">
            Avenue One Agency (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is based in New York City
            and operates avenueoneagency.com. This policy explains what personal
            information we collect, why we collect it, and the choices you have.
          </p>

          <h2 style={h2}>Who we are</h2>
          <p>
            Avenue One Agency, New York City, United States, is the controller of the
            personal data described here. You can reach us about privacy at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--pink-text)' }}>
              {CONTACT_EMAIL}
            </a>
            .
          </p>

          <h2 style={h2}>Information you give us</h2>
          <p>
            When you submit the contact form we collect your name, email address, an
            optional phone number, and the content of your message. We use this only to
            respond to your enquiry and to keep a record of our correspondence. If you
            subscribe to our newsletter we collect your email address and use it only to
            send you that newsletter; every email includes an unsubscribe link.
          </p>
          <p>
            We do not sell or share your personal information, and we do not use it for
            automated decision-making or profiling.
          </p>

          <h2 style={h2}>Cookies and analytics</h2>
          <p>
            We use two third-party services that set cookies and collect usage data.
            Neither one loads until you accept them in the cookie banner. If you decline,
            they are never loaded and no analytics or advertising cookies are set.
          </p>
          <ul style={{ color: 'var(--gray-light)', lineHeight: 1.7, paddingLeft: '1.25rem' }}>
            <li>
              <strong style={{ color: 'var(--white)' }}>Google Analytics 4</strong> — measures
              how the site is used (pages viewed, approximate location, device and browser).
              Provided by Google LLC.
            </li>
            <li>
              <strong style={{ color: 'var(--white)' }}>Meta Pixel</strong> — measures the
              performance of our advertising and allows us to show ads to people who have
              visited the site. Provided by Meta Platforms, Inc.
            </li>
          </ul>
          <p>
            Both providers are located in the United States, so accepting them involves an
            international transfer of your data. You can change your mind at any time by
            clearing this site&rsquo;s data in your browser, which will make the banner
            appear again.
          </p>

          <h2 style={h2}>How long we keep it</h2>
          <p>
            Contact enquiries are retained for up to 24 months so we can follow up and
            maintain a record of our discussions. Newsletter subscriptions are kept until
            you unsubscribe. Analytics data is retained according to the provider&rsquo;s
            own settings.
          </p>

          <h2 style={h2}>Your rights</h2>
          <p>
            Depending on where you live, you may have the right to access, correct, delete,
            or receive a copy of your personal information, and to opt out of its sale or
            sharing. We do not sell or share personal information as those terms are
            defined under California law.
          </p>
          <p>
            If you are in the European Economic Area or the United Kingdom, you also have
            the right to object to or restrict processing, to withdraw consent at any time,
            and to lodge a complaint with your local supervisory authority. Where we rely
            on a legal basis, it is your consent for analytics and advertising cookies, and
            our legitimate interest in responding to you for contact enquiries.
          </p>
          <p>
            To exercise any of these rights, email us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: 'var(--pink-text)' }}>
              {CONTACT_EMAIL}
            </a>
            . We will respond within 30 days. We will not discriminate against you for
            exercising them.
          </p>

          <h2 style={h2}>Children</h2>
          <p>
            This site is intended for business audiences. We do not knowingly collect
            personal information from anyone under 16.
          </p>

          <h2 style={h2}>Security and changes</h2>
          <p>
            The site is served over HTTPS and access to submitted enquiries is restricted
            to Avenue One Agency staff. No method of transmission is completely secure, so
            we cannot guarantee absolute security. If we change this policy we will update
            the date at the top of this page.
          </p>

          <p style={{ marginTop: '2.5rem' }}>
            See also our <Link to="/imprint/" style={{ color: 'var(--pink-text)' }}>Imprint</Link>.
          </p>
        </div>
      </section>
    </>
  )
}
