import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Premium Sex Toys for Men | Masturbators & Strokers India - Funtroo',
  description: 'Shop top-tier sex toys for men in India. Browse body-safe masturbators, strokers, and stamina rings. 100% plain box delivery and totally private billing.',
  alternates: {
    canonical: '/sex-toys-for-men'
  },
  openGraph: {
    title: 'Premium Sex Toys for Men | Funtroo',
    description: 'Shop top-tier sex toys for men in India. Browse body-safe masturbators, strokers, and stamina rings.',
    url: 'https://funtroo.in/sex-toys-for-men',
  }
}

export default function ForHimPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div></div>}>
        <ShopContent 
          baseCategory="for-him"
          h1Title="Sex Toys for Men"
          introText="Elevate your solo play with our premium selection of male masturbators, stamina training devices, and textured strokers. Designed for ultimate satisfaction and health."
        />
      </Suspense>
      <Footer />
    </div>
  )
}
