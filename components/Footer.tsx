import Link from 'next/link'
import { Shield, Package, Truck, RefreshCw, Heart, Lock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-f-dark text-f-muted mt-16 md:mt-20 border-t border-f-purple/20">
      
      {/* Trust & Guarantee Strip */}
      <div className="border-b border-f-purple/20 py-6 bg-[#0B0811]">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Package size={22} />, title: 'Plain Brown Box', sub: 'Zero brand names on outer box' },
            { icon: <Lock size={22} />,    title: '100% Private Billing', sub: 'Discreet "FT Commerce" descriptor' },
            { icon: <Truck size={22} />,   title: 'COD Pan India', sub: 'Cash on delivery across India' },
            { icon: <Shield size={22} />,  title: 'Body-Safe Materials', sub: 'Medical-grade & dermatologist tested' },
          ].map(t => (
            <div key={t.title} className="flex items-start gap-3">
              <div className="text-f-accent mt-0.5 shrink-0">{t.icon}</div>
              <div>
                <p className="text-xs font-semibold text-f-light">{t.title}</p>
                <p className="text-[11px] text-f-muted/80 mt-0.5 leading-snug">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="inline-block font-display text-2xl md:text-3xl text-f-light tracking-widest mb-3">
            FUN<span className="text-f-accent">troo</span>
          </Link>
          <p className="text-xs text-f-muted leading-relaxed mb-4">
            India's most trusted adult wellness platform. Curated premium body-safe products with total discretion and plain packaging.
          </p>
          <p className="text-[11px] text-f-muted/70">
            Billing descriptor: <strong>FT Commerce</strong><br />
            18+ Adult Wellness &middot; 100% Private
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <p className="text-xs font-bold text-f-light tracking-widest uppercase mb-4">Explore</p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-f-light transition">Home</Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-f-light transition">Shop Now</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-f-light transition">About Us</Link>
            </li>
            <li className="flex items-center gap-2">
              <Link href="/blog" className="hover:text-f-light transition">Blogs</Link>
              <span className="bg-[#BE185D] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full">NEW</span>
            </li>
            <li>
              <Link href="/auth/register" className="text-f-accent hover:underline">Get Free Loyalty Card</Link>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div>
          <p className="text-xs font-bold text-f-light tracking-widest uppercase mb-4">Categories</p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/shop?category=for-her" className="hover:text-f-light transition">💜 For Her</Link>
            </li>
            <li>
              <Link href="/shop?category=for-him" className="hover:text-f-light transition">⚡ For Him</Link>
            </li>
            <li>
              <Link href="/shop?category=couples" className="hover:text-f-light transition">💑 Couples</Link>
            </li>
            <li>
              <Link href="/shop?category=lubricants" className="hover:text-f-light transition">💧 Lubricants</Link>
            </li>
            <li>
              <Link href="/shop?category=lingerie" className="hover:text-f-light transition">👙 Lingerie</Link>
            </li>
          </ul>
        </div>

        {/* Legal & Support Column */}
        <div>
          <p className="text-xs font-bold text-f-light tracking-widest uppercase mb-4">Legal &amp; Support</p>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/privacy-policy" className="hover:text-f-light transition">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-f-light transition">Terms &amp; Conditions</Link>
            </li>
            <li className="pt-2 text-[11px] text-f-muted">
              📧 Email: <a href="mailto:help@funtroo.in" className="text-f-light hover:underline">help@funtroo.in</a>
            </li>
            <li className="text-[11px] text-f-muted">
              🕐 Mon–Sat: 10:00 AM – 7:00 PM
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="border-t border-f-purple/20 px-4 py-4 text-center text-[11px] text-f-muted/60 bg-[#0B0811]">
        &copy; {new Date().getFullYear()} Funtroo Wellness Pvt Ltd. All rights reserved. Strictly 18+ adult platform.
      </div>
    </footer>
  )
}
