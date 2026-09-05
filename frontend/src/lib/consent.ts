/**
 * Consent-gated analytics.
 *
 * Google Analytics and the Meta Pixel previously ran inline in <head> on every
 * page load, before the visitor was asked anything. For any EU visitor that is
 * non-essential tracking set without consent. They now load only after an
 * explicit opt-in, and never at all if the visitor declines.
 *
 * Loading them here also takes 171KB off the critical rendering path.
 */

const GA_ID = 'G-WYDLQ5EVPN'
const PIXEL_ID = '1636548780796618'
const STORAGE_KEY = 'a1_consent_v1'

export type ConsentValue = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] }
    _fbq?: unknown
  }
}

export function readConsent(): ConsentValue | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'granted' || v === 'denied' ? v : null
  } catch {
    // Private mode or blocked storage: treat as undecided, never as granted.
    return null
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    localStorage.setItem(STORAGE_KEY, value)
  } catch {
    /* storage unavailable — consent applies to this page view only */
  }
}

let loaded = false

function loadAnalytics() {
  if (loaded) return
  loaded = true

  // ── Google Analytics 4 ─────────────────────────────
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag = gtag

  // Consent Mode v2: declare the granted state before the first hit.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  })
  gtag('consent', 'update', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted',
  })

  const ga = document.createElement('script')
  ga.async = true
  ga.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(ga)

  gtag('js', new Date())
  gtag('config', GA_ID)

  // ── Meta Pixel ─────────────────────────────────────
  const queue: unknown[] = []
  const fbq = Object.assign(
    function (...args: unknown[]) {
      const f = window.fbq!
      if (f.callMethod) (f.callMethod as (...a: unknown[]) => void)(...args)
      else queue.push(args)
    },
    { queue, push: undefined as unknown, loaded: true, version: '2.0' },
  ) as Window['fbq']

  window.fbq = fbq
  window._fbq = fbq

  const px = document.createElement('script')
  px.async = true
  px.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(px)

  window.fbq!('init', PIXEL_ID)
  window.fbq!('track', 'PageView')
}

/** Load trackers if — and only if — consent has already been granted. */
export function applyStoredConsent() {
  if (readConsent() === 'granted') loadAnalytics()
}

export function grantConsent() {
  writeConsent('granted')
  loadAnalytics()
}

export function denyConsent() {
  writeConsent('denied')
}

/** Track an SPA route change. No-op unless analytics actually loaded. */
export function trackPageView(path: string) {
  if (!loaded) return
  window.gtag?.('event', 'page_view', { page_path: path })
  window.fbq?.('track', 'PageView')
}
