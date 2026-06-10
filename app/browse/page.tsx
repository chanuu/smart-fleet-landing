import type { Metadata } from 'next'
import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import type { VehicleListing } from '@/types'
import TopNav from '@/components/TopNav'
import BrowsePage from '@/components/BrowsePage'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Browse Vehicles — Rent Car Tours',
  description:
    'Search and filter thousands of rental vehicles across all districts in Sri Lanka. Find cars, SUVs, vans, and more from verified rental partners.',
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

function BrowseFallback() {
  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '80px 24px',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.28)',
          fontSize: 14,
        }}
      >
        Loading vehicles…
      </div>
    </div>
  )
}

export default async function BrowseRoute() {
  const vehicles = await getVehicles()

  return (
    <>
      <TopNav />
      <Suspense fallback={<BrowseFallback />}>
        <BrowsePage vehicles={vehicles} />
      </Suspense>
      <Footer />
    </>
  )
}
