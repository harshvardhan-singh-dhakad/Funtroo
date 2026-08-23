export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCollection, createDocument, updateDocument, deleteDocument } from '@/lib/firestore'
import bcrypt from 'bcryptjs'

const checkAuth = async () => {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'superadmin') return false
  return true
}

export async function GET() {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const customers = await getCollection('customers')
  const staff = customers.filter((c: any) => c.role === 'admin' || c.role === 'superadmin')
  return NextResponse.json({ staff })
}

export async function POST(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const hashed = await bcrypt.hash(body.password, 10)
  
  await createDocument('customers', {
    name: body.name,
    email: body.email,
    password: hashed,
    role: 'admin',
    permissions: body.permissions || [],
    addresses: [],
    card: { tier: 'silver', number: 'STAFF'+Date.now().toString().slice(-4), totalSpend: 0, discountPct: 0, joinedAt: new Date().toISOString() },
    wishlist: [], browsingHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  })
  return NextResponse.json({ success: true })
}

export async function PUT(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const data: any = { name: body.name, email: body.email, permissions: body.permissions || [], updatedAt: new Date().toISOString() }
  if (body.password) {
    data.password = await bcrypt.hash(body.password, 10)
  }
  await updateDocument('customers', body.id, data)
  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  if (!(await checkAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  await deleteDocument('customers', id)
  return NextResponse.json({ success: true })
}


