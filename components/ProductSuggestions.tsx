'use client'
import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface Props {
  category: string
  exclude: string
  tags?: string[]
  title?: string
}

export default function ProductSuggestions({ category, exclude, tags = [], title = 'You May Also Like' }: Props) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const params = new URLSearchParams({
      category,
      exclude,
      tags: tags.join(','),
      limit: '4',
    })
    fetch(`/api/suggestions?${params}`)
      .then(r => r.json())
      .then(d => { setProducts(d.suggestions || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, exclude])

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-f-border/30 rounded-2xl h-64 animate-pulse" />
      ))}
    </div>
  )

  if (products.length === 0) return null

  return (
    <section>
      <h2 className="font-display text-2xl text-f-dark mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  )
}
