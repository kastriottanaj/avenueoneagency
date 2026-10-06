import data from './commercialPages.json'

export interface CommercialPageSection {
  title: string
  body: string
}

export interface CommercialPageLink {
  label: string
  path: string
}

export interface CommercialPage {
  slug: string
  eyebrow: string
  navLabel: string
  breadcrumbParent: CommercialPageLink
  h1Lead: string
  h1Accent: string
  intro: string
  metaTitle: string
  metaDescription: string
  serviceType: string
  problemLabel: string
  problemTitle: string
  problems: string[]
  approachLabel: string
  approachTitle: string
  approach: CommercialPageSection[]
  audienceTitle: string
  audiences: CommercialPageSection[]
  faqs: [string, string][]
  related: CommercialPageLink[]
}

export const COMMERCIAL_PAGES = data.pages as CommercialPage[]

export const COMMERCIAL_PAGE_BY_SLUG: Record<string, CommercialPage> = Object.fromEntries(
  COMMERCIAL_PAGES.map((page) => [page.slug, page]),
)
