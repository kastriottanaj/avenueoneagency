export interface Tag {
  name: string
  slug: string
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  category: Category | null
  description: string
  content: string
  featured_image_url: string | null
  image_width: number | null
  image_height: number | null
  published: boolean
  created_at: string
  meta_title: string
  meta_description: string
  author_name: string | null
  tags: Tag[]
  related_posts?: BlogPost[]
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
