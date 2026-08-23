import { MetadataRoute } from 'next'
import { adminDb } from '@/lib/firebase-admin'

export const revalidate = 86400 // Revalidate daily (24 hours)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://funtroo.in'

  // Static routes
  const staticRoutes = [
    '', '/about', '/shop', '/blog', '/privacy-policy', '/terms', '/terms-and-conditions',
    '/sex-toys-for-women', '/sex-toys-for-men', '/couples-sex-toys', '/lubricants', '/lingerie'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  let dynamicProducts: MetadataRoute.Sitemap = []
  let dynamicBlogs: MetadataRoute.Sitemap = []

  try {
    // Fetch active products
    const pSnap = await adminDb.collection('products').where('isActive', '==', true).get()
    dynamicProducts = pSnap.docs.map(doc => {
      const data = doc.data()
      return {
        url: `${baseUrl}/product/${data.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }
    })

    // Fetch published blogs
    const bSnap = await adminDb.collection('blogs').where('published', '==', true).get()
    dynamicBlogs = bSnap.docs.map(doc => {
      const data = doc.data()
      return {
        url: `${baseUrl}/blog/${data.slug || doc.id}`,
        lastModified: data.updatedAt ? new Date(data.updatedAt.toDate()).toISOString() : new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })
  } catch (error) {
    console.error("Error generating dynamic sitemap from Firestore:", error)
    // Fallback to static dummy data if Firebase fails during build
    try {
      const { PRODUCTS_DATA } = await import('@/lib/products-data')
      dynamicProducts = PRODUCTS_DATA.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }))
    } catch (e) {
      console.error("Fallback to PRODUCTS_DATA failed", e)
    }
  }

  return [...staticRoutes, ...dynamicProducts, ...dynamicBlogs]
}
