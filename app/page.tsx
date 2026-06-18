import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import type { VehicleListing, TenantListing } from '@/types'
import TopNav from '@/components/TopNav'
import Hero from '@/components/Hero'
import VehicleSection from '@/components/VehicleSection'
import PartnersSection from '@/components/PartnersSection'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://www.rentcartours.com'

function JsonLd() {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rent Car Tours',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Sri Lanka\'s premier car rental marketplace connecting travellers with verified rental partners across 25+ districts.',
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['English', 'Sinhala', 'Tamil'],
    },
  }
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rent Car Tours',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/browse?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Car Rental',
    provider: { '@type': 'Organization', name: 'Rent Car Tours' },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    description: 'Rent a car in Sri Lanka — self-drive and chauffeur-driven vehicles including cars, SUVs, vans and luxury vehicles across Colombo, Kandy, Galle, Negombo and more.',
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'LKR',
      availability: 'https://schema.org/InStock',
    },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
    </>
  )
}

async function getVehicles(): Promise<VehicleListing[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_vehicle_listings')
    if (error) {
      console.error('Error fetching vehicles:', error)
      return []
    }

    const vehicles = (data ?? []) as VehicleListing[]

    const withImages = vehicles.map((v) => {
      if (!v.image_path) return { ...v, image_url: null }
      const { data } = supabase.storage.from('vehicle-images').getPublicUrl(v.image_path)
      return { ...v, image_url: data?.publicUrl ?? null }
    })

    return withImages
  } catch {
    return []
  }
}

async function getTenants(): Promise<TenantListing[]> {
  try {
    const { data, error } = await supabase.rpc('get_public_tenants')
    if (error) {
      console.error('Error fetching tenants:', error)
      return []
    }
    const tenants = (data ?? []) as TenantListing[]
    for (const t of tenants) {
      if (t.logo_url) {
        const { data: signed } = await supabase.storage
          .from('tenant-assets')
          .createSignedUrl(t.logo_url, 86400)
        t.logo_url = signed?.signedUrl ?? null
      }
    }
    return tenants
  } catch {
    return []
  }
}

function VehicleSectionFallback() {
  return (
    <section
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: 'clamp(48px, 8vw, 96px) 24px',
        textAlign: 'center',
      }}
    >
      <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 14 }}>Loading vehicles…</div>
    </section>
  )
}

export default async function LandingPage() {
  const [vehicles, tenants] = await Promise.all([getVehicles(), getTenants()])

  return (
    <main style={{ background: '#0a0a0a' }}>
      <JsonLd />
      <TopNav />
      <Hero />
      <Suspense fallback={<VehicleSectionFallback />}>
        <VehicleSection vehicles={vehicles} />
      </Suspense>
      <PartnersSection tenants={tenants} />
      <HowItWorks />
      <Footer />
    </main>
  )
}
