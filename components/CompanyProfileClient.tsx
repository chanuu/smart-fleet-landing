'use client'

import { useState } from 'react'
import type { TenantDetail, VehicleListing, PublicProfile } from '@/types'
import CompanyVehicleCard from './CompanyVehicleCard'
import { theme, monoLabel } from '@/lib/companyTheme'

interface Props {
  tenant: TenantDetail
  vehicles: VehicleListing[]
  years: number
}

type Tab = 'fleet' | 'about' | 'reviews' | 'contact'

export default function CompanyProfileClient({ tenant, vehicles, years }: Props) {
  const [tab, setTab] = useState<Tab>('fleet')
  const [activeType, setActiveType] = useState('All')
  const pp: PublicProfile = tenant.public_profile ?? {}

  const vehicleTypes = ['All', ...Array.from(new Set(vehicles.map((v) => v.vehicle_type).filter(Boolean) as string[]))]
  const filtered = activeType === 'All' ? vehicles : vehicles.filter((v) => v.vehicle_type === activeType)

  const typeCounts: Record<string, number> = {}
  vehicles.forEach((v) => {
    if (v.vehicle_type) typeCounts[v.vehicle_type] = (typeCounts[v.vehicle_type] ?? 0) + 1
  })
  const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

  // Representative rate note for the fleet header — most common base-km/extra-km-rate across
  // the fleet's rate plans, since each vehicle can have its own but most tenants use one plan.
  const withKm = vehicles.find((v) => v.base_kilometers)
  const withExtraRate = vehicles.find((v) => v.extra_rate_per_km)
  const rateNote = withKm
    ? `Rates include ${withKm.base_kilometers} km per day.${withExtraRate ? ` Extra km billed at LKR ${withExtraRate.extra_rate_per_km}.` : ''} Deposit refundable on return.`
    : null

  const tabs: { id: Tab; label: string; badge?: number | string }[] = [
    { id: 'fleet', label: 'Fleet', badge: vehicles.length },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Sticky tabs — top matches CompanyTopNav's rendered height so it docks just below it */}
      <div style={{ position: 'sticky', top: 66, zIndex: 20, background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 28, overflowX: 'auto' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '18px 0',
                fontSize: 13.5,
                fontWeight: 600,
                color: tab === t.id ? '#fff' : 'rgba(255,255,255,0.45)',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? `2px solid ${theme.accent}` : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {t.label}
              {t.badge !== undefined && (
                <span
                  style={{
                    ...monoLabel,
                    fontSize: 10,
                    background: tab === t.id ? theme.accentSoftBg : 'rgba(255,255,255,0.06)',
                    color: tab === t.id ? theme.accentText : theme.textFainter,
                    padding: '2px 7px',
                    borderRadius: 999,
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ── Fleet ── */}
        {tab === 'fleet' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 26 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={monoLabel}>The fleet</span>
                <h2 style={{ margin: 0, fontWeight: 700, fontSize: 30, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff' }}>
                  {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}, all owner-maintained
                </h2>
              </div>
              {rateNote && (
                <span style={{ fontSize: 13, fontWeight: 500, color: theme.textFaint, maxWidth: '34ch', lineHeight: 1.5 }}>
                  {rateNote}
                </span>
              )}
            </div>

            {/* Type chips */}
            {vehicleTypes.length > 1 && (
              <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 26 }}>
                {vehicleTypes.map((type) => {
                  const on = activeType === type
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveType(type)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '10px 16px', borderRadius: 999, cursor: 'pointer',
                        fontSize: 12.5, fontWeight: 600, transition: 'all 0.15s',
                        border: `1px solid ${on ? theme.accentSoftBorder : theme.border}`,
                        background: on ? theme.accentSoftBg : 'transparent',
                        color: on ? theme.accentText : 'rgba(255,255,255,0.62)',
                      }}
                    >
                      {type}
                      {type !== 'All' && typeCounts[type] && (
                        <span style={{ ...monoLabel, fontSize: 10.5, color: on ? 'rgba(255,120,130,0.8)' : theme.textFainter }}>{typeCounts[type]}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0', color: theme.textFainter }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
                <p>No vehicles in this category.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {filtered.map((v) => <CompanyVehicleCard key={v.vehicle_id} vehicle={v} />)}
              </div>
            )}
          </div>
        )}

        {/* ── About ── */}
        {tab === 'about' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }} className="about-layout-responsive">
            <div>
              <span style={{ ...monoLabel, display: 'block', marginBottom: 14 }}>About the operator</span>
              <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20, color: '#fff' }}>
                {tenant.name}
              </h2>
              {pp.about ? (
                <div style={{ fontSize: 15.5, color: theme.textMuted, lineHeight: 1.7, marginBottom: 32, whiteSpace: 'pre-line' }}>
                  {pp.about}
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 15.5, color: theme.textMuted, lineHeight: 1.7, marginBottom: 20 }}>
                    Operating since {new Date().getFullYear() - years}, {tenant.name} has been a trusted name in vehicle rentals
                    {tenant.district_name ? ` across the ${tenant.district_name} region` : ' across Sri Lanka'}.
                    Our fleet spans {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} serving customers islandwide.
                  </p>
                  <p style={{ fontSize: 15.5, color: theme.textMuted, lineHeight: 1.7, marginBottom: 32 }}>
                    Every vehicle is regularly serviced at certified workshops, fully insured, and equipped with roadside assistance.
                    We&apos;re committed to transparent pricing with no hidden fees.
                  </p>
                </>
              )}

              <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, color: '#fff' }}>
                Why customers choose us
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14, marginBottom: 36 }}>
                {[
                  { icon: '🛡️', title: 'Fully insured fleet', sub: 'Every vehicle covered for damage & passenger injury' },
                  { icon: '📞', title: '24/7 roadside support', sub: 'Anywhere on the island, day or night' },
                  { icon: '✨', title: 'No hidden fees', sub: 'Transparent pricing on every booking' },
                  { icon: '🔄', title: 'Free cancellation', sub: 'Cancel up to 24 hours before pickup' },
                ].map((f) => (
                  <div
                    key={f.title}
                    style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: 18, background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 14 }}
                  >
                    <div style={{ width: 36, height: 36, background: theme.accentSoftBg, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: theme.textFainter, lineHeight: 1.4 }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {topTypes.length > 0 && (
                <>
                  <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16, color: '#fff' }}>
                    Fleet composition
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {topTypes.map(([type, count]) => {
                      const pct = (count / vehicles.length) * 100
                      return (
                        <div key={type} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 36px', gap: 16, alignItems: 'center' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{type}</div>
                          <div style={{ height: 8, background: theme.border, borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: theme.accent, borderRadius: 999 }} />
                          </div>
                          <div style={{ fontSize: 13, color: theme.textFainter, fontWeight: 700, textAlign: 'right' }}>{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 24 }}>
                <h4 style={{ ...monoLabel, marginBottom: 16, color: theme.textFaint }}>
                  Operating Hours
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { day: 'Mon – Fri', hours: pp.opening_hours_weekday || '7:00 AM – 9:00 PM' },
                    { day: 'Saturday', hours: pp.opening_hours_saturday || '8:00 AM – 8:00 PM' },
                    { day: 'Sunday', hours: pp.opening_hours_sunday || '9:00 AM – 6:00 PM' },
                    { day: 'Emergency line', hours: pp.emergency_contact || '24 / 7', accent: true },
                  ].map((row) => (
                    <div key={row.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: row.accent ? 10 : 0, borderTop: row.accent ? `1px solid ${theme.border}` : 'none' }}>
                      <span style={{ color: theme.textFaint }}>{row.day}</span>
                      <b style={{ fontWeight: 700, color: row.accent ? theme.accentText : '#fff' }}>{row.hours}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 24 }}>
                <h4 style={{ ...monoLabel, marginBottom: 16, color: theme.textFaint }}>
                  Rental Policies
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    `Minimum driver age: ${pp.min_driver_age || '21'} years`,
                    pp.policy_1 || 'Valid driving license required',
                    pp.policy_2 || 'Refundable security deposit',
                    pp.policy_3 || `Free cancellation ${pp.cancellation_hours || '24'}h before`,
                    pp.policy_4,
                  ].filter(Boolean).map((p) => (
                    <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: theme.textMuted }}>
                      <span style={{ color: theme.accentText, flexShrink: 0 }}>✓</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <style>{`@media (max-width: 860px) { .about-layout-responsive { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}

        {/* ── Reviews ── */}
        {tab === 'reviews' && (
          <div>
            <div style={{ marginBottom: 26 }}>
              <span style={monoLabel}>Reviews</span>
            </div>
            {pp.google_review_url ? (
              <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
                <div style={{ marginBottom: 32 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px' }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff', marginBottom: 10 }}>
                    Customer Reviews
                  </h2>
                  <p style={{ fontSize: 15, color: theme.textFaint, lineHeight: 1.6 }}>
                    See what our customers say about us on Google, or share your own experience.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
                  <a
                    href={pp.google_review_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 32px', background: '#fff', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    View Reviews on Google
                  </a>
                  <a
                    href={pp.google_review_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: theme.accentSoftBg, border: `1px solid ${theme.accentSoftBorder}`, borderRadius: 12, fontSize: 14, fontWeight: 700, color: theme.accentText, textDecoration: 'none' }}
                  >
                    Write a Review
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '64px 24px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>
                  No reviews yet
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)', maxWidth: 360, margin: '0 auto' }}>
                  Reviews will appear here once the company connects their Google Business profile.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Contact ── */}
        {tab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="contact-layout-responsive">
            <div>
              <span style={{ ...monoLabel, display: 'block', marginBottom: 14 }}>Book direct</span>
              <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24, color: '#fff' }}>
                Get in touch
              </h2>

              {[
                tenant.district_name && {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 7-8 13-8 13s-8-6-8-13a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  ),
                  label: 'Location',
                  value: `${tenant.district_name}, Sri Lanka${tenant.address ? '\n' + tenant.address : ''}`,
                },
                tenant.phone && {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.23h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.94-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/>
                    </svg>
                  ),
                  label: 'Phone',
                  value: tenant.phone,
                },
                tenant.email && {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-10 5L2 7"/>
                    </svg>
                  ),
                  label: 'Email',
                  value: tenant.email,
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  ),
                  label: 'Hours',
                  value: `Mon–Fri: ${pp.opening_hours_weekday || '7:00 AM – 9:00 PM'}\nSat: ${pp.opening_hours_saturday || '8:00 AM – 8:00 PM'}\nSun: ${pp.opening_hours_sunday || '9:00 AM – 6:00 PM'}`,
                },
              ].filter(Boolean).map((item, idx) => {
                const it = item as { icon: React.ReactNode; label: string; value: string }
                return (
                  <div key={idx} style={{ display: 'flex', gap: 16, padding: '20px 0', borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ width: 42, height: 42, background: theme.accentSoftBg, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.accentText, flexShrink: 0 }}>
                      {it.icon}
                    </div>
                    <div>
                      <div style={{ ...monoLabel, fontSize: 10.5, color: theme.textFaint, marginBottom: 4 }}>
                        {it.label}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {it.value}
                      </div>
                    </div>
                  </div>
                )
              })}
              {pp.whatsapp && (
                <a
                  href={`https://wa.me/${pp.whatsapp.replace(/[^0-9+]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 24, padding: '14px 28px', background: '#25D366', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#fff', textDecoration: 'none' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Chat on WhatsApp
                </a>
              )}
            </div>

            {/* Message form */}
            <div style={{ background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 18, padding: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8, color: '#fff' }}>Send a message</h3>
              <p style={{ fontSize: 14, color: theme.textFainter, marginBottom: 24 }}>We&apos;ll respond within 30 minutes during business hours.</p>

              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {['Full name', 'Phone'].map((placeholder) => (
                    <div key={placeholder}>
                      <label style={{ ...monoLabel, display: 'block', fontSize: 10.5, color: theme.textFaint, marginBottom: 6 }}>
                        {placeholder}
                      </label>
                      <input
                        type={placeholder === 'Phone' ? 'tel' : 'text'}
                        placeholder={placeholder === 'Phone' ? '+94 77 …' : placeholder}
                        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${theme.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none' }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ ...monoLabel, display: 'block', fontSize: 10.5, color: theme.textFaint, marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${theme.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ ...monoLabel, display: 'block', fontSize: 10.5, color: theme.textFaint, marginBottom: 6 }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help?"
                    style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: `1px solid ${theme.border}`, borderRadius: 10, padding: '11px 14px', fontSize: 14, color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
                <button
                  type="submit"
                  style={{ background: theme.accent, borderRadius: 12, padding: '14px 24px', fontSize: 15, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}
                >
                  Send Message →
                </button>
              </form>
            </div>

            <style>{`@media (max-width: 860px) { .contact-layout-responsive { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}
      </div>

      <style>{`.company-vehicle-card:hover { border-color: rgba(225,29,46,0.4); }`}</style>
    </>
  )
}
