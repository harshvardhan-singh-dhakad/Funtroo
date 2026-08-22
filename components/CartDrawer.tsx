'use client'
import { useCart } from '@/lib/store'
import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer() {
  const { items, isOpen, toggleCart, updateQty, removeItem, subtotal } = useCart()
  const FREE_SHIP = 999
  const remaining = Math.max(0, FREE_SHIP - subtotal())

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-f-dark flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2D2773]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-f-accent" />
            <span className="font-display text-xl text-f-light">Your Cart</span>
            <span className="text-xs text-f-muted bg-[#2D2773] px-2 py-0.5 rounded-full">{items.length}</span>
          </div>
          <button onClick={toggleCart}><X size={20} className="text-f-muted hover:text-f-light transition" /></button>
        </div>

        {/* Free shipping bar */}
        {remaining > 0 ? (
          <div className="px-5 py-3 bg-[#2D2773] text-xs text-f-muted">
            Add <span className="text-f-accent font-medium">₹{remaining}</span> more for free shipping 🚚
            <div className="mt-1.5 h-1 bg-[#4C1D95] rounded-full overflow-hidden">
              <div className="h-full bg-f-accent rounded-full transition-all" style={{ width: `${Math.min(100, (subtotal()/FREE_SHIP)*100)}%` }} />
            </div>
          </div>
        ) : (
          <div className="px-5 py-3 bg-[#2D2773] text-xs text-f-accent">🎉 You get free shipping!</div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={48} className="text-[#4C1D95]" />
              <p className="text-f-muted text-sm">Your cart is empty</p>
              <button onClick={toggleCart} className="text-f-accent text-sm underline underline-offset-2">Continue Shopping</button>
            </div>
          ) : items.map(item => (
            <div key={item.productId} className="flex gap-3 bg-[#2D2773] rounded-xl p-3">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg shrink-0" />
              ) : (
                <div className="w-16 h-16 bg-f-soft rounded-lg flex items-center justify-center shrink-0 text-2xl">🛍️</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-f-light font-medium leading-snug truncate">{item.name}</p>
                <p className="text-f-accent text-sm font-medium mt-1">₹{item.price.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.productId, item.qty - 1)} className="w-6 h-6 bg-[#4C1D95] rounded-md flex items-center justify-center hover:bg-f-purple transition">
                    <Minus size={10} className="text-f-light" />
                  </button>
                  <span className="text-sm text-f-light w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.productId, item.qty + 1)} className="w-6 h-6 bg-[#4C1D95] rounded-md flex items-center justify-center hover:bg-f-purple transition">
                    <Plus size={10} className="text-f-light" />
                  </button>
                  <button onClick={() => removeItem(item.productId)} className="ml-auto text-xs text-red-400 hover:text-red-300 transition">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-5 border-t border-[#2D2773] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-f-muted">Subtotal</span>
              <span className="text-lg font-medium text-f-light">₹{subtotal().toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-f-muted">Taxes, discounts &amp; shipping calculated at checkout</p>
            <Link href="/checkout" onClick={toggleCart}
              className="block w-full py-3 bg-f-purple text-white text-center rounded-xl text-sm font-medium tracking-wide hover:bg-f-mid transition">
              Proceed to Checkout →
            </Link>
            <button onClick={toggleCart} className="block w-full py-2 text-center text-xs text-f-muted hover:text-f-light transition">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}
