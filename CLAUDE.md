# CLAUDE.md — Funtroo Project Agent Instructions

> This file is read by Claude Code, Cursor, GitHub Copilot, and all AI-powered editors.
> Follow every rule here strictly. Do not deviate from conventions without explicit instruction.

---

## 🏪 Project Identity

**Funtroo** is a production Next.js 14 e-commerce website for adult wellness products.
- **Domain:** funtroo.in
- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · MongoDB · NextAuth · Razorpay
- **Audience:** 18+ adults in India
- **Key features:** Loyalty card system, auto product suggestions, admin panel, blog with SEO

---

## 📁 Project Structure

```
funtroo/
├── app/                          ← Next.js App Router (all pages + API)
│   ├── page.tsx                  ← Homepage
│   ├── shop/page.tsx             ← Product listing with filters
│   ├── product/[slug]/page.tsx   ← Product detail + suggestions
│   ├── checkout/page.tsx         ← Checkout (Razorpay + COD + card discount)
│   ├── order/[id]/page.tsx       ← Order confirmation
│   ├── account/page.tsx          ← User account + loyalty card
│   ├── blog/page.tsx             ← Blog listing
│   ├── blog/[slug]/page.tsx      ← Individual blog post (full SEO)
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/                    ← Admin panel (all management)
│   │   ├── layout.tsx            ← Admin sidebar layout
│   │   ├── page.tsx              ← Dashboard with stats
│   │   ├── products/page.tsx     ← Product CRUD
│   │   ├── orders/page.tsx       ← Order management + status
│   │   ├── customers/page.tsx    ← Customer list + card tiers
│   │   ├── blogs/page.tsx        ← Blog editor (HTML + SEO + schedule)
│   │   └── discounts/page.tsx    ← Coupon management
│   ├── api/                      ← All API routes
│   │   ├── auth/[...nextauth]/   ← NextAuth
│   │   ├── products/             ← GET list, POST create
│   │   ├── products/[id]/        ← GET, PUT, DELETE by id/slug
│   │   ├── orders/               ← GET list, POST create (triggers card upgrade)
│   │   ├── orders/[id]/          ← GET, PUT single order
│   │   ├── customers/            ← GET list, POST register
│   │   ├── blogs/                ← GET list, POST create (auto-publishes scheduled)
│   │   ├── blogs/[id]/           ← GET (increments views), PUT, DELETE
│   │   ├── coupons/              ← GET list, POST validate, PUT create/update
│   │   ├── suggestions/          ← Smart product suggestions engine
│   │   ├── razorpay/             ← POST create order, PUT verify signature
│   │   └── admin/stats/          ← Dashboard aggregated stats
│   ├── sitemap.ts                ← Dynamic sitemap (blogs + products)
│   ├── robots.ts                 ← robots.txt rules
│   ├── layout.tsx                ← Root layout with Providers + Toaster
│   ├── globals.css               ← Tailwind + Google Fonts + card-shine animation
│   └── not-found.tsx             ← 404 page
├── components/
│   ├── AgeGate.tsx               ← 18+ gate (localStorage, 30-day)
│   ├── Navbar.tsx                ← Sticky nav + cart icon + user dropdown
│   ├── CartDrawer.tsx            ← Slide-out cart drawer
│   ├── Footer.tsx                ← Footer with trust badges
│   ├── ProductCard.tsx           ← Card with auto card-discount display
│   ├── FuntrooCard.tsx           ← Loyalty card visual (silver/gold/platinum)
│   ├── ProductSuggestions.tsx    ← Auto suggestion row (fetches /api/suggestions)
│   └── Providers.tsx             ← SessionProvider wrapper
├── lib/
│   ├── mongodb.ts                ← Mongoose connection (singleton cached)
│   ├── loyalty.ts                ← Tier logic, discount calc, card number gen
│   └── store.ts                  ← Zustand cart store + browsing history
├── models/
│   ├── Product.ts                ← Products with category, features, stock, SEO
│   ├── Customer.ts               ← Users with embedded loyalty card
│   ├── Order.ts                  ← Orders with discount breakdown + tracking
│   ├── Coupon.ts                 ← Coupons with usage tracking
│   └── Blog.ts                   ← Blogs with HTML content + full SEO fields
└── scripts/
    ├── seed.js                   ← Seeds 8 products + admin user
    └── seed-blogs.js             ← Seeds 3 sample blog posts
```

---

## 🎨 Design System — NEVER DEVIATE

### Color Palette
All colors are defined as Tailwind custom tokens under the `f` namespace:

| Token           | Hex       | Usage                              |
|-----------------|-----------|------------------------------------|
| `f-dark`        | `#1E1B4B` | Navbar, hero, page backgrounds     |
| `f-purple`      | `#6B21A8` | Primary CTAs, buttons, active      |
| `f-mid`         | `#7C3AED` | Hover states on purple             |
| `f-accent`      | `#A855F7` | Icons, ratings, card highlights    |
| `f-light`       | `#EDE9FE` | Section backgrounds, category bg   |
| `f-soft`        | `#F5F3FF` | Page background, subtle fills      |
| `f-border`      | `#DDD6FE` | All borders                        |
| `f-muted`       | `#A78BFA` | Secondary text, placeholders       |
| `f-pink`        | `#BE185D` | Discount badges, accent alerts     |
| `f-green`       | `#065F46` | Success states, discount labels    |
| `f-greenBg`     | `#D1FAE5` | Success background                 |
| `f-gray`        | `#6B7280` | Body text, descriptions            |
| `f-grayBg`      | `#F3F4F6` | Neutral backgrounds                |

### Typography
```
Headings:  font-display → "Cormorant Garamond", serif
Body:      font-sans    → "DM Sans", sans-serif
Code:      font-mono    → system-ui monospace
```
- Fonts are loaded via Google Fonts in `globals.css` — do NOT re-import
- Use `font-display` class for all `<h1>` through `<h3>` elements

### Loyalty Card CSS Classes
- `card-silver`   → Gray gradient
- `card-gold`     → Gold gradient
- `card-platinum` → Purple gradient (Funtroo brand)
- `card-shine`    → Animated shine overlay — always add to loyalty card containers

### Component Conventions
- All rounded corners: `rounded-xl` (small) or `rounded-2xl` (cards/modals)
- Buttons: `rounded-xl` with `hover:bg-f-mid transition` for purple buttons
- Borders: always `border border-f-border`
- Input focus: `focus:border-f-purple outline-none`
- Loading states: `animate-pulse bg-f-border/30 rounded-2xl`

---

## 💜 Loyalty Card System — Core Business Logic

**File:** `lib/loyalty.ts`

| Tier     | Min Lifetime Spend | Discount | Auto-trigger    |
|----------|--------------------|----------|-----------------|
| Silver   | ₹0                 | 5%       | On registration |
| Gold     | ₹10,000            | 10%      | After order     |
| Platinum | ₹50,000            | 15%      | After order     |

### Rules
1. Card assigned on signup — always Silver tier
2. Card number generated by `generateCardNumber()` — format: `FT-XXXX-XXXX-XXXX`
3. After every paid order, `Customer.card.totalSpend` increases by `order.total`
4. `getTier(totalSpend)` recalculates tier — auto-upgrade, no manual step
5. Discount applied at checkout via `calcCardDiscount(subtotal, tier)`
6. Card discount and coupon discount STACK — both deducted from subtotal
7. Card discount shown on ProductCard, Checkout, Order Confirmation pages
8. **Never bypass card logic** — always import from `lib/loyalty.ts`

---

## 🛒 Cart Store — Zustand

**File:** `lib/store.ts`

```typescript
// Always use these hooks, never local state for cart:
const { addItem, removeItem, updateQty, clearCart, toggleCart, subtotal, totalItems } = useCart()
const { addViewed } = useHistory()  // Call on every product page load
```

- Cart persisted to `localStorage` via `zustand/middleware persist`
- History persisted to `localStorage` key `funtroo-history` — last 20 slugs
- `addViewed(slug)` must be called on every product detail page

---

## 🔌 API Conventions

### All API Routes
- Always call `await connectDB()` first in every route handler
- Return `NextResponse.json({ error: e.message }, { status: 500 })` on catch
- Admin-only routes: check `session.user.role === 'admin'` before proceeding
- Pagination params: `page` (default 1), `limit` (default varies by endpoint)

### Product API
- `GET /api/products` — public (isActive: true only) unless `?admin=true`
- `GET /api/products/[id]` — accepts both MongoDB `_id` AND `slug`
- Slug auto-generated from name on POST if not provided

### Blog API
- `GET /api/blogs` — public returns only `status: published`
- Auto-publish scheduled: `await Blog.updateMany({ status: 'scheduled', scheduledAt: { $lte: now } }, ...)`
- `readTime` auto-calculated: `words ÷ 200`, minimum 1 minute
- View count incremented on every public slug GET (not ID GET)
- Blog content is raw HTML — render with `dangerouslySetInnerHTML`

### Orders API
- POST to `/api/orders` triggers card upgrade automatically
- `order.cardDiscount` and `order.couponDiscount` stored separately
- `orderNumber` auto-generated: `'FT' + Date.now().toString().slice(-8)`

### Suggestions API
- 3-layer fallback: (1) same category + matching tags → (2) same category → (3) store bestsellers
- Always exclude current product slug from results

---

## 🗄️ Database Models — Key Fields

### Customer
```typescript
card: {
  tier:        'silver' | 'gold' | 'platinum'
  number:      string   // FT-XXXX-XXXX-XXXX
  totalSpend:  number   // lifetime rupees
  discountPct: number   // 5, 10, or 15
  joinedAt:    Date
}
```

### Blog
```typescript
status: 'draft' | 'published' | 'scheduled'
scheduledAt: Date | null   // when to auto-publish
content: string            // raw HTML
seo: {
  metaTitle:   string  // max 60 chars
  metaDesc:    string  // max 160 chars
  focusKw:     string
  secondaryKws:string[]
  canonical:   string
  ogImage:     string
  noIndex:     boolean
}
```

### Order
```typescript
subtotal:       number  // before discounts
cardDiscount:   number  // loyalty card saving
couponDiscount: number  // coupon saving
couponCode:     string
shipping:       number  // 0 if subtotal >= 999
total:          number  // final amount charged
```

---

## 🔍 SEO Rules — Every Blog Post

1. `generateMetadata()` must return all fields: title, description, keywords, robots, alternates.canonical, openGraph, twitter
2. `application/ld+json` Article schema required on every blog post page
3. Canonical URL format: `https://funtroo.in/blog/[slug]`
4. `robots: 'index, follow'` for all public pages except admin, checkout, account
5. Blog content rendered with Tailwind `prose` classes — typography plugin handles formatting
6. `sitemap.ts` auto-includes all published blogs — no manual update needed

---

## ⚙️ Environment Variables

```env
MONGODB_URI              # MongoDB Atlas connection string
NEXTAUTH_SECRET          # Min 32 chars random string
NEXTAUTH_URL             # Full URL (http://localhost:3000 or https://funtroo.in)
RAZORPAY_KEY_ID          # rzp_test_... or rzp_live_...
RAZORPAY_KEY_SECRET      # From Razorpay dashboard
NEXT_PUBLIC_RAZORPAY_KEY_ID  # Same as KEY_ID (public, used in client)
ADMIN_EMAIL              # admin@funtroo.in
ADMIN_PASSWORD           # Admin@123 (change in production!)
```

---

## 🚀 Commands

```bash
npm run dev          # Start dev server on :3000
npm run build        # Production build
npm run start        # Start production server
npm run seed         # Seed 8 products + admin user
npm run seed:blogs   # Seed 3 sample blog posts
```

---

## 🏗️ Admin Panel Routes

| URL                   | Purpose                                    |
|-----------------------|--------------------------------------------|
| `/admin`              | Dashboard — revenue, orders, top products  |
| `/admin/products`     | Product CRUD — create, edit, toggle, delete|
| `/admin/orders`       | Order status update, tracking number       |
| `/admin/customers`    | View customers + card tiers + order history|
| `/admin/blogs`        | Full blog editor — HTML, SEO, schedule     |
| `/admin/discounts`    | Coupon create/edit, usage tracking         |

- Admin access requires `session.user.role === 'admin'`
- Admin layout has sidebar in `app/admin/layout.tsx`
- All admin pages are client components (`'use client'`) — data fetched via `fetch()` calls

---

## ✅ Coding Rules — Always Follow

### TypeScript
- Always type component props with an `interface Props {}`
- API route params: `{ params }: { params: { id: string } }`
- Use `as any` only when absolutely necessary, prefer proper types
- `'use client'` at top for any component using hooks, browser APIs, or event handlers

### Tailwind
- Never write raw CSS — use Tailwind classes only
- Never use arbitrary values like `text-[#6B21A8]` — use `text-f-purple` instead
- Mobile-first: base styles for mobile, `md:` prefix for desktop
- Dark overlays: `bg-black/50` not `bg-black opacity-50`

### Components
- Every new page must include `<Navbar />` and `<Footer />` (except admin, auth pages)
- `<AgeGate />` only on `app/page.tsx` (homepage) — not on every page
- Loading skeletons: use `animate-pulse bg-f-border/30 rounded-2xl h-XX`
- Toast notifications: `import toast from 'react-hot-toast'` — already configured

### API Routes
- Always wrap in `try/catch`
- Never expose passwords — `select('-password')` in customer queries
- Mongoose `lean()` for read-only queries — returns plain objects, faster
- `JSON.parse(JSON.stringify(result))` when passing Mongoose docs to client components

### Forms
- Never use `<form>` with `action` — use `onSubmit` with `e.preventDefault()`
- Loading state: `const [saving, setSaving] = useState(false)` — disable button while saving
- Validation: check required fields before API call, show `toast.error()` for issues

---

## ❌ Anti-Patterns — Never Do These

```typescript
// ❌ NEVER — hardcode colors
<div className="bg-[#6B21A8]">

// ✅ ALWAYS — use token
<div className="bg-f-purple">

// ❌ NEVER — import Google Fonts in component
import { Cormorant_Garamond } from 'next/font/google'

// ✅ ALREADY LOADED — use font-display class
<h1 className="font-display">

// ❌ NEVER — raw MongoDB queries in page components
const data = await mongoose.connection.db.collection('products').find()

// ✅ ALWAYS — use imported model
import Product from '@/models/Product'
const data = await Product.find({ isActive: true })

// ❌ NEVER — skip connectDB()
export async function GET() {
  const products = await Product.find()  // will crash

// ✅ ALWAYS — connect first
export async function GET() {
  await connectDB()
  const products = await Product.find()

// ❌ NEVER — create new cart state
const [cart, setCart] = useState([])

// ✅ ALWAYS — use Zustand store
const { items, addItem } = useCart()

// ❌ NEVER — render blog content as text
<p>{blog.content}</p>

// ✅ ALWAYS — render as HTML
<article dangerouslySetInnerHTML={{ __html: blog.content }} />
```

---

## 🔐 Auth & Security

- Authentication: NextAuth with Credentials provider
- Session strategy: JWT
- Password hashing: bcrypt with 10 rounds
- Admin check: `(session?.user as any)?.role === 'admin'`
- Razorpay: signature verified server-side in `PUT /api/razorpay` — never client-side
- Age gate: `localStorage.getItem('ft_age_verified')` — 30-day persistence

---

## 📦 Key Dependencies

```json
"next":         "14.2.3"     // App Router — use server components where possible
"mongoose":     "^8.3.4"     // ODM — always use models, never raw queries
"next-auth":    "^4.24.7"    // Auth — useSession() for client, getServerSession() for server
"zustand":      "^4.5.2"     // State — cart + browsing history
"razorpay":     "^2.9.2"     // Payments — server-side only
"react-hot-toast": "^2.4.1"  // Toasts — already configured in layout.tsx
"lucide-react": "^0.383.0"   // Icons — all icons come from here only
"@tailwindcss/typography": "^0.5.13"  // prose classes for blog content
```

---

## 🌐 Deployment — Vercel

```bash
# Deploy
vercel

# Set all .env.local vars in Vercel dashboard:
# Project Settings → Environment Variables

# MongoDB: allow Vercel IP (or use 0.0.0.0/0 for Atlas)
# Razorpay: switch to live keys (rzp_live_...) before launch
```

**Build command:** `next build`
**Output directory:** `.next`
**Node version:** 18.x or 20.x

---

## 📝 Blog HTML Content — Style Guide

When writing blog content HTML, follow this structure:

```html
<h2>Section Title</h2>
<p>Opening paragraph with focus keyword naturally included.</p>

<h3>Sub-section (optional)</h3>
<p>Content with <strong>bold key terms</strong> and <a href="/shop">internal links</a>.</p>

<ul>
  <li>Point with detail</li>
</ul>

<blockquote>Key insight or quote highlighted here.</blockquote>

<h2>Next Section</h2>
<p>Continue content...</p>
```

**Rules:**
- Use `<h2>` for main sections, `<h3>` for sub-sections
- Include focus keyword in first `<h2>` and first `<p>`
- At least one `<blockquote>` per post for visual interest
- Internal links always point to `/shop`, `/blog`, or `/product/[slug]`
- Images: `<img src="URL" alt="descriptive text" />` — always include alt
- Minimum 800 words for SEO (2-3 minutes read time)
- Tables: `<table><thead><tr><th>...</th></tr></thead><tbody>...</tbody></table>`

---

## 🏷️ File Naming Conventions

| Type              | Convention         | Example                          |
|-------------------|--------------------|----------------------------------|
| Pages             | `page.tsx`         | `app/shop/page.tsx`              |
| API Routes        | `route.ts`         | `app/api/products/route.ts`      |
| Components        | `PascalCase.tsx`   | `components/ProductCard.tsx`     |
| Lib files         | `camelCase.ts`     | `lib/loyalty.ts`                 |
| Models            | `PascalCase.ts`    | `models/Product.ts`              |
| Styles            | `globals.css`      | `app/globals.css`                |

---

## 🆘 Common Issues & Fixes

| Problem                            | Fix                                                      |
|------------------------------------|----------------------------------------------------------|
| Mongoose model re-register error   | Use `mongoose.models.X \|\| mongoose.model('X', Schema)` |
| Client component using server data | Add `'use client'`, fetch via `useEffect` + fetch()      |
| Tailwind class not applying        | Check `tailwind.config.js` content array includes file   |
| Session undefined in server comp   | Use `getServerSession(authOptions)` not `useSession()`   |
| Blog content not styled            | Wrap with `prose prose-lg max-w-none` Tailwind classes   |
| Scheduled blog not publishing      | Call `autoPublish()` at top of GET /api/blogs            |
| Cart not persisting on reload      | Zustand persist middleware handles this — check store.ts |

---

*Last updated: May 2025 · Funtroo v1.0 · funtroo.in*
