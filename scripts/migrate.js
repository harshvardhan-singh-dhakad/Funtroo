const { MongoClient } = require('mongodb');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, setDoc, doc } = require('firebase/firestore');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const MONGODB_URI = process.env.MONGODB_URI;
const collectionsToMigrate = ['products', 'blogs', 'customers', 'orders', 'coupons'];

async function migrate() {
  if (!MONGODB_URI || MONGODB_URI.includes('YOUR_USER')) {
    console.error('Error: Please provide a valid MONGODB_URI in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const mongoDb = client.db();

    for (const colName of collectionsToMigrate) {
      console.log(`Migrating ${colName}...`);
      const documents = await mongoDb.collection(colName).find({}).toArray();
      
      for (const docData of documents) {
        const { _id, ...data } = docData;
        const idString = _id.toString();
        
        await setDoc(doc(db, colName, idString), {
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : new Date().toISOString(),
        });
      }
      console.log(`Migrated ${documents.length} documents from ${colName}`);
    }

    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await client.close();
  }
}

migrate();
