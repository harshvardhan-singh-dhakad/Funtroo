export interface IProduct {
  id?: string
  name: string
  slug: string
  description: string
  price: number
  originalPrice: number
  images: string[]
  category: 'for-her' | 'for-him' | 'couples' | 'lubricants' | 'lingerie' | 'accessories'
  subcategory?: string
  tags: string[]
  stock: number
  sku?: string
  material?: string
  features: string[]
  isWaterproof: boolean
  isRechargeable: boolean
  intensityModes: number
  isFeatured: boolean
  isActive: boolean
  rating: number
  reviewCount: number
  soldCount: number
  createdAt: string | Date
  updatedAt?: string | Date
}
