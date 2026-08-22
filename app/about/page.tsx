import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Package, Heart, Sparkles, Award, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-f-dark text-white py-16 md:py-24 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #C27A8E 0%, transparent 60%)' }} 
          />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <span className="text-xs uppercase tracking-[0.25em] text-f-accent font-semibold px-3 py-1 bg-f-accent/10 border border-f-accent/30 rounded-full inline-block mb-4">
              Our Story &amp; Mission
            </span>
            <h1 className="font-display text-4xl md:text-6xl tracking-wide leading-tight mb-6">
              Empowering Intimacy &amp; Wellness, <br />
              <span className="text-f-accent italic">Without Compromise.</span>
            </h1>
            <p className="text-f-muted text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              At Funtroo, we believe that adult wellness and personal intimacy should be celebrated with dignity, safety, and 100% uncompromising privacy across India.
            </p>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl text-f-dark mb-3">Why Thousands Trust Funtroo</h2>
            <p className="text-f-gray text-sm max-w-lg mx-auto">We are redefining adult wellness with premium global standards and total discretion.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-f-border rounded-2xl p-7 shadow-sm hover:border-f-purple transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-f-purple/10 text-f-purple flex items-center justify-center mb-5">
                <Package size={24} />
              </div>
              <h3 className="text-lg font-semibold text-f-dark mb-2">100% Discreet Packaging</h3>
              <p className="text-sm text-f-gray leading-relaxed">
                Every single order arrives in an unmarked, plain brown cardboard box. No brand logos, no product descriptions outside. Even delivery personnel won't know what's inside.
              </p>
            </div>

            <div className="bg-white border border-f-border rounded-2xl p-7 shadow-sm hover:border-f-purple transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-f-purple/10 text-f-purple flex items-center justify-center mb-5">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-semibold text-f-dark mb-2">Discreet Private Billing</h3>
              <p className="text-sm text-f-gray leading-relaxed">
                Your bank statement or credit card summary will only reflect generic descriptors like <em>"FT Commerce"</em>. Your personal privacy is safeguarded at every step.
              </p>
            </div>

            <div className="bg-white border border-f-border rounded-2xl p-7 shadow-sm hover:border-f-purple transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-f-purple/10 text-f-purple flex items-center justify-center mb-5">
                <Award size={24} />
              </div>
              <h3 className="text-lg font-semibold text-f-dark mb-2">Body-Safe &amp; Certified</h3>
              <p className="text-sm text-f-gray leading-relaxed">
                All wellness devices and consumables are crafted from medical-grade silicone, skin-safe polymers, and dermatologically tested water-based formulations.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white border-y border-f-border py-16 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs uppercase tracking-widest text-f-accent font-bold mb-2 block">Our Vision</span>
              <h2 className="font-display text-3xl md:text-4xl text-f-dark mb-4 leading-tight">
                Breaking Taboos, <br />Building Trust.
              </h2>
              <p className="text-sm text-f-gray leading-relaxed mb-4">
                For too long, adult intimacy and sexual health in India have been shrouded in taboo, unreliable counterfeit products, and awkward purchasing experiences.
              </p>
              <p className="text-sm text-f-gray leading-relaxed mb-6">
                Funtroo was created to change the narrative. We offer an authentic, curated catalog of modern sexual wellness products that cater to solo explorers, men, women, and couples looking to enrich their intimacy.
              </p>

              <div className="space-y-2.5">
                {[
                  'Pan-India fast shipping with Cash on Delivery (COD)',
                  'Automated Loyalty Program with lifetime stackable savings',
                  'Dedicated discrete customer support on WhatsApp and Email',
                  'Strict 18+ verification and ethical sourcing'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-f-dark font-medium">
                    <CheckCircle2 size={16} className="text-f-purple shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-f-dark rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <Sparkles size={28} className="text-f-accent mb-4" />
                <h3 className="font-display text-2xl mb-3">Funtroo Loyalty Program</h3>
                <p className="text-xs md:text-sm text-f-muted leading-relaxed mb-6">
                  Every member gets a free <strong className="text-white">Silver Loyalty Card (5% off)</strong> on registration, which auto-upgrades to <strong className="text-white">Gold (10%)</strong> and <strong className="text-white">Platinum (15%)</strong> as you shop.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link 
                    href="/shop" 
                    className="px-5 py-2.5 bg-f-purple text-white text-xs md:text-sm rounded-xl font-medium hover:bg-f-mid transition inline-flex items-center gap-2"
                  >
                    Explore Shop <ArrowRight size={14} />
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="px-5 py-2.5 bg-white/10 text-white text-xs md:text-sm border border-white/20 rounded-xl hover:bg-white/20 transition"
                  >
                    Join Free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
