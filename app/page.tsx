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
    return (data ?? []) as TenantListing[]
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
