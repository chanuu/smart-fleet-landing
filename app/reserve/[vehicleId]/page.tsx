import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import type { VehicleListing } from '@/types'
import TopNav from '@/components/TopNav'
import ReservePage from '@/components/ReservePage'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ vehicleId: string }>
}

async function getVehicle(vehicleId: string): Promise<VehicleListing | null> {
  try {
    const { data, error } = await supabase.rpc('get_public_vehicle_listings')
    if (error) {
      console.error('Error fetching vehicles:', error)
      return null
    }

    const vehicles = (data ?? []) as VehicleListing[]
    const vehicle = vehicles.find((v) => v.vehicle_id === vehicleId)
    if (!vehicle) return null

    // Resolve image (bucket allows public read)
    if (vehicle.image_path) {
      const { data: pubData } = supabase.storage.from('vehicle-images').getPublicUrl(vehicle.image_path)
      return { ...vehicle, image_url: pubData?.publicUrl ?? null }
    }

    return { ...vehicle, image_url: null }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { vehicleId } = await params
  const vehicle = await getVehicle(vehicleId)
  if (!vehicle) {
    return { title: 'Vehicle Not Found — Rent Car Tours' }
  }
  const name = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`
  return {
    title: `Reserve ${name} — Rent Car Tours`,
    description: `Book the ${name} in ${vehicle.district_name ?? 'Sri Lanka'}. ${vehicle.base_rate ? `From LKR ${vehicle.base_rate.toLocaleString()} per ${vehicle.rental_type === 'monthly' ? 'month' : 'day'}.` : ''}`,
  }
}

export default async function ReserveRoute({ params }: Props) {
  const { vehicleId } = await params
  const vehicle = await getVehicle(vehicleId)

  if (!vehicle) {
    notFound()
  }

  return (
    <>
      <TopNav />
      <ReservePage vehicle={vehicle} />
      <Footer />
    </>
  )
}
