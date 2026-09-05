import data from './verticals.json'

export interface Approach {
  title: string
  body: string
}

export interface Proof {
  quote: string
  author: string
  role: string
}

export interface Vertical {
  slug: string
  eyebrow: string
  navLabel: string
  h1Lead: string
  h1Accent: string
  intro: string
  metaTitle: string
  metaDescription: string
  problemTitle: string
  problems: string[]
  approachTitle: string
  approach: Approach[]
  proof: Proof | null
  faqs: [string, string][]
}

/**
 * verticals.json is read by BOTH this module and core/seo.py — the Python side
 * uses it for titles, descriptions, JSON-LD and sitemap entries. Keeping one
 * file means the page content and its metadata cannot drift apart.
 */
export const VERTICALS = (data.verticals as Vertical[])

export const VERTICAL_BY_SLUG: Record<string, Vertical> = Object.fromEntries(
  VERTICALS.map((v) => [v.slug, v]),
)
