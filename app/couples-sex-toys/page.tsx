import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Couples Sex Toys | Enhance Intimacy & Pleasure India - Funtroo',
  description: 'Spice up your relationship with premium couples sex toys. Buy vibrating rings, wearable massagers, and intimacy kits in India with 100% discreet shipping.',
  alternates: {
    canonical: '/couples-sex-toys'
  },
  openGraph: {
    title: 'Couples Sex Toys & Intimacy Products | Funtroo',
    description: 'Spice up your relationship with premium couples sex toys. Buy vibrating rings, wearable massagers, and intimacy kits in India.',
    url: 'https://funtroo.in/couples-sex-toys',
  }
}

export default function CouplesPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div></div>}>
        <ShopContent 
          baseCategory="couples"
          h1Title="Couples Sex Toys"
          introText="Explore new dimensions of intimacy together. Our couples collection features app-controlled wearables, vibrating rings, and games to bring you closer than ever."
        />
      </Suspense>
      <Footer />
    </div>
  )
}
