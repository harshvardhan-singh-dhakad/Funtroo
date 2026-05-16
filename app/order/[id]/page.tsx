'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { CheckCircle, Package, Truck, MapPin, Clock, Zap } from 'lucide-react'
import ProductSuggestions from '@/components/ProductSuggestions'

const STATUS_STEPS = ['pending','confirmed','processing','shipped','delivered']

export default function OrderConfirmPage() {
  const { id }       = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/orders/${id}`).then(r => r.json()).then(d => { setOrder(d.order); setLoading(false) })
  }, [id])

  if (loading) return <><Navbar /><div className="min-h-screen bg-f-soft flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full" /></div><Footer /></>
  if (!order)  return <><Navbar /><div className="min-h-screen flex items-center justify-center"><p className="text-f-gray">Order not found.</p></div><Footer /></>

  const stepIdx  = STATUS_STEPS.indexOf(order.status)
  const firstCat = order.items?.[0]?.product?.category || 'for-her'

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">

        {/* Success header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-f-greenBg rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-f-green" />
          </div>
          <h1 className="font-display text-3xl text-f-dark mb-2">Order Placed!</h1>
          <p className="text-f-gray text-sm">Thank you for shopping with Funtroo. Your order is confirmed.</p>
          <p className="text-f-purple font-mono font-semibold mt-2">#{order.orderNumber}</p>
        </div>

        {/* Discreet shipping note */}
        <div className="bg-f-dark rounded-2xl p-4 mb-6 flex gap-3 items-start">
          <Package size={18} className="text-f-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-f-light">100% Discreet Delivery</p>
            <p className="text-xs text-f-muted mt-1">Your order will arrive in a plain brown box with no brand name. Billing statement will show <strong className="text-f-muted">FT Commerce</strong>.</p>
          </div>
        </div>

        {/* Tracking steps */}
        <div className="bg-white border border-f-border rounded-2xl p-5 mb-6">
          <h2 className="font-medium text-f-dark text-sm mb-5">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-f-border" />
            <div className="absolute top-4 left-0 h-0.5 bg-f-purple transition-all" style={{ width: `${stepIdx === -1 ? 0 : (stepIdx / (STATUS_STEPS.length - 1)) * 100}%` }} />
            {STATUS_STEPS.map((s, i) => {
              const done    = i <= stepIdx
              const current = i === stepIdx
              return (
                <div key={s} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all
                    ${done ? 'bg-f-purple border-f-purple text-white' : 'bg-white border-f-border text-f-muted'}
                    ${current ? 'ring-4 ring-f-purple/20' : ''}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <p className={`text-[10px] mt-2 capitalize font-medium ${done ? 'text-f-purple' : 'text-f-muted'}`}>{s}</p>
                </div>
              )
            })}
          </div>
          {order.trackingNumber && (
            <div className="mt-4 pt-4 border-t border-f-soft flex items-center gap-2">
              <Truck size={14} className="text-f-purple" />
              <span className="text-xs text-f-gray">Tracking: </span>
              <span className="text-xs font-mono font-medium text-f-dark">{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="bg-white border border-f-border rounded-2xl p-5 mb-6">
          <h2 className="font-medium text-f-dark text-sm mb-4">Order Summary</h2>

          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-f-soft last:border-0">
              <div>
                <p className="text-xs font-medium text-f-dark">{item.name}</p>
                <p className="text-[11px] text-f-muted">Qty: {item.qty}</p>
              </div>
              <p className="text-xs font-semibold text-f-dark">₹{(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}

          <div className="pt-3 space-y-1.5 border-t border-f-soft mt-2">
            {[
              { l: 'Subtotal',         v: `₹${order.subtotal?.toLocaleString()}` },
              ...(order.cardDiscount > 0   ? [{ l: `Card Discount`, v: `−₹${order.cardDiscount?.toLocaleString()}` }] : []),
              ...(order.couponDiscount > 0 ? [{ l: 'Coupon Discount', v: `−₹${order.couponDiscount?.toLocaleString()}` }] : []),
              { l: order.shipping === 0 ? 'Shipping (Free 🎉)' : 'Shipping', v: order.shipping === 0 ? '₹0' : `₹${order.shipping}` },
            ].map(r => (
              <div key={r.l} className="flex justify-between">
                <span className="text-xs text-f-gray">{r.l}</span>
                <span className={`text-xs ${r.l.includes('Discount') ? 'text-f-green' : 'text-f-dark'}`}>{r.v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-f-soft">
              <span className="text-sm font-semibold text-f-dark">Total</span>
              <span className="text-sm font-semibold text-f-dark">₹{order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white border border-f-border rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-f-purple" />
            <h2 className="font-medium text-f-dark text-sm">Delivery Address</h2>
          </div>
          <p className="text-xs text-f-gray leading-relaxed">
            <strong className="text-f-dark">{order.customerSnapshot?.name}</strong><br />
            {order.address?.line1}{order.address?.line2 ? ', ' + order.address.line2 : ''}<br />
            {order.address?.city}, {order.address?.state} — {order.address?.pincode}<br />
            📱 {order.customerSnapshot?.phone}
          </p>
        </div>

        {/* Payment */}
        <div className="bg-white border border-f-border rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-f-purple" />
            <h2 className="font-medium text-f-dark text-sm">Payment</h2>
          </div>
          <p className="text-xs text-f-gray mt-2">
            Method: <strong className="text-f-dark capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</strong>
            <br />Status: <strong className={`capitalize ${order.paymentStatus === 'paid' ? 'text-f-green' : 'text-orange-500'}`}>{order.paymentStatus}</strong>
          </p>
          {order.cardDiscount > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-f-accent">
              <Zap size={11} className="fill-f-accent" /> Funtroo card discount applied — you saved ₹{order.cardDiscount?.toLocaleString()}!
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-12">
          <Link href="/shop" className="flex-1 py-3 bg-f-purple text-white text-center rounded-xl text-sm font-medium hover:bg-f-mid transition">
            Continue Shopping
          </Link>
          <Link href="/account?tab=orders" className="flex-1 py-3 border border-f-border text-f-gray text-center rounded-xl text-sm hover:bg-f-soft transition">
            View All Orders
          </Link>
        </div>

        {/* Suggestions */}
        <ProductSuggestions category={firstCat} exclude="" title="You Might Also Love" />

      </main>
      <Footer />
    </>
  )
}
