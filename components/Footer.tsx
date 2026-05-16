import Link from 'next/link'
import { Shield, Package, Truck, RefreshCw } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-f-dark text-f-muted mt-20">
      {/* Trust strip */}
      <div className="border-y border-f-purple/20 py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <Package size={20} />,    title: 'Plain Brown Box',    sub: 'No brand name outside' },
            { icon: <Shield size={20} />,     title: '100% Private',       sub: 'Discreet billing always' },
            { icon: <Truck size={20} />,      title: 'COD Available',      sub: 'Pan India delivery' },
            { icon: <RefreshCw size={20} />,  title: 'Easy Exchange',      sub: 'Damaged? We replace' },
          ].map(t => (
            <div key={t.title} className="flex items-center gap-3">
              <div className="text-f-accent">{t.icon}</div>
              <div>
                <p className="text-xs font-medium text-f-light">{t.title}</p>
                <p className="text-[11px] text-f-muted mt-0.5">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl text-f-light tracking-widest mb-3">FUN<span className="text-f-accent">troo</span></p>
          <p className="text-xs leading-relaxed mb-4">India's most trusted adult wellness store. Premium quality, discreet delivery, your privacy always protected.</p>
          <p className="text-[11px] text-f-muted/70">Billing name: FT Commerce<br />18+ only · All orders private</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-f-light tracking-widest uppercase mb-4">Shop</p>
          {['For Her', 'For Him', 'Couples', 'Lubricants', 'Lingerie', 'New In'].map(l => (
            <Link key={l} href={`/shop?category=${l.toLowerCase().replace(' ', '-')}`}
              className="block text-xs py-1 hover:text-f-light transition">{l}</Link>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-f-light tracking-widest uppercase mb-4">Help</p>
          {['Shipping Policy', 'Return Policy', 'Privacy Policy', 'FAQ', 'Track Order', 'Contact Us'].map(l => (
            <Link key={l} href={`/${l.toLowerCase().replace(/ /g, '-')}`}
              className="block text-xs py-1 hover:text-f-light transition">{l}</Link>
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-f-light tracking-widest uppercase mb-4">Contact</p>
          <p className="text-xs py-1">📱 WhatsApp: +91-XXXXXXXXXX</p>
          <p className="text-xs py-1">📧 help@funtroo.in</p>
          <p className="text-xs py-1">🕐 Mon–Sat: 10am–7pm</p>
          <div className="mt-4 p-3 bg-f-purple/20 rounded-xl border border-f-purple/30">
            <p className="text-[11px] text-f-accent font-medium mb-1">Funtroo Loyalty Card</p>
            <p className="text-[10px]">Automatic discounts 5–15% on every order. Join free on signup!</p>
          </div>
        </div>
      </div>

      <div className="border-t border-f-purple/20 px-4 py-4 text-center text-[11px] text-f-muted/50">
        © {new Date().getFullYear()} Funtroo Wellness Pvt Ltd · All rights reserved · 18+ only
      </div>
    </footer>
  )
}
