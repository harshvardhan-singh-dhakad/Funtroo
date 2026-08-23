const { initializeApp } = require('firebase/app')
const { getFirestore, collection, getDocs, addDoc, updateDoc, doc, query, where } = require('firebase/firestore')
const bcrypt = require('bcryptjs')

const firebaseConfig = {
  apiKey: 'AIzaSyCxaXgTcYCZxzLvE6UKy9f4MkrEdJlL44c',
  authDomain: 'funtrooo.firebaseapp.com',
  projectId: 'funtrooo',
  storageBucket: 'funtrooo.firebasestorage.app',
  messagingSenderId: '567105046529',
  appId: '1:567105046529:web:4415be0780089782879800',
  measurementId: 'G-4SYKKE1NLN'
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function seed() {
  const email = 'deepakdhakad5421@gmail.com'
  const passwordPlain = 'FUNtroo@7811'
  
  try {
    const q = query(collection(db, 'customers'), where('email', '==', email))
    const snap = await getDocs(q)
    
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
      await addDoc(collection(db, 'customers'), superAdminData)
      console.log('User created!')
    } else {
      const docId = snap.docs[0].id
      await updateDoc(doc(db, 'customers', docId), superAdminData)
      console.log('User updated!')
    }
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

seed()
