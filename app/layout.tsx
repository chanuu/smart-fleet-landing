import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Rent Car Tours — Premium Vehicle Rental Across Sri Lanka',
  description:
    'Browse and book premium cars, SUVs, vans and more from verified rental partners across 25+ districts in Sri Lanka. Instant booking, transparent pricing, reliable fleet.',
  keywords: [
    'vehicle rental Sri Lanka',
    'car hire Sri Lanka',
    'SUV rental Colombo',
    'rent a car Kandy',
    'Rent Car Tours',
    'fleet rental',
  ],
  openGraph: {
    title: 'Rent Car Tours — Premium Vehicle Rental Across Sri Lanka',
    description:
      'Browse and book premium vehicles from verified rental partners across Sri Lanka.',
    type: 'website',
    locale: 'en_LK',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
