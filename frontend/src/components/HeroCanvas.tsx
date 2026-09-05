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

    // Deferred so the shader never competes with first paint.
    const idle =
      window.requestIdleCallback?.bind(window) ??
      ((cb: () => void) => window.setTimeout(cb, 200))

    const handle = idle(async () => {
      if (cancelled) return
      const { shouldRunHeroGL, initHeroGL } = await import('../lib/heroGL')
      if (cancelled || !shouldRunHeroGL()) return

      const canvas = canvasRef.current
      const img = imgRef.current
      if (!canvas || !img) return

      const run = () => {
        if (cancelled || !img.naturalWidth) return
        // Reveal only after the first frame is on the canvas, never merely
        // because initialisation returned.
        teardown = initHeroGL(canvas, img, () => setGlReady(true))
      }

      if (img.complete) run()
      else img.addEventListener('load', run, { once: true })
    })

    return () => {
      cancelled = true
      window.cancelIdleCallback?.(handle as number)
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
