'use client'
import { useEffect, useState } from 'react'
import { Search, X, Crown, Star, Zap } from 'lucide-react'

const TIER_STYLES: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  silver:   { bg: 'bg-gray-100',   text: 'text-gray-700',   icon: <Star size={10} />  },
  gold:     { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: <Star size={10} className="fill-yellow-500" /> },
  platinum: { bg: 'bg-purple-100', text: 'text-purple-800', icon: <Crown size={10} /> },
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total,     setTotal]     = useState(0)
  const [page,      setPage]      = useState(1)
  const [q,         setQ]         = useState('')
  const [loading,   setLoading]   = useState(true)
  const [selected,  setSelected]  = useState<any>(null)
  const [orders,    setOrders]    = useState<any[]>([])

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (q) params.set('q', q)
    fetch(`/api/customers?${params}`).then(r => r.json()).then(d => {
      setCustomers(d.customers || [])
      setTotal(d.total || 0)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [page, q])

  const selectCustomer = async (c: any) => {
    setSelected(c)
    const res  = await fetch(`/api/orders?customer=${c.id}&limit=10`)
    const data = await res.json()
    setOrders(data.orders || [])
  }

  const tier = selected?.card?.tier as string

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-f-dark">Customers</h1>
          <p className="text-xs text-f-gray mt-0.5">{total} registered</p>
        </div>
        {/* Quick tier summary */}
        <div className="hidden md:flex gap-3">
          {['silver','gold','platinum'].map(t => (
            <div key={t} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${TIER_STYLES[t].bg}`}>
              <span className={TIER_STYLES[t].text}>{TIER_STYLES[t].icon}</span>
              <span className={`text-[11px] font-medium capitalize ${TIER_STYLES[t].text}`}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-f-border rounded-xl flex items-center gap-2 px-3 py-2 mb-5 max-w-sm">
        <Search size={14} className="text-f-muted" />
        <input value={q} onChange={e => { setQ(e.target.value); setPage(1) }} placeholder="Search name or email..."
          className="flex-1 text-sm outline-none placeholder:text-f-muted text-f-dark" />
        {q && <button onClick={() => setQ('')}><X size={12} className="text-f-muted" /></button>}
      </div>

      <div className={`grid gap-6 ${selected ? 'md:grid-cols-3' : ''}`}>
        {/* Table */}
        <div className={selected ? 'md:col-span-2' : ''}>
          <div className="bg-white border border-f-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-f-soft border-b border-f-border">
                <tr>{['Name','Email','Phone','Card Tier','Total Spend','Joined'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-f-gray px-4 py-3">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {loading ? [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-f-border/30 rounded animate-pulse" /></td></tr>
                )) : customers.map(c => {
                  const t = TIER_STYLES[c.card?.tier] || TIER_STYLES.silver
                  return (
                    <tr key={c.id}
                      onClick={() => selectCustomer(c)}
                      className={`border-b border-f-soft cursor-pointer transition ${selected?.id === c.id ? 'bg-f-light' : 'hover:bg-f-soft/50'}`}>
                      <td className="px-4 py-3">
                        <p className="text-xs font-medium text-f-dark">{c.name}</p>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs text-f-gray">{c.email}</span></td>
                      <td className="px-4 py-3"><span className="text-xs text-f-gray">{c.phone || '—'}</span></td>
                      <td className="px-4 py-3">
                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${t.bg}`}>
                          <span className={t.text}>{t.icon}</span>
                          <span className={`text-[10px] font-medium capitalize ${t.text}`}>{c.card?.tier}</span>
                          <span className={`text-[10px] ${t.text}`}>{c.card?.discountPct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Zap size={10} className="text-f-accent fill-f-accent" />
                          <span className="text-xs font-medium text-f-dark">₹{(c.card?.totalSpend || 0).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className="text-[11px] text-f-muted">{new Date(c.createdAt).toLocaleDateString('en-IN')}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
              className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">← Prev</button>
            <span className="px-4 py-2 text-sm text-f-gray">{page} / {Math.ceil(total/20)||1}</span>
            <button onClick={() => setPage(p=>p+1)} disabled={page>=Math.ceil(total/20)}
              className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">Next →</button>
          </div>
        </div>

        {/* Customer detail */}
        {selected && (
          <div className="space-y-4">
            <div className="bg-white border border-f-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-f-dark text-sm">Customer Detail</h2>
                <button onClick={() => setSelected(null)}><X size={16} className="text-f-muted" /></button>
              </div>

              {/* Card display */}
              <div className={`${TIER_STYLES[tier]?.bg || 'bg-gray-100'} rounded-xl p-4 mb-4`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[9px] uppercase opacity-60 tracking-widest">Funtroo Card</p>
                    <p className={`font-display text-lg capitalize ${TIER_STYLES[tier]?.text}`}>{tier} Member</p>
                  </div>
                  <div className={`flex items-center gap-1 ${TIER_STYLES[tier]?.text}`}>
                    <Zap size={14} className="fill-current" />
                    <span className="font-bold">{selected.card?.discountPct}%</span>
                  </div>
                </div>
                <p className={`text-[10px] font-mono opacity-60 ${TIER_STYLES[tier]?.text}`}>{selected.card?.number || 'FT-XXXX-XXXX-XXXX'}</p>
                <div className="flex justify-between mt-2">
                  <div>
                    <p className={`text-[9px] uppercase opacity-50 ${TIER_STYLES[tier]?.text}`}>Holder</p>
                    <p className={`text-sm font-medium ${TIER_STYLES[tier]?.text}`}>{selected.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[9px] uppercase opacity-50 ${TIER_STYLES[tier]?.text}`}>Total Spent</p>
                    <p className={`text-sm font-semibold ${TIER_STYLES[tier]?.text}`}>₹{(selected.card?.totalSpend || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Info */}
              {[
                { l: 'Email',   v: selected.email },
                { l: 'Phone',   v: selected.phone || '—' },
                { l: 'Joined',  v: new Date(selected.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }) },
              ].map(r => (
                <div key={r.l} className="flex justify-between py-2 border-b border-f-soft last:border-0">
                  <span className="text-xs text-f-muted">{r.l}</span>
                  <span className="text-xs text-f-dark font-medium">{r.v}</span>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="bg-white border border-f-border rounded-2xl p-5">
              <h3 className="font-semibold text-f-dark text-sm mb-3">Recent Orders</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-f-muted text-center py-4">No orders yet</p>
              ) : orders.map(o => (
                <div key={o.id} className="flex justify-between py-2 border-b border-f-soft last:border-0">
                  <div>
                    <p className="text-xs font-mono font-medium text-f-dark">#{o.orderNumber}</p>
                    <p className="text-[11px] text-f-muted capitalize">{o.status}</p>
                  </div>
                  <span className="text-xs font-semibold text-f-dark">₹{o.total?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

