import { NextRequest, NextResponse } from 'next/server'
import { getDocument, getCollection, updateDocument, where, limit } from '@/lib/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IProduct } from '@/models/Product'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Try by ID first
    let product = await getDocument<IProduct>('products', params.id)
    
    // If not found, try by slug
    if (!product) {
      const results = await getCollection<IProduct>('products', [
        where('slug', '==', params.id),
        limit(1)
      ])
      product = results[0] || null
    }

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    await updateDocument('products', params.id, {
      ...body,
      updatedAt: new Date().toISOString()
    })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Soft delete by setting isActive to false
    await updateDocument('products', params.id, { isActive: false })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
