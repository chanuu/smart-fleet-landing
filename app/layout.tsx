import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CustomerAuthProvider } from '@/contexts/CustomerAuthContext'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = 'https://www.rentcartours.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Rent a Car in Sri Lanka | Rent Car Tours — Cars, SUVs & Vans',
    template: '%s | Rent Car Tours',
  },
  description:
    'Rent a car in Sri Lanka from verified rental partners. Browse cars, SUVs, vans & luxury vehicles across Colombo, Kandy, Galle and 25+ districts. Instant online booking, transparent pricing, 24/7 support.',
  keywords: [
    'rent a car Sri Lanka',
    'car rental Sri Lanka',
    'car hire Sri Lanka',
    'rent a car Colombo',
    'rent a car Kandy',
    'rent a car Galle',
    'SUV rental Sri Lanka',
    'van rental Sri Lanka',
    'wedding car hire Sri Lanka',
    'airport car rental Sri Lanka',
    'self drive car rental Sri Lanka',
    'car rental with driver Sri Lanka',
    'cheap car rental Sri Lanka',
    'luxury car hire Sri Lanka',
    'Rent Car Tours',
    'vehicle rental Sri Lanka',
    'Sri Lanka tour vehicle',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Rent a Car in Sri Lanka | Rent Car Tours',
    description:
      'Browse and book cars, SUVs, vans from verified rental partners across 25+ districts in Sri Lanka. Transparent pricing, instant booking.',
    type: 'website',
    locale: 'en_LK',
    url: SITE_URL,
    siteName: 'Rent Car Tours',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rent a Car in Sri Lanka | Rent Car Tours',
    description: 'Browse and book rental vehicles across Sri Lanka. Verified partners, transparent pricing.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <CustomerAuthProvider>{children}</CustomerAuthProvider>
      </body>
    </html>
  )
}
