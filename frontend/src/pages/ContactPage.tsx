import { useState } from 'react'
import { submitContact } from '../api/client'

interface FormState {
  name: string
  email: string
  phone: string
  message: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', phone: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.name.trim()) e.name = 'Name is required.'
    if (!form.email.trim()) e.email = 'Email is required.'
    if (!form.message.trim()) e.message = 'Message is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setServerError('')
    try {
      await submitContact(form)
      setSuccess(true)
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }))
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Contact</span>
          <h1>
            Let&apos;s build<br />
            something <span className="pink">iconic</span>.
          </h1>
          <p>
            Tell us about your brand and what you want to achieve.
            We will get back to you within 24 hours.
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div className="contact-layout">

            {/* Info */}
            <div className="contact-info">
              <span className="section-label">Reach Us</span>
              <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                New York City
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Email
                  </p>
                  <a
                    href="mailto:avenueoneagency@gmail.com"
                    style={{ color: 'var(--white)', fontSize: '1rem', transition: 'color 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--pink)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--white)')}
                  >
                    avenueoneagency@gmail.com
                  </a>
                </div>
                <div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Instagram
                  </p>
                  <a
                    href="https://www.instagram.com/avenueone.agency/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'var(--white)', fontSize: '1rem', transition: 'color 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = 'var(--pink)')}
                    onMouseOut={(e) => (e.currentTarget.style.color = 'var(--white)')}
                  >
                    @avenueone.agency
                  </a>
                </div>
                <div>
                  <p style={{ color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Location
                  </p>
                  <span style={{ color: 'var(--white)', fontSize: '1rem' }}>New York City, USA</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="contact-form card-dark">
              {success ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                  <h3 style={{ color: 'var(--white)', marginBottom: '0.75rem' }}>Message sent!</h3>
                  <p style={{ color: 'var(--gray)' }}>
                    Thank you! We will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 style={{ color: 'var(--white)', marginBottom: '1.5rem', fontSize: '1.25rem' }}>
                    Send us a message
                  </h3>

                  {serverError && (
                    <div
                      style={{
                        background: 'rgba(255,68,68,0.1)',
                        border: '1px solid #ff4444',
                        borderRadius: '10px',
                        padding: '1rem',
                        color: '#ff4444',
                        fontSize: '0.9rem',
                        marginBottom: '1.25rem',
                      }}
                    >
                      {serverError}
                    </div>
                  )}

                  <div className="form-field">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className={errors.name ? 'error' : ''}
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Linda Kafexholli"
                    />
                    {errors.name && <p className="error-msg">{errors.name}</p>}
                  </div>

                  <div className="form-field">
                    <label>Your Email</label>
                    <input
                      type="email"
                      name="email"
                      className={errors.email ? 'error' : ''}
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@brand.com"
                    />
                    {errors.email && <p className="error-msg">{errors.email}</p>}
                  </div>

                  <div className="form-field">
                    <label>Phone <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(optional)</span></label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-field">
                    <label>Message</label>
                    <textarea
                      name="message"
                      rows={5}
                      className={errors.message ? 'error' : ''}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us about your brand and what you want to achieve..."
                    />
                    {errors.message && <p className="error-msg">{errors.message}</p>}
                  </div>

                  <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center' }}>
                    {submitting ? 'Sending…' : 'Send Message ↗'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
