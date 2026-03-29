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
      .then(([posts, cats]) => { setData(posts); setCategories(cats) })
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
    <>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">Blog</span>
          <h1>
            Insights, trends<br />
            &amp; <span className="pink">brand stories</span>.
          </h1>
          <p>The latest on social media, marketing strategy, and brand culture.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem', alignItems: 'start' }}>

            {/* Sidebar */}
            <aside>
              {/* Search */}
              <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="q"
                    defaultValue={query ?? ''}
                    placeholder="Search posts..."
                    style={{
                      width: '100%',
                      background: 'var(--black-3)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.75rem 3rem 0.75rem 1rem',
                      color: 'var(--white)',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      position: 'absolute',
                      right: '0.75rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--pink)',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      padding: 0,
                    }}
                  >
                    ↗
                  </button>
                </div>
              </form>

              {/* Categories */}
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '0.75rem' }}>
                Categories
              </p>
              <ul className="cat-list">
                <li>
                  <button className={`cat-btn ${!currentCategory ? 'active' : ''}`} onClick={() => setCategory(null)}>
                    All Posts
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      className={`cat-btn ${currentCategory === cat.slug ? 'active' : ''}`}
                      onClick={() => setCategory(cat.slug)}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Posts */}
            <div>
              {(query || currentTag) && (
                <div style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '0.875rem 1.25rem',
                  fontSize: '0.875rem',
                  color: 'var(--gray-light)',
                  marginBottom: '1.5rem',
                }}>
                  {query && <span>{data?.count ?? 0} result(s) for &ldquo;{query}&rdquo;</span>}
                  {currentTag && <span>Posts tagged &ldquo;{currentTag}&rdquo;</span>}
                </div>
              )}

              {loading && (
                <div style={{ color: 'var(--gray)', textAlign: 'center', padding: '4rem 0' }}>Loading…</div>
              )}
              {error && (
                <div style={{ color: '#ff4444', padding: '1rem' }}>{error}</div>
              )}

              {!loading && !error && data && data.results.length === 0 && (
                <div className="card-dark" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                  <h3 style={{ color: 'var(--white)', marginBottom: '0.75rem' }}>No posts yet</h3>
                  <p style={{ color: 'var(--gray)' }}>Our first articles are coming soon. Check back shortly.</p>
                </div>
              )}

              {!loading && !error && data && data.results.length > 0 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {data.results.map((post) => (
                      <BlogCard key={post.id} post={post} onTagClick={(slug) => {
                        const next = new URLSearchParams()
                        next.set('tag', slug)
                        setSearchParams(next)
                      }} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="pagination">
                      {page > 1 && (
                        <button className="page-btn" onClick={() => goToPage(page - 1)}>← Prev</button>
                      )}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => goToPage(p)}>
                          {p}
                        </button>
                      ))}
                      {page < totalPages && (
                        <button className="page-btn" onClick={() => goToPage(page + 1)}>Next →</button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Newsletter */}
          <div
            className="card-dark"
            style={{ marginTop: '4rem', padding: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}
          >
            <div>
              <span className="section-label">Newsletter</span>
              <h3 style={{ color: 'var(--white)', fontSize: '1.5rem', margin: '0.5rem 0 0.75rem' }}>
                Stay ahead of the trends
              </h3>
              <p style={{ color: 'var(--gray)', margin: 0, fontSize: '0.9rem' }}>
                Get the latest insights on social media, brand strategy and marketing delivered to your inbox.
              </p>
            </div>
            <div>
              {newsletterSuccess ? (
                <p style={{ color: 'var(--pink)', fontWeight: 700 }}>✓ You are subscribed!</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
                  {newsletterError && (
                    <p style={{ color: '#ff4444', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>{newsletterError}</p>
                  )}
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'var(--black-3)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.75rem 1rem',
                      color: 'var(--white)',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                    }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem', whiteSpace: 'nowrap' }}>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function BlogCard({ post, onTagClick }: { post: BlogPost; onTagClick: (slug: string) => void }) {
  return (
    <div className="blog-card">
      {post.featured_image_url && (
        <img
          src={post.featured_image_url}
          alt={post.title}
          className="blog-card-img"
          loading="lazy"
        />
      )}
      <div className="blog-card-body">
        <p className="blog-card-date">
          {new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
          })}
        </p>
        {post.category && (
          <span className="tag-pill" style={{ marginBottom: '0.5rem' }}>
            {post.category.name}
          </span>
        )}
        <h4>
          <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
        </h4>
        <p style={{ color: 'var(--gray)', fontSize: '0.875rem', marginBottom: '1rem', flex: 1 }}>
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="tag-pill"
                onClick={() => onTagClick(tag.slug)}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <Link to={`/blog/${post.slug}/`} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
          Read ↗
        </Link>
      </div>
    </div>
  )
}
