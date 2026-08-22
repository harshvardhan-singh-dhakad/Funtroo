'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth'
import { ICustomer } from '@/models/Customer'

interface AuthContextType {
  user: User | null
  customerData: ICustomer | null
  loading: boolean
  signOut: () => Promise<void>
  refreshCustomerData: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  customerData: null,
  loading: true,
  signOut: async () => {},
  refreshCustomerData: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [customerData, setCustomerData] = useState<ICustomer | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCustomerData = async (email: string) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        setCustomerData(data)
      } else {
        setCustomerData(null)
      }
    } catch (error) {
      console.error("Error fetching customer data:", error)
      setCustomerData(null)
    }
  }

  const refreshCustomerData = async () => {
    if (user?.email) {
      await fetchCustomerData(user.email)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        if (firebaseUser.email) {
          await fetchCustomerData(firebaseUser.email)
        }
      } else {
        setUser(null)
        setCustomerData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signOut = async () => {
    await firebaseSignOut(auth)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, customerData, loading, signOut, refreshCustomerData }}>
      {children}
    </AuthContext.Provider>
  )
}
