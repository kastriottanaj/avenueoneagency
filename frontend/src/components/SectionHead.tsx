import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface Props {
  label: string
  title: ReactNode
  lead?: ReactNode
  className?: string
}

/**
 * The label / headline / standfirst group that opens most sections.
 *
 * Bundled into one component so the three parts always arrive in the same
 * order with the same rhythm. Orchestrating them consistently is what makes a
 * page feel composed rather than a set of independent animations firing.
 */
export default function SectionHead({ label, title, lead, className = '' }: Props) {
  return (
    <div className={`section-head ${className}`}>
      <Reveal variant="fade">
        <span className="section-label">{label}</span>
      </Reveal>
      <Reveal variant="mask" delay={90} className="mask-clip">
        <h2 className="section-title">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal variant="rise" delay={260}>
          <p className="section-lead">{lead}</p>
        </Reveal>
      )}
    </div>
  )
}
