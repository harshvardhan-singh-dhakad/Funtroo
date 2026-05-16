import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getCollection, createDocument, getCollectionCount, where, orderBy, limit } from '@/lib/firestore'
import { generateCardNumber } from '@/lib/loyalty'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ICustomer } from '@/models/Customer'
import { QueryConstraint } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone } = await req.json()
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const normalizedEmail = email.toLowerCase()
    
    // Check if customer exists
    const exists = await getCollection<ICustomer>('customers', [
      where('email', '==', normalizedEmail),
      limit(1)
    ])
    
    if (exists.length > 0) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 10)
    const customerData: any = {
      name,
      email: normalizedEmail,
      phone: phone || '',
      password: hashed,
      role: 'customer',
      addresses: [],
      card: { 
        tier: 'silver', 
        number: generateCardNumber(), 
        totalSpend: 0, 
        discountPct: 5,
        joinedAt: new Date().toISOString()
      },
      wishlist: [],
      browsingHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const customerId = await createDocument('customers', customerData)

    return NextResponse.json({ success: true, id: customerId })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page  = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('limit') || '20')

    const constraints: QueryConstraint[] = [
      orderBy('createdAt', 'desc'),
      limit(pageSize * page)
    ]

    const [customers, total] = await Promise.all([
      getCollection<ICustomer>('customers', constraints),
      getCollectionCount('customers')
    ])

    // Exclude passwords and paginate locally
    const sanitizedCustomers = customers
      .slice((page - 1) * pageSize, page * pageSize)
      .map(c => {
        const { password, ...rest } = c as any
        return rest
      })

    return NextResponse.json({ 
      customers: sanitizedCustomers, 
      total, 
      page, 
      pages: Math.ceil(total / pageSize) 
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
