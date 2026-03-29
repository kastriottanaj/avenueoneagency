import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getBlogPosts, getCategories, subscribeNewsletter } from '../api/client'
import type { BlogPost, Category, PaginatedResponse } from '../types'

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<PaginatedResponse<BlogPost> | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const [newsletterError, setNewsletterError] = useState('')

  const currentCategory = searchParams.get('category') ?? undefined
  const currentTag = searchParams.get('tag') ?? undefined
  const query = searchParams.get('q') ?? undefined
  const page = Number(searchParams.get('page') ?? '1')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getBlogPosts({ page, category: currentCategory, tag: currentTag, q: query }),
      getCategories(),
    ])
      .then(([posts, cats]) => {
        setData(posts)
        setCategories(cats)
      })
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false))
  }, [page, currentCategory, currentTag, query])

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value.trim()
    const next = new URLSearchParams()
    if (q) next.set('q', q)
    setSearchParams(next)
  }

  function setCategory(slug: string | null) {
    const next = new URLSearchParams()
    if (slug) next.set('category', slug)
    setSearchParams(next)
  }

  function goToPage(p: number) {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  async function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNewsletterError('')
    try {
      await subscribeNewsletter({ email: newsletterEmail })
      setNewsletterSuccess(true)
      setNewsletterEmail('')
    } catch (err) {
      setNewsletterError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  const totalPages = data ? Math.ceil(data.count / 5) : 0

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">

          {/* Search */}
          <div className="col-12 mb-4">
            <form onSubmit={handleSearch} className="row gx-2">
              <div className="col-md-4 col-8">
                <input
                  type="text"
                  name="q"
                  className="form-control"
                  placeholder="Search for blog posts..."
                  defaultValue={query ?? ''}
                />
              </div>
              <div className="col-md-3 col-4">
                <button type="submit" className="btn btn-primary w-100">Search</button>
              </div>
            </form>
            {query && data && (
              <div className="mt-2 alert alert-info">
                {data.count} result(s) for &ldquo;{query}&rdquo;
              </div>
            )}
            {currentTag && (
              <div className="mt-2 alert alert-info">
                Posts tagged with &ldquo;{currentTag}&rdquo;
              </div>
            )}
          </div>

          {/* Sidebar – desktop */}
          <aside className="col-md-3 d-none d-md-block">
            <h5>Categories</h5>
            <ul className="list-group">
              <li
                className={`list-group-item ${!currentCategory ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setCategory(null)}
              >
                All
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`list-group-item ${currentCategory === cat.slug ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCategory(cat.slug)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Mobile category dropdown */}
          <div className="col-12 d-md-none mb-3">
            <select
              className="form-select"
              value={currentCategory ?? ''}
              onChange={(e) => setCategory(e.target.value || null)}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Posts */}
          <div className="col-md-9">
            <h1 className="mb-4">Our Blog</h1>

            {loading && <p>Loading…</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && data && data.results.length > 0 && (
              <>
                <div className="row">
                  {data.results.map((post) => (
                    <div key={post.id} className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          {post.featured_image_url && (
                            <img
                              src={post.featured_image_url}
                              alt={post.title}
                              width={post.image_width ?? undefined}
                              height={post.image_height ?? undefined}
                              className="img-fluid mb-3"
                              loading="lazy"
                            />
                          )}
                          <h4 className="card-title">
                            <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                          </h4>
                          <p className="text-muted">
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'long', day: 'numeric',
                            })}
                          </p>
                          {post.tags.length > 0 && (
                            <div className="mb-2">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag.slug}
                                  className="badge bg-light text-dark border me-1"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => {
                                    const next = new URLSearchParams()
                                    next.set('tag', tag.slug)
                                    setSearchParams(next)
                                  }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <p>{post.description}</p>
                          <Link to={`/blog/${post.slug}/`} className="btn btn-primary btn-sm">
                            Read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                      {page > 1 && (
                        <li className="page-item">
                          <button className="page-link" onClick={() => goToPage(page - 1)}>
                            &laquo; Previous
                          </button>
                        </li>
                      )}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                          <button className="page-link" onClick={() => goToPage(p)}>{p}</button>
                        </li>
                      ))}
                      {page < totalPages && (
                        <li className="page-item">
                          <button className="page-link" onClick={() => goToPage(page + 1)}>
                            Next &raquo;
                          </button>
                        </li>
                      )}
                    </ul>
                  </nav>
                )}
              </>
            )}

            {!loading && !error && data && data.results.length === 0 && (
              <div className="alert alert-info">
                <strong>Coming Soon:</strong> Our first articles will be available soon.
              </div>
            )}
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="row mt-5">
          <div className="col-md-6">
            <h4>Subscribe to our Newsletter</h4>
            {newsletterSuccess ? (
              <div className="alert alert-success">
                Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="row gx-2">
                {newsletterError && (
                  <div className="col-12 mb-2">
                    <div className="alert alert-danger">{newsletterError}</div>
                  </div>
                )}
                <div className="col-8">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-4">
                  <button type="submit" className="btn btn-primary w-100">Subscribe</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
