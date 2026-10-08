import data from './caseStudies.json'

export interface CaseStudy {
  slug: string
  client: string
  industry: string
  location: string
  headline: string
  summary: string
  metric: { figure: string; label: string } | null
  quote: string
  author: string
  role: string
  verifiedOutcomes: string[]
  related: { label: string; path: string }[]
  metaTitle: string
  metaDescription: string
  publishedAt: string
  updatedAt: string
}

export const CASE_STUDIES = data.caseStudies as CaseStudy[]
export const CASE_STUDY_BY_SLUG = Object.fromEntries(
  CASE_STUDIES.map((study) => [study.slug, study]),
) as Record<string, CaseStudy>
