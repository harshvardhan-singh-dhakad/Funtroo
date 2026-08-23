require('dotenv').config({ path: '.env.local' })
const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const bcrypt = require('bcryptjs')

const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  })
})

const db = getFirestore()

async function createSuperAdmin() {
  const email = 'deepakdhakad5421@gmail.com'
  const passwordPlain = 'FUNtroo@7811'
  
  try {
    const snap = await db.collection('customers').where('email', '==', email).get()
    
    const hashedPassword = await bcrypt.hash(passwordPlain, 10)
    
    const superAdminData = {
      name: 'Deepak Dhakad',
      email: email,
      password: hashedPassword,
      role: 'superadmin',
      permissions: ['blogs', 'products', 'orders', 'staff'],
      addresses: [],
      card: {
        tier: 'platinum',
        number: 'SUP' + Date.now().toString().slice(-8),
        totalSpend: 0,
        discountPct: 15,
        joinedAt: new Date().toISOString()
      },
      wishlist: [],
      browsingHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    if (snap.empty) {
      await db.collection('customers').add(superAdminData)
      console.log('Super Admin created successfully!')
    } else {
      const docId = snap.docs[0].id
      await db.collection('customers').doc(docId).update({
        name: 'Deepak Dhakad',
        password: hashedPassword,
        role: 'superadmin',
        permissions: ['blogs', 'products', 'orders', 'staff'],
        updatedAt: new Date().toISOString()
      })
      console.log('Existing user updated to Super Admin!')
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Error creating super admin:', error)
    process.exit(1)
  }
}

createSuperAdmin()
