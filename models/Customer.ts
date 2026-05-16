export type CardTier = 'silver' | 'gold' | 'platinum'

export interface ICustomer {
  id?: string
  name: string
  email: string
  password?: string // Should be excluded in most queries
  phone?: string
  role: 'customer' | 'admin'
  addresses: {
    id?: string
    label: string
    line1: string
    line2: string
    city: string
    state: string
    pincode: string
    isDefault: boolean
  }[]
  card: {
    tier: CardTier
    number: string
    totalSpend: number
    discountPct: number
    joinedAt: string | Date
  }
  wishlist: string[]
  browsingHistory: string[]
  createdAt: string | Date
  updatedAt?: string | Date
}
