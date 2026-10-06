import Reveal from './Reveal'
import { TESTIMONIALS, type Testimonial } from '../data/testimonials'

/**
 * Testimonials as a ruled editorial index rather than a card grid.
 *
 * Two side-by-side cards left the attributions at different heights, because
 * the quotes are different lengths — which read as a mistake rather than a
 * composition. Full-width rows sidestep that entirely: each quote can be
 * whatever length it is, the hairlines carry the rhythm, and the layout
 * matches the services index elsewhere on the site.
 */
function Row({ t, index }: { t: Testimonial; index: number }) {
  return (
    <div className="quote-row">
      <div className="quote-meta">
        <span className="quote-index">{String(index + 1).padStart(2, '0')}</span>
        {t.result && (
          <div className="quote-result">
            <strong>{t.result.figure}</strong>
            <span>{t.result.label}</span>
          </div>
        )}
        <cite className="quote-cite">
          <span className="quote-author">{t.author}</span>
          <span className="quote-role">{t.role}</span>
        </cite>
      </div>

      <blockquote className="quote-body">
        <span className="quote-mark" aria-hidden="true">&ldquo;</span>
        {t.quote}
        <span aria-hidden="true">&rdquo;</span>
      </blockquote>
    </div>
  )
}

export default function Testimonials({ items = TESTIMONIALS }: { items?: Testimonial[] }) {
  return (
    <Reveal className="quote-list" variant="slide" stagger={130}>
      {items.map((t, i) => (
        <Row key={t.author} t={t} index={i} />
      ))}
    </Reveal>
  )
}
