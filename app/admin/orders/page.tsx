'use client'
import { useEffect, useState } from 'react'
import { Search, X, ChevronDown, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled','returned']
const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
  returned:   'bg-gray-100 text-gray-800',
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState<any[]>([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [q,       setQ]       = useState('')
  const [status,  setStatus]  = useState('')
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [tracking, setTracking] = useState('')
  const [updating, setUpdating] = useState(false)

  const load = () => {
    setLoading(true)
    const p = new URLSearchParams({ page: String(page), limit: '15' })
    if (q)      p.set('q', q)
    if (status) p.set('status', status)
    fetch(`/api/orders?${p}`).then(r => r.json()).then(d => {
      setOrders(d.orders || [])
      setTotal(d.total   || 0)
      setLoading(false)
    })
  }

  useEffect(() => { load() }, [page, q, status])

  const updateOrder = async (id: string, data: any) => {
    setUpdating(true)
    const res  = await fetch(`/api/orders/${id}`, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } })
    const json = await res.json()
    setUpdating(false)
    if (json.order) {
      toast.success('Order updated!')
      setSelected(json.order)
      load()
    } else toast.error('Update failed')
  }

  const exportToCSV = () => {
    if (!orders || orders.length === 0) return toast.error('No orders to export')
    
    const headers = ['Order Number', 'Date', 'Customer Name', 'Email', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Items', 'Total Amount', 'Status', 'Payment Method', 'Tracking Number']
    const rows = orders.map(o => {
      const itemsStr = o.items?.map((i: any) => `${i.name} (x${i.qty})`).join('; ') || ''
      const addr = o.address || {}
      return [
        o.orderNumber,
        new Date(o.createdAt).toLocaleDateString('en-IN'),
        o.customerSnapshot?.name || '',
        o.customerSnapshot?.email || '',
        o.customerSnapshot?.phone || '',
        `${addr.line1 || ''} ${addr.line2 || ''}`,
        addr.city || '',
        addr.state || '',
        addr.pincode || '',
        itemsStr,
        o.total || 0,
        o.status,
        o.paymentMethod,
        o.trackingNumber || ''
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
    })
    
    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `funtroo_orders_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const Row = ({ label, value }: any) => (
    <div className="flex justify-between py-2 border-b border-f-soft last:border-0">
      <span className="text-xs text-f-muted">{label}</span>
      <span className="text-xs text-f-dark font-medium">{value}</span>
    </div>
  )

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-f-dark">Orders</h1>
          <p className="text-xs text-f-gray mt-0.5">{total} total orders</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2.5 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="bg-white border border-f-border rounded-xl flex items-center gap-2 px-3 py-2">
          <Search size={14} className="text-f-muted" />
          <input value={q} onChange={e => { setQ(e.target.value); setPage(1) }} placeholder="Search order / customer..."
            className="text-sm outline-none placeholder:text-f-muted text-f-dark w-44" />
          {q && <button onClick={() => setQ('')}><X size={12} className="text-f-muted" /></button>}
        </div>

        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
          className="bg-white border border-f-border rounded-xl px-3 py-2 text-sm text-f-dark outline-none">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      <div className={`grid gap-6 ${selected ? 'md:grid-cols-3' : 'md:grid-cols-1'}`}>
        {/* Table */}
        <div className={selected ? 'md:col-span-2' : ''}>
          <div className="bg-white border border-f-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-f-soft border-b border-f-border">
                <tr>{['Order','Customer','Items','Total','Status','Payment','Date'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-f-gray px-4 py-3">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {loading ? [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-f-border/30 rounded animate-pulse" /></td></tr>
                )) : orders.map(o => (
                  <tr key={o.id}
                    onClick={() => setSelected(o)}
                    className={`border-b border-f-soft cursor-pointer transition ${selected?.id === o.id ? 'bg-f-light' : 'hover:bg-f-soft/50'}`}>
                    <td className="px-4 py-3">
                      <p className="text-xs font-mono font-semibold text-f-dark">#{o.orderNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-f-dark">{o.customerSnapshot?.name}</p>
                      <p className="text-[11px] text-f-muted">{o.customerSnapshot?.phone}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-f-gray">{o.items?.length} item(s)</span></td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold text-f-dark">₹{o.total?.toLocaleString()}</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${o.paymentMethod === 'cod' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="px-4 py-3"><span className="text-[11px] text-f-muted">{new Date(o.createdAt).toLocaleDateString('en-IN')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
              className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">← Prev</button>
            <span className="px-4 py-2 text-sm text-f-gray">{page} / {Math.ceil(total/15) || 1}</span>
            <button onClick={() => setPage(p => p+1)} disabled={page>=Math.ceil(total/15)}
              className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">Next →</button>
          </div>
        </div>

        {/* Order detail panel */}
        {selected && (
          <div className="bg-white border border-f-border rounded-2xl p-5 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-f-dark text-sm">#{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)}><X size={16} className="text-f-muted" /></button>
            </div>

            {/* Customer */}
            <div className="bg-f-soft rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-f-dark mb-2">Customer</p>
              <Row label="Name"  value={selected.customerSnapshot?.name} />
              <Row label="Email" value={selected.customerSnapshot?.email} />
              <Row label="Phone" value={selected.customerSnapshot?.phone} />
            </div>

            {/* Address */}
            <div className="bg-f-soft rounded-xl p-3 mb-4">
              <p className="text-xs font-semibold text-f-dark mb-2">Delivery Address</p>
              <p className="text-xs text-f-gray leading-relaxed">
                {selected.address?.line1}{selected.address?.line2 ? ', ' + selected.address.line2 : ''}<br />
                {selected.address?.city}, {selected.address?.state} — {selected.address?.pincode}
              </p>
            </div>

            {/* Items */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-f-dark mb-2">Items</p>
              {selected.items?.map((item: any, i: number) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-f-soft last:border-0">
                  <span className="text-xs text-f-dark truncate max-w-[150px]">{item.name} × {item.qty}</span>
                  <span className="text-xs font-medium text-f-dark">₹{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="bg-f-soft rounded-xl p-3 mb-4 space-y-1">
              <Row label="Subtotal"       value={`₹${selected.subtotal?.toLocaleString()}`} />
              {selected.cardDiscount > 0   && <Row label="Card Discount"   value={`−₹${selected.cardDiscount?.toLocaleString()}`} />}
              {selected.couponDiscount > 0 && <Row label="Coupon Discount" value={`−₹${selected.couponDiscount?.toLocaleString()}`} />}
              <Row label="Shipping"       value={selected.shipping === 0 ? 'Free' : `₹${selected.shipping}`} />
              <div className="flex justify-between pt-1 font-semibold">
                <span className="text-xs text-f-dark">Total</span>
                <span className="text-xs text-f-dark">₹{selected.total?.toLocaleString()}</span>
              </div>
            </div>

            {/* Status update */}
            <div className="mb-3">
              <label className="text-xs text-f-muted mb-1 block">Update Status</label>
              <select defaultValue={selected.status}
                onChange={e => updateOrder(selected.id, { status: e.target.value })}
                className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white">
                {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>

            {/* Tracking */}
            <div className="flex gap-2">
              <input value={tracking || selected.trackingNumber || ''} onChange={e => setTracking(e.target.value)}
                placeholder="Tracking number"
                className="flex-1 border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark" />
              <button onClick={() => updateOrder(selected.id, { trackingNumber: tracking })} disabled={updating}
                className="px-3 py-2 bg-f-purple text-white rounded-xl text-xs font-medium hover:bg-f-mid transition disabled:opacity-60">
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

