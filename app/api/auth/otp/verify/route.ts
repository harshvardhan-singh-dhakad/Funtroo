import { NextRequest, NextResponse } from 'next/server'
import { getDocument, updateDocument } from '@/lib/firestore'

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required.' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const docId = `otp_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`
    
    const record = await getDocument<{
      email: string
      otp: string
      expiresAt: string
      verified: boolean
    }>('otps', docId)

    if (!record) {
      return NextResponse.json({ error: 'No OTP found for this email. Please request a new code.' }, { status: 400 })
    }

    // Check expiry
    if (new Date(record.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new code.' }, { status: 400 })
    }

    // Check match
    if (record.otp !== otp.toString().trim()) {
      return NextResponse.json({ error: 'Invalid verification code. Please check and try again.' }, { status: 400 })
    }

    // Mark as verified
    await updateDocument('otps', docId, {
      verified: true,
      verifiedAt: new Date().toISOString()
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Email verified successfully!' 
    })
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json({ error: error.message || 'Failed to verify OTP.' }, { status: 500 })
  }
}
