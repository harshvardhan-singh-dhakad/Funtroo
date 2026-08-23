import { NextRequest, NextResponse } from 'next/server'
import { getCollection, createDocument, where, limit } from '@/lib/firestore'
import { sendOtpEmail } from '@/lib/mail'
import { ICustomer } from '@/models/Customer'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, name, type = 'register' } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address format.' }, { status: 400 })
    }

    // Check if user already exists when registering
    if (type === 'register') {
      const existing = await getCollection<ICustomer>('customers', [
        where('email', '==', normalizedEmail),
        limit(1)
      ])

      if (existing.length > 0) {
        return NextResponse.json({ error: 'An account with this email already exists. Please sign in.' }, { status: 400 })
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const docId = `otp_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
    await createDocument('otps', {
      email: normalizedEmail,
      otp,
      expiresAt,
      verified: false,
      createdAt: new Date().toISOString()
    }, docId)

    await sendOtpEmail({ email: normalizedEmail, otp, name })

    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email.' 
    })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: error.message || 'Failed to send OTP.' }, { status: 500 })
  }
}

