'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, Search, X } from 'lucide-react'

const CATEGORIES = [
  { label: 'All',        value: '' },
  { label: 'For Her',    value: 'for-her' },
  { label: 'For Him',    value: 'for-him' },
  { label: 'Couples',    value: 'couples' },
  { label: 'Lubricants', value: 'lubricants' },
  { label: 'Lingerie',   value: 'lingerie' },
  { label: 'Accessories',value: 'accessories' },
]
const SORTS = [
  { label: 'Newest',       value: 'createdAt'  },
  { label: 'Popular',      value: 'popular'    },
  { label: 'Price: Low',   value: 'price_asc'  },
  { label: 'Price: High',  value: 'price_desc' },
  { label: 'Top Rated',    value: 'rating'     },
]

function ShopContent() {
  const sp     = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<any[]>([])
  const [total,    setTotal]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [page,     setPage]     = useState(1)

  const category = sp.get('category') || ''
  const sort     = sp.get('sort')     || 'createdAt'
  const q        = sp.get('q')        || ''
  const [search, setSearch] = useState(q)

  function setParam(key: string, val: string) {
    const p = new URLSearchParams(sp.toString())
    val ? p.set(key, val) : p.delete(key)
    p.delete('page')
    router.push(`/shop?${p}`)
    setPage(1)
  }

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '12', sort })
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setTotal(d.total || 0); setLoading(false) })
  }, [category, sort, q, page])

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl text-f-dark">
              {category ? CATEGORIES.find(c => c.value === category)?.label : 'All Products'}
            </h1>
            <p className="text-f-gray text-sm">{total} products</p>
          </div>
          {/* Search */}
          <form onSubmit={e => { e.preventDefault(); setParam('q', search) }} className="hidden md:flex items-center gap-2 bg-white border border-f-border rounded-xl px-3 py-2">
            <Search size={14} className="text-f-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              className="text-sm outline-none w-40 placeholder:text-f-muted text-f-dark" />
            {search && <button type="button" onClick={() => { setSearch(''); setParam('q', '') }}><X size={12} className="text-f-muted" /></button>}
          </form>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden md:block w-48 shrink-0">
            <div className="bg-white border border-f-border rounded-2xl p-4 sticky top-20">
              <p className="text-xs font-semibold text-f-dark tracking-wider uppercase mb-3 flex items-center gap-2">
                <SlidersHorizontal size={12} /> Filters
              </p>

              <p className="text-[10px] text-f-muted uppercase tracking-wider mb-2 mt-4">Category</p>
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setParam('category', c.value)}
                  className={`block w-full text-left text-xs py-2 px-2.5 rounded-lg mb-1 transition ${category === c.value ? 'bg-f-light text-f-purple font-medium' : 'text-f-gray hover:bg-f-soft'}`}>
                  {c.label}
                </button>
              ))}

              <p className="text-[10px] text-f-muted uppercase tracking-wider mb-2 mt-4">Sort By</p>
              {SORTS.map(s => (
                <button key={s.value} onClick={() => setParam('sort', s.value)}
                  className={`block w-full text-left text-xs py-2 px-2.5 rounded-lg mb-1 transition ${sort === s.value ? 'bg-f-light text-f-purple font-medium' : 'text-f-gray hover:bg-f-soft'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {/* Mobile filters */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
              {CATEGORIES.map(c => (
                <button key={c.value} onClick={() => setParam('category', c.value)}
                  className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition ${category === c.value ? 'bg-f-purple text-white border-f-purple' : 'border-f-border text-f-gray bg-white'}`}>
                  {c.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => <div key={i} className="bg-f-border/30 rounded-2xl h-64 animate-pulse" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-f-gray">No products found. Try a different filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                  className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">← Prev</button>
                <span className="px-4 py-2 text-sm text-f-gray">{page} / {Math.ceil(total/12)}</span>
                <button onClick={() => setPage(p => p+1)} disabled={page >= Math.ceil(total/12)}
                  className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">Next →</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ShopPage() {
  return <Suspense fallback={<div className="min-h-screen bg-f-soft" />}><ShopContent /></Suspense>
}

