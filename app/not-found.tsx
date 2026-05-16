import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-4">
          <p className="font-display text-8xl text-f-border mb-4">404</p>
          <h1 className="font-display text-3xl text-f-dark mb-3">Page Not Found</h1>
          <p className="text-f-gray text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/"     className="px-6 py-3 bg-f-purple text-white rounded-xl text-sm font-medium hover:bg-f-mid transition">Go Home</Link>
            <Link href="/shop" className="px-6 py-3 border border-f-border text-f-gray rounded-xl text-sm hover:bg-f-soft transition">Shop</Link>
            <Link href="/blog" className="px-6 py-3 border border-f-border text-f-gray rounded-xl text-sm hover:bg-f-soft transition">Blog</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
