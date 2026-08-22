import { Metadata } from 'next'
import { getCollection, where, limit } from '@/lib/firestore'
import { IProduct } from '@/models/Product'
import { PRODUCTS_DATA } from '@/lib/products-data'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  
  // Try to fetch from Firestore first
  let product: IProduct | undefined
  try {
    const dbProducts = await getCollection<IProduct>('products', [
      where('slug', '==', slug),
      limit(1)
    ])
    if (dbProducts && dbProducts.length > 0) {
      product = dbProducts[0]
    }
  } catch (e) {
    // ignore
  }

  // Fallback to local data
  if (!product) {
    product = PRODUCTS_DATA.find(p => p.slug === slug) as any
  }

  if (!product) {
    return { title: 'Product Not Found | Funtroo' }
  }

  return {
    title: `${product.name} | Buy Premium Adult Toys India`,
    description: `${product.description.slice(0, 150)}... 100% discreet delivery and plain packaging across India.`,
    keywords: [
      product.name,
      ...product.tags,
      'buy adult toys online India',
      'discreet delivery',
      'body-safe adult wellness'
    ],
    openGraph: {
      title: `${product.name} - Funtroo`,
      description: `${product.description.slice(0, 150)}...`,
      images: product.images ? [{ url: product.images[0] }] : [],
    }
  }
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
