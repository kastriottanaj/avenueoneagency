import Reveal from './Reveal'

/**
 * Visible FAQ.
 *
 * Google only honours FAQPage structured data when the same questions and
 * answers are visible on the page, and answer engines quote this format
 * directly. These MUST stay in sync with FAQS in core/seo.py — core/tests.py
 * asserts the counts match.
 */
export const FAQS: [string, string][] = [
  [
    'What does Avenue One Agency do?',
    'Avenue One Agency is a New York City social media and marketing agency. It provides social media strategy, content creation, influencer and creator partnerships, brand identity and creative direction, campaign production, paid media, and AI Engine Optimization for hospitality, fashion, beauty, lifestyle and food and beverage brands.',
  ],
  [
    'Which industries does Avenue One Agency specialise in?',
    'Hotels and hospitality, restaurants and food and beverage, fashion and luxury, beauty and wellness, lifestyle and culture, and real estate and development.',
  ],
  [
    'Where is Avenue One Agency based?',
    'Avenue One Agency is based in New York City and works with brands across the United States and Europe.',
  ],
  [
    'Who founded Avenue One Agency?',
    'Avenue One Agency was founded in 2020 by Linda Kafexholli, a global digital creator and marketing strategist with an audience of over one million.',
  ],
  [
    'What is AEO, or AI Engine Optimization?',
    "AI Engine Optimization is the practice of making a brand discoverable and citable inside AI answer engines such as ChatGPT, Perplexity, Claude and Google's AI Overviews, rather than only in traditional search rankings. It combines server-rendered content, structured data, and clearly answered questions so that answer engines can retrieve and quote a brand accurately.",
  ],
  [
    'How quickly does Avenue One Agency respond to enquiries?',
    'Avenue One Agency replies to enquiries submitted through its contact form within 24 hours.',
  ],
]

export default function Faq() {
  return (
    <section className="page-section" id="faq">
      <div className="container">
        <span className="section-label">Questions</span>
        <h2 className="section-title">
          Frequently asked<br />
          <span className="highlight">questions</span>
        </h2>
        <dl className="faq-list">
          {FAQS.map(([q, a], i) => (
            <Reveal key={q} className="faq-item" delay={i * 40}>
              <dt>{q}</dt>
              <dd>{a}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
