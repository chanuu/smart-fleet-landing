import Link from 'next/link'
import type { TenantListing } from '@/types'
import { ShieldCheckIcon } from './Icons'

interface PartnersSectionProps {
  tenants: TenantListing[]
}

const ACCENT_COLORS = [
  '#dc2828', '#60a5fa', '#34d399', '#f87171',
  '#a78bfa', '#fb923c', '#2dd4bf', '#e879f9',
]


function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

function getYears(joinedAt: string): number {
  const joined = new Date(joinedAt).getFullYear()
  const now = new Date().getFullYear()
  return Math.max(1, now - joined)
}


export default function PartnersSection({ tenants }: PartnersSectionProps) {
  if (tenants.length === 0) return null

  return (
    <section
      style={{
        background: 'rgba(255,255,255,0.015)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) 24px',
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#dc2828', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Premium Partners
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 44px)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
              }}
            >
              Trusted rental
              <br />
              <span style={{ color: 'rgba(255,255,255,0.38)' }}>companies islandwide.</span>
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', maxWidth: 340, lineHeight: 1.6 }}>
              Tap any company to explore their full fleet, read reviews, and contact
              them directly. All partners are verified and insured.
            </p>
          </div>
        </div>

        {/* Partner cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 20,
          }}
        >
          {tenants.map((tenant, i) => {
            const accent = ACCENT_COLORS[i % ACCENT_COLORS.length]
            const years = getYears(tenant.joined_at)
            const initials = getInitials(tenant.name)
            const specialty = (tenant.vehicle_types ?? []).slice(0, 3).join(' · ') || 'Fleet'
            const location = tenant.district_name ?? 'Sri Lanka'

            return (
              <Link
                key={tenant.tenant_id}
                href={`/companies/${tenant.tenant_id}`}
                className="card-hover"
                style={{
                  background: '#131313',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {tenant.logo_url ? (
                    <img
                      src={tenant.logo_url}
                      alt={tenant.name}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        objectFit: 'cover',
                        border: '1.5px solid rgba(255,255,255,0.10)',
                        flexShrink: 0,
                        background: '#1a1a1a',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        background: `${accent}22`,
                        border: `1.5px solid ${accent}55`,
                        borderRadius: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                        fontWeight: 800,
                        color: accent,
                        flexShrink: 0,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#fff',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tenant.name}
                      </span>
                      <ShieldCheckIcon size={14} style={{ color: '#dc2828', flexShrink: 0 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      {location}, Sri Lanka
                    </div>
                  </div>
                </div>

                {/* Specialty badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.45)',
                  }}
                >
                  {specialty}
                </div>

                {/* Stats grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}
                >
                  {[
                    { label: 'Vehicles', value: tenant.vehicle_count },
                    { label: 'Years', value: `${years}+` },
                    { label: 'Types', value: (tenant.vehicle_types ?? []).length },
                  ].map((stat, idx) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: '12px 0',
                        textAlign: 'center',
                        borderRight: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 800, color: idx === 0 ? accent : '#fff' }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: 'auto' }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#dc2828',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                    }}
                  >
                    View Fleet →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
