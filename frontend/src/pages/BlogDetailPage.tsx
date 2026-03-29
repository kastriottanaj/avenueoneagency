import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogPost } from '../api/client'
import type { BlogPost } from '../types'

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getBlogPost(slug)
      .then(setPost)
      .catch(() => setError('Post not found.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--gray)' }}>Loading…</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <section className="page-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ color: 'var(--white)', marginBottom: '1rem' }}>Post not found</h1>
          <Link to="/blog/" className="btn-primary">← Back to Blog</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* Hero */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '60px',
          background: 'var(--black)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="breadcrumb">
            <Link to="/blog/">Blog</Link>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'var(--gray-light)' }}>{post.title}</span>
          </div>

          {post.category && (
            <span className="tag-pill" style={{ marginBottom: '1.25rem', display: 'inline-block' }}>
              {post.category.name}
            </span>
          )}

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: 'var(--white)',
              marginBottom: '1rem',
            }}
          >
            {post.title}
          </h1>

          <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
            {post.author_name && (
              <span> &nbsp;·&nbsp; by <strong style={{ color: 'var(--gray-light)' }}>{post.author_name}</strong></span>
            )}
          </p>
        </div>
      </section>

      <section className="page-section">
        <div className="container" style={{ maxWidth: '800px' }}>
          {post.featured_image_url && (
            <img
              src={post.featured_image_url}
              alt={post.title}
              style={{
                width: '100%',
                borderRadius: '16px',
                marginBottom: '3rem',
                objectFit: 'cover',
                maxHeight: '480px',
              }}
              loading="lazy"
            />
          )}

          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.tags.length > 0 && (
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--gray)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Tags
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {post.tags.map((tag) => (
                  <Link
                    key={tag.slug}
                    to={`/blog/?tag=${tag.slug}`}
                    className="tag-pill"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <Link to="/blog/" className="btn-outline">← Back to Blog</Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {post.related_posts && post.related_posts.length > 0 && (
        <section className="page-section page-section--dark">
          <div className="container">
            <span className="section-label">Continue Reading</span>
            <h2 className="section-title" style={{ marginBottom: '2rem' }}>Related Posts</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {post.related_posts.map((related) => (
                <div key={related.id} className="blog-card">
                  {related.featured_image_url && (
                    <img
                      src={related.featured_image_url}
                      alt={related.title}
                      className="blog-card-img"
                      loading="lazy"
                    />
                  )}
                  <div className="blog-card-body">
                    <p className="blog-card-date">
                      {new Date(related.created_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                    <h4>
                      <Link to={`/blog/${related.slug}/`}>{related.title}</Link>
                    </h4>
                    <Link to={`/blog/${related.slug}/`} className="btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.8rem' }}>
                      Read ↗
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
