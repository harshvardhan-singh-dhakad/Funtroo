import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Sensual Lingerie for Women | Buy Online in India - Funtroo',
  description: 'Shop premium, sensual lingerie for women. Discover babydolls, matching sets, and roleplay costumes crafted for confidence and comfort. 100% private delivery.',
  alternates: {
    canonical: '/lingerie'
  },
  openGraph: {
    title: 'Sensual Lingerie for Women | Buy Online in India - Funtroo',
    description: 'Shop premium, sensual lingerie for women. Discover babydolls, matching sets, and roleplay costumes.',
    url: 'https://funtroo.in/lingerie',
  }
}

export default function LingeriePage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div></div>}>
        <ShopContent 
          baseCategory="lingerie"
          h1Title="Sensual Lingerie"
          introText="Feel beautifully empowered. From elegant babydolls to daring roleplay sets, our lingerie collection is crafted to celebrate confidence and ignite passion."
        />
      </Suspense>
      <Footer />
    </div>
  )
}
