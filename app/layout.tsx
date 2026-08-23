import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import '@/lib/env'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/Providers'
import AgeGate from '@/components/AgeGate'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-body' })

export const metadata: Metadata = {
  metadataBase: new URL('https://funtroo.in'),
  title: {
    default: 'Funtroo | Premium Adult Wellness & Intimacy Store in India',
    template: '%s | Funtroo'
  },
  description: 'Funtroo is India\'s most trusted premium adult wellness brand. Buy adult toys, massagers, lubricants & lingerie online. 100% private, discreet plain box delivery with COD.',
  keywords: ['Funtroo', 'adult wellness India', 'buy vibrators online India', 'couple toys', 'intimacy products', 'Funtroo store', 'premium adult toys'],
  robots: 'index, follow',
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://funtroo.in',
    siteName: 'Funtroo',
    title: 'Funtroo | Premium Adult Wellness Store',
    description: '100% discreet delivery of premium adult wellness products across India.',
    images: [{ url: '/icon0.svg', width: 512, height: 512, alt: 'Funtroo Logo' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Funtroo | Premium Adult Wellness Store',
    description: '100% discreet delivery of premium adult wellness products across India.',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Global Entity Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Funtroo",
    "url": "https://funtroo.in",
    "logo": "https://funtroo.in/icon.svg",
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Funtroo",
    "url": "https://funtroo.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://funtroo.in/shop?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <Providers>
          <AgeGate />
          {children}
          <Toaster position="top-right" toastOptions={{
            duration: 3000,
            style: { background: '#0E0B14', color: '#F0EBF4', fontSize: '13px', borderRadius: '12px', border: '1px solid #2D2235' },
            success: { iconTheme: { primary: '#2D6A4F', secondary: '#F0EBF4' } },
            error: { iconTheme: { primary: '#8B2D52', secondary: '#F0EBF4' } },
          }} />
        </Providers>
      </body>
    </html>
  )
}
