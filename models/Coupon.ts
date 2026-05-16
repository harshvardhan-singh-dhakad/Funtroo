export interface ICoupon {
  id?: string
  code: string
  type: 'percent' | 'flat'
  value: number
  minOrder: number
  maxDiscount: number
  usageLimit: number
  usedCount: number
  isActive: boolean
  expiresAt: string | Date
  createdAt?: string | Date
  updatedAt?: string | Date
}
