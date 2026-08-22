import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import '@/lib/env'
import { Toaster } from 'react-hot-toast'
import Providers from '@/components/Providers'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '600'], style: ['normal', 'italic'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Funtroo — Wellness, Intimately',
  description: 'Premium adult wellness products. Discreet delivery across India. Plain packaging. COD available.',
  robots: 'noindex, nofollow',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
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
