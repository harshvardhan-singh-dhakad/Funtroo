import { NextResponse } from 'next/server'
import { getCollection, where, limit, createDocument } from '@/lib/firestore'
import { ICustomer } from '@/models/Customer'
import { generateCardNumber } from '@/lib/loyalty'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    const users = await getCollection<ICustomer>('customers', [
      where('email', '==', email.toLowerCase()),
      limit(1)
    ])

    if (users.length > 0) {
      return NextResponse.json(users[0])
    }

    // If user doesn't exist (e.g. fresh Google Login), create them
    const newCustomer: Partial<ICustomer> = {
      name: email.split('@')[0], // Fallback name
      email: email.toLowerCase(),
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
    
    const docId = await createDocument('customers', newCustomer)
    return NextResponse.json({ id: docId, ...newCustomer })
  } catch (error) {
    console.error('Error in user profile route:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
