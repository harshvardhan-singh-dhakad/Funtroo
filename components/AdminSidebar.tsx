'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Settings, LogOut, Zap, BookOpen, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

const NAV = [
  { label: 'Dashboard',  href: '/admin',              icon: <LayoutDashboard size={20} />, req: 'all' },
  { label: 'Products',   href: '/admin/products',     icon: <Package size={20} />, req: 'products' },
  { label: 'Orders',     href: '/admin/orders',       icon: <ShoppingBag size={20} />, req: 'orders' },
  { label: 'Customers',  href: '/admin/customers',    icon: <Users size={20} />, req: 'all' },
  { label: 'Blog Posts', href: '/admin/blogs',        icon: <BookOpen size={20} />, req: 'blogs' },
  { label: 'Coupons',    href: '/admin/discounts',    icon: <Tag size={20} />, req: 'products' },
  { label: 'Staff Roles',href: '/admin/staff',        icon: <Users size={20} />, req: 'staff' },
]

export default function AdminSidebar({ collapsed, isDark, onToggleTheme, onToggleSidebar }: any) {
  const path = usePathname()
  const { data: session } = useSession()
  
  const userRole = (session?.user as any)?.role
  const perms = (session?.user as any)?.permissions || []
  
  const filteredNav = NAV.filter(n => {
    if (userRole === 'superadmin') return true
    if (n.req === 'all') return true
    return perms.includes(n.req)
  })

  return (
    <aside className={`bg-f-dark flex flex-col shrink-0 sticky top-0 h-screen transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className={`flex items-center justify-between px-5 py-6 border-b border-[#2D2773] ${collapsed ? 'justify-center px-0' : ''}`}>
        {!collapsed && (
          <div>
            <p className="font-display text-2xl text-f-light tracking-widest">FUN<span className="text-f-accent">troo</span></p>
            <div className="flex items-center gap-1 mt-1">
              <Zap size={10} className="text-f-accent fill-f-accent" />
              <p className="text-[10px] text-f-muted tracking-wider">ADMIN PANEL</p>
            </div>
          </div>
        )}
        {collapsed && <p className="font-display text-2xl text-f-light">F</p>}
        <button onClick={onToggleSidebar} className="text-f-muted hover:text-white transition hidden md:block">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {filteredNav.map(n => {
          const active = n.href === '/admin' ? path === '/admin' : path.startsWith(n.href)
          return (
            <Link key={n.href} href={n.href} title={collapsed ? n.label : undefined}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition ${collapsed ? 'justify-center' : ''} ${active ? 'bg-f-purple text-white shadow-lg' : 'text-f-muted hover:text-f-light hover:bg-[#2D2773]'}`}>
              {n.icon} 
              {!collapsed && <span>{n.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[#2D2773] space-y-2">
        <button onClick={onToggleTheme} title="Toggle Theme" className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm w-full transition ${collapsed ? 'justify-center' : ''} ${isDark ? 'text-yellow-400 bg-[#2D2773]/50' : 'text-f-muted hover:text-f-light hover:bg-[#2D2773]'}`}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <Link href="/" title="Store Front" className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-f-muted hover:text-f-light transition ${collapsed ? 'justify-center' : ''}`}>
          <Settings size={20} /> {!collapsed && 'View Store'}
        </Link>
        <button onClick={() => signOut()} title="Sign Out" className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-red-400 hover:text-red-300 w-full transition ${collapsed ? 'justify-center' : ''}`}>
          <LogOut size={20} /> {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
