import { useEffect, useRef } from 'react'

/**
 * Pulls an element gently toward the cursor when it is close. Skipped under
 * reduced-motion and on touch, where there is no hover to respond to.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28, radius = 90) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let raf = 0
    let cx = 0, cy = 0, tx = 0, ty = 0

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(dx, dy)
      const near = dist < r.width / 2 + radius
      tx = near ? dx * strength : 0
      ty = near ? dy * strength : 0
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      cx += (tx - cx) * 0.14
      cy += (ty - cy) * 0.14
      el.style.transform =
        Math.abs(cx) < 0.05 && Math.abs(cy) < 0.05 ? '' : `translate3d(${cx}px, ${cy}px, 0)`
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
      el.style.transform = ''
    }
  }, [strength, radius])

  return ref
}
