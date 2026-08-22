import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_SqMXwSf8fj5kXS',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_fallback_secret',
  })
}

// POST /api/razorpay — create order
export async function POST(req: NextRequest) {
  try {
    const razorpay = getRazorpayInstance()
    const { amount, currency = 'INR', receipt } = await req.json()
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),
      currency,
      receipt:  receipt || 'FT' + Date.now(),
    })
    return NextResponse.json({ orderId: order.id, amount: order.amount })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

// PUT /api/razorpay — verify signature
export async function PUT(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
    const secret    = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_fallback_secret'
    const body      = razorpay_order_id + '|' + razorpay_payment_id
    const expected  = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return NextResponse.json({ valid: false, error: 'Invalid signature' }, { status: 400 })
    }
    return NextResponse.json({ valid: true, paymentId: razorpay_payment_id })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
