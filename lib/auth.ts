import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { getCollection, where, limit, createDocument } from '@/lib/firestore'
import { ICustomer } from '@/models/Customer'
import { generateCardNumber } from '@/lib/loyalty'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        // Find user in Firestore
        const users = await getCollection<ICustomer>('customers', [
          where('email', '==', credentials.email.toLowerCase()),
          limit(1)
        ])
        
        const user = users[0]
        if (!user || !user.password) return null
        
        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null
        
        return {
          id:   user.id as string,
          name: user.name,
          email:user.email,
          role: user.role,
          card: user.card,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        // Check if user exists in Firestore
        const users = await getCollection<ICustomer>('customers', [
          where('email', '==', user.email?.toLowerCase()),
          limit(1)
        ])

        if (users.length === 0) {
          // Create new user for Google login
          const customerData: Partial<ICustomer> = {
            name: user.name || 'Funtroo User',
            email: user.email?.toLowerCase() || '',
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
          await createDocument('customers', customerData)
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) { 
        token.id = user.id; 
        token.role = (user as any).role || 'customer'; 
        token.card = (user as any).card;

        // If it's a social login, we might need to fetch the card/role from Firestore
        if (account?.provider === 'google' && !token.card) {
          const users = await getCollection<ICustomer>('customers', [
            where('email', '==', user.email?.toLowerCase()),
            limit(1)
          ])
          if (users[0]) {
            token.id = users[0].id;
            token.role = users[0].role;
            token.card = users[0].card;
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) { 
        (session.user as any).id = token.id; 
        (session.user as any).role = token.role; 
        (session.user as any).card = token.card 
      }
      return session
    },
  },
  pages: { signIn: '/auth/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}
