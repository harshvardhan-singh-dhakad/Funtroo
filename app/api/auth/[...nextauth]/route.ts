export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

async function auth(req: NextRequest, ctx: any) {
  if (process.env.NODE_ENV === 'production') {
    process.env.NEXTAUTH_URL = req.nextUrl.origin;
  }
  return NextAuth(authOptions)(req, ctx);
}

export { auth as GET, auth as POST };
