import { NextRequest, NextResponse } from 'next/server'
import { getDocument, getCollection, updateDocument, deleteDocument, where, limit, increment } from '@/lib/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IBlog } from '@/models/Blog'

function calcReadTime(html: string): number {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    let blog = await getDocument<IBlog>('blogs', params.id)
    let isId = true

    if (!blog) {
      const results = await getCollection<IBlog>('blogs', [
        where('slug', '==', params.id),
        limit(1)
      ])
      blog = results[0] || null
      isId = false
    }

    if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 })

    // Increment views if accessed by slug
    if (!isId && blog.id) {
      await updateDocument('blogs', blog.id, { views: increment(1) as any })
    }

    return NextResponse.json({ blog })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()

    if (body.content) body.readTime = calcReadTime(body.content)

    // Set publishedAt when first publishing
    if (body.status === 'published') {
      const existing = await getDocument<IBlog>('blogs', params.id)
      if (existing && existing.status !== 'published') {
        body.publishedAt = new Date().toISOString()
      }
    }

    await updateDocument('blogs', params.id, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await deleteDocument('blogs', params.id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
