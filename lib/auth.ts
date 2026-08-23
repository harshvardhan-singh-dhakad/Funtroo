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
        console.log('--- START AUTHORIZE ---')
        console.log('Credentials received:', credentials?.email)
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing email or password')
          return null
        }
        
        try {
          const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCxaXgTcYCZxzLvE6UKy9f4MkrEdJlL44c'
          
          // 1. Verify user exactly via Firebase Authentication (Rules of Firebase)
          console.log('Verifying via Firebase Authentication...')
          const authRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: credentials.email, password: credentials.password, returnSecureToken: true })
          })
          
          const authData = await authRes.json()
          
          if (!authRes.ok || !authData.localId) {
            console.log('Firebase Auth rejected login:', authData.error?.message)
            return null
          }
          
          const firebaseUid = authData.localId // The exact UID from Firebase Auth tab

          // 2. Fetch role and permissions from Firestore Database 
          console.log('Fetching role from Firestore Database...')
          const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'funtrooo'
          const dbRes = await fetch(`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/customers`)
          const dbData = await dbRes.json()
          
          let user = null;
          let userId = firebaseUid; // Default to Auth UID
          
          if (dbData.documents) {
            for (const doc of dbData.documents) {
              const emailField = doc.fields.email?.stringValue
              if (emailField && emailField.toLowerCase() === credentials.email.toLowerCase()) {
                user = doc.fields
                userId = doc.name.split('/').pop()
                break
              }
            }
          }
          
          return {
            id: userId,
            name: user?.name?.stringValue || authData.email.split('@')[0],
            email: authData.email,
            role: user?.role?.stringValue || 'customer',
            card: {
              tier: user?.card?.mapValue?.fields?.tier?.stringValue || 'silver',
              number: user?.card?.mapValue?.fields?.number?.stringValue || '',
              totalSpend: user?.card?.mapValue?.fields?.totalSpend?.integerValue || 0,
              discountPct: user?.card?.mapValue?.fields?.discountPct?.integerValue || 0
            },
            permissions: user?.permissions?.arrayValue?.values?.map((v: any) => v.stringValue) || [],
          }
        } catch (error) {
          console.error('AUTHORIZE ERROR:', error)
          return null
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
        token.permissions = (user as any).permissions || [];

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
            token.permissions = users[0].permissions || [];
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) { 
        (session.user as any).id = token.id; 
        (session.user as any).role = token.role; 
        (session.user as any).card = token.card;
        (session.user as any).permissions = token.permissions || [];
      }
      return session
    },
  },
  pages: { signIn: '/auth/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
}
