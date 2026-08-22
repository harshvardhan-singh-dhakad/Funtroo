import { NextRequest, NextResponse } from 'next/server'
import { getDocument, updateDocument } from '@/lib/firestore'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const docId = `otp_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`

    const record: any = await getDocument('otps', docId)

    if (!record) {
      return NextResponse.json({ error: 'Invalid or expired OTP code. Please request a new one.' }, { status: 400 })
    }

    if (record.otp !== otp.trim()) {
      return NextResponse.json({ error: 'Incorrect verification code. Please check your email.' }, { status: 400 })
    }

    if (new Date(record.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Verification code has expired. Please click resend.' }, { status: 400 })
    }

    await updateDocument('otps', docId, { verified: true, verifiedAt: new Date().toISOString() })

    return NextResponse.json({ success: true, message: 'Email verified successfully.' })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: error.message || 'Verification failed.' }, { status: 500 })
  }
}
