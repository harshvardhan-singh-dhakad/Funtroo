import { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Shield, Package, Heart, Sparkles, Award, Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { PAGE_FAQS } from '@/lib/faqs-data'
import FAQSection from '@/components/FAQSection'

export const metadata: Metadata = {
  title: 'About Funtroo | India\'s Premium Adult Wellness & Intimacy Brand',
  description: 'Learn about Funtroo, India\'s most trusted platform for premium adult wellness. We break taboos with 100% discreet packaging, body-safe products, and secure billing.',
  keywords: ['About Funtroo', 'Funtroo mission', 'adult wellness brand India', 'safe adult toys', 'discreet delivery adult toys'],
  openGraph: {
    title: 'About Funtroo | Premium Adult Wellness',
    description: 'Learn about Funtroo, India\'s most trusted platform for premium adult wellness. We break taboos with 100% discreet packaging.',
    url: 'https://funtrooo.web.app/about',
  }
}

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
                Breaking Taboos, <br />Building Trust in India.
              </h2>
              <p className="text-sm text-f-gray leading-relaxed mb-4">
                For too long, adult intimacy and sexual health in India have been shrouded in taboo, unreliable counterfeit products, and awkward purchasing experiences. We realized that Indians deserve a safe, dignified, and premium platform to explore their wellness journey without judgment.
              </p>
              <p className="text-sm text-f-gray leading-relaxed mb-6">
                Funtroo was created to change this narrative completely. We offer an authentic, carefully curated catalog of modern sexual wellness products that cater to solo explorers, men, women, and couples looking to enrich their intimacy. Our platform is built on the foundation of absolute privacy, ensuring that your wellness journey remains yours alone.
              </p>

              <div className="space-y-2.5 mb-8">
                {[
                  'Pan-India fast shipping with Cash on Delivery (COD) options',
                  'Automated Loyalty Program with lifetime stackable savings',
                  'Dedicated discrete customer support on WhatsApp and Email',
                  'Strict 18+ verification and ethical sourcing standards'
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

        {/* SEO Deep Content Expansion */}
        <section className="bg-f-soft py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-f-dark mb-4">Why Funtroo is the Best Adult Wellness Store in India</h2>
              <p className="text-sm text-f-gray leading-relaxed mb-4">
                When it comes to buying adult wellness products, vibrators, massagers, or couple intimacy toys online in India, trust and quality are paramount. The market is flooded with low-grade, non-certified plastics that can harm your body. Funtroo strictly curates only medical-grade silicone and body-safe materials that are dermatologically tested and approved for sensitive skin.
              </p>
              <p className="text-sm text-f-gray leading-relaxed">
                Whether you are exploring personal pleasure for the first time or looking to spice up a long-term relationship, our expertly categorized shop (For Her, For Him, Couples, Lubricants, and Lingerie) ensures you find exactly what you need with zero hassle.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl text-f-dark mb-3">Our Commitment to Absolute Discretion</h3>
                <p className="text-sm text-f-gray leading-relaxed mb-4">
                  We understand the need for privacy. That is why our <strong>100% Discreet Packaging</strong> guarantee ensures that your order is shipped in a generic, plain brown cardboard box without any branding, logos, or product descriptions on the outside. Even the delivery executive will have no idea what is inside the package. 
                </p>
                <p className="text-sm text-f-gray leading-relaxed">
                  Furthermore, our billing descriptor strictly uses <strong>"FT Commerce"</strong> on your bank and credit card statements, ensuring that your purchases remain entirely your secret.
                </p>
              </div>
              
              <div>
                <h3 className="font-display text-xl text-f-dark mb-3">Health, Hygiene, and Safety First</h3>
                <p className="text-sm text-f-gray leading-relaxed mb-4">
                  Adult wellness is deeply connected to personal health. Unlike unbranded marketplaces, Funtroo guarantees that all our products are authentic, sealed, and ethically sourced from globally recognized manufacturers. 
                </p>
                <p className="text-sm text-f-gray leading-relaxed">
                  From water-based organic lubricants to hypoallergenic silicone toys, every item in our catalog prioritizes your well-being. We also maintain strict non-return policies on opened intimacy items to guarantee 100% hygiene for every customer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Optimized FAQ Section */}
        <section className="bg-white border-t border-f-border px-4 py-8">
          <FAQSection faqs={PAGE_FAQS.about} title="Frequently Asked Questions" />
        </section>
      </main>

      <Footer />
    </div>
  )
}
