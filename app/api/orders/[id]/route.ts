import { NextRequest, NextResponse } from 'next/server'
import { getDocument, getCollection, updateDocument, where, limit } from '@/lib/firestore'
import { IOrder } from '@/models/Order'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    let order: IOrder | null = null
    
    // Try by ID first
    try {
      order = await getDocument<IOrder>('orders', params.id)
    } catch (e) {
      // If ID format is invalid, getDocument might throw
    }

    // Try by Order Number if not found
    if (!order) {
      const results = await getCollection<IOrder>('orders', [
        where('orderNumber', '==', params.id),
        limit(1)
      ])
      order = results[0] || null
    }

    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ order })
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
    await updateDocument('orders', params.id, {
      ...body,
      updatedAt: new Date().toISOString()
    })
    
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
