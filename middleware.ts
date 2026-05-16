import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === 'admin'
    const { pathname } = req.nextUrl

    // If it's an admin route but user is not admin, redirect to home
    if ((pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && !isAdmin) {
      return NextResponse.redirect(new URL('/?error=unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/auth/login',
    },
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
