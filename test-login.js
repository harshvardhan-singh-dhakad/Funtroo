const bcrypt = require('bcryptjs')
const { initializeApp } = require('firebase/app')
const { getFirestore, initializeFirestore, collection, getDocs, query, where, limit } = require('firebase/firestore')

const firebaseConfig = {
  apiKey: 'AIzaSyCxaXgTcYCZxzLvE6UKy9f4MkrEdJlL44c',
  authDomain: 'funtrooo.firebaseapp.com',
  projectId: 'funtrooo'
};

const app = initializeApp(firebaseConfig)
const db = initializeFirestore(app, { experimentalForceLongPolling: true })

async function test() {
  console.log('Testing login...')
  const q = query(collection(db, 'customers'), where('email', '==', 'deepakdhakad5421@gmail.com'), limit(1))
  const snap = await getDocs(q)
  if (snap.empty) {
    console.log('User not found!')
    process.exit(1)
  }
  const user = snap.docs[0].data()
  console.log('User found:', user.email)
  const valid = await bcrypt.compare('FUNtroo@7811', user.password)
  console.log('Password valid:', valid)
  process.exit(0)
}
test()
