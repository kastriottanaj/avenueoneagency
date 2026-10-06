export interface Testimonial {
  /** Stored without quote marks — the component sets typographic ones. */
  quote: string
  author: string
  role: string
  /**
   * A result the client stated, pulled out of the quote so it reads as
   * evidence rather than being buried mid-sentence. Only set where the
   * client actually gave a number — never inferred.
   */
  result?: { figure: string; label: string }
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Through Avenue One Agency, we were able to streamline our services, increase local visibility and improve customer engagement — increasing booking rate by 25%.',
    author: 'Edwin Kornmann Rudi',
    role: 'Faralda Crane Hotel',
    result: { figure: '+25%', label: 'Booking rate' },
  },
  {
    quote:
      'Social Media Marketing services provided by Avenue One Agency helped us increase our online presence and customer engagement significantly.',
    author: 'Fregi Mathew',
    role: 'Chef, Chatti New York',
  },
]
