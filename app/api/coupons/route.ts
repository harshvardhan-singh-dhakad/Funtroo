export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getCollection, createDocument, updateDocument, where, limit, orderBy } from '@/lib/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ICoupon } from '@/models/Coupon'

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json()
    const coupons = await getCollection<ICoupon>('coupons', [
      where('code', '==', code.toUpperCase()),
      where('isActive', '==', true),
      limit(1)
    ])
    
    const coupon = coupons[0]

    if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 })
    if (coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    
    const expiresAt = coupon.expiresAt ? new Date(coupon.expiresAt) : null
    if (expiresAt && new Date() > expiresAt) return NextResponse.json({ error: 'Coupon expired' }, { status: 400 })
    if (subtotal < coupon.minOrder) return NextResponse.json({ error: `Min order ₹${coupon.minOrder} required` }, { status: 400 })

    const discount = coupon.type === 'percent'
      ? Math.min(Math.round(subtotal * coupon.value / 100), coupon.maxDiscount)
      : Math.min(coupon.value, coupon.maxDiscount)

    return NextResponse.json({ 
      valid: true, 
      discount, 
      coupon: { code: coupon.code, type: coupon.type, value: coupon.value } 
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'superadmin'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const coupons = await getCollection<ICoupon>('coupons', [orderBy('createdAt', 'desc')])
    return NextResponse.json({ coupons })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'superadmin'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()
    
    if (body.id) {
      const { id, ...data } = body
      await updateDocument('coupons', id, {
        ...data,
        updatedAt: new Date().toISOString()
      })
      return NextResponse.json({ success: true })
    } else {
      const couponId = await createDocument('coupons', {
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return NextResponse.json({ id: couponId })
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}


