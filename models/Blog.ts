export type BlogStatus = 'draft' | 'published' | 'scheduled'

export interface IBlog {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string          // Raw HTML
  featuredImage: string
  category: string
  tags: string[]
  author: string
  status: BlogStatus
  scheduledAt: string | Date | null
  publishedAt: string | Date | null
  // SEO
  seo: {
    metaTitle: string
    metaDesc: string
    focusKw: string
    secondaryKws: string[]
    canonical: string
    ogImage: string
    noIndex: boolean
  }
  // Stats
  views: number
  readTime: number         // auto-calculated in minutes
  createdAt: string | Date
  updatedAt?: string | Date
}
