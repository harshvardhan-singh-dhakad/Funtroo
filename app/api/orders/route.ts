import { NextRequest, NextResponse } from 'next/server'
import { getCollection, createDocument, getDocument, updateDocument, getCollectionCount, where, orderBy, limit } from '@/lib/firestore'
import { getTier, generateCardNumber } from '@/lib/loyalty'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IOrder } from '@/models/Order'
import { ICustomer } from '@/models/Customer'
import { QueryConstraint } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paymentMethod, razorpayOrderId, razorpayPaymentId, razorpaySignature, customerId } = body

    let finalPaymentStatus = 'pending'

    if (paymentMethod === 'razorpay') {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json({ error: 'Missing Razorpay payment details' }, { status: 400 })
      }

      const secret = process.env.RAZORPAY_KEY_SECRET!
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex')

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
      }
      
      finalPaymentStatus = 'paid'
    } else {
      finalPaymentStatus = 'pending'
    }

    const orderNumber = 'FT' + Date.now().toString().slice(-8)
    const orderData: any = {
      ...body,
      orderNumber,
      paymentStatus: finalPaymentStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const orderId = await createDocument('orders', orderData)

    // Update customer loyalty card
    if (customerId && body.total) {
      const customer = await getDocument<ICustomer>('customers', customerId)
      if (customer) {
        const newSpend = (customer.card.totalSpend || 0) + body.total
        const newTier  = getTier(newSpend)
        const discMap: Record<string, number> = { silver: 5, gold: 10, platinum: 15 }
        
        const updatedCard = {
          ...customer.card,
          totalSpend: newSpend,
          tier: newTier,
          discountPct: discMap[newTier],
          number: customer.card.number || generateCardNumber()
        }
        
        await updateDocument('customers', customerId, { card: updatedCard })
      }
    }

    return NextResponse.json({ order: { id: orderId, ...orderData } }, { status: 201 })
  } catch (e: any) {
    console.error('Order creation error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page       = parseInt(searchParams.get('page')     || '1')
    const pageSize   = parseInt(searchParams.get('limit')    || '20')
    const status     = searchParams.get('status')    || ''
    const customerId = searchParams.get('customer')  || ''

    const constraints: QueryConstraint[] = []
    if (status) constraints.push(where('status', '==', status))
    if (customerId) constraints.push(where('customerId', '==', customerId))
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(pageSize * page))

    const [orders, total] = await Promise.all([
      getCollection<IOrder>('orders', constraints),
      getCollectionCount('orders', constraints.filter(c => c.type !== 'limit' && c.type !== 'orderBy'))
    ])

    const paginatedOrders = orders.slice((page - 1) * pageSize, page * pageSize)

    return NextResponse.json({ 
      orders: paginatedOrders, 
      total, 
      page, 
      pages: Math.ceil(total / pageSize) 
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
