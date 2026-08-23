import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCxaXgTcYCZxzLvE6UKy9f4MkrEdJlL44c',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'funtrooo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'funtrooo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'funtrooo.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '567105046529',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:567105046529:web:4415be0780089782879800',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-4SYKKE1NLN',
};

// Initialize Firebase safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
let db: Firestore;
try {
  db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true, experimentalForceLongPolling: true } as any);
} catch (e) {
  db = getFirestore(app);
}
const storage = getStorage(app);
const auth = getAuth(app);

export { app, db, storage, auth };
