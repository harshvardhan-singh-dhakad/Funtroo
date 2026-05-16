'use client'
import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FuntrooCard from '@/components/FuntrooCard'
import { Package, CreditCard, User, LogOut } from 'lucide-react'

const STATUS_COLORS: Record<string, string> = {
  pending:    'bg-yellow-100 text-yellow-800',
  confirmed:  'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped:    'bg-indigo-100 text-indigo-800',
  delivered:  'bg-green-100 text-green-800',
  cancelled:  'bg-red-100 text-red-800',
}

function AccountContent() {
  const { data: session, status } = useSession()
  const sp     = useSearchParams()
  const router = useRouter()
  const tab    = sp.get('tab') || 'orders'
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status])

  useEffect(() => {
    const id = (session?.user as any)?.id
    if (!id) return
    fetch(`/api/orders?customer=${id}&limit=20`)
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false) })
  }, [session])

  if (!session) return null
  const user = session.user as any
  const card = user?.card

  const TABS = [
    { id: 'orders', label: 'My Orders', icon: <Package size={15} /> },
    { id: 'card',   label: 'My Card',   icon: <CreditCard size={15} /> },
    { id: 'profile',label: 'Profile',   icon: <User size={15} /> },
  ]

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl text-f-dark">My Account</h1>
          <button onClick={() => signOut()} className="flex items-center gap-2 text-sm text-f-gray hover:text-red-500 transition">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-f-border rounded-2xl p-1.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => router.push(`/account?tab=${t.id}`)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition ${tab === t.id ? 'bg-f-purple text-white' : 'text-f-gray hover:text-f-dark'}`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="space-y-3">
            {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-f-border/30 rounded-2xl animate-pulse" />) :
              orders.length === 0 ? (
                <div className="text-center py-16 bg-white border border-f-border rounded-2xl">
                  <Package size={40} className="text-f-border mx-auto mb-3" />
                  <p className="text-f-gray">No orders yet. Start shopping!</p>
                </div>
              ) : orders.map((o: any) => (
                <div key={o.id} className="bg-white border border-f-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-f-dark">#{o.orderNumber}</p>
                    <p className="text-xs text-f-muted mt-0.5">{o.items?.length} items · {new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-semibold text-f-dark">₹{o.total?.toLocaleString()}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* Card tab */}
        {tab === 'card' && card && (
          <div className="space-y-6">
            <FuntrooCard card={card} name={user.name || ''} />
            <div className="bg-white border border-f-border rounded-2xl p-6">
              <h3 className="font-medium text-f-dark mb-4">Card Benefits</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { tier: 'Silver 🥈', spend: '₹0+',    disc: '5%' },
                  { tier: 'Gold 🥇',   spend: '₹10K+',  disc: '10%' },
                  { tier: 'Platinum 💎',spend: '₹50K+', disc: '15%' },
                ].map(t => (
                  <div key={t.tier} className={`p-4 rounded-xl border text-center ${card.tier === t.tier.split(' ')[0].toLowerCase() ? 'border-f-purple bg-f-soft' : 'border-f-border'}`}>
                    <p className="text-sm font-medium text-f-dark">{t.tier}</p>
                    <p className="text-xs text-f-muted mt-1">Spend {t.spend}</p>
                    <p className="text-lg font-bold text-f-purple mt-1">{t.disc} off</p>
                    <p className="text-[10px] text-f-muted">every order</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-f-muted mt-4 text-center">Discount auto-applied at checkout · No coupon needed</p>
            </div>
          </div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <div className="bg-white border border-f-border rounded-2xl p-6 space-y-4">
            {[{ label: 'Name', value: user.name }, { label: 'Email', value: user.email }].map(f => (
              <div key={f.label}>
                <p className="text-xs text-f-muted mb-1">{f.label}</p>
                <p className="text-sm text-f-dark bg-f-soft border border-f-border rounded-xl px-3 py-2.5">{f.value}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default function AccountPage() {
  return <Suspense fallback={<div className="min-h-screen bg-f-soft" />}><AccountContent /></Suspense>
}

