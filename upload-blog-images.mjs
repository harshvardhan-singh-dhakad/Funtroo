import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as fs from 'fs';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCxaXgTcYCZxzLvE6UKy9f4MkrEdJlL44c',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'funtrooo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'funtrooo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'funtrooo.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '567105046529',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:567105046529:web:4415be0780089782879800',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-4SYKKE1NLN',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function run() {
  const files = [
    { local: 'public/blog-images/mood.jpg', remote: 'blogs/mood.jpg' },
    { local: 'public/blog-images/abstract.jpg', remote: 'blogs/abstract.jpg' },
    { local: 'public/blog-images/spa.jpg', remote: 'blogs/spa.jpg' }
  ];

  const urls = {};

  for (const file of files) {
    if (!fs.existsSync(file.local)) {
       console.log('Skipping', file.local, 'not found');
       continue;
    }
    const buffer = fs.readFileSync(file.local);
    const storageRef = ref(storage, file.remote);
    
    console.log('Uploading', file.remote, '...');
    const snapshot = await uploadBytes(storageRef, new Uint8Array(buffer), { contentType: 'image/jpeg' });
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Uploaded:', downloadURL);
    urls[file.remote] = downloadURL;
  }
  
  // Now update the blog in Firestore
  console.log('Fetching blogs from REST API...');
  const res = await fetch('https://firestore.googleapis.com/v1/projects/funtrooo/databases/(default)/documents/blogs');
  const data = await res.json();
  
  const targetBlog = data.documents.find(d => d.fields.slug?.stringValue === 'ultimate-guide-elevating-intimacy-wellness');
  if (!targetBlog) {
    console.log('Blog not found!');
    return;
  }
  
  const blogId = targetBlog.name.split('/').pop();
  console.log('Found blog ID:', blogId);
  
  let content = targetBlog.fields.content.stringValue;
  content = content.replace(/\/blog-images\/abstract\.jpg/g, urls['blogs/abstract.jpg']);
  content = content.replace(/\/blog-images\/spa\.jpg/g, urls['blogs/spa.jpg']);
  
  const updatePayload = {
    fields: {
      ...targetBlog.fields,
      featuredImage: { stringValue: urls['blogs/mood.jpg'] },
      seo: {
        mapValue: {
          fields: {
             ...targetBlog.fields.seo.mapValue.fields,
             ogImage: { stringValue: urls['blogs/mood.jpg'] }
          }
        }
      },
      content: { stringValue: content }
    }
  };
  
  console.log('Updating blog in Firestore...');
  const updateRes = await fetch(`https://firestore.googleapis.com/v1/projects/funtrooo/databases/(default)/documents/blogs/${blogId}?updateMask.fieldPaths=featuredImage&updateMask.fieldPaths=content&updateMask.fieldPaths=seo.ogImage`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatePayload)
  });
  
  const result = await updateRes.json();
  console.log('Update result:', result.name ? 'SUCCESS' : result);
  process.exit(0);
}

run().catch(console.error);
