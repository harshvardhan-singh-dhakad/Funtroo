// scripts/seed-blogs.js — Run: node scripts/seed-blogs.js
// Seeds 3 sample blog posts into Firestore using Firebase Admin SDK

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const admin = require('firebase-admin');

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

const BLOGS = [
  {
    title:    "Beginner's Guide to Adult Toys in India: What to Buy First",
    slug:     'beginners-guide-adult-toys-india',
    excerpt:  "New to adult toys? Here's a friendly, honest guide to choosing your first product — what to look for, what to avoid, and how discreet delivery works in India.",
    category: 'Product Guides',
    tags:     ['beginner', 'guide', 'india', 'adult toys', 'first time'],
    author:   'Funtroo Team',
    status:   'published',
    publishedAt: new Date().toISOString(),
    readTime: 5,
    views: 0,
    seo: {
      metaTitle:   "Beginner's Guide to Adult Toys in India 2025 — Funtroo",
      metaDesc:    "Complete beginner guide to buying adult toys in India. Learn what to choose, discreet delivery, payment options, and body-safe materials.",
      focusKw:     'adult toys india beginners guide',
      secondaryKws:['buy adult toys india', 'best vibrator india', 'discreet delivery adult toys'],
      canonical:   'https://funtroo.in/blog/beginners-guide-adult-toys-india',
      noIndex:     false,
    },
    content: `
<h2>Why More Indians Are Exploring Adult Wellness</h2>
<p>The conversation around sexual wellness in India has shifted dramatically in recent years. With better internet access, growing awareness, and the normalisation of self-care, more people are curious about adult products — but don't know where to start.</p>
<p>This guide is for you if you're exploring for the first time. We'll keep it honest, practical, and judgment-free.</p>

<h2>Step 1 — Understand What You're Looking For</h2>
<p>Adult toys broadly fall into a few categories:</p>
<ul>
  <li><strong>Vibrators</strong> — The most popular category. Great for beginners. Wide range from ₹500 to ₹5,000+.</li>
  <li><strong>Lubricants</strong> — Often overlooked but extremely important. Water-based is safest for most use cases.</li>
  <li><strong>Couples toys</strong> — Designed for shared pleasure. Remote-controlled options are popular.</li>
  <li><strong>Lingerie</strong> — Low-friction entry point. Great as a starting gift.</li>
</ul>

<blockquote>For most first-time buyers, we recommend starting with a lubricant + one simple vibrator. Budget: ₹800–₹1,500 total.</blockquote>

<h2>Step 2 — What Makes a Product Body-Safe?</h2>
<p>This is important and often ignored. Look for these terms on product listings:</p>
<ul>
  <li><strong>Medical-grade silicone</strong> — Non-porous, easy to clean, hypoallergenic</li>
  <li><strong>Phthalate-free</strong> — Avoids toxic plasticizers</li>
  <li><strong>ABS plastic</strong> — Safe for external use</li>
</ul>
<p>Avoid cheap rubber or "jelly" toys without material specifications. At Funtroo, every product is vetted for body safety before listing.</p>

<h2>Step 3 — How Discreet Delivery Works in India</h2>
<p>This is the #1 concern for Indian buyers — and it's completely understandable.</p>
<p>Here's exactly what happens when you order from Funtroo:</p>
<ol>
  <li>Your order is packed in a <strong>plain brown corrugated box</strong>. No brand name, no product description outside.</li>
  <li>Your bill shows <strong>"FT Commerce"</strong> — not Funtroo.</li>
  <li>Delivery is handled by standard couriers (Delhivery, Shiprocket) — they have no idea what's inside.</li>
  <li>COD is available — so you don't even need to pay online.</li>
</ol>

<h2>Step 4 — Your First Order Checklist</h2>
<ul>
  <li>✅ Start with a simple, affordable product (₹500–₹1,200)</li>
  <li>✅ Always order water-based lubricant alongside any toy</li>
  <li>✅ Choose COD if you're nervous about online payment records</li>
  <li>✅ Check the material — silicone or ABS only</li>
  <li>✅ Sign up for a Funtroo Card — 5% off instantly, no strings attached</li>
</ul>

<h2>Frequently Asked Questions</h2>
<p><strong>Is it legal to buy adult toys in India?</strong><br />Yes. Adult toys are legal to purchase and own in India. There is no law prohibiting it.</p>
<p><strong>Will my family/roommates know?</strong><br />No. The packaging is completely plain. Nothing on the outside indicates the contents.</p>
<p><strong>What if I want to return it?</strong><br />Due to hygiene, returns are not accepted on opened products. However, damaged items are replaced free of charge.</p>
`,
  },
  {
    title:    'Top 5 Lubricants for Every Couple in India (2025 Guide)',
    slug:     'best-lubricants-india-2025',
    excerpt:  "A practical, no-nonsense guide to choosing the right lubricant in India. Water-based, silicone, warming — what works, what doesn't, and what to avoid.",
    category: 'Product Guides',
    tags:     ['lubricant', 'couples', 'guide', 'india', '2025'],
    author:   'Funtroo Team',
    status:   'published',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 4,
    views: 0,
    seo: {
      metaTitle:   'Best Lubricants in India 2025 — Funtroo Guide',
      metaDesc:    'Compare water-based, silicone, and warming lubricants available in India. Find the right one for your needs with honest reviews.',
      focusKw:     'best lubricant india 2025',
      secondaryKws:['water based lubricant india', 'personal lubricant india', 'couples lubricant'],
      canonical:   'https://funtroo.in/blog/best-lubricants-india-2025',
      noIndex:     false,
    },
    content: `
<h2>Why Lubricants Are the Most Underrated Wellness Product</h2>
<p>Most people think lubricants are only needed for specific situations. In reality, they improve comfort, reduce friction, and make every intimate experience better — for everyone, at any age.</p>
<p>In this guide, we break down the types available in India and help you pick the right one.</p>

<h2>Type 1 — Water-Based Lubricants (Recommended for Most)</h2>
<p>The safest, most versatile option. Compatible with all toy materials and condoms. Easy to clean. Won't stain sheets.</p>
<p><strong>Best for:</strong> Beginners, everyday use, anyone using silicone toys</p>
<p><strong>Downside:</strong> May need reapplication during extended sessions</p>
<p><strong>Our pick:</strong> Silk Glide Water-Based Lubricant — pH balanced, no parabens, no glycerin. ₹449 for 100ml.</p>

<h2>Type 2 — Silicone-Based Lubricants</h2>
<p>Long-lasting formula that doesn't dry out. Great for shower use. Silky texture.</p>
<p><strong>Best for:</strong> Longer sessions, water play</p>
<p><strong>Downside:</strong> Do NOT use with silicone toys — degrades the material. Not easy to wash off.</p>

<h2>Type 3 — Warming Lubricants</h2>
<p>Water-based with a warming sensation when applied. Popular with couples for massage as well.</p>
<p><strong>Best for:</strong> Couples who want added sensation, full-body massage</p>
<p><strong>Avoid if:</strong> You have sensitive skin — test a small amount first</p>
<p><strong>Our pick:</strong> Warming Massage Oil 200ml — rose scent, non-greasy. ₹399.</p>

<h2>What to Avoid</h2>
<ul>
  <li>❌ Oil-based lubricants with condoms — breaks latex</li>
  <li>❌ Products with glycerin if you're prone to infections</li>
  <li>❌ Flavoured lubes for internal use — sugar content causes irritation</li>
  <li>❌ Anything not labelled "body-safe" or without ingredients list</li>
</ul>

<blockquote>Tip: Always do a patch test on your inner wrist before using a new lubricant. Wait 30 minutes to check for any reaction.</blockquote>

<h2>Final Recommendation</h2>
<p>If you're buying your first lubricant, go with a water-based option under ₹500. Add it to any toy order and you'll notice the difference immediately.</p>
`,
  },
  {
    title:    'How to Talk to Your Partner About Trying Adult Toys',
    slug:     'how-to-talk-partner-adult-toys',
    excerpt:  "Starting the conversation about adult toys with your partner can feel awkward. Here's how to approach it naturally, with zero pressure and real examples.",
    category: 'Relationships',
    tags:     ['couples', 'relationships', 'communication', 'intimacy', 'tips'],
    author:   'Funtroo Team',
    status:   'draft',
    readTime: 4,
    views: 0,
    seo: {
      metaTitle:   'How to Talk to Your Partner About Adult Toys — Funtroo',
      metaDesc:    'Nervous about bringing up adult toys with your partner? These practical, real conversation starters make it easy and natural.',
      focusKw:     'how to talk partner adult toys',
      secondaryKws:['couples toys conversation', 'intimacy tips couples india'],
      canonical:   'https://funtroo.in/blog/how-to-talk-partner-adult-toys',
      noIndex:     false,
    },
    content: `
<h2>Why This Conversation Feels Hard</h2>
<p>For most couples in India, bringing up adult toys can feel like crossing an invisible line. There's worry about judgment, rejection, or making things awkward. But research consistently shows that couples who communicate openly about intimacy report higher satisfaction.</p>
<p>The conversation isn't the problem — it's how you start it.</p>

<h2>Step 1 — Choose the Right Moment</h2>
<p>Don't bring this up in the middle of an intimate moment, during an argument, or when either of you is stressed. The best time is a relaxed, private setting — over dinner, on a walk, or while watching something together.</p>

<h2>Step 2 — Frame It as Addition, Not Criticism</h2>
<p>The conversation goes wrong when it sounds like something is missing. Instead, frame it as curiosity and addition:</p>
<ul>
  <li><strong>Instead of:</strong> "We should try something new because things have become boring."</li>
  <li><strong>Say:</strong> "I've been reading about couples who try wellness products together and it sounds interesting — want to explore?"</li>
</ul>
<blockquote>Small shift in framing = completely different response from your partner.</blockquote>

<h2>Step 3 — Start Small</h2>
<p>Don't open the conversation with the most adventurous thing you have in mind. Start with something low-stakes — a lubricant, a massage oil, or lingerie. Once the ice is broken, bigger conversations become easier.</p>

<h2>Step 4 — Make It a Shared Decision</h2>
<p>Browse together. Let your partner choose what interests them. Make it a fun activity rather than a presentation. Sites like Funtroo are designed to be easy to navigate and don't feel clinical or intimidating.</p>

<h2>What If They Say No?</h2>
<p>Respect it fully. Don't push, revisit it constantly, or make them feel guilty. Sometimes people need time. Leave the door open: "No problem — if you ever change your mind, we can always explore."</p>
<p>Pressure never leads to a good experience for either person.</p>
`,
  },
];

async function seedBlogs() {
  console.log('🌱 Seeding Blogs into Firestore via Admin SDK...');

  const blogsCol = db.collection('blogs');

  for (const b of BLOGS) {
    // Check if exists
    const snap = await blogsCol.where('slug', '==', b.slug).get();
    
    if (snap.empty) {
      await blogsCol.doc(b.slug).set({
        ...b,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      console.log(`✅ Blog: ${b.title}`);
    } else {
      console.log(`⏭️  Skip: ${b.title} (already exists)`);
    }
  }

  console.log('🎉 Blog seed complete!');
  process.exit(0);
}

seedBlogs().catch(e => { console.error(e); process.exit(1); });
