import { useState } from 'react'
import { submitContact } from '../api/client'

interface FormState {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
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
      setForm({ name: '', email: '', message: '' })
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
    <section className="py-5">
      <div className="container">
        <h1 className="mb-4">Contact</h1>
        <p className="lead">Get in touch with us — we'd love to hear from you.</p>

        <div className="row mt-4">
          {/* Contact info */}
          <div className="col-md-6 mb-4">
            <h4>New York City</h4>
            <ul className="list-unstyled">
              <li>
                <strong>E-Mail:</strong>{' '}
                <a href="mailto:info@avenueoneagency.com">info@avenueoneagency.com</a>
              </li>
              <li>
                <strong>Address:</strong>
                <br />
                New York City, USA
              </li>
            </ul>
          </div>

          {/* Contact form */}
          <div className="col-md-6">
            <h4>Contact Form</h4>

            {success && (
              <div className="alert alert-success">
                Your message was sent successfully. We will get back to you as soon as possible.
              </div>
            )}
            {serverError && (
              <div className="alert alert-danger">{serverError}</div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    value={form.name}
                    onChange={handleChange}
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    rows={5}
                    className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                    value={form.message}
                    onChange={handleChange}
                  />
                  {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
