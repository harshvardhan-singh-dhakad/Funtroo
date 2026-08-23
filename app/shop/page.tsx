import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ShopContent from '@/components/ShopContent'

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-f-soft flex flex-col w-full max-w-full overflow-x-hidden">
      <Navbar />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-2 border-f-purple border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <ShopContent />
      </Suspense>
      <Footer />
    </div>
  )
}
