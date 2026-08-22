'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProductCard from '@/components/ProductCard'
import { SlidersHorizontal, Search, X, ArrowUpDown } from 'lucide-react'

const CATEGORIES = [
  { label: '✨ View All',  value: '' },
  { label: '💜 For Her',   value: 'for-her' },
  { label: '⚡ For Him',   value: 'for-him' },
  { label: '💑 Couples',   value: 'couples' },
  { label: '💧 Lubricants',value: 'lubricants' },
  { label: '👙 Lingerie',  value: 'lingerie' },
]

const SORTS = [
  { label: 'Newest',             value: 'createdAt'  },
  { label: 'Popular',            value: 'popular'    },
  { label: 'Price: Low to High', value: 'price_asc'  },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated',          value: 'rating'     },
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
      .catch(() => { setProducts([]); setLoading(false) })
  }, [category, sort, q, page])

  const currentCategoryLabel = CATEGORIES.find(c => c.value === category)?.label.replace(/^[^\w\s]+\s*/, '') || 'All Products'

  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-8 w-full">

        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-f-dark">
              {category ? currentCategoryLabel : 'All Products'}
            </h1>
            <p className="text-f-gray text-xs md:text-sm mt-0.5">{total} products available</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <form onSubmit={e => { e.preventDefault(); setParam('q', search) }} className="flex-1 sm:flex-initial flex items-center gap-2 bg-white border border-f-border rounded-xl px-3 py-2 shadow-sm">
              <Search size={14} className="text-f-muted shrink-0" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Search products..."
                className="text-xs md:text-sm outline-none w-full sm:w-44 placeholder:text-f-muted text-f-dark bg-transparent" 
              />
              {search && (
                <button type="button" onClick={() => { setSearch(''); setParam('q', '') }}>
                  <X size={13} className="text-f-muted" />
                </button>
              )}
            </form>

            {/* Mobile Sort Dropdown */}
            <div className="md:hidden relative shrink-0">
              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                className="appearance-none bg-white border border-f-border rounded-xl pl-3 pr-7 py-2 text-xs text-f-dark font-medium outline-none shadow-sm"
              >
                {SORTS.map(s => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-f-muted pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Category Scroll (View All first) */}
        <div className="md:hidden w-full mb-4">
          <div className="overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-2 py-1 -mx-3 px-3">
            {CATEGORIES.map(c => {
              const active = category === c.value
              return (
                <button 
                  key={c.value} 
                  onClick={() => setParam('category', c.value)}
                  className={`shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all duration-200 shadow-sm ${
                    active 
                      ? 'bg-f-purple text-white border border-f-purple shadow-f-purple/20' 
                      : 'border border-f-border text-f-gray bg-white hover:bg-f-light hover:text-f-purple'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Desktop Sidebar filters */}
          <aside className="hidden md:block w-48 shrink-0">
            <div className="bg-white border border-f-border rounded-2xl p-4 sticky top-20 shadow-sm">
              <p className="text-xs font-semibold text-f-dark tracking-wider uppercase mb-3 flex items-center gap-2">
                <SlidersHorizontal size={12} /> Filters
              </p>

              <p className="text-[10px] text-f-muted uppercase tracking-wider mb-2 mt-4 font-bold">Category</p>
              {CATEGORIES.map(c => (
                <button 
                  key={c.value} 
                  onClick={() => setParam('category', c.value)}
                  className={`block w-full text-left text-xs py-2 px-2.5 rounded-lg mb-1 transition ${
                    category === c.value 
                      ? 'bg-f-light text-f-purple font-semibold' 
                      : 'text-f-gray hover:bg-f-soft hover:text-f-dark'
                  }`}
                >
                  {c.label}
                </button>
              ))}

              <p className="text-[10px] text-f-muted uppercase tracking-wider mb-2 mt-4 font-bold">Sort By</p>
              {SORTS.map(s => (
                <button 
                  key={s.value} 
                  onClick={() => setParam('sort', s.value)}
                  className={`block w-full text-left text-xs py-2 px-2.5 rounded-lg mb-1 transition ${
                    sort === s.value 
                      ? 'bg-f-light text-f-purple font-semibold' 
                      : 'text-f-gray hover:bg-f-soft hover:text-f-dark'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-f-border/30 rounded-2xl h-64 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white border border-f-border rounded-2xl p-6">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-f-dark font-medium text-sm">No products found</p>
                <p className="text-f-muted text-xs mt-1">Try selecting another category or clear filters.</p>
                <button 
                  onClick={() => { router.push('/shop'); setPage(1) }} 
                  className="mt-4 px-4 py-2 bg-f-purple text-white text-xs rounded-xl hover:bg-f-mid transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {products.map((p: any) => (
                  <ProductCard key={p.id || p._id} product={p} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center items-center gap-2 mt-8 mb-4">
                <button 
                  onClick={() => setPage(p => Math.max(1, p-1))} 
                  disabled={page === 1}
                  className="px-3.5 py-1.5 text-xs md:text-sm border border-f-border rounded-xl bg-white disabled:opacity-40 hover:bg-f-light transition"
                >
                  ← Prev
                </button>
                <span className="px-3 py-1.5 text-xs md:text-sm text-f-gray font-medium">
                  {page} / {Math.ceil(total/12)}
                </span>
                <button 
                  onClick={() => setPage(p => p+1)} 
                  disabled={page >= Math.ceil(total/12)}
                  className="px-3.5 py-1.5 text-xs md:text-sm border border-f-border rounded-xl bg-white disabled:opacity-40 hover:bg-f-light transition"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-f-soft flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  )
}
