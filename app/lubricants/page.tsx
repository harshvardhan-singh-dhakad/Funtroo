import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Personal Lubricants | Water-Based & Silicone Lubes India - Funtroo',
  description: 'Buy body-safe personal lubricants online in India. Choose from organic water-based, silicone, and flavored lubes for ultimate comfort and enhanced pleasure.',
  alternates: {
    canonical: '/lubricants'
  },
  openGraph: {
    title: 'Personal Lubricants | Water-Based & Silicone Lubes - Funtroo',
    description: 'Buy body-safe personal lubricants online in India. Choose from organic water-based, silicone, and flavored lubes.',
    url: 'https://funtroo.in/lubricants',
  }
}

export default function LubricantsPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div></div>}>
        <ShopContent 
          baseCategory="lubricants"
          h1Title="Personal Lubricants"
          introText="Smooth, safe, and satisfying. Browse our dermatologically tested collection of water-based and specialty lubricants perfect for solo play or partner intimacy."
        />
      </Suspense>
      <Footer />
    </div>
  )
}
