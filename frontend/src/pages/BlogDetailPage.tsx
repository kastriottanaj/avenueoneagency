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

  if (loading) return <div className="container py-5"><p>Loading…</p></div>
  if (error || !post) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error || 'Post not found.'}</div>
        <Link to="/blog/" className="btn btn-outline-primary">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-9">

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/blog/">Blog</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {post.title}
                </li>
              </ol>
            </nav>

            <article>
              <h1>{post.title}</h1>
              <p className="text-muted">
                Published on{' '}
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
                {post.author_name && ` by ${post.author_name}`}
              </p>

              {post.featured_image_url && (
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  width={post.image_width ?? undefined}
                  height={post.image_height ?? undefined}
                  className="img-fluid mb-4"
                  loading="lazy"
                />
              )}

              {/* Render HTML content from the admin */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {post.tags.length > 0 && (
                <div className="mt-4">
                  <h5>Tags:</h5>
                  <ul className="list-inline">
                    {post.tags.map((tag) => (
                      <li key={tag.slug} className="list-inline-item">
                        <Link
                          to={`/blog/?tag=${tag.slug}`}
                          className="badge bg-secondary text-decoration-none"
                        >
                          {tag.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* Related posts */}
            {post.related_posts && post.related_posts.length > 0 && (
              <>
                <hr className="my-5" />
                <h3>Related posts</h3>
                <div className="row">
                  {post.related_posts.map((related) => (
                    <div key={related.id} className="col-md-6 mb-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          {related.featured_image_url && (
                            <img
                              src={related.featured_image_url}
                              alt={related.title}
                              className="img-fluid mb-3"
                              loading="lazy"
                            />
                          )}
                          <h5>
                            <Link to={`/blog/${related.slug}/`}>{related.title}</Link>
                          </h5>
                          <Link
                            to={`/blog/${related.slug}/`}
                            className="btn btn-outline-primary btn-sm"
                          >
                            Read more
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
