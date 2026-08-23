import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Premium Sex Toys for Women | Buy Vibrators Online India - Funtroo',
  description: 'Explore India\'s finest collection of premium sex toys for women. Buy body-safe vibrators, wands, and massagers with 100% discreet packaging and COD available.',
  alternates: {
    canonical: '/sex-toys-for-women'
  },
  openGraph: {
    title: 'Premium Sex Toys for Women | Funtroo',
    description: 'Explore India\'s finest collection of premium sex toys for women.',
    url: 'https://funtroo.in/sex-toys-for-women',
  }
}

export default function ForHerPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div></div>}>
        <ShopContent 
          baseCategory="for-her"
          h1Title="Sex Toys for Women"
          introText="Discover our exclusive, body-safe collection of premium vibrators, wands, and massagers designed specifically for female pleasure. 100% private billing and plain brown box delivery."
        />
      </Suspense>
      <Footer />
    </div>
  )
}
