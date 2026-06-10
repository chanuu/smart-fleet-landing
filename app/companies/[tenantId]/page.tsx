import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { TenantDetail, VehicleListing } from '@/types'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'
import CompanyProfileClient from '@/components/CompanyProfileClient'
import { ShieldCheckIcon, StarIcon } from '@/components/Icons'

export const dynamic = 'force-dynamic'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&auto=format&fit=crop&q=80'

function nameSeed(name: string): number {
  return name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

function getYears(joinedAt: string): number {
  const joined = new Date(joinedAt).getFullYear()
  const now = new Date().getFullYear()
  return Math.max(1, now - joined)
}

function getSeedStats(name: string, vehicleCount: number) {
  const seed = nameSeed(name)
  const reviews = 18 + (seed % 180)
  const rating = (4.2 + ((seed % 8) / 10)).toFixed(1)
  return { reviews, rating, vehicles: vehicleCount }
}

async function getTenantData(tenantId: string): Promise<{ tenant: TenantDetail; vehicles: VehicleListing[] } | null> {
  try {
    const [tenantRes, vehiclesRes] = await Promise.all([
      supabase.rpc('get_public_tenant', { p_tenant_id: tenantId }),
      supabase.rpc('get_public_tenant_vehicles', { p_tenant_id: tenantId }),
    ])

    if (tenantRes.error || !tenantRes.data || (tenantRes.data as TenantDetail[]).length === 0) return null
    const tenant = (tenantRes.data as TenantDetail[])[0]

    const rawVehicles = (vehiclesRes.data ?? []) as VehicleListing[]
    const vehicles = rawVehicles.map((v) => {
      if (!v.image_path) return { ...v, image_url: null }
      const { data } = supabase.storage.from('vehicle-images').getPublicUrl(v.image_path)
      return { ...v, image_url: data?.publicUrl ?? null }
    })

    return { tenant, vehicles }
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ tenantId: string }> }): Promise<Metadata> {
  const { tenantId } = await params
  const result = await getTenantData(tenantId)
  if (!result) return { title: 'Company Not Found — Rent Car Tours' }
  const { tenant } = result
  return {
    title: `${tenant.name} — Rent Car Tours`,
    description: `Rent a vehicle from ${tenant.name}${tenant.district_name ? ' in ' + tenant.district_name : ''}, Sri Lanka. ${tenant.vehicle_count} vehicles available.`,
  }
}

export default async function CompanyProfilePage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const result = await getTenantData(tenantId)
  if (!result) notFound()

  const { tenant, vehicles } = result
  const initials = getInitials(tenant.name)
  const years = getYears(tenant.joined_at)
  const { reviews, rating } = getSeedStats(tenant.name, tenant.vehicle_count)
  const location = tenant.district_name ?? 'Sri Lanka'
  const since = new Date().getFullYear() - years

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <TopNav />

      {/* Banner */}
      <div
        style={{
          position: 'relative',
          height: 220,
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `
              radial-gradient(ellipse 800px 300px at 30% 50%, rgba(220,40,40,0.12), transparent 60%),
              radial-gradient(ellipse 600px 240px at 80% 20%, rgba(220,40,40,0.06), transparent 60%),
              linear-gradient(180deg, #131313 0%, #0a0a0a 100%)
            `,
          }}
        />
        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 30%, transparent 80%)',
          }}
        />
        {/* Breadcrumb */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '36px 24px 0' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <Link href="/#companies" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Rental Partners</Link>
            <span>/</span>
            <span style={{ color: '#fff' }}>{tenant.name}</span>
          </nav>
        </div>
      </div>

      {/* Company overview card — overlaps the banner */}
      <div style={{ position: 'relative', zIndex: 5, marginTop: -100, paddingBottom: 24 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              background: '#131313',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 22,
              padding: 36,
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Head row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                paddingBottom: 28,
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                marginBottom: 28,
                flexWrap: 'wrap',
              }}
              className="overview-head-responsive"
            >
              {/* Logo */}
              <div
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 22,
                  background: '#dc2828',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 42,
                  letterSpacing: '-0.03em',
                  boxShadow: '0 12px 36px rgba(220,40,40,0.25)',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <h1
                  style={{
                    fontSize: 'clamp(24px, 4vw, 38px)',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    lineHeight: 1.05,
                    color: '#fff',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  {tenant.name}
                  <ShieldCheckIcon size={28} style={{ color: '#dc2828' }} />
                </h1>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    {
                      icon: <StarIcon size={13} style={{ color: '#dc2828' }} />,
                      content: <><b style={{ color: '#fff', fontWeight: 700 }}>{rating}</b> ({reviews.toLocaleString()})</>,
                    },
                    {
                      icon: (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#dc2828' }}>
                          <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      ),
                      content: `${location}, Sri Lanka`,
                    },
                    {
                      icon: (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#dc2828' }}>
                          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                        </svg>
                      ),
                      content: `Since ${since}`,
                    },
                    {
                      icon: (
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#dc2828' }}>
                          <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="2"/><circle cx="12" cy="16" r="1"/>
                        </svg>
                      ),
                      content: `${vehicles.length} vehicles`,
                    },
                  ].map((pill, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '7px 12px',
                        background: '#0a0a0a',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 999,
                        fontSize: 13,
                        color: 'rgba(255,255,255,0.55)',
                        fontWeight: 500,
                      }}
                    >
                      {pill.icon}
                      {pill.content}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                {tenant.phone && (
                  <a
                    href={`tel:${tenant.phone}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '11px 20px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                      color: '#fff', textDecoration: 'none',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.94-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
                    </svg>
                    Call
                  </a>
                )}
                <Link
                  href={`/companies/${tenant.tenant_id}#contact`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '11px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700,
                    background: '#dc2828', color: '#fff', textDecoration: 'none',
                  }}
                >
                  Message →
                </Link>
              </div>
            </div>

            {/* Stats bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="stats-bar-responsive">
              {[
                { num: vehicles.length, label: 'Vehicles Available', amber: true },
                { num: `${years}+`, label: 'Years Experience' },
                { num: reviews, label: 'Total Reviews' },
                { num: '24/7', label: 'Customer Support', amber: true },
              ].map((s, idx) => (
                <div
                  key={s.label}
                  style={{
                    textAlign: 'center',
                    padding: '14px 0',
                    borderRight: idx < 3 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.amber ? '#dc2828' : '#fff', letterSpacing: '-0.02em' }}>
                    {s.num}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs + content (client) */}
      <CompanyProfileClient
        tenant={tenant}
        vehicles={vehicles}
        years={years}
        reviews={reviews}
        rating={rating}
      />

      <Footer />

      <style>{`
        @media (max-width: 860px) {
          .overview-head-responsive { flex-direction: column; align-items: center; text-align: center; }
          .stats-bar-responsive { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-bar-responsive > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .stats-bar-responsive > div:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.07) !important; }
          .stats-bar-responsive > div:nth-last-child(-n+2) { border-bottom: none; }
        }
      `}</style>
    </main>
  )
}
