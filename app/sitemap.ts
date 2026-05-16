import { MetadataRoute } from 'next'
import { getCollection, where } from '@/lib/firestore'
import { IBlog } from '@/models/Blog'
import { IProduct } from '@/models/Product'

const BASE = 'https://funtroo.in'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const [blogs, products] = await Promise.all([
      getCollection<IBlog>('blogs', [where('status', '==', 'published')]),
      getCollection<IProduct>('products', [where('isActive', '==', true)]),
    ])

    const staticPages: MetadataRoute.Sitemap = [
      { url: BASE,            lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
      { url: `${BASE}/shop`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
      { url: `${BASE}/blog`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
      { url: `${BASE}/auth/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ]

    const blogPages: MetadataRoute.Sitemap = blogs.map(b => ({
      url:             `${BASE}/blog/${b.slug}`,
      lastModified:    b.updatedAt ? new Date(b.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    }))

    const productPages: MetadataRoute.Sitemap = products.map(p => ({
      url:             `${BASE}/product/${p.slug}`,
      lastModified:    p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority:        0.7,
    }))

    return [...staticPages, ...blogPages, ...productPages]
  } catch (e) {
    console.error('Sitemap generation failed', e)
    return []
  }
}
