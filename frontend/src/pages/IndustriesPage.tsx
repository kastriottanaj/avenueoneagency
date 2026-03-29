const industries = [
  {
    title: 'Restaurants',
    description:
      'Digital Marketing Services for restaurants to increase online visibility and customer engagement.',
  },
  {
    title: 'Fashion Brands',
    description:
      'Digital Marketing Services for fashion brands to enhance brand awareness and drive sales.',
  },
  {
    title: 'Marketing Agencies',
    description:
      'Digital Marketing Services for marketing agencies to streamline campaign management and lead nurturing.',
  },
  {
    title: 'Cosmetics & Beauty',
    description:
      'Digital Marketing Services for cosmetics and beauty brands to increase brand awareness and drive sales.',
  },
]

export default function IndustriesPage() {
  return (
    <section className="py-5">
      <div className="container">
        <h1 className="mb-4">Industries we serve</h1>
        <p className="lead">
          Our Social Media Marketing and Digital Marketing solutions are tailored for various industries.
        </p>

        <div className="row mt-4">
          {industries.map((i) => (
            <div key={i.title} className="col-md-6 mb-4">
              <h4>{i.title}</h4>
              <p>{i.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
