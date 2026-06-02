import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { VehicleListing } from '@/types'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import VehicleImageSlider from '@/components/VehicleImageSlider'

export const dynamic = 'force-dynamic'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&auto=format&fit=crop&q=80'

async function getVehicle(vehicleId: string): Promise<{ vehicle: VehicleListing; imageUrls: string[] } | null> {
  try {
    // Fetch vehicle info and all its images in parallel
    const [listingRes, imagesRes] = await Promise.all([
      supabase.rpc('get_public_vehicle_listings'),
      supabase.rpc('get_public_vehicle_images', { p_vehicle_id: vehicleId }),
    ])

    if (listingRes.error || !listingRes.data) return null
    const vehicle = (listingRes.data as VehicleListing[]).find((v) => v.vehicle_id === vehicleId)
    if (!vehicle) return null

    // Build public URLs for each image
    const imagePaths: string[] = (imagesRes.data ?? []).map((r: { image_path: string }) => r.image_path)

    const imageUrls: string[] = imagePaths.length > 0
      ? imagePaths.map((path) => {
          const { data } = supabase.storage.from('vehicle-images').getPublicUrl(path)
          return data?.publicUrl ?? FALLBACK_IMAGE
        })
      : [FALLBACK_IMAGE]

    return { vehicle, imageUrls }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ vehicleId: string }> }): Promise<Metadata> {
  const { vehicleId } = await params
  const result = await getVehicle(vehicleId)
  if (!result) return { title: 'Vehicle Not Found — DriveLanka' }
  const { vehicle } = result
  const displayName = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`
  return {
    title: `${displayName} — DriveLanka`,
    description: `Rent a ${vehicle.brand} in ${vehicle.district_name ?? 'Sri Lanka'}.${vehicle.base_rate ? ` From LKR ${vehicle.base_rate.toLocaleString()} per ${vehicle.rental_type === 'monthly' ? 'month' : 'day'}.` : ''}`,
  }
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = await params
  const result = await getVehicle(vehicleId)
  if (!result) notFound()

  const { vehicle, imageUrls } = result
  const displayName = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`
  const location = [vehicle.city_name, vehicle.district_name].filter(Boolean).join(', ')
  const priceLabel = vehicle.rental_type === 'monthly' ? '/month' : '/day'
  const transmissionLabel = vehicle.transmission === 'auto' ? 'Automatic' : vehicle.transmission === 'manual' ? 'Manual' : null
  const fuelLabel = vehicle.fuel_type ? vehicle.fuel_type.charAt(0).toUpperCase() + vehicle.fuel_type.slice(1) : null

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <TopNav />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* Back link */}
        <Link
          href="/browse"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 28,
            textDecoration: 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to browse
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="vehicle-detail-grid">

          {/* Left — image slider + details */}
          <div>
            {/* Image slider */}
            <div style={{ marginBottom: 28 }}>
              <VehicleImageSlider images={imageUrls} vehicleName={displayName} />
            </div>

            {/* Badges row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {vehicle.vehicle_type && (
                <span style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                  {vehicle.vehicle_type}
                </span>
              )}
              <span style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>
                ✓ Verified
              </span>
            </div>

            {/* Title + location */}
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>
              {displayName}
            </h1>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 28 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {location}
              </div>
            )}

            {/* Specs */}
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                Specifications
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {([
                  { label: 'Seats', value: vehicle.seating_capacity ? `${vehicle.seating_capacity} seats` : null },
                  { label: 'Transmission', value: transmissionLabel },
                  { label: 'Fuel Type', value: fuelLabel },
                  { label: 'Vehicle Type', value: vehicle.vehicle_type },
                ] as { label: string; value: string | null }[]).filter((s) => s.value).map((spec) => (
                  <div key={spec.label} style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                      {spec.label}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{spec.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rate plan */}
            {vehicle.rate_plan_name && vehicle.base_rate !== null && (
              <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 22px' }}>
                <h2 style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                  Rate Plan
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{vehicle.rate_plan_name}</div>
                    {vehicle.base_kilometers !== null && vehicle.base_kilometers > 0 && (
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
                        Includes {vehicle.base_kilometers.toLocaleString()} km
                        {vehicle.extra_rate_per_km ? ` · LKR ${vehicle.extra_rate_per_km}/extra km` : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.02em' }}>
                      LKR {vehicle.base_rate.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', marginLeft: 4 }}>{priceLabel}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky booking card */}
          <aside style={{ position: 'sticky', top: 90 }}>
            <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: 24 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>Starting from</div>
                {vehicle.base_rate !== null ? (
                  <>
                    <span style={{ fontSize: 32, fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.02em' }}>
                      LKR {vehicle.base_rate.toLocaleString()}
                    </span>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', marginLeft: 4 }}>{priceLabel}</span>
                  </>
                ) : (
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>Contact for price</span>
                )}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {([
                  vehicle.vehicle_type  ? { icon: '🚗', label: vehicle.vehicle_type }    : null,
                  transmissionLabel     ? { icon: '⚙️', label: transmissionLabel }         : null,
                  fuelLabel             ? { icon: '⛽', label: fuelLabel }                  : null,
                  vehicle.seating_capacity ? { icon: '👥', label: `${vehicle.seating_capacity} Seats` } : null,
                  location              ? { icon: '📍', label: location }                  : null,
                ] as ({ icon: string; label: string } | null)[]).filter((item): item is { icon: string; label: string } => item !== null)
                  .map((item) => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 15 }}>{item.icon}</span>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)' }}>{item.label}</span>
                    </div>
                  ))}
              </div>

              <Link
                href={`/reserve/${vehicle.vehicle_id}`}
                style={{
                  display: 'block', textAlign: 'center',
                  background: '#f59e0b', borderRadius: 12,
                  padding: '14px 24px', fontSize: 15, fontWeight: 700,
                  color: '#000', textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
              >
                Book This Vehicle
              </Link>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 12 }}>
                Free cancellation up to 24h before pickup
              </p>
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .vehicle-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
