'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductSuggestions from '@/components/ProductSuggestions'
import FuntrooCard from '@/components/FuntrooCard'
import { useCart, useHistory } from '@/lib/store'
import { useSession } from 'next-auth/react'
import { TIERS } from '@/lib/loyalty'
import { ShoppingBag, Shield, Package, Truck, Zap, Star, Check, Heart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductPage() {
  const { slug }   = useParams<{ slug: string }>()
  const [p, setP]  = useState<any>(null)
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { addViewed } = useHistory()
  const { data: session } = useSession()
  const card    = (session?.user as any)?.card
  const tier    = card?.tier
  const discPct = tier ? TIERS[tier as keyof typeof TIERS]?.discountPct : 0
  const cardPrice = (price: number) => tier ? Math.round(price * (1 - discPct / 100)) : price

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(r => r.json())
      .then(d => { setP(d.product); setLoading(false); if (d.product) addViewed(d.product.slug) })
  }, [slug])

  const handleAdd = () => {
    if (!p) return
    addItem({ productId: p.id, name: p.name, image: p.images?.[0] || '', price: cardPrice(p.price), qty, slug: p.slug })
    toast.success(`${qty} item${qty > 1 ? 's' : ''} added to cart!`)
  }

  if (loading) return <><Navbar /><div className="min-h-screen bg-f-soft animate-pulse" /><Footer /></>
  if (!p) return <><Navbar /><div className="min-h-screen flex items-center justify-center"><p className="text-f-gray">Product not found.</p></div><Footer /></>

  const discount = Math.round((1 - p.price / p.originalPrice) * 100)

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <p className="text-xs text-f-muted mb-6">
          <a href="/" className="hover:text-f-purple">Home</a> /
          <a href="/shop" className="hover:text-f-purple mx-1">Shop</a> /
          <a href={`/shop?category=${p.category}`} className="hover:text-f-purple mr-1 capitalize">{p.category.replace('-', ' ')}</a> /
          <span className="text-f-dark">{p.name}</span>
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          {/* Gallery */}
          <div className="bg-f-soft border border-f-border rounded-2xl flex items-center justify-center min-h-80 text-7xl text-f-accent/40 relative">
            🛍️
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-f-pink text-white text-xs font-bold px-3 py-1 rounded-full">{discount}% OFF</span>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-[11px] text-f-accent tracking-[2px] uppercase mb-2 capitalize">{p.category.replace('-', ' ')}</p>
            <h1 className="font-display text-3xl text-f-dark mb-2">{p.name}</h1>

            {p.reviewCount > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.round(p.rating) ? 'fill-f-accent text-f-accent' : 'text-f-border'} />
                  ))}
                </div>
                <span className="text-sm text-f-accent font-medium">{p.rating.toFixed(1)}</span>
                <span className="text-sm text-f-gray">({p.reviewCount} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-f-dark">₹{cardPrice(p.price).toLocaleString()}</span>
                {p.originalPrice > p.price && <span className="text-lg text-f-muted line-through">₹{p.originalPrice.toLocaleString()}</span>}
                {discount > 0 && <span className="text-sm text-f-green bg-f-greenBg px-2 py-0.5 rounded-full">{discount}% off</span>}
              </div>
              {tier && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-f-accent">
                  <Zap size={12} className="fill-f-accent" />
                  <span>{discPct}% {tier} card discount applied — you save ₹{(p.price - cardPrice(p.price)).toLocaleString()}</span>
                </div>
              )}
              {!tier && (
                <a href="/auth/register" className="flex items-center gap-1 mt-2 text-xs text-f-purple hover:underline">
                  <Zap size={12} /> Sign up for free card &amp; get 5% off instantly
                </a>
              )}
            </div>

            <p className="text-sm text-f-gray leading-relaxed mb-6">{p.description}</p>

            {/* Features */}
            {p.features?.length > 0 && (
              <ul className="space-y-2 mb-6">
                {p.features.map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-f-gray">
                    <Check size={14} className="text-f-green shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Qty + Add */}
            {p.stock > 0 ? (
              <div className="flex gap-3 mb-6">
                <div className="flex items-center border border-f-border rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q-1))} className="px-3 py-3 hover:bg-f-light transition text-f-dark">−</button>
                  <span className="px-4 text-sm text-f-dark">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(p.stock, q+1))} className="px-3 py-3 hover:bg-f-light transition text-f-dark">+</button>
                </div>
                <button onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
                  <ShoppingBag size={16} /> Add to Cart
                </button>
                <button className="p-3 border border-f-border rounded-xl hover:bg-f-light transition">
                  <Heart size={18} className="text-f-muted" />
                </button>
              </div>
            ) : (
              <div className="py-3 bg-f-grayBg border border-f-border rounded-xl text-center text-sm text-f-gray mb-6">Out of Stock</div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: <Package size={13} />, t: 'Plain Brown Box', s: 'No brand name outside' },
                { icon: <Shield  size={13} />, t: 'Discreet Billing', s: 'Shows FT Commerce' },
                { icon: <Truck   size={13} />, t: '3–5 Day Delivery', s: 'COD available' },
                { icon: <Check   size={13} />, t: 'Body-Safe Certified', s: 'Tested & verified' },
              ].map(b => (
                <div key={b.t} className="flex items-start gap-2 bg-f-soft border border-f-border rounded-xl p-3">
                  <div className="text-f-purple mt-0.5">{b.icon}</div>
                  <div><p className="text-[11px] font-medium text-f-dark">{b.t}</p><p className="text-[10px] text-f-muted">{b.s}</p></div>
                </div>
              ))}
            </div>

            {/* Card upsell */}
            {tier && (
              <div className="mt-4">
                <FuntrooCard card={card} name={(session?.user as any)?.name || ''} compact />
              </div>
            )}
          </div>
        </div>

        {/* Suggestions */}
        <ProductSuggestions category={p.category} exclude={p.slug} tags={p.tags || []} />

      </main>
      <Footer />
    </>
  )
}
