# Funtroo — Adult Wellness E-commerce

Built with Next.js 14 · MongoDB · Razorpay · Tailwind CSS

---

## 🚀 Quick Start (7 Steps)

### Step 1 — Clone & Install
```bash
cd funtroo
npm install
```

### Step 2 — Setup .env.local
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/funtroo
NEXTAUTH_SECRET=your-super-secret-32chars-string
NEXTAUTH_URL=http://localhost:3000
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
ADMIN_EMAIL=admin@funtroo.in
ADMIN_PASSWORD=Admin@123
```

### Step 3 — MongoDB Setup
1. Go to mongodb.com/cloud/atlas
2. Create free cluster
3. Add database user
4. Whitelist IP: 0.0.0.0/0
5. Copy connection string to MONGODB_URI

### Step 4 — Seed Database
```bash
npm run seed
```
This creates 8 demo products + admin account.

### Step 5 — Run Dev Server
```bash
npm run dev
```
Open http://localhost:3000

### Step 6 — Admin Panel
Go to http://localhost:3000/admin
Login: admin@funtroo.in / Admin@123

### Step 7 — Deploy to Vercel
```bash
npm install -g vercel
vercel
# Add all .env.local vars to Vercel dashboard
```

---

## 📁 Project Structure

```
funtroo/
├── app/
│   ├── page.tsx              ← Homepage
│   ├── shop/page.tsx         ← Product listing
│   ├── product/[slug]/       ← Product detail
│   ├── cart/ (via drawer)
│   ├── checkout/page.tsx     ← Checkout + Razorpay
│   ├── order/[id]/           ← Order confirmation
│   ├── account/page.tsx      ← User account + card
│   ├── auth/login|register   ← Auth pages
│   └── admin/                ← Full admin panel
│       ├── page.tsx          ← Dashboard
│       ├── products/         ← Product CRUD
│       ├── orders/           ← Order management
│       ├── customers/        ← Customer list + cards
│       └── discounts/        ← Coupons + card tiers
├── components/
│   ├── AgeGate.tsx           ← 18+ verification
│   ├── Navbar.tsx            ← Top nav + cart icon
│   ├── CartDrawer.tsx        ← Slide-out cart
│   ├── ProductCard.tsx       ← Card with discount logic
│   ├── FuntrooCard.tsx       ← Loyalty card display
│   ├── ProductSuggestions.tsx← Auto suggestions engine
│   └── Footer.tsx
├── lib/
│   ├── mongodb.ts            ← DB connection
│   ├── loyalty.ts            ← Card tier logic
│   └── store.ts              ← Zustand cart store
├── models/
│   ├── Product.ts
│   ├── Customer.ts           ← With card field
│   ├── Order.ts
│   └── Coupon.ts
└── scripts/
    └── seed.js               ← Demo data seeder
```

---

## 💜 Funtroo Card System

| Tier     | Lifetime Spend  | Discount | Auto-upgrade |
|----------|-----------------|----------|--------------|
| Silver   | ₹0+             | 5% off   | On signup    |
| Gold     | ₹10,000+        | 10% off  | Auto         |
| Platinum | ₹50,000+        | 15% off  | Auto         |

- Card assigned on signup (Silver)
- Discount auto-applied at checkout — no code needed
- Tier upgrades automatically after each order
- Admin can view all cards in Customers panel

---

## 🎯 Auto Product Suggestions

Logic in `/api/suggestions`:
1. Same category + matching tags (highest relevance)
2. Same category bestsellers (fill remaining)
3. Store-wide bestsellers (final fallback)

Used on: Product detail page, Order confirmation page

---

## 💳 Razorpay Setup

1. Create account at razorpay.com
2. Go to Settings → API Keys
3. Generate test keys (rzp_test_...)
4. Add to .env.local
5. For adult category — submit business docs to Razorpay support
6. Switch to live keys when approved

---

## 📦 Shipping (Shiprocket)

1. Create account at shiprocket.in
2. Add warehouse address
3. Enable COD
4. Integrate via Shiprocket API (optional — can do manual for now)

---

## 🔐 Security Notes

- Age gate uses localStorage (30-day verification)
- All sensitive routes protected by NextAuth
- Admin panel requires admin role
- Passwords hashed with bcrypt (10 rounds)
- Razorpay signatures verified server-side

---

Built for Funtroo Wellness Pvt Ltd · funtroo.in · 18+ only
