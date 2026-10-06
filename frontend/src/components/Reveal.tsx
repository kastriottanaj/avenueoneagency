import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export type RevealVariant = 'rise' | 'mask' | 'slide' | 'fade'

interface Props {
  children: ReactNode
  /** Delay in ms before this element starts. */
  delay?: number
  /**
   * Stagger direct children by this many ms each, instead of animating the
   * wrapper as one block. Lets a grid deal its items in sequence from a
   * single wrapper rather than one Reveal per item.
   */
  stagger?: number
  variant?: RevealVariant
  as?: 'div' | 'section' | 'li' | 'article' | 'dl'
  className?: string
  /** Forwarded to the wrapper — it stands in for the element it replaced. */
  style?: CSSProperties
}

/**
 * How long to wait for the observer to prove it works.
 *
 * IntersectionObserver always delivers an initial callback for anything it
 * observes, intersecting or not. If nothing arrives in this window the
 * observer is not functioning — throttled in a background tab, absent in an
 * embedded webview — and everything is revealed so no one can land on a blank
 * page. Any callback at all cancels this, so scrolling genuinely drives the
 * reveal rather than a blanket timer firing a second after load.
 */
const OBSERVER_PROOF_MS = 1500

/**
 * Scroll-triggered entrance.
 *
 * Three guarantees, in order of importance:
 *  1. Elements start visible in CSS and are only hidden once this mounts, so
 *     no-JS visitors and crawlers always see the full page.
 *  2. Anything already on screen at mount is revealed immediately, without
 *     waiting for an observer callback.
 *  3. A timer reveals everything regardless after SAFETY_MS.
 *     IntersectionObserver is throttled on backgrounded tabs and absent in
 *     some embedded webviews; without this a visitor could land on a
 *     permanently blank page.
 */
export default function Reveal({
  children,
  delay = 0,
  stagger,
  variant = 'rise',
  as = 'div',
  className = '',
  style,
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets: HTMLElement[] =
      stagger != null ? (Array.from(el.children) as HTMLElement[]) : [el]

    const show = () => {
      targets.forEach((t, i) => {
        t.style.transitionDelay = `${delay + (stagger ?? 0) * i}ms`
        t.classList.add('is-in')
      })
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      targets.forEach((t) => t.classList.add('is-in'))
      return
    }

    targets.forEach((t) => t.classList.add('rv', `rv--${variant}`))

    // Already on screen — do not wait for a callback.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show()
      return
    }

    const safety = window.setTimeout(show, OBSERVER_PROOF_MS)

    const io = new IntersectionObserver(
      ([entry]) => {
        // The observer answered, so it works — stand the fallback down and
        // let scroll position decide from here.
        window.clearTimeout(safety)
        if (!entry.isIntersecting) return
        show()
        io.disconnect()
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)

    return () => {
      window.clearTimeout(safety)
      io.disconnect()
    }
  }, [delay, stagger, variant])

  const Tag = as as 'div'
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className} style={style}>
      {children}
    </Tag>
  )
}
