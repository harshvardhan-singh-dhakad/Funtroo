import { NextRequest, NextResponse } from 'next/server'
import { getCollection, createDocument, getCollectionCount, where, orderBy, limit } from '@/lib/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IProduct } from '@/models/Product'
import { QueryConstraint } from 'firebase/firestore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category  = searchParams.get('category') || ''
    const featured  = searchParams.get('featured') === 'true'
    const page      = parseInt(searchParams.get('page') || '1')
    const pageSize  = parseInt(searchParams.get('limit') || '12')
    const sortKey   = searchParams.get('sort') || 'createdAt'
    const adminMode = searchParams.get('admin') === 'true'
    
    if (adminMode) {
      const session = await getServerSession(authOptions)
      if (!session || (session.user as any)?.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

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

    // Sort mapping
    if (sortKey === 'price_asc') constraints.push(orderBy('price', 'asc'))
    else if (sortKey === 'price_desc') constraints.push(orderBy('price', 'desc'))
    else if (sortKey === 'popular') constraints.push(orderBy('soldCount', 'desc'))
    else if (sortKey === 'rating') constraints.push(orderBy('rating', 'desc'))
    else constraints.push(orderBy('createdAt', 'desc'))

    // Firestore pagination is slightly different (requires startAfter for true cursors)
    // For simplicity with offset-like behavior in small datasets, we fetch up to limit
    // but in a real production app we'd use startAfter.
    constraints.push(limit(pageSize * page)) 

    const [products, total] = await Promise.all([
      getCollection<IProduct>('products', constraints),
      getCollectionCount('products', constraints.filter(c => c.type !== 'limit' && c.type !== 'orderBy'))
    ])

    // Slice for local pagination since we're simulating offsets
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize)

    return NextResponse.json({ 
      products: paginatedProducts, 
      total, 
      page, 
      pages: Math.ceil(total / pageSize) 
    })
  } catch (e: any) {
    console.error('API Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()

    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }

    const productId = await createDocument('products', {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ product: { id: productId, ...body } }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
