import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow:    ['/', '/shop', '/blog', '/product'],
        disallow: ['/admin', '/checkout', '/account', '/api', '/auth'],
      },
    ],
    sitemap: 'https://funtroo.in/sitemap.xml',
  }
}
