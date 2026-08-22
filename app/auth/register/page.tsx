'use client'
import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Zap, Eye, EyeOff, Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '' 
  })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // Step 1: Validate form and send OTP
  const handleInitiateRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Please enter your full name')
    if (!form.email.trim()) return toast.error('Please enter your email address')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match')

    setSendingOtp(true)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          name: form.name.trim(),
          type: 'register'
        })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || 'Failed to send verification code')
        setSendingOtp(false)
        return
      }

      toast.success('Verification code sent to your email!')
      setStep('otp')
      setResendTimer(60)
      setCanResend(false)
    } catch (err: any) {
      toast.error('Network error. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return
    setSendingOtp(true)
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          name: form.name.trim(),
          type: 'register'
        })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || 'Failed to resend code')
      } else {
        toast.success('New verification code sent!')
        setResendTimer(60)
        setCanResend(false)
      }
    } catch (err) {
      toast.error('Failed to resend code')
    } finally {
      setSendingOtp(false)
    }
  }

  // Step 2: Verify OTP, create account & login
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length < 6) return toast.error('Please enter the complete 6-digit OTP')

    setLoading(true)
    try {
      const { confirmPassword, ...submitData } = form
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...submitData,
          otp: otp.trim()
        })
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || 'Registration failed')
        setLoading(false)
        return
      }

      // Auto sign-in with newly created credentials
      const signInRes = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false
      })

      if (signInRes?.ok) {
        toast.success('Account created! Your Silver Card is ready 🎉')
        router.push('/')
      } else {
        toast.success('Account created successfully! Please sign in.')
        router.push('/auth/login')
      }
    } catch (err) {
      toast.error('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-f-dark flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-3xl text-f-light tracking-widest">
            FUN<span className="text-f-accent">troo</span>
          </Link>
          <p className="text-f-muted text-sm mt-2">
            {step === 'form' ? 'Create your free account' : 'Verify your email address'}
          </p>
        </div>

        {/* Card preview */}
        <div className="card-silver card-shine rounded-xl p-4 mb-4 text-white flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[9px] opacity-60 uppercase tracking-widest">You'll receive</p>
            <p className="font-display text-lg">Funtroo Silver Card</p>
          </div>
          <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Zap size={13} className="fill-white" />
            <span className="text-sm font-bold">5% OFF</span>
          </div>
        </div>

        <div className="bg-f-grayBg border border-f-border rounded-2xl p-7 shadow-2xl">
          {step === 'form' ? (
            <>
              {/* Social Sign Up */}
              <button 
                type="button"
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className="w-full py-2.5 bg-white text-f-dark rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-f-light transition mb-6 shadow-sm"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-f-border"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                  <span className="bg-f-grayBg px-2 text-f-muted">Or with email &amp; OTP</span>
                </div>
              </div>

              <form onSubmit={handleInitiateRegister} className="space-y-4">
                <div>
                  <label className="block text-xs text-f-muted mb-1.5 font-medium">Full Name</label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#0E0B14] border border-[#2D2235] rounded-xl px-3.5 py-2.5 text-sm text-f-light outline-none focus:border-f-accent placeholder:text-f-muted/60 transition"
                    required 
                    placeholder="Nency Arora" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs text-f-muted mb-1.5 font-medium">Email</label>
                    <input 
                      type="email" 
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-[#0E0B14] border border-[#2D2235] rounded-xl px-3.5 py-2.5 text-sm text-f-light outline-none focus:border-f-accent placeholder:text-f-muted/60 transition"
                      required 
                      placeholder="nency@gmail.com" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-f-muted mb-1.5 font-medium">Phone</label>
                    <input 
                      type="tel" 
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full bg-[#0E0B14] border border-[#2D2235] rounded-xl px-3.5 py-2.5 text-sm text-f-light outline-none focus:border-f-accent placeholder:text-f-muted/60 transition"
                      placeholder="+91 98765 43210" 
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs text-f-muted mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <input 
                      type={showPass ? "text" : "password"} 
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      className="w-full bg-[#0E0B14] border border-[#2D2235] rounded-xl px-3.5 py-2.5 text-sm text-f-light outline-none focus:border-f-accent placeholder:text-f-muted/60 transition pr-10"
                      required 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPass(!showPass)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-f-muted hover:text-f-accent transition"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs text-f-muted mb-1.5 font-medium">Confirm Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirm ? "text" : "password"} 
                      value={form.confirmPassword}
                      onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      className="w-full bg-[#0E0B14] border border-[#2D2235] rounded-xl px-3.5 py-2.5 text-sm text-f-light outline-none focus:border-f-accent placeholder:text-f-muted/60 transition pr-10"
                      required 
                      placeholder="••••••••" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirm(!showConfirm)} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-f-muted hover:text-f-accent transition"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-f-muted leading-relaxed">
                  By signing up you agree to our <Link href="/terms" className="text-f-accent hover:underline">Terms</Link>. You must be 18+ to use Funtroo.
                </p>
                
                <button 
                  type="submit" 
                  disabled={sendingOtp}
                  className="w-full py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid shadow-lg shadow-f-purple/20 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {sendingOtp ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Continue with Email OTP'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Step 2: OTP Verification Screen */
            <div>
              <button 
                type="button"
                onClick={() => setStep('form')}
                className="inline-flex items-center gap-1.5 text-xs text-f-muted hover:text-f-light mb-5 transition"
              >
                <ArrowLeft size={14} /> Back to details
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-f-purple/20 border border-f-purple/40 text-f-accent flex items-center justify-center mx-auto mb-3">
                  <Mail size={22} />
                </div>
                <h2 className="text-lg font-semibold text-f-light">Check your email</h2>
                <p className="text-xs text-f-muted mt-1.5">
                  We've sent a 6-digit verification code to
                </p>
                <p className="text-xs font-semibold text-f-accent mt-0.5 break-all">
                  {form.email}
                </p>
              </div>

              <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                <div>
                  <label className="block text-center text-xs text-f-muted mb-2 font-medium">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-[#0E0B14] border-2 border-[#2D2235] focus:border-f-accent text-center rounded-xl py-3.5 text-2xl font-bold tracking-[0.4em] text-f-light outline-none transition"
                    placeholder="••••••"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-f-muted">
                  <span>Didn't receive code?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={sendingOtp}
                      className="text-f-accent hover:underline font-medium transition"
                    >
                      {sendingOtp ? 'Sending...' : 'Resend OTP'}
                    </button>
                  ) : (
                    <span className="text-f-muted/70">
                      Resend in {resendTimer}s
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid shadow-lg shadow-f-purple/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      Verifying &amp; Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Verify OTP &amp; Create Account
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-xs text-f-muted mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-f-accent hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
