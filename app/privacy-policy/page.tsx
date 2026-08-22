import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ShieldCheck, Lock, Package, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 md:py-12 w-full">
        {/* Header */}
        <div className="mb-8 border-b border-f-border pb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-f-accent font-semibold mb-2">
            <ShieldCheck size={16} /> Privacy &amp; Security Policy
          </div>
          <h1 className="font-display text-3xl md:text-5xl text-f-dark">Privacy Policy</h1>
          <p className="text-xs text-f-muted mt-2">Last Updated: January 2025 · Funtroo Wellness Pvt Ltd</p>
        </div>

        {/* Content */}
        <div className="bg-white border border-f-border rounded-2xl p-6 md:p-10 shadow-sm space-y-8 text-sm text-f-gray leading-relaxed">
          
          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3 flex items-center gap-2">
              <Package size={18} className="text-f-purple shrink-0" />
              1. Our 100% Privacy &amp; Discretion Guarantee
            </h2>
            <p>
              Your privacy is the cornerstone of everything we do at Funtroo. We understand the deeply personal nature of adult wellness products. We guarantee that:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li><strong>Plain Packaging:</strong> All parcels are shipped in standard, unmarked brown or white outer boxes with zero brand logos or product mentions.</li>
              <li><strong>Discreet Billing:</strong> Your credit card or bank statements will display generic commercial descriptors such as <em>"FT Commerce"</em> or <em>"Funtroo Ent"</em>.</li>
              <li><strong>Strict Confidentiality:</strong> Delivery couriers are never informed of the nature of the package contents.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3 flex items-center gap-2">
              <Lock size={18} className="text-f-purple shrink-0" />
              2. Information We Collect
            </h2>
            <p>When you browse, create an account, or make a purchase on Funtroo, we may collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li><strong>Account Details:</strong> Full name, email address, contact phone number, and encrypted password credentials.</li>
              <li><strong>Delivery Information:</strong> Shipping and billing addresses, pin codes, and delivery instructions.</li>
              <li><strong>Transaction Data:</strong> Order IDs, payment status, payment method chosen (COD or Razorpay), and Funtroo Loyalty Card tier/spend history. (We <strong>never</strong> store raw debit/credit card numbers or CVVs on our servers).</li>
              <li><strong>Technical Data:</strong> Device type, IP address, and browser cookies used strictly for authentication and cart persistence.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">
              3. How We Use Your Information
            </h2>
            <p>Your data is used strictly for:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li>Fulfilling, packing, and dispatching your orders.</li>
              <li>Sending order status updates, tracking numbers, and email OTP verification codes.</li>
              <li>Managing your Funtroo Loyalty Card tier and automatic member discounts.</li>
              <li>Preventing fraudulent transactions and ensuring age compliance (18+).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">
              4. Data Sharing &amp; Third-Party Partners
            </h2>
            <p>
              We <strong>do not sell, rent, or trade</strong> your personal information to any third parties for advertising or commercial marketing. We share limited necessary data only with:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs md:text-sm">
              <li><strong>Logistics Partners:</strong> Address and phone number required exclusively for courier delivery.</li>
              <li><strong>Payment Gateways:</strong> Certified PCI-DSS Level 1 compliant partners (e.g. Razorpay) to process digital payments securely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">
              5. Data Security &amp; Retention
            </h2>
            <p>
              All personal data transmitted across our platform is encrypted via industry-standard 256-bit SSL (HTTPS). Passwords are cryptographically hashed using salted bcrypt before database persistence.
            </p>
          </section>

          <section>
            <h2 className="text-base md:text-lg font-semibold text-f-dark mb-3">
              6. Your Rights &amp; Contact Us
            </h2>
            <p>
              You have the right to request access to, correction of, or permanent deletion of your customer account and personal data at any time. For any privacy queries or data removal requests, please contact our Data Protection Officer:
            </p>
            <div className="mt-3 p-4 bg-f-soft rounded-xl border border-f-border text-xs md:text-sm">
              <p><strong>Email:</strong> help@funtroo.in / privacy@funtroo.in</p>
              <p><strong>Support Hours:</strong> Monday – Saturday, 10:00 AM – 7:00 PM IST</p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
