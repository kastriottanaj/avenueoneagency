const services = [
  {
    title: 'Advertising',
    description: 'Optimize your advertising campaigns with AI-driven insights and automated targeting.',
  },
  {
    title: 'Digital Marketing',
    description: 'Enhance your digital marketing efforts with data-driven strategies and automated execution.',
  },
  {
    title: 'Search Engine Optimization',
    description: 'Improve your online visibility and organic search rankings with our SEO services.',
  },
  {
    title: 'Social Media Marketing',
    description: 'Grow your brand presence and engagement on social media with our marketing solutions.',
  },
  {
    title: 'Content Creation',
    description:
      'Generate high-quality content for your website, blog, and social media channels.',
  },
  {
    title: 'Web Development',
    description:
      'Build and maintain modern, responsive websites and web applications tailored to your business needs.',
  },
  {
    title: 'AEO (AI Engine Optimization)',
    description:
      'We optimize your website to perform better in AI engines like ChatGPT, Perplexity, and Google AI Overview — including content, structure, and metadata.',
  },
]

export default function ServicesPage() {
  return (
    <section className="py-5">
      <div className="container">
        <h1 className="mb-4">Our Services</h1>
        <p className="lead">
          We offer a wide range of digital services for automating and optimizing your brand presence.
        </p>

        <div className="row mt-4">
          {services.map((s) => (
            <div key={s.title} className="col-md-6 mb-4">
              <h4>{s.title}</h4>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
