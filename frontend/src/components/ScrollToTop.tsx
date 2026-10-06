import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/consent'

/**
 * React Router keeps the scroll offset across route changes, so navigating from
 * a scrolled page landed the visitor partway down the next one — measured at
 * 795px into /services/, past the headline and introduction.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    trackPageView(pathname)
  }, [pathname, hash])

  return null
}
