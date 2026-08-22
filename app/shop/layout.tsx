import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop Premium Adult Wellness Products | Funtroo India',
  description: 'Explore Funtroo\'s curated collection of body-safe vibrators, massagers, couples toys, and organic lubricants. 100% discreet shipping across India.',
  keywords: ['buy adult toys online', 'premium vibrators India', 'couple intimacy products', 'body-safe lubricants', 'Funtroo shop'],
  openGraph: {
    title: 'Shop Premium Adult Wellness | Funtroo',
    description: 'Explore Funtroo\'s curated collection of body-safe vibrators, massagers, and couples toys. 100% discreet shipping.',
    url: 'https://funtrooo.web.app/shop',
  }
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
