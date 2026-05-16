// Run: node scripts/seed.js
// Seeds demo products and admin user into Firestore using Firebase Admin SDK

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

const PRODUCTS = [
  { name: 'Rose Bloom Vibe Pro', category: 'for-her', price: 1299, originalPrice: 2499, description: 'Body-safe silicone vibrator with 10 intensity modes. USB rechargeable, IPX7 waterproof, whisper-quiet 40dB motor. Perfect for all experience levels.', features: ['Body-safe silicone', 'USB rechargeable (2hr battery)', 'Whisper-quiet (40dB)', 'IPX7 Waterproof', '10 vibration modes'], material: 'Medical-grade silicone', isWaterproof: true, isRechargeable: true, intensityModes: 10, stock: 50, isFeatured: true, tags: ['vibrator', 'beginner', 'waterproof', 'rechargeable'], rating: 4.9, reviewCount: 214, soldCount: 312 },
  { name: 'Velvet Touch Duo Kit', category: 'couples', price: 2199, originalPrice: 3999, description: 'Complete couples wellness kit with remote-controlled vibrator and couples ring. Perfect for spicing up intimacy.', features: ['Remote control (10m range)', 'Dual motors', 'USB rechargeable', 'Body-safe silicone', 'App compatible'], material: 'ABS + Silicone', isWaterproof: false, isRechargeable: true, intensityModes: 7, stock: 30, isFeatured: true, tags: ['couples', 'remote', 'kit'], rating: 4.7, reviewCount: 89, soldCount: 145 },
  { name: 'Silk Glide Lubricant 100ml', category: 'lubricants', price: 449, originalPrice: 699, description: 'Premium water-based lubricant. Condom compatible, pH balanced, long-lasting formula. Dermatologist tested.', features: ['Water-based formula', 'Condom compatible', 'pH balanced', 'No parabens', 'Fragrance-free'], material: 'Water-based', isWaterproof: false, isRechargeable: false, intensityModes: 0, stock: 200, isFeatured: true, tags: ['lubricant', 'water-based', 'beginner'], rating: 4.8, reviewCount: 342, soldCount: 520 },
  { name: 'Midnight Lace Lingerie Set', category: 'lingerie', price: 899, originalPrice: 1599, description: 'Elegant black lace bra and panty set. Available in S, M, L, XL. Adjustable straps for perfect fit.', features: ['Premium lace material', 'Adjustable straps', 'Multiple sizes', 'Hand wash only'], material: 'Nylon + Lace', isWaterproof: false, isRechargeable: false, intensityModes: 0, stock: 80, isFeatured: true, tags: ['lingerie', 'lace', 'gift'], rating: 4.6, reviewCount: 167, soldCount: 234 },
  { name: 'G-Spot Wand Massager', category: 'for-her', price: 1799, originalPrice: 2999, description: 'Curved wand massager for targeted G-spot stimulation. 12 vibration patterns, flexible neck, waterproof design.', features: ['12 vibration patterns', 'Flexible curved neck', 'Waterproof', 'USB rechargeable', 'Travel lock'], material: 'ABS + Silicone tip', isWaterproof: true, isRechargeable: true, intensityModes: 12, stock: 40, isFeatured: true, tags: ['wand', 'g-spot', 'advanced'], rating: 4.8, reviewCount: 98, soldCount: 178 },
  { name: 'Bullet Vibe Mini', category: 'for-her', price: 699, originalPrice: 1299, description: 'Compact and powerful bullet vibrator. Great for travel, discreet and powerful. 7 vibration speeds.', features: ['Ultra-compact design', 'Powerful motor', 'Battery powered (AAA)', 'Travel-friendly', 'Waterproof'], material: 'ABS plastic', isWaterproof: true, isRechargeable: false, intensityModes: 7, stock: 100, isFeatured: false, tags: ['bullet', 'beginner', 'travel', 'compact'], rating: 4.5, reviewCount: 203, soldCount: 389 },
  { name: 'Couples Ring Set (3pc)', category: 'couples', price: 599, originalPrice: 999, description: 'Set of 3 silicone couples rings in different sizes. Stretchy, body-safe, easy to use.', features: ['3 sizes included', '100% silicone', 'Body-safe', 'Easy to clean'], material: 'Stretchy silicone', isWaterproof: true, isRechargeable: false, intensityModes: 0, stock: 150, isFeatured: false, tags: ['couples', 'ring', 'beginner'], rating: 4.4, reviewCount: 134, soldCount: 267 },
  { name: 'Warming Massage Oil 200ml', category: 'lubricants', price: 399, originalPrice: 599, description: 'Warming massage oil with subtle fragrance. Great for couples massage and sensual experiences.', features: ['Warming sensation', 'Subtle rose scent', 'Non-greasy formula', 'Easy to wash off'], material: 'Water + Glycerin base', isWaterproof: false, isRechargeable: false, intensityModes: 0, stock: 90, isFeatured: false, tags: ['massage', 'warming', 'couples'], rating: 4.6, reviewCount: 88, soldCount: 210 },
]

async function seed() {
  console.log('🌱 Seeding Firestore via Admin SDK...');

  // 1. Seed products
  const productsCol = db.collection('products');
  for (const p of PRODUCTS) {
    const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    // Check if exists
    const snap = await productsCol.where('slug', '==', slug).get();
    
    if (snap.empty) {
      await productsCol.doc(slug).set({
        ...p,
        slug,
        images: [],
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Product: ${p.name}`);
    } else {
      console.log(`⏭️  Skip: ${p.name} (already exists)`);
    }
  }

  // 2. Seed admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@funtroo.in';
  const adminPass  = process.env.ADMIN_PASSWORD || 'Admin@123';
  const customersCol = db.collection('customers');
  
  const asnap = await customersCol.where('email', '==', adminEmail).get();
  
  if (asnap.empty) {
    const hashed = await bcrypt.hash(adminPass, 10);
    const adminId = 'admin-default';
    await customersCol.doc(adminId).set({
      name: 'Funtroo Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      card: { tier: 'platinum', number: 'FT-ADMIN-XXXX', totalSpend: 0, discountPct: 15, joinedAt: new Date().toISOString() },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`✅ Admin created: ${adminEmail}`);
  } else {
    console.log(`⏭️  Admin already exists`);
  }

  console.log('🎉 Seed complete!');
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
