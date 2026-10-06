import { useEffect, useRef, useState } from 'react'

const SRC = '/static/core/css/img/hero'

/**
 * The <picture> below is the real LCP element and the permanent fallback — it
 * renders and paints exactly as it would without WebGL. The canvas is layered
 * on top and only fades in once the shader is compiled and drawing, so a
 * failed or skipped effect is invisible rather than a black hole.
 */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const [glReady, setGlReady] = useState(false)

  useEffect(() => {
    let teardown: (() => void) | null = null
    let cancelled = false
    let started = false

    // Deferred so the shader never competes with first paint — but with a
    // deadline. requestIdleCallback only fires when the main thread goes
    // quiet, and a page with a continuous animation (the grain layer) may
    // never offer an idle window.
    const idle = (cb: () => void) =>
      window.requestIdleCallback
        ? window.requestIdleCallback(cb, { timeout: 1200 })
        : window.setTimeout(cb, 200)

    // The viewport can legitimately be too narrow when this first runs — a
    // window that starts small, a tab restored in the background, a pane that
    // has not settled. Evaluating once and giving up leaves the hero static
    // forever, so the decision is re-taken whenever the conditions change.
    const wide = window.matchMedia('(min-width: 900px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')

    async function attempt() {
      if (cancelled || started) return

      const { shouldRunHeroGL, initHeroGL } = await import('../lib/heroGL')
      if (cancelled || started || !shouldRunHeroGL()) return

      const canvas = canvasRef.current
      const img = imgRef.current
      if (!canvas || !img) return

      const run = () => {
        if (cancelled || started || !img.naturalWidth) return
        started = true
        teardown = initHeroGL(canvas, img, () => setGlReady(true))
        if (!teardown) started = false
      }

      if (img.complete) run()
      else img.addEventListener('load', run, { once: true })
    }

    const handle = idle(attempt)
    wide.addEventListener('change', attempt)
    still.addEventListener('change', attempt)

    return () => {
      cancelled = true
      window.cancelIdleCallback?.(handle as number)
      wide.removeEventListener('change', attempt)
      still.removeEventListener('change', attempt)
      teardown?.()
    }
  }, [])

  return (
    <div className="hero-bg">
      <picture>
        <source
          type="image/avif"
          sizes="100vw"
          srcSet={`${SRC}/newyork-640.avif 640w, ${SRC}/newyork-1024.avif 1024w, ${SRC}/newyork-1600.avif 1600w, ${SRC}/newyork-2048.avif 2048w`}
        />
        <source
          type="image/webp"
          sizes="100vw"
          srcSet={`${SRC}/newyork-640.webp 640w, ${SRC}/newyork-1024.webp 1024w, ${SRC}/newyork-1600.webp 1600w, ${SRC}/newyork-2048.webp 2048w`}
        />
        <img
          ref={imgRef}
          src={`${SRC}/newyork-1600.jpg`}
          sizes="100vw"
          srcSet={`${SRC}/newyork-640.jpg 640w, ${SRC}/newyork-1024.jpg 1024w, ${SRC}/newyork-1600.jpg 1600w, ${SRC}/newyork-2048.jpg 2048w`}
          alt=""
          width={2051}
          height={922}
          // Lowercase: React 18 passes it through verbatim and does not warn
          // during server rendering the way the camelCase prop does.
          {...{ fetchpriority: 'high' }}
          decoding="async"
        />
      </picture>
      <canvas
        ref={canvasRef}
        className={`hero-canvas ${glReady ? 'is-live' : ''}`}
        aria-hidden="true"
      />
    </div>
  )
}
