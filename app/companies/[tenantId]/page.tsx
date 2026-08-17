import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { TenantDetail, VehicleListing, PublicProfile } from '@/types'
import CompanyTopNav from '@/components/CompanyTopNav'
import CompanyFooter from '@/components/CompanyFooter'
import CompanyProfileClient from '@/components/CompanyProfileClient'
import { ShieldCheckIcon } from '@/components/Icons'
import CompanyImageWithFallback from '@/components/CompanyImageWithFallback'
import { archivo, jetbrainsMono, fontSans, theme, monoLabel } from '@/lib/companyTheme'

export const dynamic = 'force-dynamic'



function getInitials(name: string): string {
  return name.split(/\s+/).map((w) => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

function getYears(joinedAt: string): number {
  const joined = new Date(joinedAt).getFullYear()
  const now = new Date().getFullYear()
  return Math.max(1, now - joined)
}


async function getTenantData(tenantId: string): Promise<{ tenant: TenantDetail; vehicles: VehicleListing[] } | null> {
  try {
    const [tenantRes, vehiclesRes] = await Promise.all([
      supabase.rpc('get_public_tenant', { p_tenant_id: tenantId }),
      supabase.rpc('get_public_tenant_vehicles', { p_tenant_id: tenantId }),
    ])

    if (tenantRes.error || !tenantRes.data || (tenantRes.data as TenantDetail[]).length === 0) return null
    const tenant = (tenantRes.data as TenantDetail[])[0]

    if (tenant.logo_url) {
      const { data: signed } = await supabase.storage
        .from('tenant-assets')
        .createSignedUrl(tenant.logo_url, 86400)
      tenant.logo_url = signed?.signedUrl ?? null
    }

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
  const { tenant, vehicles } = result
  const title = `${tenant.name} — Rent Car Tours`
  const description = `Rent a vehicle from ${tenant.name}${tenant.district_name ? ' in ' + tenant.district_name : ''}, Sri Lanka. ${vehicles.length} vehicles available.`
  const canonical = `https://www.rentcartours.com/companies/${tenant.tenant_id}`
  return {
    title,
    description,
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      siteName: 'Rent Car Tours',
      images: tenant.logo_url ? [{ url: tenant.logo_url }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function CompanyProfilePage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params
  const result = await getTenantData(tenantId)
  if (!result) notFound()

  const { tenant, vehicles } = result
  const initials = getInitials(tenant.name)
  const years = getYears(tenant.joined_at)
  const location = tenant.district_name ?? 'Sri Lanka'
  const since = new Date().getFullYear() - years

  const featured = vehicles.find((v) => v.image_url) ?? vehicles[0]
  const thumbs = vehicles.filter((v) => v.vehicle_id !== featured?.vehicle_id).slice(0, 3)

  return (
    <main
      className={`${archivo.variable} ${jetbrainsMono.variable}`}
      style={{ background: theme.bg, minHeight: '100vh', fontFamily: fontSans, color: '#f2f2f3', WebkitFontSmoothing: 'antialiased' }}
    >
      <CompanyTopNav tenantId={tenant.tenant_id} tenantName={tenant.name} logoUrl={tenant.logo_url} initials={initials} />

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '56px 24px', borderBottom: `1px solid ${theme.border}` }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(90% 120% at 12% 0%, rgba(225,29,46,0.20) 0%, rgba(225,29,46,0) 55%), radial-gradient(70% 90% at 95% 20%, rgba(225,29,46,0.09) 0%, rgba(8,8,10,0) 60%)`,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'linear-gradient(to bottom, #000, transparent 85%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0,1.05fr) minmax(0,0.95fr)', gap: 48, alignItems: 'start' }}
          className="hero-grid-responsive"
        >
          {/* Left — info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '6px 11px', borderRadius: 999,
                  background: theme.accentSoftBg, border: `1px solid ${theme.accentSoftBorder}`,
                  ...monoLabel, fontSize: 10.5,
                }}
              >
                <ShieldCheckIcon size={12} />
                Verified operator
              </span>
              <span style={{ ...monoLabel, color: theme.textFainter }}>
                {location.toUpperCase()} · SINCE {since}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              {tenant.logo_url ? (
                <img
                  src={tenant.logo_url}
                  alt={tenant.name}
                  style={{ flexShrink: 0, width: 76, height: 76, borderRadius: 18, objectFit: 'cover', boxShadow: '0 10px 32px rgba(0,0,0,0.5)', background: '#fff' }}
                />
              ) : (
                <div
                  style={{
                    flexShrink: 0, width: 76, height: 76, borderRadius: 18, background: '#fff',
                    display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 22, color: theme.accent,
                    letterSpacing: '-0.03em', boxShadow: '0 10px 32px rgba(0,0,0,0.5)',
                  }}
                >
                  {initials}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 200 }}>
                <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(30px, 4.2vw, 50px)', lineHeight: 1, letterSpacing: '-0.035em', color: '#fff' }}>
                  {tenant.name}
                </h1>
                <p style={{ margin: 0, maxWidth: '44ch', fontSize: 15.5, lineHeight: 1.6, color: theme.textMuted }}>
                  {(tenant.public_profile as PublicProfile | undefined)?.about?.slice(0, 180)
                    ?? `Vehicle rentals in ${location}, Sri Lanka — booked directly with the operator.`}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {[
                `${location}, Sri Lanka`,
                `${vehicles.length} vehicle${vehicles.length === 1 ? '' : 's'} available`,
                `${(tenant.vehicle_types ?? []).length} categories`,
              ].map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px', borderRadius: 8,
                    background: 'rgba(255,255,255,0.045)', border: `1px solid ${theme.border}`,
                    fontSize: 12.5, fontWeight: 500, color: 'rgba(255,255,255,0.72)',
                  }}
                >
                  <span style={{ width: 5, height: 5, borderRadius: 99, background: theme.accent, flexShrink: 0 }} />
                  {t}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <Link
                href={`/companies/${tenant.tenant_id}#contact`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '15px 26px', borderRadius: 12,
                  background: theme.accent, fontSize: 14.5, fontWeight: 700, color: '#fff',
                  textDecoration: 'none', boxShadow: '0 12px 34px rgba(225,29,46,0.32)',
                }}
              >
                Message owner →
              </Link>
              {tenant.phone && (
                <a
                  href={`tel:${tenant.phone}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '15px 24px', borderRadius: 12,
                    border: `1px solid ${theme.borderStrong}`, fontSize: 14.5, fontWeight: 600, color: '#fff', textDecoration: 'none',
                  }}
                >
                  Call {tenant.phone}
                </a>
              )}
            </div>

            {/* Stats */}
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: theme.border, border: `1px solid ${theme.border}`, borderRadius: 14, overflow: 'hidden', marginTop: 6 }}
              className="stats-bar-responsive"
            >
              {[
                { num: vehicles.length, label: 'Vehicles', accent: true },
                { num: (tenant.vehicle_types ?? []).length, label: 'Categories' },
                { num: `${years}+`, label: 'Years active' },
                { num: '24/7', label: 'Support', accent: true },
              ].map((s) => (
                <div key={s.label} style={{ background: theme.cardAlt, padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: 30, lineHeight: 1, letterSpacing: '-0.03em', color: s.accent ? theme.accent : '#fff' }}>{s.num}</span>
                  <span style={{ ...monoLabel, color: theme.textFaint }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — featured vehicle */}
          {featured && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <Link
                href={`/vehicles/${featured.vehicle_id}`}
                style={{ position: 'relative', display: 'block', border: `1px solid ${theme.border}`, borderRadius: 20, overflow: 'hidden', background: theme.card, textDecoration: 'none' }}
              >
                <div style={{ position: 'relative', height: 340, background: theme.cardAlt }}>
                  <CompanyImageWithFallback
                    src={featured.image_url ?? null}
                    alt={featured.brand}
                    label={`${featured.brand}${featured.model_name ? ` ${featured.model_name}` : ''}`}
                  />
                  <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 8 }}>
                    <span style={{ padding: '6px 11px', borderRadius: 7, background: 'rgba(8,8,10,0.75)', border: `1px solid ${theme.borderStrong}`, ...monoLabel, fontSize: 10.5, color: '#fff' }}>
                      Most booked
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, padding: '20px 22px', borderTop: `1px solid ${theme.border}` }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
                      {featured.brand}{featured.model_name ? ` ${featured.model_name}` : ''}
                    </span>
                    <span style={{ fontSize: 12.5, fontWeight: 500, color: theme.textFaint }}>
                      {[featured.seating_capacity ? `${featured.seating_capacity} seats` : null, featured.transmission, featured.fuel_type, featured.base_kilometers ? `${featured.base_kilometers} km/day` : null].filter(Boolean).join(' · ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: theme.accent }}>
                      {featured.base_rate ? `LKR ${featured.base_rate.toLocaleString()}` : 'Contact'}
                      <span style={{ fontSize: 12, fontWeight: 500, color: theme.textFaint }}> /{featured.rental_type === 'monthly' ? 'mo' : 'day'}</span>
                    </span>
                    <span style={{ padding: '9px 16px', borderRadius: 9, background: theme.accent, fontSize: 12.5, fontWeight: 700, color: '#fff' }}>
                      Book Now
                    </span>
                  </div>
                </div>
              </Link>

              {thumbs.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${thumbs.length}, 1fr)`, gap: 12 }}>
                  {thumbs.map((v) => (
                    <Link
                      key={v.vehicle_id}
                      href={`/vehicles/${v.vehicle_id}`}
                      style={{
                        position: 'relative', height: 86, border: `1px solid ${theme.border}`, borderRadius: 12, overflow: 'hidden',
                        background: theme.cardAlt, display: 'block', textDecoration: 'none',
                      }}
                    >
                      <CompanyImageWithFallback
                        src={v.image_url ?? null}
                        alt={v.brand}
                        label={`${v.brand}${v.model_name ? ` ${v.model_name}` : ''}`}
                        labelSize={9.5}
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Tabs + content (client) */}
      <CompanyProfileClient
        tenant={tenant}
        vehicles={vehicles}
        years={years}
      />

      <CompanyFooter tenantName={tenant.name} logoUrl={tenant.logo_url} initials={initials} phone={tenant.phone} />

      <style>{`
        @media (max-width: 900px) {
          .hero-grid-responsive { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 700px) {
          .stats-bar-responsive { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  )
}
