'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, ToggleLeft, ToggleRight, X, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadImage } from '@/lib/uploadImage'
import { updateDocument, createDocument, deleteDocument } from '@/lib/firestore'

const CATS = ['for-her','for-him','couples','lubricants','lingerie','accessories']
const EMPTY = { name:'', slug:'', description:'', price:'', originalPrice:'', category:'for-her', stock:'', material:'', features:'', tags:'', isWaterproof:false, isRechargeable:false, intensityModes:'', isFeatured:false, isActive:true, images: [] }

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [q, setQ]               = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(false)
  const [editing, setEditing]   = useState<any>(null)
  const [form, setForm]         = useState<any>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)

  const [bulkData, setBulkData] = useState<Record<string, { price: string, originalPrice: string }>>({})
  const [isBulkEdit, setIsBulkEdit] = useState(false)
  const [bulkSaving, setBulkSaving] = useState(false)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '15', admin: 'true' })
    if (q) params.set('q', q)
    fetch(`/api/products?${params}`).then(r => r.json()).then(d => { setProducts(d.products || []); setTotal(d.total || 0); setLoading(false) })
  }

  useEffect(() => { load() }, [page, q])

  useEffect(() => {
    if (isBulkEdit) {
      const data: Record<string, { price: string, originalPrice: string }> = {}
      products.forEach(p => {
        data[p.id] = { price: String(p.price || ''), originalPrice: String(p.originalPrice || '') }
      })
      setBulkData(data)
    }
  }, [isBulkEdit, products])

  const saveBulk = async () => {
    setBulkSaving(true)
    let errCount = 0
    for (const p of products) {
      const updated = bulkData[p.id]
      if (!updated) continue
      const pr = parseFloat(updated.price) || 0
      const op = parseFloat(updated.originalPrice) || 0
      if (pr === p.price && op === p.originalPrice) continue

      try {
        await updateDocument('products', p.id, { price: pr, originalPrice: op })
      } catch (e) {
        errCount++
      }
    }
    setBulkSaving(false)
    if (errCount > 0) toast.error(`${errCount} items failed to update.`)
    else toast.success('Pricing updated successfully!')
    setIsBulkEdit(false)
    load()
  }

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (p: any) => {
    setEditing(p)
    setForm({ ...p, price: String(p.price), originalPrice: String(p.originalPrice), stock: String(p.stock), intensityModes: String(p.intensityModes || ''), features: (p.features || []).join('\n'), tags: (p.tags || []).join(', '), images: p.images || [] })
    setModal(true)
  }

  const save = async () => {
    setSaving(true)
    const payload = {
      ...form,
      price:          parseFloat(form.price),
      originalPrice:  parseFloat(form.originalPrice),
      stock:          parseInt(form.stock),
      intensityModes: parseInt(form.intensityModes) || 0,
      features:       form.features.split('\n').filter(Boolean),
      tags:           form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    }
    try {
      if (editing) {
        await updateDocument('products', editing.id, payload)
        toast.success('Product updated!')
      } else {
        await createDocument('products', payload)
        toast.success('Product created!')
      }
      setModal(false)
      load()
    } catch (e) {
      toast.error('Error saving')
    }
    setSaving(false)
  }

  const toggle = async (p: any) => {
    try {
      await updateDocument('products', p.id, { isActive: !p.isActive })
      toast.success(p.isActive ? 'Product hidden' : 'Product visible')
      load()
    } catch (e) {
      toast.error('Error toggling status')
    }
  }

  const del = async (id: string) => {
    if (!confirm('Hide this product?')) return
    try {
      await updateDocument('products', id, { isActive: false })
      toast.success('Product hidden'); load()
    } catch (e) {
      toast.error('Error hiding product')
    }
  }

  const F = ({ label, k, type = 'text', span = 1, ...rest }: any) => (
    <div className={span === 2 ? 'col-span-2' : ''}>
      <label className="block text-xs text-f-muted mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))} rows={3}
          className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark resize-none" {...rest} />
      ) : type === 'select' ? (
        <select value={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))}
          className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark bg-white">
          {rest.options?.map((o: string) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.checked }))} className="accent-f-purple" />
          <span className="text-sm text-f-gray">{rest.checkLabel}</span>
        </label>
      ) : (
        <input type={type} value={form[k]} onChange={e => setForm((p: any) => ({ ...p, [k]: e.target.value }))}
          className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple text-f-dark" />
      )}
    </div>
  )

  return (
    <div className="p-6 md:p-8 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-xl font-semibold text-f-dark">Products</h1><p className="text-xs text-f-gray mt-0.5">{total} total</p></div>
        <div className="flex gap-2">
          <button onClick={() => setIsBulkEdit(!isBulkEdit)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${isBulkEdit ? 'bg-f-dark text-white' : 'bg-f-light text-f-dark hover:bg-f-soft'}`}>
            {isBulkEdit ? 'Cancel Quick Edit' : 'Quick Edit (Pricing)'}
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-f-border rounded-xl flex items-center gap-2 px-3 py-2 mb-4 max-w-sm">
        <Search size={14} className="text-f-muted" />
        <input value={q} onChange={e => { setQ(e.target.value); setPage(1) }} placeholder="Search products..."
          className="flex-1 text-sm outline-none placeholder:text-f-muted text-f-dark" />
      </div>

      {/* Table */}
      <div className="bg-white border border-f-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-f-soft border-b border-f-border">
            <tr>{['Product','Category','Price','Stock','Status','Actions'].map(h => (
              <th key={h} className="text-left text-xs font-semibold text-f-gray px-4 py-3">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {loading ? [...Array(5)].map((_, i) => (
              <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-f-border/30 rounded animate-pulse" /></td></tr>
            )) : products.map(p => (
              <tr key={p.id} className={`border-b border-f-soft transition ${isBulkEdit ? 'bg-f-light/30' : 'hover:bg-f-soft/50'}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-f-dark text-xs">{p.name}</p>
                  <p className="text-[11px] text-f-muted">{p.sku || p.slug}</p>
                </td>
                <td className="px-4 py-3"><span className="text-xs bg-f-light text-f-purple px-2 py-0.5 rounded-full capitalize">{p.category}</span></td>
                <td className="px-4 py-3">
                  {isBulkEdit ? (
                    <div className="flex flex-col gap-1 w-24">
                      <input type="number" value={bulkData[p.id]?.price ?? ''} onChange={e => setBulkData(prev => ({...prev, [p.id]: {...prev[p.id], price: e.target.value}}))} className="border border-f-border rounded px-2 py-1 text-xs outline-none focus:border-f-purple bg-white" placeholder="Price" />
                      <input type="number" value={bulkData[p.id]?.originalPrice ?? ''} onChange={e => setBulkData(prev => ({...prev, [p.id]: {...prev[p.id], originalPrice: e.target.value}}))} className="border border-f-border rounded px-2 py-1 text-[11px] text-f-muted outline-none focus:border-f-purple bg-white" placeholder="Orig. Price" />
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-f-dark">₹{p.price?.toLocaleString()}</p>
                      <p className="text-[11px] text-f-muted line-through">₹{p.originalPrice?.toLocaleString()}</p>
                    </>
                  )}
                </td>
                <td className="px-4 py-3"><span className={`text-xs font-medium ${p.stock <= 5 ? 'text-red-500' : 'text-f-dark'}`}>{p.stock}</span></td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(p)} disabled={isBulkEdit}>
                    {p.isActive ? <ToggleRight size={20} className={isBulkEdit ? 'text-f-green/50' : 'text-f-green'} /> : <ToggleLeft size={20} className="text-f-muted" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} disabled={isBulkEdit} className="p-1.5 hover:bg-f-light rounded-lg transition disabled:opacity-50"><Pencil size={13} className="text-f-purple" /></button>
                    <button onClick={() => del(p.id)} disabled={isBulkEdit} className="p-1.5 hover:bg-red-50 rounded-lg transition disabled:opacity-50"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isBulkEdit && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-2xl border border-f-border rounded-full px-6 py-3 flex items-center gap-4 z-40">
          <span className="text-sm font-medium text-f-dark">Quick Edit Mode</span>
          <div className="w-px h-4 bg-f-border"></div>
          <button onClick={() => setIsBulkEdit(false)} className="text-sm text-f-gray hover:text-f-dark transition">Cancel</button>
          <button onClick={saveBulk} disabled={bulkSaving} className="px-4 py-1.5 bg-f-purple text-white rounded-full text-sm font-medium hover:bg-f-mid transition disabled:opacity-60">
            {bulkSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">← Prev</button>
        <span className="px-4 py-2 text-sm text-f-gray">{page} / {Math.ceil(total/15)}</span>
        <button onClick={() => setPage(p => p+1)} disabled={page>=Math.ceil(total/15)} className="px-4 py-2 text-sm border border-f-border rounded-xl disabled:opacity-40 hover:bg-f-light transition">Next →</button>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto pt-8 pb-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-f-border">
              <h2 className="font-semibold text-f-dark">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModal(false)}><X size={18} className="text-f-muted hover:text-f-dark" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <F label="Product Name"     k="name"          span={2} />
              <F label="Slug"             k="slug" />
              <F label="Category"         k="category" type="select" options={CATS} />
              <F label="Price (₹)"        k="price"         type="number" />
              <F label="Original Price (₹)" k="originalPrice" type="number" />
              <F label="Stock"            k="stock"         type="number" />
              <F label="Material"         k="material" />
              <F label="Intensity Modes"  k="intensityModes" type="number" />
              <F label="Description"      k="description"   type="textarea" span={2} />
              <F label="Features (one per line)" k="features" type="textarea" span={2} />
              <F label="Tags (comma separated)"  k="tags" span={2} />
              <div className="col-span-2">
                <label className="block text-xs text-f-muted mb-1">Product Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images?.map((url: string, i: number) => (
                    <div key={i} className="relative group w-20 h-20 border border-f-border rounded-xl overflow-hidden">
                      <img src={url} alt="product" className="w-full h-full object-cover" />
                      <button onClick={() => setForm((p:any) => ({...p, images: p.images.filter((_:any, idx:number) => idx !== i)}))} className="absolute top-1 right-1 bg-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm text-red-500 hover:bg-red-50">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border border-dashed border-f-purple bg-f-light text-f-purple rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-f-soft transition">
                    {uploadingImages ? <span className="text-[10px]">Uploading...</span> : (
                      <>
                        <Upload size={16} className="mb-1" />
                        <span className="text-[10px] font-medium">Add Image</span>
                      </>
                    )}
                    <input type="file" multiple className="hidden" accept="image/*" onChange={async e => {
                      if (!e.target.files?.length) return
                      setUploadingImages(true)
                      try {
                        const urls: string[] = []
                        for (const file of Array.from(e.target.files)) {
                          urls.push(await uploadImage(file, 'products'))
                        }
                        setForm((p:any) => ({...p, images: [...(p.images || []), ...urls]}))
                        toast.success(`${urls.length} images uploaded!`)
                      } catch (err) {
                        toast.error('Failed to upload some images')
                      }
                      setUploadingImages(false)
                    }} />
                  </label>
                </div>
                <p className="text-[10px] text-f-muted">Upload multiple images of any size. The system automatically crops and adjusts them uniformly.</p>
              </div>
              <F label="" k="isWaterproof"  type="checkbox" checkLabel="Waterproof" />
              <F label="" k="isRechargeable" type="checkbox" checkLabel="Rechargeable" />
              <F label="" k="isFeatured"   type="checkbox" checkLabel="Featured (Homepage)" />
              <F label="" k="isActive"     type="checkbox" checkLabel="Active (visible in store)" />
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

