// Script: Upload local product images to Firebase Storage & update Firestore
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

// Initialize Admin SDK with service account
const saPath = path.resolve(__dirname, '../firebase-service-account.json');
if (!fs.existsSync(saPath)) {
  console.error('❌ Service account file not found!');
  process.exit(1);
}

const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    projectId: sa.project_id || 'funtrooo',
    storageBucket: `${sa.project_id || 'funtrooo'}.firebasestorage.app`
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function uploadImagesAndUpdateProducts() {
  console.log('🚀 Starting Firebase Storage upload for product images...');
  
  const productsDir = path.resolve(__dirname, '../public/products');
  if (!fs.existsSync(productsDir)) {
    console.error('❌ Products directory not found in public/products');
    process.exit(1);
  }

  const files = fs.readdirSync(productsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`📁 Found ${files.length} images to upload...`);

  const urlMap = {};

  for (const filename of files) {
    const filePath = path.join(productsDir, filename);
    const destination = `products/${filename}`;

    console.log(`⬆️ Uploading ${filename} to Storage path: ${destination}...`);
    
    await bucket.upload(filePath, {
      destination,
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Make public or generate public URL format
    const file = bucket.file(destination);
    await file.makePublic().catch(() => {});

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(destination)}?alt=media`;
    urlMap[filename] = publicUrl;
    console.log(`✅ Uploaded! Public URL: ${publicUrl}`);
  }

  console.log('🔄 Updating Firestore products with Firebase Storage image URLs...');

  const productsSnap = await db.collection('products').get();
  for (const doc of productsSnap.docs) {
    const data = doc.data();
    const slug = data.slug || doc.id;
    const expectedFilename = `${slug}.jpg`;

    if (urlMap[expectedFilename]) {
      const storageUrl = urlMap[expectedFilename];
      await db.collection('products').doc(doc.id).update({
        images: [storageUrl],
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Updated Firestore product [${slug}] with Firebase Storage URL`);
    }
  }

  // Update lib/products-data.ts
  const dataPath = path.resolve(__dirname, '../lib/products-data.ts');
  let dataContent = fs.readFileSync(dataPath, 'utf8');

  for (const [filename, url] of Object.entries(urlMap)) {
    const localPath = `/products/${filename}`;
    dataContent = dataContent.replaceAll(localPath, url);
  }

  fs.writeFileSync(dataPath, dataContent, 'utf8');
  console.log('✅ Updated lib/products-data.ts with Firebase Storage URLs!');

  console.log('🎉 Firebase Storage Upload & Firestore Update Complete!');
  process.exit(0);
}

uploadImagesAndUpdateProducts().catch(err => {
  console.error('❌ Error during upload:', err);
  process.exit(1);
});
