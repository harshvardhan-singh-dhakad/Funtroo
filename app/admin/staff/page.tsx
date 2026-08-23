'use client'
import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Shield, Search, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

export default function AdminStaff() {
  const { data: session } = useSession()
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState<any>({ name: '', email: '', password: '', role: 'admin', permissions: [] })
  const [editing, setEditing] = useState<string|null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/staff')
    const data = await res.json()
    setStaff(data.staff || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const togglePerm = (p: string) => {
    setForm((prev: any) => ({
      ...prev,
      permissions: prev.permissions.includes(p) ? prev.permissions.filter((x: string) => x !== p) : [...prev.permissions, p]
    }))
  }

  const save = async () => {
    if (!form.name || !form.email) return toast.error('Name and email required')
    if (!editing && !form.password) return toast.error('Password required for new staff')

    const res = await fetch('/api/admin/staff', {
      method: editing ? 'PUT' : 'POST',
      body: JSON.stringify({ ...form, id: editing }),
      headers: { 'Content-Type': 'application/json' }
    })
    
    const data = await res.json()
    if (res.ok) {
      toast.success(editing ? 'Staff updated' : 'Staff added')
      setModal(false)
      load()
    } else {
      toast.error(data.error || 'Failed to save')
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this staff member?')) return
    const res = await fetch(`/api/admin/staff?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Staff removed')
      load()
    } else toast.error('Failed to remove')
  }

  if ((session?.user as any)?.role !== 'superadmin') {
    return <div className="p-8 text-center text-red-500">Access Denied. Super Admin only.</div>
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-f-dark">Staff Roles & Permissions</h1>
          <p className="text-xs text-f-gray mt-0.5">Manage sub-admins and their access</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'admin', permissions: [] }); setModal(true) }} className="flex items-center gap-2 px-4 py-2 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">
          <Plus size={16} /> Add Staff
        </button>
      </div>

      <div className="bg-white border border-f-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-f-soft border-b border-f-border">
            <tr>
              <th className="text-left text-xs font-semibold text-f-gray px-4 py-3">Name</th>
              <th className="text-left text-xs font-semibold text-f-gray px-4 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-f-gray px-4 py-3">Role</th>
              <th className="text-left text-xs font-semibold text-f-gray px-4 py-3">Permissions</th>
              <th className="text-left text-xs font-semibold text-f-gray px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr> : staff.map(s => (
              <tr key={s.id} className="border-b border-f-soft last:border-0 hover:bg-f-soft/30">
                <td className="px-4 py-3 font-medium text-f-dark">{s.name}</td>
                <td className="px-4 py-3 text-f-gray">{s.email}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] uppercase font-bold px-2 py-1 rounded-full">{s.role}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {s.role === 'superadmin' ? <span className="text-xs text-f-muted">Full Access</span> : s.permissions?.map((p: string) => (
                      <span key={p} className="text-[10px] bg-f-light text-f-purple px-2 py-0.5 rounded-full capitalize">{p}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {s.role !== 'superadmin' && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditing(s.id); setForm({ name: s.name, email: s.email, password: '', role: 'admin', permissions: s.permissions || [] }); setModal(true) }} className="p-1.5 hover:bg-f-light text-f-purple rounded-lg"><Pencil size={13}/></button>
                      <button onClick={() => remove(s.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={13}/></button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-f-dark">{editing ? 'Edit Staff' : 'Add Staff'}</h2>
              <button onClick={() => setModal(false)}><X size={18} className="text-f-muted" /></button>
            </div>
            
            <div className="space-y-4">
              <div><label className="text-xs text-f-muted mb-1 block">Name</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple" /></div>
              <div><label className="text-xs text-f-muted mb-1 block">Email</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple" /></div>
              <div><label className="text-xs text-f-muted mb-1 block">Password {editing && '(leave blank to keep current)'}</label><input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="w-full border border-f-border rounded-xl px-3 py-2 text-sm outline-none focus:border-f-purple" /></div>
              
              <div>
                <label className="text-xs text-f-muted mb-2 block">Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {['blogs', 'products', 'orders'].map(p => (
                    <label key={p} className="flex items-center gap-2 border border-f-border rounded-xl px-3 py-2 cursor-pointer hover:bg-f-soft">
                      <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePerm(p)} className="accent-f-purple" />
                      <span className="text-sm capitalize">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="px-4 py-2 border border-f-border rounded-xl text-sm">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid">Save Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
