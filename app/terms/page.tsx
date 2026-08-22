import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Header */}
        <div className="mb-8 border-b border-f-border pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-f-accent font-semibold mb-2">
            <FileText size={16} /> Legal &amp; Compliance
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-f-dark">Terms and Conditions</h1>
          <p className="text-xs text-f-muted mt-2">Last Updated: January 2025 · Funtroo Wellness Pvt Ltd</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-f-border rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-sm text-f-gray leading-relaxed">
          
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-amber-900 text-xs md:text-sm">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">Age Restriction Warning (18+ Only)</p>
              <p className="mt-0.5 text-amber-900/90">
                You must be at least 18 years of age (or legal adult age in your jurisdiction) to access, browse, or purchase from Funtroo. By using this website, you solemnly certify that you meet this requirement.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">1. Acceptance of Terms</h2>
            <p>
              Welcome to Funtroo (<em>funtroo.in</em>). By accessing our website, browsing our catalog, registering an account, or placing an order, you agree to be bound by these Terms and Conditions and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">2. Account Registration &amp; Loyalty Program</h2>
            <p>
              When you create an account on Funtroo, you are automatically issued a <strong>Silver Loyalty Card</strong> (5% discount). You agree to provide accurate information and keep your credentials secure.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li>Loyalty tier discounts (Silver 5%, Gold 10%, Platinum 15%) are automatically computed based on verified, completed order totals.</li>
              <li>Funtroo reserves the right to suspend accounts engaged in abusive order practices or fraudulent activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">3. Orders, Pricing &amp; Payments</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li>All prices listed on Funtroo are in Indian Rupees (₹) inclusive of applicable taxes.</li>
              <li>We support prepaid methods (UPI, Credit/Debit cards, Net Banking via Razorpay) as well as Cash on Delivery (COD) for eligible pincodes across India.</li>
              <li>Orders are subject to product availability and confirmation of dispatch.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">4. Packaging, Shipping &amp; Delivery</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li>All packages are shipped in tamper-evident, unmarked brown boxes with complete privacy discretion.</li>
              <li>Standard delivery takes 3 to 7 business days depending on delivery location.</li>
              <li>Free shipping is automatically applied on orders above ₹999.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">5. Hygiene &amp; Replacement Policy</h2>
            <p>
              Due to the personal hygiene and intimate nature of adult wellness products, <strong>used or opened items cannot be returned or refunded</strong>.
            </p>
            <p className="mt-2">
              However, if you receive a <strong>damaged, defective, or incorrect product</strong> upon delivery:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li>Notify our customer support within 48 hours of delivery at <code>help@funtroo.in</code>.</li>
              <li>Provide an unboxing photo/video showing the issue.</li>
              <li>We will arrange a free, discrete replacement promptly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">6. Limitation of Liability &amp; Governing Law</h2>
            <p>
              All wellness items must be used strictly in accordance with manufacturer instructions. Funtroo will not be liable for indirect, incidental, or consequential damages resulting from misuse.
            </p>
            <p className="mt-2">
              These terms are governed by and construed in accordance with the laws of India, subject to the jurisdiction of the courts of New Delhi.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
