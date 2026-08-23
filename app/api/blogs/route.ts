export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getCollection, createDocument, updateDocument, getCollectionCount, where, orderBy, limit } from '@/lib/firestore'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { IBlog } from '@/models/Blog'
import { QueryConstraint } from 'firebase/firestore'

// Auto-publish scheduled posts that are due
async function autoPublish() {
  const now = new Date().toISOString()
  const scheduled = await getCollection<IBlog>('blogs', [
    where('status', '==', 'scheduled'),
    where('scheduledAt', '<=', now)
  ])

  for (const blog of scheduled) {
    if (blog.id) {
      await updateDocument('blogs', blog.id, {
        status: 'published',
        publishedAt: now
      })
    }
  }
}

// Estimate read time (avg 200 words/min)
function calcReadTime(html: string): number {
  const text  = html.replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

// Auto-generate slug
function makeSlug(title: string): string {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').slice(0, 80)
}

export async function GET(req: NextRequest) {
  try {
    await autoPublish()

    const { searchParams } = new URL(req.url)
    const page     = parseInt(searchParams.get('page')     || '1')
    const pageSize = parseInt(searchParams.get('limit')    || '10')
    const status   = searchParams.get('status')   || ''
    const category = searchParams.get('category') || ''
    const adminMode= searchParams.get('admin')     === 'true'

    if (adminMode) {
      const session = await getServerSession(authOptions)
      if (!session || !['admin', 'superadmin'].includes((session.user as any)?.role)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const constraints: QueryConstraint[] = []
    if (!adminMode) {
      constraints.push(where('status', '==', 'published'))
    } else if (status) {
      constraints.push(where('status', '==', status))
    }

    if (category) {
      constraints.push(where('category', '==', category))
    }

    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(pageSize * page))

    const [blogs, total] = await Promise.all([
      getCollection<IBlog>('blogs', constraints),
      getCollectionCount('blogs', constraints.filter(c => c.type !== 'limit' && c.type !== 'orderBy'))
    ])

    const paginatedBlogs = blogs.slice((page - 1) * pageSize, page * pageSize)

    return NextResponse.json({ 
      blogs: paginatedBlogs, 
      total, 
      page, 
      pages: Math.ceil(total / pageSize) 
    })
  } catch (e: any) {
    console.error('Blog GET Error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['admin', 'superadmin'].includes((session.user as any)?.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await req.json()

    if (!body.slug && body.title) body.slug = makeSlug(body.title)
    if (body.content) body.readTime = calcReadTime(body.content)
    if (body.status === 'published' && !body.publishedAt) body.publishedAt = new Date().toISOString()

    if (!body.seo) body.seo = {}
    if (!body.seo.metaTitle && body.title)  body.seo.metaTitle = body.title.slice(0, 60)
    if (!body.seo.metaDesc  && body.excerpt) body.seo.metaDesc = body.excerpt.slice(0, 160)

    const blogId = await createDocument('blogs', {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ blog: { id: blogId, ...body } }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}


