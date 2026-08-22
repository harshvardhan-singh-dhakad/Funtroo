'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/lib/store'
import { 
  ShoppingBag, 
  Search, 
  User, 
  Menu, 
  X, 
  BookOpen, 
  ChevronDown, 
  Sparkles, 
  Info,
  Home as HomeIcon,
  Layers,
  ArrowRight
} from 'lucide-react'
import { useState, Suspense, useRef } from 'react'
import CartDrawer from './CartDrawer'
import { usePathname, useSearchParams } from 'next/navigation'

const SHOP_SUBCATEGORIES = [
  { label: 'View All Products', href: '/shop',                   emoji: '✨', desc: 'Browse all curated wellness items' },
  { label: 'For Her',           href: '/shop?category=for-her',    emoji: '💜', desc: 'Vibrators, wellness & essentials' },
  { label: 'For Him',           href: '/shop?category=for-him',    emoji: '⚡', desc: 'Rings, masturbators & stamina' },
  { label: 'Couples',           href: '/shop?category=couples',    emoji: '💑', desc: 'Shared intimacy & games' },
  { label: 'Lubricants',        href: '/shop?category=lubricants', emoji: '💧', desc: 'Water-based & organic formulas' },
  { label: 'Lingerie',          href: '/shop?category=lingerie',   emoji: '👙', desc: 'Sensual apparel & robes' },
]

function NavbarContent() {
  const { data: session } = useSession()
  const { totalItems, toggleCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false)
  const [mobileShopExpand, setMobileShopExpand] = useState(true)
  const [q, setQ] = useState('')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setShopDropdownOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShopDropdownOpen(false)
    }, 150)
  }

  const isShopActive = pathname === '/shop'
  const isHomeActive = pathname === '/'
  const isAboutActive = pathname === '/about'
  const isBlogActive = pathname === '/blog' || pathname.startsWith('/blog/')

  return (
    <>
      <header className="sticky top-0 z-50 bg-f-dark shadow-xl border-b border-f-purple/10 w-full max-w-full overflow-visible">
        {/* Top announcement bar */}
        <div className="bg-f-purple text-white text-center text-[10px] md:text-[11px] py-1.5 px-2 tracking-[0.12em] font-medium uppercase truncate">
          🚚 Free shipping above ₹999 &nbsp;·&nbsp; 📦 100% Plain brown box &nbsp;·&nbsp; 💳 COD available
        </div>

        {/* Main Navbar */}
        <div className="flex items-center justify-between px-3 md:px-12 h-14 md:h-16 relative">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img src="/icon0.svg" alt="Funtroo" className="w-7 h-7 md:w-8 md:h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display text-2xl md:text-3xl text-f-light tracking-[0.2em]">
              FUN<span className="text-f-accent">troo</span>
            </span>
          </Link>

          {/* Desktop Navigation (4 Items: Home, Shop Now, About Us, Blogs) */}
          <nav className="hidden lg:flex gap-8 items-center">
            {/* 1. Home */}
            <Link 
              href="/" 
              className={`text-xs tracking-[0.15em] uppercase transition-all duration-200 py-1 px-2 rounded-md ${
                isHomeActive 
                  ? 'text-white font-bold border-b-2 border-f-accent' 
                  : 'text-f-light/70 hover:text-white'
              }`}
            >
              Home
            </Link>

            {/* 2. Shop Now (Dropdown with View All first, then categories) */}
            <div 
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link 
                href="/shop"
                className={`text-xs tracking-[0.15em] uppercase transition-all duration-200 py-2 px-2 rounded-md inline-flex items-center gap-1.5 ${
                  isShopActive 
                    ? 'text-white font-bold border-b-2 border-f-accent' 
                    : 'text-f-light/70 hover:text-white'
                }`}
              >
                <span>Shop Now</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-f-accent' : 'text-f-light/60'}`} />
              </Link>

              {/* Shop Subcategories Dropdown */}
              {shopDropdownOpen && (
                <div className="absolute left-0 top-full pt-2 w-72 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="bg-[#181222] border border-[#2D2235] rounded-2xl shadow-2xl p-3 overflow-hidden backdrop-blur-md">
                    <div className="px-3 py-1.5 mb-1 text-[10px] uppercase tracking-widest text-f-muted font-bold border-b border-[#2D2235]/60 flex items-center justify-between">
                      <span>Categories</span>
                      <span className="text-[9px] text-f-accent">All Products Ready</span>
                    </div>
                    <div className="space-y-1 py-1">
                      {SHOP_SUBCATEGORIES.map((sub, idx) => (
                        <Link 
                          key={sub.href} 
                          href={sub.href}
                          onClick={() => setShopDropdownOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition group ${
                            idx === 0 
                              ? 'bg-f-purple/30 text-white border border-f-purple/40 hover:bg-f-purple/50' 
                              : 'text-f-light/80 hover:text-white hover:bg-f-purple/40'
                          }`}
                        >
                          <span className="text-lg group-hover:scale-125 transition-transform">{sub.emoji}</span>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold ${idx === 0 ? 'text-f-accent' : 'text-f-light group-hover:text-white'}`}>{sub.label}</p>
                            <p className="text-[10px] text-f-muted/80 truncate">{sub.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. About Us */}
            <Link 
              href="/about" 
              className={`text-xs tracking-[0.15em] uppercase transition-all duration-200 py-1 px-2 rounded-md ${
                isAboutActive 
                  ? 'text-white font-bold border-b-2 border-f-accent' 
                  : 'text-f-light/70 hover:text-white'
              }`}
            >
              About Us
            </Link>

            {/* 4. Blog with Pink "NEW" badge on top */}
            <Link 
              href="/blog" 
              className="relative inline-flex items-center gap-1.5 py-1 px-2 group"
            >
              <span className="absolute -top-3.5 right-0 bg-[#BE185D] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full tracking-wider shadow-md shadow-pink-900/40 animate-pulse">
                NEW
              </span>
              <span className={`text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                isBlogActive 
                  ? 'text-white font-bold border-b-2 border-f-accent' 
                  : 'text-f-light/70 group-hover:text-white'
              }`}>
                Blogs
              </span>
            </Link>
          </nav>

          {/* Icons & Actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {searchOpen ? (
              <form onSubmit={e => { e.preventDefault(); window.location.href = `/shop?q=${q}` }} className="flex items-center gap-1.5">
                <input 
                  autoFocus 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search..."
                  className="bg-[#1B1525] text-f-light text-xs px-3 py-1.5 rounded-full border border-f-mid outline-none w-28 sm:w-36 md:w-44 placeholder:text-f-muted/50" 
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={16} className="text-f-light/60 hover:text-white transition" />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-1" title="Search">
                <Search size={18} className="text-f-light/70 hover:text-white transition" />
              </button>
            )}

            {session ? (
              <div className="relative group hidden md:block">
                <button className="p-1" title="Account">
                  <User size={18} className="text-f-light/70 hover:text-white transition" />
                </button>
                <div className="absolute right-0 top-10 bg-[#1B1525] border border-[#2D2235] rounded-2xl shadow-2xl w-56 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50 overflow-hidden">
                  <div className="px-5 py-4 bg-f-dark/50 border-b border-[#2D2235]">
                    <p className="text-[10px] text-f-muted uppercase tracking-widest font-bold">Signed in as</p>
                    <p className="text-sm text-f-light truncate font-medium">{session.user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link href="/account"            className="block px-5 py-2.5 text-sm text-f-light/80 hover:text-white hover:bg-f-purple/40 transition">My Account</Link>
                    <Link href="/account?tab=orders" className="block px-5 py-2.5 text-sm text-f-light/80 hover:text-white hover:bg-f-purple/40 transition">Orders</Link>
                    <Link href="/account?tab=card"   className="block px-5 py-2.5 text-sm text-f-light/80 hover:text-white hover:bg-f-purple/40 transition">My Loyalty Card</Link>
                    {(session.user as any)?.role === 'admin' && (
                      <Link href="/admin" className="block px-5 py-3 text-sm text-f-accent hover:text-white hover:bg-f-accent/20 transition border-t border-[#2D2235] font-medium">Admin Panel</Link>
                    )}
                    <button onClick={() => signOut()} className="block w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-[#2D2235]">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:block p-1" title="Sign In">
                <User size={18} className="text-f-light/70 hover:text-white transition" />
              </Link>
            )}

            <button onClick={toggleCart} className="relative p-1" title="Cart">
              <ShoppingBag size={18} className="text-f-light/70 hover:text-white transition" />
              {totalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-f-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-f-dark">
                  {totalItems()}
                </span>
              )}
            </button>

            <button className="lg:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)} title="Menu">
              {mobileOpen ? <X size={20} className="text-f-light" /> : <Menu size={20} className="text-f-light" />}
            </button>
          </div>
        </div>

        {/* Mobile Swipeable Quick Category Strip */}
        <div className="lg:hidden bg-[#120D1C] border-t border-f-border/50 px-2 py-1.5 overflow-x-auto no-scrollbar scroll-smooth flex items-center gap-1.5 whitespace-nowrap">
          <Link
            href="/"
            className={`shrink-0 text-[11px] tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-200 ${
              isHomeActive
                ? 'bg-f-accent text-white font-semibold shadow-sm'
                : 'text-f-light/70 bg-white/5 hover:text-white'
            }`}
          >
            Home
          </Link>
          {SHOP_SUBCATEGORIES.map((item, idx) => {
            const active = idx === 0 
              ? (isShopActive && !searchParams.get('category'))
              : (pathname === '/shop' && searchParams.get('category') === item.href.split('=')[1])
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 text-[11px] tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-200 ${
                  active
                    ? 'bg-f-accent text-white font-semibold shadow-sm'
                    : 'text-f-light/70 bg-white/5 hover:text-white'
                }`}
              >
                {item.emoji} {idx === 0 ? 'View All' : item.label}
              </Link>
            )
          })}
          <Link
            href="/about"
            className={`shrink-0 text-[11px] tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-200 ${
              isAboutActive
                ? 'bg-f-accent text-white font-semibold shadow-sm'
                : 'text-f-light/70 bg-white/5 hover:text-white'
            }`}
          >
            About
          </Link>
          <Link
            href="/blog"
            className={`shrink-0 text-[11px] tracking-wider uppercase px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
              isBlogActive
                ? 'bg-f-accent text-white font-semibold shadow-sm'
                : 'text-f-light/70 bg-white/5 hover:text-white'
            }`}
          >
            <span>Blog</span>
            <span className="bg-[#BE185D] text-white text-[8px] font-black px-1.5 py-0.2 rounded-full">NEW</span>
          </Link>
        </div>

        {/* Mobile Hamburger Drawer Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-[#1B1525] border-t border-[#2D2235] shadow-2xl animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto">
            <div className="px-6 py-6 flex flex-col gap-3">
              
              {/* 1. Home */}
              <Link 
                href="/" 
                onClick={() => setMobileOpen(false)} 
                className={`text-sm tracking-[0.1em] uppercase py-2.5 border-b border-[#2D2235]/50 flex items-center justify-between ${
                  isHomeActive ? 'text-f-accent font-bold' : 'text-f-light/80'
                }`}
              >
                <span className="flex items-center gap-2.5"><HomeIcon size={16} /> Home</span>
                <span className="text-xs opacity-50">→</span>
              </Link>

              {/* 2. Shop Now (Collapsible with View All first) */}
              <div className="border-b border-[#2D2235]/50 py-1">
                <div 
                  onClick={() => setMobileShopExpand(!mobileShopExpand)} 
                  className="flex items-center justify-between py-2 cursor-pointer text-sm tracking-[0.1em] uppercase text-f-light font-medium"
                >
                  <span className="flex items-center gap-2.5"><Layers size={16} /> Shop Now</span>
                  <ChevronDown size={16} className={`transition-transform ${mobileShopExpand ? 'rotate-180 text-f-accent' : 'text-f-muted'}`} />
                </div>

                {mobileShopExpand && (
                  <div className="pl-6 pb-2 pt-1 space-y-2">
                    {SHOP_SUBCATEGORIES.map((sub, idx) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileOpen(false)}
                        className={`block text-xs uppercase tracking-wider py-1.5 transition ${
                          idx === 0 
                            ? 'text-f-accent font-bold' 
                            : 'text-f-light/70 hover:text-white'
                        }`}
                      >
                        {sub.emoji} {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. About Us */}
              <Link 
                href="/about" 
                onClick={() => setMobileOpen(false)} 
                className={`text-sm tracking-[0.1em] uppercase py-2.5 border-b border-[#2D2235]/50 flex items-center justify-between ${
                  isAboutActive ? 'text-f-accent font-bold' : 'text-f-light/80'
                }`}
              >
                <span className="flex items-center gap-2.5"><Info size={16} /> About Us</span>
                <span className="text-xs opacity-50">→</span>
              </Link>

              {/* 4. Blog (with Pink NEW badge) */}
              <Link 
                href="/blog" 
                onClick={() => setMobileOpen(false)} 
                className={`text-sm tracking-[0.1em] uppercase py-2.5 border-b border-[#2D2235]/50 flex items-center justify-between ${
                  isBlogActive ? 'text-f-accent font-bold' : 'text-f-light/80'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen size={16} /> Blogs
                  <span className="bg-[#BE185D] text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow">NEW</span>
                </span>
                <span className="text-xs opacity-50">→</span>
              </Link>

              {/* User Account / Auth Section */}
              <div className="mt-3 pt-3 border-t border-[#2D2235] flex flex-col gap-3">
                {session ? (
                  <>
                    <div className="text-xs text-f-muted">Signed in as: <strong className="text-f-light">{session.user?.email}</strong></div>
                    <Link href="/account" onClick={() => setMobileOpen(false)} className="text-sm text-f-light/80 py-1">My Account &amp; Orders</Link>
                    <Link href="/account?tab=card" onClick={() => setMobileOpen(false)} className="text-sm text-f-light/80 py-1">My Loyalty Card</Link>
                    {(session.user as any)?.role === 'admin' && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="text-sm text-f-accent py-1 font-bold">Admin Dashboard</Link>
                    )}
                    <button onClick={() => signOut()} className="text-left text-sm text-red-400 py-1">Sign Out</button>
                  </>
                ) : (
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="w-full py-3 bg-f-accent text-white rounded-xl text-center text-sm font-bold shadow-lg">
                    Sign In / Register
                  </Link>
                )}
              </div>

            </div>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-f-dark shadow-xl border-b border-f-purple/10 w-full max-w-full">
        <div className="bg-f-purple text-white text-center text-[10px] md:text-[11px] py-1.5 px-2 tracking-[0.12em] font-medium uppercase">
          🚚 Free shipping above ₹999 &nbsp;·&nbsp; 📦 Plain brown box &nbsp;·&nbsp; 💳 COD available
        </div>
        <div className="flex items-center justify-between px-4 md:px-12 h-14 md:h-16">
          <div className="flex items-center gap-2 shrink-0">
            <span className="font-display text-2xl md:text-3xl text-f-light tracking-[0.2em]">FUN<span className="text-f-accent">troo</span></span>
          </div>
        </div>
      </header>
    }>
      <NavbarContent />
    </Suspense>
  )
}
