# GitHub Copilot Instructions — Funtroo

## Project Overview
Next.js 14 adult wellness e-commerce for India (funtroo.in).
Tech: TypeScript, Tailwind CSS, MongoDB/Mongoose, NextAuth, Razorpay, Zustand.

## Critical Rules

### Colors — Use Tailwind tokens ONLY
f-dark=#1E1B4B, f-purple=#6B21A8, f-mid=#7C3AED, f-accent=#A855F7,
f-light=#EDE9FE, f-soft=#F5F3FF, f-border=#DDD6FE, f-muted=#A78BFA,
f-pink=#BE185D, f-green=#065F46, f-gray=#6B7280
Never use raw hex values like bg-[#6B21A8] — use bg-f-purple instead.

### API Routes — Required Pattern
```ts
import { connectDB } from '@/lib/mongodb'
export async function GET/POST/PUT/DELETE(req) {
  try {
    await connectDB()
    // logic here
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
```

### Mongoose Models — Required Pattern
```ts
export default mongoose.models.ModelName || mongoose.model('ModelName', Schema)
```

### Cart — Always Zustand
```ts
import { useCart } from '@/lib/store'
const { addItem, items, subtotal, totalItems } = useCart()
```

### Loyalty System
```ts
import { getTier, calcCardDiscount, TIERS } from '@/lib/loyalty'
// Silver=5%, Gold(₹10K+)=10%, Platinum(₹50K+)=15%
```

### Blog Content
Blog `.content` is raw HTML. Always render:
```tsx
<article dangerouslySetInnerHTML={{ __html: blog.content }} className="prose prose-lg max-w-none" />
```

### Fonts
Already loaded in globals.css. Use classes only:
- font-display → Cormorant Garamond (headings)
- font-sans → DM Sans (body)
Never import next/font or @import Google Fonts in components.

### Icons — Lucide only
```ts
import { ShoppingBag, Star, Zap } from 'lucide-react'
```

### Toasts
```ts
import toast from 'react-hot-toast'
toast.success('Done!') | toast.error('Failed!')
```

## File Structure
- Pages: app/[route]/page.tsx
- API: app/api/[resource]/route.ts
- Components: components/PascalCase.tsx
- Models: models/PascalCase.ts
- Utils: lib/camelCase.ts
