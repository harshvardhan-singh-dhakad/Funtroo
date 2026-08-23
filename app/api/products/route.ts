export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getCollection, getCollectionCount, where, orderBy, limit } from '@/lib/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IProduct } from '@/models/Product'
import { QueryConstraint } from 'firebase/firestore'
import { PRODUCTS_DATA, ProductData } from '@/lib/products-data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category  = searchParams.get('category') || ''
    const featured  = searchParams.get('featured') === 'true'
    const q         = (searchParams.get('q') || '').toLowerCase().trim()
    const page      = parseInt(searchParams.get('page') || '1')
    const pageSize  = parseInt(searchParams.get('limit') || '12')
    const sortKey   = searchParams.get('sort') || 'createdAt'
    const adminMode = searchParams.get('admin') === 'true'
    
    if (adminMode) {
      const session = await getServerSession(authOptions)
      if (!session || !['admin', 'superadmin'].includes((session.user as any)?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    let products: any[] = []
    let total = 0

    // Try fetching from Firestore first
    try {
      const constraints: QueryConstraint[] = []
      if (!adminMode) {
        constraints.push(where('isActive', '==', true))
      }
      if (category) {
        constraints.push(where('category', '==', category))
      }
      if (featured) {
        constraints.push(where('isFeatured', '==', true))
      }

      if (sortKey === 'price_asc') constraints.push(orderBy('price', 'asc'))
      else if (sortKey === 'price_desc') constraints.push(orderBy('price', 'desc'))
      else if (sortKey === 'popular') constraints.push(orderBy('soldCount', 'desc'))
      else if (sortKey === 'rating') constraints.push(orderBy('rating', 'desc'))

      constraints.push(limit(pageSize * page))

      const [dbProducts, dbTotal] = await Promise.all([
        getCollection<IProduct>('products', constraints),
        getCollectionCount('products', constraints.filter(c => c.type !== 'limit' && c.type !== 'orderBy'))
      ])

      products = dbProducts
      total = dbTotal
    } catch (e) {
      // Fallback to PRODUCTS_DATA if Firestore is offline / uninitialized
      products = []
    }

    // Fallback to local static PRODUCTS_DATA if Firestore is empty or unavailable
    if (!products || products.length === 0) {
      let filtered = [...PRODUCTS_DATA]

      if (category) {
        filtered = filtered.filter(p => p.category === category)
      }
      if (featured) {
        filtered = filtered.filter(p => p.isFeatured)
      }
      if (q) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        )
      }

      // Sort
      if (sortKey === 'price_asc') filtered.sort((a, b) => a.price - b.price)
      else if (sortKey === 'price_desc') filtered.sort((a, b) => b.price - a.price)
      else if (sortKey === 'popular') filtered.sort((a, b) => b.soldCount - a.soldCount)
      else if (sortKey === 'rating') filtered.sort((a, b) => b.rating - a.rating)

      total = filtered.length
      products = filtered.slice((page - 1) * pageSize, page * pageSize)
    } else {
      // Client search filter if q is present
      if (q) {
        products = products.filter(p => 
          p.name.toLowerCase().includes(q) || 
          (p.description && p.description.toLowerCase().includes(q))
        )
        total = products.length
      }
      products = products.slice((page - 1) * pageSize, page * pageSize)
    }

    return NextResponse.json({ 
      products, 
      total, 
      page, 
      pages: Math.ceil(total / pageSize) 
    })
  } catch (e: any) {
    console.error('API Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}


