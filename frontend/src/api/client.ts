import type { BlogPost, Category, PaginatedResponse } from '../types'

const API_BASE = '/api'

export async function getBlogPosts(params?: {
  page?: number
  category?: string
  tag?: string
  q?: string
}): Promise<PaginatedResponse<BlogPost>> {
  const qs = new URLSearchParams()
  if (params?.page) qs.set('page', String(params.page))
  if (params?.category) qs.set('category', params.category)
  if (params?.tag) qs.set('tag', params.tag)
  if (params?.q) qs.set('q', params.q)
  const res = await fetch(`${API_BASE}/blog/?${qs}`)
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`${API_BASE}/blog/${slug}/`)
  if (!res.ok) throw new Error('Failed to fetch post')
  return res.json()
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/blog/categories/`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json()
}

export async function submitContact(data: {
  name: string
  email: string
  phone?: string
  message: string
}): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/contact/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || 'Failed to send message')
  }
  return res.json()
}

export async function subscribeNewsletter(data: {
  email: string
}): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/newsletter/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || 'Failed to subscribe')
  }
  return res.json()
}
