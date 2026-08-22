'use client'
import Link from 'next/link'
import { useCart } from '@/lib/store'
import { ShoppingBag, Star, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { TIERS } from '@/lib/loyalty'

interface Props {
  product: {
    _id: string
    name: string
    slug: string
    price: number
    originalPrice: number
    images: string[]
    category: string
    rating: number
    reviewCount: number
    isFeatured?: boolean
    stock: number
    tags?: string[]
  }
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const { data: session } = useSession()
  const card   = (session?.user as any)?.card
  const tier   = card?.tier || null
  const discPct = tier ? TIERS[tier as keyof typeof TIERS]?.discountPct : 0
  const cardPrice = tier ? Math.round(product.price * (1 - discPct / 100)) : 0
  const discount  = Math.round((1 - product.price / product.originalPrice) * 100)

  const handleAdd = () => {
    addItem({
      productId: product._id,
      name:      product.name,
      image:     product.images?.[0] || '',
      price:     cardPrice || product.price,
      qty:       1,
      slug:      product.slug,
    })
    toast.success('Added to cart!')
  }

  return (
    <div className="bg-white border border-f-border rounded-2xl overflow-hidden group hover:border-f-purple hover:shadow-lg transition-all duration-300">

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="block relative h-48 bg-f-soft overflow-hidden group">
        {product.images && product.images.length > 0 && product.images[0] ? (
          <img 
            src={product.images[0]} 
            alt={`${product.name} - Premium Adult Wellness Product`} 
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-5xl text-f-accent/40 group-hover:scale-110 transition-transform duration-500">
            🛍️
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-f-pink text-white text-[9px] font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
          )}
          {product.isFeatured && (
            <span className="bg-f-purple text-white text-[9px] font-bold px-2 py-0.5 rounded-full">HOT</span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">LOW STOCK</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/product/${product.slug}`} aria-label={`View details for ${product.name}`}>
          <p className="text-sm font-medium text-f-dark leading-snug hover:text-f-purple transition line-clamp-2 mb-1">{product.name}</p>
        </Link>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-f-pink text-f-pink" />
            <span className="text-[11px] text-f-pink font-bold">{product.rating.toFixed(1)}</span>
            <span className="text-[11px] text-f-gray">({product.reviewCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-base font-semibold text-f-dark">₹{(cardPrice || product.price).toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-f-gray line-through">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Card price indicator */}
        {tier && cardPrice < product.price && (
          <div className="flex items-center gap-1 mb-3">
            <Zap size={10} className="text-f-pink fill-f-pink" />
            <span className="text-[10px] text-f-pink font-semibold">{discPct}% {tier} card discount applied</span>
          </div>
        )}

        {/* Add to cart */}
        <button onClick={handleAdd} disabled={product.stock === 0} aria-label={`Add ${product.name} to Cart`}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-f-purple text-white text-xs font-medium rounded-xl hover:bg-f-mid transition disabled:opacity-40 disabled:cursor-not-allowed">
          <ShoppingBag size={13} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
