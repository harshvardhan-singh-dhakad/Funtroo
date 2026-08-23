'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Zap, Eye, EyeOff, RefreshCw } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      return toast.error('Please fill in both email and password')
    }

    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
        redirect: false
      })

      if (res?.ok) {
        toast.success('Welcome back!')
        // We don't have role immediately in client without useSession, so redirect to /admin by default if they came for admin
        router.push('/admin')
      } else {
        toast.error('Invalid email or password. Please check your details.')
      }
    } catch (err) {
      toast.error('An error occurred during sign in.')
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
          <p className="text-f-muted text-sm mt-2">Sign in to your account</p>
        </div>

        <div className="bg-f-grayBg border border-f-border rounded-2xl p-7 shadow-2xl">
          {/* Social Login 
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
              <span className="bg-f-grayBg px-2 text-f-muted">Or with email &amp; password</span>
            </div>
          </div>
          */}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-f-muted mb-1.5 font-medium">Email Address</label>
              <input 
                type="email" 
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full bg-[#0E0B14] border border-[#2D2235] rounded-xl px-3.5 py-2.5 text-sm text-f-light outline-none focus:border-f-accent placeholder:text-f-muted/60 transition"
                required 
                placeholder="nency@gmail.com" 
              />
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

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid shadow-lg shadow-f-purple/20 transition disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-f-muted mt-6">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-f-accent hover:underline font-medium">
              Create one free
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-f-grayBg rounded-xl border border-f-border text-center">
          <p className="text-xs text-f-accent flex items-center justify-center gap-1">
            <Zap size={12} className="fill-f-accent" /> Sign up &amp; get a free loyalty card — 5% off every order
          </p>
        </div>
      </div>
    </div>
  )
}
