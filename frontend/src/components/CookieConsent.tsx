import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { applyStoredConsent, denyConsent, grantConsent, readConsent } from '../lib/consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    applyStoredConsent()
    if (readConsent() === null) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="consent" role="dialog" aria-live="polite" aria-label="Cookie preferences">
      <div className="consent-inner">
        <p className="consent-copy">
          We use analytics and advertising cookies to understand how our site is used.
          They are only set if you accept. See our{' '}
          <Link to="/privacy/">Privacy Policy</Link>.
        </p>
        <div className="consent-actions">
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              denyConsent()
              setVisible(false)
            }}
          >
            Decline
          </button>
          <button
            type="button"
            className="btn-primary consent-accept"
            onClick={() => {
              grantConsent()
              setVisible(false)
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
