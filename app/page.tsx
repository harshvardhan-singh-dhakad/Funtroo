import { Zap, Shield, Package, Truck, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AgeGate from '@/components/AgeGate'
import ProductCard from '@/components/ProductCard'
import { getCollection, where, limit } from '@/lib/firestore'
import { IProduct } from '@/models/Product'
import { PRODUCTS_DATA } from '@/lib/products-data'
import { PAGE_FAQS } from '@/lib/faqs-data'
import FAQSection from '@/components/FAQSection'

const CATEGORIES = [
  { label: 'For Her',    slug: 'for-her',    emoji: '💜', count: '48+' },
  { label: 'For Him',    slug: 'for-him',    emoji: '⚡', count: '22+' },
  { label: 'Couples',    slug: 'couples',    emoji: '💑', count: '31+' },
  { label: 'Lubricants', slug: 'lubricants', emoji: '💧', count: '16+' },
  { label: 'Lingerie',   slug: 'lingerie',   emoji: '👙', count: '34+' },
  { label: 'New In',     slug: '',           emoji: '✨', count: 'Fresh' },
]

async function getFeatured() {
  try {
    const products = await getCollection<IProduct>('products', [
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      limit(8)
    ])
    if (products && products.length > 0) return products
  } catch (e) {
    console.error('Failed to fetch featured products', e)
  }
  return PRODUCTS_DATA.filter(p => p.isFeatured).slice(0, 8)
}

export default async function HomePage() {
  const featured = await getFeatured()

  return (
    <>
      <AgeGate />
      <Navbar />
      <main>

        {/* Hero */}
        <section className="bg-f-dark relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #C27A8E 0%, transparent 60%)' }} />
          <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center relative z-10">
            <div>
              <p className="text-[11px] text-f-accent tracking-[3px] uppercase mb-4">New Collection 2025</p>
              <h1 className="font-display text-5xl md:text-6xl text-f-light leading-[1.1] mb-5">
                Feel good,<br /><span className="text-f-accent italic">fearlessly.</span>
              </h1>
              <p className="text-f-muted text-sm leading-relaxed max-w-md mb-6">
                India's most trusted adult wellness store. Premium body-safe products delivered in a plain brown box — your privacy, always protected.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['📦 Plain Box', '💳 Discreet Billing', '🚚 COD Available', '🔒 100% Private'].map(b => (
                  <span key={b} className="text-[11px] text-f-muted bg-f-grayBg border border-f-border rounded-full px-3 py-1">{b}</span>
                ))}
              </div>
              <div className="flex gap-3">
                <Link href="/shop" className="px-6 py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition flex items-center gap-2">
                  Shop Now <ArrowRight size={14} />
                </Link>
                <Link href="/auth/register" className="px-6 py-3 bg-transparent text-f-muted border border-f-border rounded-xl text-sm hover:border-f-muted transition">
                  Get Your Free Card
                </Link>
              </div>
            </div>
            {/* Card preview */}
            <div className="hidden md:flex justify-center">
              <div className="card-platinum card-shine rounded-2xl p-6 w-72 text-white shadow-2xl">
                <div className="flex justify-between mb-6">
                  <div>
                    <p className="text-[9px] tracking-[3px] uppercase opacity-60">Funtroo</p>
                    <p className="font-display text-xl tracking-widest">Loyalty Card</p>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Star size={12} /> Silver
                  </div>
                </div>
                <p className="text-sm tracking-[3px] font-mono opacity-60 mb-6">FT-XXXX-XXXX-XXXX</p>
                <div className="flex justify-between">
                  <div><p className="text-[9px] uppercase opacity-50">Member</p><p className="text-sm">Your Name</p></div>
                  <div className="text-right"><p className="text-[9px] uppercase opacity-50">Discount</p>
                    <div className="flex items-center gap-1"><Zap size={14} className="fill-white" /><p className="text-xl font-bold">5%</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="bg-f-dark border-y border-f-grayBg">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around">
            {[
              { icon: <Package size={14} />,  t: 'Plain Packaging' },
              { icon: <Shield  size={14} />,  t: '100% Private'    },
              { icon: <Truck   size={14} />,  t: 'COD Pan India'   },
              { icon: <Zap     size={14} />,  t: 'Card Discounts'  },
            ].map(i => (
              <div key={i.t} className="flex items-center gap-2 text-f-mid text-xs">
                {i.icon} {i.t}
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty card banner */}
        <section className="bg-f-soft">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="bg-f-dark rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="text-[11px] text-f-accent tracking-[2px] uppercase mb-2">Exclusive Member Benefit</p>
                <h2 className="font-display text-3xl text-f-light mb-2">Get Your Funtroo Card</h2>
                <p className="text-f-muted text-sm leading-relaxed">
                  Sign up free and get a <strong className="text-f-accent">Silver Card (5% off)</strong> instantly.
                  Spend more, upgrade to <strong className="text-f-accent">Gold (10%)</strong> and{' '}
                  <strong className="text-f-accent">Platinum (15%)</strong> — auto applied at checkout, always.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link href="/auth/register" className="px-6 py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
                  Join Free →
                </Link>
                <Link href="/account?tab=card" className="px-6 py-3 border border-f-border text-f-muted rounded-xl text-sm hover:border-f-muted transition">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="font-display text-3xl text-f-dark mb-2">Shop by Category</h2>
          <p className="text-f-gray text-sm mb-8">Explore our curated wellness collection</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map(c => (
              <Link key={c.slug} href={`/shop?category=${c.slug}`}
                className="bg-white border border-f-border rounded-2xl p-4 text-center hover:border-f-purple hover:shadow-md transition group">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{c.emoji}</div>
                <p className="text-xs font-medium text-f-dark">{c.label}</p>
                <p className="text-[10px] text-f-muted mt-0.5">{c.count} items</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured products */}
        {featured.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl text-f-dark">Bestsellers</h2>
                <p className="text-f-gray text-sm">Our most loved products</p>
              </div>
              <Link href="/shop" className="text-sm text-f-purple hover:text-f-mid transition flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featured.map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {/* AI Optimized FAQ Section */}
        <section className="bg-white border-t border-f-border px-4 py-8">
          <FAQSection faqs={PAGE_FAQS.home} title="Frequently Asked Questions" />
        </section>

      </main>
      <Footer />
    </>
  )
}
