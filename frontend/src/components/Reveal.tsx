import { useEffect, useRef, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Stagger in ms, for siblings revealed together. */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
  className?: string
}

/** Content must never stay hidden because an enhancement failed. */
const SAFETY_MS = 1500

/**
 * Reveals content once as it enters the viewport.
 *
 * Three guarantees, in order of importance:
 *  1. Elements start visible in CSS and are only hidden once this mounts, so
 *     no-JS visitors and crawlers always see the full page.
 *  2. Anything already on screen at mount is revealed immediately, without
 *     waiting for an observer callback.
 *  3. A timer reveals everything regardless after SAFETY_MS. IntersectionObserver
 *     is throttled on backgrounded tabs and absent in some embedded webviews;
 *     without this, a visitor could land on a permanently blank page.
 */
export default function Reveal({ children, delay = 0, as = 'div', className = '' }: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const show = () => {
      el.style.transitionDelay = `${delay}ms`
      el.classList.add('is-in')
    }

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      el.classList.add('is-in')
      return
    }

    el.classList.add('reveal')

    // Already on screen — do not wait for a callback.
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show()
      return
    }

    const safety = window.setTimeout(show, SAFETY_MS)

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        window.clearTimeout(safety)
        show()
        io.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)

    return () => {
      window.clearTimeout(safety)
      io.disconnect()
    }
  }, [delay])

  const Tag = as as 'div'
  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  )
}
