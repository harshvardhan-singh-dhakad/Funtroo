import { NextRequest, NextResponse } from 'next/server'
import { getCollection, where, orderBy, limit } from '@/lib/firestore'
import { IProduct } from '@/models/Product'
import { QueryConstraint } from 'firebase/firestore'
import { PRODUCTS_DATA } from '@/lib/products-data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || ''
    const exclude  = (searchParams.get('exclude') || '').split(',').filter(Boolean)
    const limitVal = parseInt(searchParams.get('limit') || '4')

    let suggestions: any[] = []

    try {
      // 1. Same category bestsellers
      if (category) {
        const constraints: QueryConstraint[] = [
          where('isActive', '==', true),
          where('category', '==', category),
          orderBy('soldCount', 'desc'),
          limit(limitVal + exclude.length)
        ]
        const results = await getCollection<IProduct>('products', constraints)
        suggestions = results.filter(p => !exclude.includes(p.slug)).slice(0, limitVal)
      }

      // 2. Fill with store bestsellers if needed
      if (suggestions.length < limitVal) {
        const remainingLimit = limitVal - suggestions.length
        const constraints: QueryConstraint[] = [
          where('isActive', '==', true),
          orderBy('soldCount', 'desc'),
          limit(remainingLimit + exclude.length + suggestions.length)
        ]
        const results = await getCollection<IProduct>('products', constraints)
        const filled = results.filter(p => 
          !exclude.includes(p.slug) && 
          !suggestions.find(s => s.slug === p.slug)
        ).slice(0, remainingLimit)
        
        suggestions = [...suggestions, ...filled]
      }
    } catch (e) {
      suggestions = []
    }

    // Fallback using PRODUCTS_DATA
    if (!suggestions || suggestions.length < limitVal) {
      let staticCategoryItems = PRODUCTS_DATA.filter(p => 
        p.category === category && !exclude.includes(p.slug)
      )
      let staticOthers = PRODUCTS_DATA.filter(p => 
        !exclude.includes(p.slug) && !staticCategoryItems.some(c => c.slug === p.slug)
      )

      const combined = [...staticCategoryItems, ...staticOthers]
      suggestions = combined.slice(0, limitVal)
    }

    return NextResponse.json({ suggestions })
  } catch (e: any) {
    console.error('Suggestions Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
