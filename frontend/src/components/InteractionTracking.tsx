import { useEffect } from 'react'
import { trackEvent } from '../lib/consent'

/** Tracks high-intent link clicks without attaching handlers across the site. */
export default function InteractionTracking() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest('a')
      if (!link) return

      const rawHref = link.getAttribute('href')
      if (!rawHref) return
      const linkText = (link.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 80)
      const context = {
        link_text: linkText,
        destination: rawHref.slice(0, 160),
        page_path: window.location.pathname,
      }

      if (rawHref.startsWith('mailto:')) {
        trackEvent('contact_click', { ...context, contact_method: 'email' })
        return
      }

      const destination = new URL(link.href, window.location.href)
      if (destination.origin !== window.location.origin) {
        trackEvent('outbound_click', { ...context, destination_host: destination.hostname })
      } else if (destination.pathname === '/contact/') {
        trackEvent('cta_click', { ...context, cta_type: 'contact' })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
