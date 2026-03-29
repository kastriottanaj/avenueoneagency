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
          <p className="section-lead">
            The protection of your personal data is a special concern for us. We process your
            data exclusively on the basis of legal regulations (GDPR, TMG).
          </p>
          <p>
            In this privacy policy we inform you about the most important aspects of data
            processing within our website.
          </p>

          <h2 style={{ color: 'var(--white)', marginTop: '2.5rem', fontSize: '1.5rem' }}>Contact with us</h2>
          <p>
            If you contact us via form on our website or via email, your data will be stored
            for six months for processing your request and in case of follow-up questions.
          </p>

          <h2 style={{ color: 'var(--white)', marginTop: '2.5rem', fontSize: '1.5rem' }}>Cookies</h2>
          <p>
            Our website uses cookies. These are small text files that are stored on your device
            using the browser. They do not cause any damage.
          </p>
        </div>
      </section>
    </>
  )
}
