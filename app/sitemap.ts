import { MetadataRoute } from 'next'
import { PRODUCTS_DATA } from '@/lib/products-data'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://funtroo.in'

  // Static routes
  const routes = ['', '/about', '/shop', '/blog', '/privacy-policy', '/terms', '/terms-and-conditions'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic product routes
  const products = PRODUCTS_DATA.map((product) => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [...routes, ...products]
}
