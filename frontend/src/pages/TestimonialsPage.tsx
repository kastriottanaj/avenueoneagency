const testimonials = [
  {
    quote:
      'Through Avenue One Agency, we were able to streamline our services, increase local visibility and improve customer engagement, also increase the booking rate by 25%.',
    author: 'Edwin Kornmann Rudi, Faralda Crane Hotel',
  },
  {
    quote:
      'Social Media Marketing services provided by Avenue One Agency, helped us increase our online presence and customer engagement.',
    author: 'Fregi Mathew, Chef, Chatti New York',
  },
]

export default function TestimonialsPage() {
  return (
    <section className="py-5">
      <div className="container">
        <h1 className="mb-4">What Our Customers Say</h1>
        <p className="lead">
          Feedback and testimonials from customers who have successfully grown their brand with us.
        </p>

        <div className="row mt-5">
          {testimonials.map((t) => (
            <div key={t.author} className="col-md-6 mb-4">
              <div className="border rounded p-4 h-100">
                <p className="mb-2">&ldquo;{t.quote}&rdquo;</p>
                <strong>– {t.author}</strong>
              </div>
            </div>
          ))}
        </div>

        <div className="alert alert-info mt-5">
          <strong>More testimonials coming soon.</strong>
        </div>
      </div>
    </section>
  )
}
