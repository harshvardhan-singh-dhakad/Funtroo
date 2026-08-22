import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getCollection, createDocument, getDocument, deleteDocument, getCollectionCount, where, orderBy, limit } from '@/lib/firestore'
import { generateCardNumber } from '@/lib/loyalty'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ICustomer } from '@/models/Customer'
import { QueryConstraint } from 'firebase/firestore'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, phone, otp } = await req.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    
    // Check if customer already exists
    const exists = await getCollection<ICustomer>('customers', [
      where('email', '==', normalizedEmail),
      limit(1)
    ])
    
    if (exists.length > 0) {
      return NextResponse.json({ error: 'Email is already registered. Please sign in.' }, { status: 400 })
    }

    // Verify OTP
    const docId = `otp_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
    const otpRecord = await getDocument<{
      email: string
      otp: string
      expiresAt: string
      verified: boolean
    }>('otps', docId)

    if (!otpRecord) {
      return NextResponse.json({ error: 'Please request and verify the email OTP first.' }, { status: 400 })
    }

    const isDirectMatch = otp && otpRecord.otp === otp.toString().trim()
    const isAlreadyVerified = otpRecord.verified === true
    const isExpired = new Date(otpRecord.expiresAt).getTime() < Date.now()

    if (isExpired) {
      return NextResponse.json({ error: 'Verification OTP has expired. Please request a new code.' }, { status: 400 })
    }

    if (!isDirectMatch && !isAlreadyVerified) {
      return NextResponse.json({ error: 'Invalid or unverified OTP.' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    const customerData: any = {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || '',
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

    // Clean up OTP record
    try {
      await deleteDocument('otps', docId)
    } catch (e) {
      console.warn('Failed to delete used OTP record:', e)
    }

    return NextResponse.json({ success: true, id: customerId })
  } catch (e: any) {
    console.error('Customer registration error:', e)
    return NextResponse.json({ error: e.message || 'Registration failed' }, { status: 500 })
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
