'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, X, Tag, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { code: '', type: 'percent', value: '', minOrder: '', maxDiscount: '', usageLimit: '1000', isActive: true, expiresAt: '' }

export default function AdminDiscounts() {
  const [coupons,  setCoupons]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(false)
  const [editing,  setEditing]  = useState<any>(null)
  const [form,     setForm]     = useState<any>(EMPTY)
  const [saving,   setSaving]   = useState(false)

  const load = () => {
    setLoading(true)
    fetch('/api/coupons').then(r => r.json()).then(d => { setCoupons(d.coupons || []); setLoading(false) })
  }
  useEffect(() => { load() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (c: any) => {
    setEditing(c)
    setForm({ ...c, value: String(c.value), minOrder: String(c.minOrder || ''), maxDiscount: String(c.maxDiscount || ''), usageLimit: String(c.usageLimit), expiresAt: c.expiresAt ? c.expiresAt.split('T')[0] : '' })
    setModal(true)
  }

  const save = async () => {
    if (!form.code || !form.value) return toast.error('Code and value are required')
    setSaving(true)
    const payload = { ...form, value: parseFloat(form.value), minOrder: parseFloat(form.minOrder) || 0, maxDiscount: parseFloat(form.maxDiscount) || 99999, usageLimit: parseInt(form.usageLimit) || 1000 }
    const res  = await fetch('/api/coupons', { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } })
    const data = await res.json()
    setSaving(false)
    if (data.coupon) { toast.success(editing ? 'Coupon updated!' : 'Coupon created!'); setModal(false); load() }
    else toast.error(data.error || 'Error')
  }

  const toggle = async (c: any) => {
    await fetch('/api/coupons', { method: 'PUT', body: JSON.stringify({ _id: c.id, isActive: !c.isActive }), headers: { 'Content-Type': 'application/json' } })
    toast.success(c.isActive ? 'Coupon disabled' : 'Coupon enabled'); load()
  }

  const F = ({ label, k, type = 'text', ...rest }: any) => (
    <div>
      <label className="block text-xs text-f-muted mb-1">{label}</label>
      {type === 'select' ? (
        <select value={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))}
          className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white">
          {rest.options?.map((o: string[]) => <option key={o[0]} value={o[0]}>{o[1]}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input type="checkbox" checked={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.checked }))} className="accent-f-purple" />
          <span className="text-sm text-f-gray">{rest.checkLabel}</span>
        </label>
      ) : (
        <input type={type} value={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))}
          placeholder={rest.placeholder}
          className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark" />
      )}
    </div>
  )

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-f-dark">Coupons & Discounts</h1>
          <p className="text-xs text-f-gray mt-0.5">{coupons.length} coupons</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {/* Card tier info */}
      <div className="bg-f-dark rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-f-accent fill-f-accent" />
          <h2 className="text-sm font-semibold text-f-light">Loyalty Card Discounts (Auto-applied)</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { tier: 'Silver 🥈', range: '₹0 – ₹9,999',   disc: '5%',  color: 'bg-gray-700' },
            { tier: 'Gold 🥇',   range: '₹10K – ₹49,999', disc: '10%', color: 'bg-yellow-900' },
            { tier: 'Platinum 💎',range: '₹50K+',          disc: '15%', color: 'bg-f-purple/40' },
          ].map(t => (
            <div key={t.tier} className={`${t.color} rounded-xl p-3 text-center`}>
              <p className="text-xs font-medium text-white">{t.tier}</p>
              <p className="text-[10px] text-white/60 mt-0.5">{t.range} lifetime</p>
              <p className="text-xl font-bold text-white mt-1">{t.disc}</p>
              <p className="text-[10px] text-white/50">off every order</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-f-muted mt-3">Card discounts are auto-applied at checkout. Stacks with coupon codes.</p>
      </div>

      {/* Coupons table */}
      <div className="bg-white border border-f-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-f-soft border-b border-f-border">
            <tr>{['Code','Type','Value','Min Order','Used','Expires','Status','Actions'].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-f-gray px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {loading ? [...Array(4)].map((_, i) => (
              <tr key={i}><td colSpan={8} className="px-4 py-4"><div className="h-4 bg-f-border/30 rounded animate-pulse" /></td></tr>
            )) : coupons.map(c => (
              <tr key={c.id} className="border-b border-f-soft hover:bg-f-soft/30 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={12} className="text-f-purple" />
                    <span className="font-mono text-xs font-bold text-f-dark">{c.code}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="text-xs capitalize text-f-gray">{c.type}</span></td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold text-f-dark">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</span>
                </td>
                <td className="px-4 py-3"><span className="text-xs text-f-gray">{c.minOrder > 0 ? `₹${c.minOrder}` : 'None'}</span></td>
                <td className="px-4 py-3">
                  <span className="text-xs text-f-gray">{c.usedCount} / {c.usageLimit}</span>
                  <div className="mt-1 h-1 bg-f-border rounded-full overflow-hidden w-16">
                    <div className="h-full bg-f-purple rounded-full" style={{ width: `${Math.min(100, (c.usedCount/c.usageLimit)*100)}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-f-gray">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : '∞'}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(c)}>
                    {c.isActive ? <ToggleRight size={20} className="text-f-green" /> : <ToggleLeft size={20} className="text-f-muted" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-f-light rounded-lg transition">
                    <Pencil size={13} className="text-f-purple" />
                  </button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && !loading && (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-f-muted text-sm">No coupons yet. Create your first one!</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-f-border">
              <h2 className="font-semibold text-f-dark">{editing ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setModal(false)}><X size={18} className="text-f-muted" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <F label="Coupon Code *"         k="code"        placeholder="SAVE20" />
              <F label="Type *"                k="type"        type="select" options={[['percent','Percentage (%)'],['flat','Flat Amount (₹)']]} />
              <F label="Discount Value *"      k="value"       type="number" placeholder={form.type === 'percent' ? '20 (= 20%)' : '200 (= ₹200)'} />
              <F label="Usage Limit"           k="usageLimit"  type="number" placeholder="1000" />
              <F label="Min Order Amount (₹)"  k="minOrder"    type="number" placeholder="0" />
              <F label="Max Discount Cap (₹)"  k="maxDiscount" type="number" placeholder="Leave blank = no cap" />
              <div className="col-span-2"><F label="Expiry Date (optional)" k="expiresAt" type="date" /></div>
              <div className="col-span-2"><F label="" k="isActive" type="checkbox" checkLabel="Coupon is active" /></div>
            </div>
            <div className="px-6 pb-6 flex gap-3 justify-end">
              <button onClick={() => setModal(false)} className="px-5 py-2.5 border border-f-border rounded-xl text-sm text-f-gray hover:bg-f-soft transition">Cancel</button>
              <button onClick={save} disabled={saving} className="px-5 py-2.5 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

