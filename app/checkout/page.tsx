'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/lib/store'
import { TIERS, calcCardDiscount } from '@/lib/loyalty'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FuntrooCard from '@/components/FuntrooCard'
import { useRouter } from 'next/navigation'
import { Zap, Tag, Truck, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

declare global { interface Window { Razorpay: any } }

export default function CheckoutPage() {
  const { data: session } = useSession()
  const { items, subtotal, clearCart } = useCart()
  const router   = useRouter()
  const card     = (session?.user as any)?.card
  const tier     = card?.tier
  const discPct  = tier ? TIERS[tier as keyof typeof TIERS]?.discountPct : 0
  const cardDisc = tier ? calcCardDiscount(subtotal(), tier) : 0

  const [coupon,      setCoupon]      = useState('')
  const [couponDisc,  setCouponDisc]  = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponLoading, setCouponLoading] = useState(false)
  const [method,      setMethod]      = useState<'cod' | 'razorpay'>('cod')
  const [placing,     setPlacing]     = useState(false)

  const shipping = subtotal() - cardDisc - couponDisc >= 999 ? 0 : 60
  const total    = subtotal() - cardDisc - couponDisc + shipping

  const [addr, setAddr] = useState({ name: (session?.user as any)?.name || '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })

  const applyCoupon = async () => {
    setCouponLoading(true)
    const res  = await fetch('/api/coupons', { method: 'POST', body: JSON.stringify({ code: coupon, subtotal: subtotal() }), headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    setCouponLoading(false)
    if (data.valid) { setCouponDisc(data.discount); setCouponApplied(true); toast.success(`Coupon applied! ₹${data.discount} off`) }
    else toast.error(data.error || 'Invalid coupon')
  }

  const buildOrderPayload = (payStatus: string, rzpOrderId = '', rzpPaymentId = '') => ({
    customer: (session?.user as any)?.id,
    customerSnapshot: { name: addr.name, email: session?.user?.email, phone: addr.phone },
    items: items.map(i => ({ product: i.productId, name: i.name, image: i.image, price: i.price, qty: i.qty })),
    address: { line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, pincode: addr.pincode },
    subtotal: subtotal(), cardDiscount: cardDisc, couponDiscount: couponDisc, couponCode: coupon,
    shipping, total, paymentMethod: method, paymentStatus: payStatus,
    razorpayOrderId: rzpOrderId, razorpayPaymentId: rzpPaymentId, status: 'pending',
  })

  const placeOrder = async () => {
    if (!addr.line1 || !addr.city || !addr.pincode || !addr.phone) return toast.error('Please fill all address fields')
    if (items.length === 0) return toast.error('Cart is empty')
    setPlacing(true)

    if (method === 'cod') {
      const res  = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(buildOrderPayload('pending')), headers: { 'Content-Type': 'application/json' } })
      const data = await res.json()
      if (data.order) { clearCart(); router.push(`/order/${data.order.orderNumber}`) }
      else toast.error('Order failed. Try again.')
      setPlacing(false)
      return
    }

    // Razorpay
    const rzpRes  = await fetch('/api/razorpay', { method: 'POST', body: JSON.stringify({ amount: total }), headers: { 'Content-Type': 'application/json' } })
    const rzpData = await rzpRes.json()

    const script = document.createElement('script')
    script.src   = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)
    script.onload = () => {
      const rzp = new window.Razorpay({
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      rzpData.amount,
        currency:    'INR',
        order_id:    rzpData.orderId,
        name:        'Funtroo',
        description: 'Wellness Order',
        prefill:     { name: addr.name, contact: addr.phone, email: session?.user?.email },
        theme:       { color: '#8B2D52' },
        handler: async (response: any) => {
          const verify = await fetch('/api/razorpay', { method: 'PUT', body: JSON.stringify(response), headers: { 'Content-Type': 'application/json' } })
          const vData  = await verify.json()
          if (vData.valid) {
            const orderRes = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(buildOrderPayload('paid', rzpData.orderId, vData.paymentId)), headers: { 'Content-Type': 'application/json' } })
            const orderData = await orderRes.json()
            if (orderData.order) { clearCart(); router.push(`/order/${orderData.order.orderNumber}`) }
          } else toast.error('Payment verification failed')
          setPlacing(false)
        },
        modal: { ondismiss: () => setPlacing(false) },
      })
      rzp.open()
    }
  }

  const I = ({ label, value, bold = false }: any) => (
    <div className={`flex justify-between text-sm ${bold ? 'font-semibold text-f-dark' : 'text-f-gray'}`}>
      <span>{label}</span><span>₹{value.toLocaleString()}</span>
    </div>
  )

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-f-dark mb-8">Checkout</h1>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Left — address + payment */}
          <div className="md:col-span-3 space-y-6">

            {/* Address */}
            <div className="bg-white border border-f-border rounded-2xl p-6">
              <h2 className="font-medium text-f-dark mb-4">Delivery Address</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'name', label: 'Full Name', span: 1 },
                  { key: 'phone', label: 'Phone', span: 1 },
                  { key: 'line1', label: 'Address Line 1', span: 2 },
                  { key: 'line2', label: 'Address Line 2 (optional)', span: 2 },
                  { key: 'city', label: 'City', span: 1 },
                  { key: 'state', label: 'State', span: 1 },
                  { key: 'pincode', label: 'Pincode', span: 1 },
                ].map(f => (
                  <input key={f.key} placeholder={f.label}
                    value={(addr as any)[f.key]} onChange={e => setAddr(a => ({ ...a, [f.key]: e.target.value }))}
                    className={`${f.span === 2 ? 'col-span-2' : ''} border border-f-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-f-purple text-f-dark placeholder:text-f-muted`}
                  />
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-f-border rounded-2xl p-6">
              <h2 className="font-medium text-f-dark mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { id: 'cod',      label: 'Cash on Delivery',   icon: <Truck size={16} />,      sub: 'Pay when your order arrives' },
                  { id: 'razorpay', label: 'Pay Online (UPI/Card)', icon: <CreditCard size={16} />, sub: 'Razorpay — secure & instant' },
                ].map(m => (
                  <label key={m.id} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition ${method === m.id ? 'border-f-purple bg-f-soft' : 'border-f-border hover:border-f-muted'}`}>
                    <input type="radio" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id as any)} className="accent-f-purple" />
                    <div className="text-f-purple">{m.icon}</div>
                    <div>
                      <p className="text-sm font-medium text-f-dark">{m.label}</p>
                      <p className="text-xs text-f-muted">{m.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right — summary */}
          <div className="md:col-span-2 space-y-4">

            {/* Card benefit */}
            {card && <FuntrooCard card={card} name={(session?.user as any)?.name || ''} compact />}

            {/* Order summary */}
            <div className="bg-white border border-f-border rounded-2xl p-5 space-y-3">
              <h2 className="font-medium text-f-dark mb-1">Order Summary</h2>

              {items.map(i => (
                <div key={i.productId} className="flex justify-between text-xs text-f-gray">
                  <span className="truncate max-w-[180px]">{i.name} × {i.qty}</span>
                  <span>₹{(i.price * i.qty).toLocaleString()}</span>
                </div>
              ))}

              <div className="border-t border-f-border pt-3 space-y-2">
                <I label="Subtotal"       value={subtotal()} />
                {cardDisc > 0 && (
                  <div className="flex justify-between text-sm text-f-accent">
                    <span className="flex items-center gap-1"><Zap size={12} className="fill-f-accent" /> {tier} Card ({discPct}%)</span>
                    <span>−₹{cardDisc.toLocaleString()}</span>
                  </div>
                )}
                {couponDisc > 0 && (
                  <div className="flex justify-between text-sm text-f-green">
                    <span className="flex items-center gap-1"><Tag size={12} /> Coupon</span>
                    <span>−₹{couponDisc.toLocaleString()}</span>
                  </div>
                )}
                <I label={shipping === 0 ? 'Shipping (Free 🎉)' : 'Shipping'} value={shipping} />
                <div className="border-t border-f-border pt-2">
                  <I label="Total" value={total} bold />
                </div>
              </div>

              {/* Coupon */}
              {!couponApplied && (
                <div className="flex gap-2 pt-1">
                  <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code"
                    className="flex-1 border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple placeholder:text-f-muted text-f-dark" />
                  <button onClick={applyCoupon} disabled={couponLoading || !coupon}
                    className="px-4 py-2 bg-f-light text-f-purple text-sm rounded-xl hover:bg-f-border transition disabled:opacity-40">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponApplied && <p className="text-xs text-f-green">✓ Coupon applied — ₹{couponDisc} saved!</p>}

              <button onClick={placeOrder} disabled={placing}
                className="w-full py-3.5 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition disabled:opacity-60 mt-2">
                {placing ? 'Placing Order...' : method === 'cod' ? 'Place Order (COD)' : 'Pay ₹' + total.toLocaleString()}
              </button>

              <p className="text-[10px] text-f-muted text-center">🔒 Billed as "FT Commerce" · Plain brown box · Fully discreet</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
