'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(d => { setStats(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-f-border" />)}
      </div>
    </div>
  )

  const CARDS = [
    { label: 'Total Revenue',   value: `₹${(stats?.revenue?.total || 0).toLocaleString()}`, sub: `₹${(stats?.revenue?.thisMonth || 0).toLocaleString()} this month`, icon: <TrendingUp size={20} />, color: 'bg-f-purple text-white' },
    { label: 'Total Orders',    value: stats?.orders?.total || 0,        sub: `${stats?.orders?.thisWeek || 0} this week`,   icon: <ShoppingBag size={20} />, color: 'bg-f-dark text-white' },
    { label: 'Customers',       value: stats?.customers?.total || 0,     sub: `${stats?.customers?.new || 0} new this month`,icon: <Users size={20} />,       color: 'bg-f-grayBg text-white' },
    { label: 'Active Products', value: stats?.products?.total || 0,      sub: `${stats?.products?.lowStock || 0} low stock`, icon: <Package size={20} />,     color: 'bg-f-mid text-white' },
  ]

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-f-dark">Dashboard</h1>
        <p className="text-xs text-f-gray">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {CARDS.map(c => (
          <div key={c.label} className={`${c.color} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs opacity-70 font-medium">{c.label}</p>
              <div className="opacity-60">{c.icon}</div>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs opacity-60 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="md:col-span-2 bg-white border border-f-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-f-dark">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-f-purple flex items-center gap-1 hover:underline">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {(stats?.recentOrders || []).map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-f-soft last:border-0">
                <div>
                  <p className="text-xs font-medium text-f-dark">#{o.orderNumber}</p>
                  <p className="text-[11px] text-f-muted">{o.customerSnapshot?.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-medium text-f-dark">₹{o.total?.toLocaleString()}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">
          {/* Top products */}
          <div className="bg-white border border-f-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-f-dark mb-4">Top Products</h2>
            {(stats?.topProducts || []).map((p: any, i: number) => (
              <div key={p.id} className="flex items-center gap-2 mb-3 last:mb-0">
                <span className="text-xs text-f-muted w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-f-dark truncate">{p.id}</p>
                  <p className="text-[11px] text-f-muted">{p.qty} sold</p>
                </div>
                <p className="text-xs font-medium text-f-dark">₹{p.revenue?.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Order status breakdown */}
          <div className="bg-white border border-f-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-f-dark mb-4">Orders by Status</h2>
            {(stats?.ordersByStatus || []).map((s: any) => (
              <div key={s.id} className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[s.id] || 'bg-gray-100 text-gray-700'}`}>{s.id}</span>
                <span className="text-xs text-f-dark font-medium">{s.count}</span>
              </div>
            ))}
          </div>

          {/* Low stock alert */}
          {(stats?.products?.lowStock || 0) > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex gap-3">
              <AlertTriangle size={16} className="text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-orange-800">{stats.products.lowStock} products low on stock</p>
                <Link href="/admin/products?filter=low" className="text-xs text-orange-600 underline">Review now</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

