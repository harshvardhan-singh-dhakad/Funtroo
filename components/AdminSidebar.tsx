'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Settings, LogOut, Zap, BookOpen } from 'lucide-react'
import { signOut } from 'next-auth/react'

const NAV = [
  { label: 'Dashboard',  href: '/admin',              icon: <LayoutDashboard size={16} /> },
  { label: 'Products',   href: '/admin/products',     icon: <Package size={16} /> },
  { label: 'Orders',     href: '/admin/orders',       icon: <ShoppingBag size={16} /> },
  { label: 'Customers',  href: '/admin/customers',    icon: <Users size={16} /> },
  { label: 'Blog Posts', href: '/admin/blogs',        icon: <BookOpen size={16} /> },
  { label: 'Coupons',    href: '/admin/discounts',    icon: <Tag size={16} /> },
]

export default function AdminSidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 bg-f-dark flex flex-col shrink-0 sticky top-0 h-screen">
      <div className="px-5 py-6 border-b border-[#2D2773]">
        <p className="font-display text-xl text-f-light tracking-widest">FUN<span className="text-f-accent">troo</span></p>
        <div className="flex items-center gap-1 mt-1">
          <Zap size={10} className="text-f-accent fill-f-accent" />
          <p className="text-[10px] text-f-muted tracking-wider">ADMIN PANEL</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(n => {
          const active = n.href === '/admin' ? path === '/admin' : path.startsWith(n.href)
          return (
            <Link key={n.href} href={n.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${active ? 'bg-f-purple text-white' : 'text-f-muted hover:text-f-light hover:bg-[#2D2773]'}`}>
              {n.icon} {n.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#2D2773] space-y-1">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-f-muted hover:text-f-light transition">
          <Settings size={16} /> View Store
        </Link>
        <button onClick={() => signOut()} className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:text-red-300 w-full transition">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
