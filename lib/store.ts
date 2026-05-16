'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  image: string
  price: number
  qty: number
  slug: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  toggleCart: () => void
  subtotal: () => number
  totalItems: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (item) => set((s) => {
        const exists = s.items.find(i => i.productId === item.productId)
        if (exists) {
          return { items: s.items.map(i => i.productId === item.productId ? { ...i, qty: i.qty + item.qty } : i) }
        }
        return { items: [...s.items, item], isOpen: true }
      }),

      removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.productId !== id) })),

      updateQty: (id, qty) => set((s) => ({
        items: qty <= 0
          ? s.items.filter(i => i.productId !== id)
          : s.items.map(i => i.productId === id ? { ...i, qty } : i)
      })),

      clearCart:  () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      subtotal:   () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'funtroo-cart' }
  )
)

/* ── Browsing history (for suggestions) ─────────────────── */
interface HistoryStore {
  viewed: string[]   // product slugs
  addViewed: (slug: string) => void
}

export const useHistory = create<HistoryStore>()(
  persist(
    (set, get) => ({
      viewed: [],
      addViewed: (slug) => {
        const prev = get().viewed.filter(s => s !== slug)
        set({ viewed: [slug, ...prev].slice(0, 20) })
      },
    }),
    { name: 'funtroo-history' }
  )
)
