'use client'
import { useEffect, useState } from 'react'
import { createDocument, getCollection, updateDocument } from '@/lib/firestore'
import bcrypt from 'bcryptjs'

export default function SeedPage() {
  const [msg, setMsg] = useState('Seeding...')

  useEffect(() => {
    const seed = async () => {
      try {
        const email = 'deepakdhakad5421@gmail.com'
        const passwordPlain = 'FUNtroo@7811'
        const users = await getCollection('customers')
        const existingUser = users.find((u: any) => u.email === email)
        
        // Use a simple hash for client side, wait bcrypt works in browser? 
        // bcryptjs works in browser.
        const hashedPassword = await bcrypt.hash(passwordPlain, 10)
        
        const superAdminData = {
          name: 'Deepak Dhakad',
          email: email,
          password: hashedPassword,
          role: 'superadmin',
          permissions: ['blogs', 'products', 'orders', 'staff'],
          addresses: [],
          card: { tier: 'platinum', number: 'SUP1234', totalSpend: 0, discountPct: 15, joinedAt: new Date().toISOString() },
          wishlist: [], browsingHistory: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
        }
        
        if (!existingUser) {
          await createDocument('customers', superAdminData)
          setMsg('Super Admin created successfully!')
        } else {
          await updateDocument('customers', existingUser.id, superAdminData)
          setMsg('Existing user updated to Super Admin!')
        }
      } catch (err: any) {
        setMsg('Error: ' + err.message)
      }
    }
    seed()
  }, [])

  return <div>{msg}</div>
}
