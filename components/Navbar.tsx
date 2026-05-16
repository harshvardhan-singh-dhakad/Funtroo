'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/lib/store'
import { ShoppingBag, Search, User, Menu, X, BookOpen } from 'lucide-react'
import { useState } from 'react'
import CartDrawer from './CartDrawer'

const SHOP_LINKS = [
  { label: 'For Her',    href: '/shop?category=for-her' },
  { label: 'For Him',    href: '/shop?category=for-him' },
  { label: 'Couples',    href: '/shop?category=couples' },
  { label: 'Lubricants', href: '/shop?category=lubricants' },
  { label: 'Lingerie',   href: '/shop?category=lingerie' },
  { label: 'New In',     href: '/shop?sort=createdAt' },
]

import { usePathname, useSearchParams } from 'next/navigation'

export default function Navbar() {
  const { data: session } = useSession()
  const { totalItems, toggleCart } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    if (href === '/blog') return pathname === '/blog'
    const url = new URL(href, 'http://localhost')
    const category = url.searchParams.get('category')
    return pathname === '/shop' && searchParams.get('category') === category
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-f-dark shadow-xl border-b border-f-purple/10">
        <div className="bg-f-purple text-white text-center text-[10px] md:text-[11px] py-1.5 tracking-[0.15em] font-medium uppercase">
          🚚 Free shipping above ₹999 &nbsp;·&nbsp; 📦 Plain brown box &nbsp;·&nbsp; 💳 COD available pan India
        </div>
        <div className="flex items-center justify-between px-4 md:px-12 h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <img src="/icon0.svg" alt="Funtroo" className="w-8 h-8 object-contain group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display text-2xl md:text-3xl text-f-light tracking-[0.2em]">
              FUN<span className="text-f-accent">troo</span>
            </span>
          </Link>
          <nav className="hidden lg:flex gap-7 items-center">
            {SHOP_LINKS.map(c => {
              const active = isActive(c.href)
              return (
                <Link key={c.href} href={c.href} 
                  className={`text-[11px] tracking-[0.2em] uppercase transition-all duration-300 py-1.5 px-3 rounded-md ${
                    active 
                    ? 'text-white border border-f-accent/50 bg-f-accent/10' 
                    : 'text-f-light/60 hover:text-white hover:bg-white/5'
                  }`}>
                  {c.label}
                </Link>
              )
            })}
            <Link href="/blog" 
              className={`text-[11px] tracking-[0.2em] uppercase transition-all duration-300 py-1.5 px-4 rounded-full flex items-center gap-2 ${
                isActive('/blog')
                ? 'text-white bg-f-accent'
                : 'text-f-accent border border-f-accent/30 hover:bg-f-accent hover:text-white'
              }`}>
              <BookOpen size={12} /> Blog
            </Link>
          </nav>
          <div className="flex items-center gap-5">
            {searchOpen ? (
              <form onSubmit={e => { e.preventDefault(); window.location.href = `/shop?q=${q}` }} className="flex items-center gap-2">
                <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
                  className="bg-[#1B1525] text-f-light text-xs px-3 py-1.5 rounded-full border border-f-mid outline-none w-32 md:w-40 placeholder:text-f-muted/50" />
                <button type="button" onClick={() => setSearchOpen(false)}><X size={16} className="text-f-light/60 hover:text-white transition" /></button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)}><Search size={19} className="text-f-light/70 hover:text-white transition" /></button>
            )}
            {session ? (
              <div className="relative group hidden md:block">
                <button><User size={19} className="text-f-light/70 hover:text-white transition" /></button>
                <div className="absolute right-0 top-10 bg-[#1B1525] border border-[#2D2235] rounded-2xl shadow-2xl w-56 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 z-50 overflow-hidden">
                  <div className="px-5 py-4 bg-f-dark/50 border-b border-[#2D2235]">
                    <p className="text-[10px] text-f-muted uppercase tracking-widest font-bold">Signed in as</p>
                    <p className="text-sm text-f-light truncate font-medium">{session.user?.email}</p>
                  </div>
                  <div className="py-2">
                    <Link href="/account"            className="block px-5 py-2.5 text-sm text-f-light/80 hover:text-white hover:bg-f-purple/40 transition">My Account</Link>
                    <Link href="/account?tab=orders" className="block px-5 py-2.5 text-sm text-f-light/80 hover:text-white hover:bg-f-purple/40 transition">Orders</Link>
                    <Link href="/account?tab=card"   className="block px-5 py-2.5 text-sm text-f-light/80 hover:text-white hover:bg-f-purple/40 transition">My Card</Link>
                    {(session.user as any)?.role === 'admin' && (
                      <Link href="/admin" className="block px-5 py-3 text-sm text-f-accent hover:text-white hover:bg-f-accent/20 transition border-t border-[#2D2235] font-medium">Admin Panel</Link>
                    )}
                    <button onClick={() => signOut()} className="block w-full text-left px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-[#2D2235]">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:block"><User size={19} className="text-f-light/70 hover:text-white transition" /></Link>
            )}
            <button onClick={toggleCart} className="relative">
              <ShoppingBag size={19} className="text-f-light/70 hover:text-white transition" />
              {totalItems() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-f-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-f-dark">{totalItems()}</span>
              )}
            </button>
            <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={22} className="text-f-light" /> : <Menu size={22} className="text-f-light" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden bg-[#1B1525] border-t border-[#2D2235] shadow-2xl animate-in slide-in-from-top duration-300">
            <div className="px-6 py-8 flex flex-col gap-5">
              {SHOP_LINKS.map(c => (
                <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)} 
                  className={`text-sm tracking-[0.1em] uppercase py-2 border-b border-[#2D2235]/50 ${
                    isActive(c.href) ? 'text-white font-bold' : 'text-f-light/70'
                  }`}>
                  {c.label}
                </Link>
              ))}
              <Link href="/blog" onClick={() => setMobileOpen(false)} 
                className={`text-sm tracking-[0.1em] uppercase py-2 flex items-center gap-2 ${
                  isActive('/blog') ? 'text-white font-bold' : 'text-f-accent'
                }`}>
                <BookOpen size={16} /> Blog
              </Link>
              <div className="mt-4 pt-6 border-t border-[#2D2235] flex flex-col gap-4">
                {session ? (
                  <>
                    <Link href="/account" onClick={() => setMobileOpen(false)} className="text-sm text-f-light/70 py-1">Account Settings</Link>
                    <button onClick={() => signOut()} className="text-left text-sm text-red-400 py-1">Logout Account</button>
                  </>
                ) : (
                  <Link href="/auth/login" className="w-full py-3 bg-f-accent text-white rounded-xl text-center text-sm font-bold shadow-lg">Login / Register</Link>
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
