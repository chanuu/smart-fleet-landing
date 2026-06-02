'use client'

import { useState } from 'react'
import type { TenantDetail, VehicleListing } from '@/types'
import VehicleCard from './VehicleCard'

interface Props {
  tenant: TenantDetail
  vehicles: VehicleListing[]
  years: number
  reviews: number
  rating: string
}

type Tab = 'fleet' | 'about' | 'reviews' | 'contact'

const STATIC_REVIEWS = [
  { name: 'Nimal F.', rating: 5, date: '2 weeks ago', text: 'Booked a Land Cruiser for a Yala trip — vehicle was spotless, paperwork was instant, and the staff stayed back when our flight was delayed. Will book again.' },
  { name: 'Sandhya P.', rating: 5, date: '1 month ago', text: 'Great experience. The car was delivered to my hotel on time and they explained every feature before I drove off. Pricing was transparent — no surprise fees.' },
  { name: 'Aravinda K.', rating: 4, date: '1 month ago', text: 'Smooth booking, fair pricing. Small AC issue but they swapped the vehicle within an hour. Customer service was excellent.' },
  { name: 'Priya R.', rating: 5, date: '2 months ago', text: 'Rented for our wedding — the car was immaculate and the driver was a true professional. Made our day perfect.' },
]

const RATING_DIST = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
]

function StarRow({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export default function CompanyProfileClient({ tenant, vehicles, years, reviews, rating }: Props) {
  const [tab, setTab] = useState<Tab>('fleet')
  const [activeType, setActiveType] = useState('All')

  const vehicleTypes = ['All', ...Array.from(new Set(vehicles.map((v) => v.vehicle_type).filter(Boolean) as string[]))]
  const filtered = activeType === 'All' ? vehicles : vehicles.filter((v) => v.vehicle_type === activeType)

  const typeCounts: Record<string, number> = {}
  vehicles.forEach((v) => {
    if (v.vehicle_type) typeCounts[v.vehicle_type] = (typeCounts[v.vehicle_type] ?? 0) + 1
  })
  const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

  const tabs: { id: Tab; label: string; badge?: number | string }[] = [
    { id: 'fleet', label: 'Fleet', badge: vehicles.length },
    { id: 'about', label: 'About' },
    { id: 'reviews', label: 'Reviews', badge: reviews },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Sticky tabs */}
      <div
        style={{
          position: 'sticky',
          top: 72,
          zIndex: 20,
          background: '#0a0a0a',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 0, overflowX: 'auto' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '18px 0',
                marginRight: 32,
                fontSize: 14,
                fontWeight: 600,
                color: tab === t.id ? '#f59e0b' : 'rgba(255,255,255,0.45)',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.id ? '2px solid #f59e0b' : '2px solid transparent',
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
                    background: tab === t.id ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                    color: tab === t.id ? '#000' : 'rgba(255,255,255,0.4)',
                    fontSize: 11,
                    fontWeight: 700,
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
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* ── Fleet ── */}
        {tab === 'fleet' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)' }}>
                <b style={{ color: '#fff' }}>{filtered.length}</b> vehicle{filtered.length !== 1 ? 's' : ''} in fleet
              </p>
            </div>

            {/* Type chips */}
            {vehicleTypes.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                {vehicleTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: `1px solid ${activeType === type ? '#f59e0b' : 'rgba(255,255,255,0.10)'}`,
                      background: activeType === type ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                      color: activeType === type ? '#f59e0b' : 'rgba(255,255,255,0.62)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {type}
                    {type !== 'All' && typeCounts[type] && (
                      <span style={{ marginLeft: 6, opacity: 0.65, fontSize: 11 }}>{typeCounts[type]}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
                <p>No vehicles in this category.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {filtered.map((v) => <VehicleCard key={v.vehicle_id} vehicle={v} />)}
              </div>
            )}
          </div>
        )}

        {/* ── About ── */}
        {tab === 'about' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 48, alignItems: 'start' }} className="about-layout-responsive">
            <div>
              <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 20, color: '#fff' }}>
                About {tenant.name}
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
                Operating since {new Date().getFullYear() - years}, {tenant.name} has been a trusted name in vehicle rentals
                {tenant.district_name ? ` across the ${tenant.district_name} region` : ' across Sri Lanka'}.
                Our fleet spans {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} serving customers islandwide.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 32 }}>
                Every vehicle is regularly serviced at certified workshops, fully insured, and equipped with roadside assistance.
                We&apos;re committed to transparent pricing with no hidden fees.
              </p>

              <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, color: '#fff' }}>
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
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      padding: 18,
                      background: '#131313',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        background: 'rgba(245,158,11,0.12)',
                        borderRadius: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{f.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.4 }}>{f.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {topTypes.length > 0 && (
                <>
                  <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16, color: '#fff' }}>
                    Fleet composition
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {topTypes.map(([type, count]) => {
                      const pct = (count / vehicles.length) * 100
                      return (
                        <div key={type} style={{ display: 'grid', gridTemplateColumns: '120px 1fr 36px', gap: 16, alignItems: 'center' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{type}</div>
                          <div style={{ height: 8, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #d97706 0%, #f59e0b 100%)', borderRadius: 999 }} />
                          </div>
                          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', fontWeight: 700, textAlign: 'right' }}>{count}</div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                  Operating Hours
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { day: 'Mon – Fri', hours: '7:00 AM – 9:00 PM' },
                    { day: 'Saturday', hours: '8:00 AM – 8:00 PM' },
                    { day: 'Sunday', hours: '9:00 AM – 6:00 PM' },
                    { day: 'Emergency line', hours: '24 / 7', amber: true },
                  ].map((row) => (
                    <div key={row.day} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingTop: row.amber ? 10 : 0, borderTop: row.amber ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
                      <span style={{ color: 'rgba(255,255,255,0.45)' }}>{row.day}</span>
                      <b style={{ fontWeight: 700, color: row.amber ? '#f59e0b' : '#fff' }}>{row.hours}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
                  Rental Policies
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Minimum driver age: 21 years',
                    'Valid driving license required',
                    'Refundable security deposit',
                    'Free cancellation 24h before',
                  ].map((p) => (
                    <div key={p} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ color: '#f59e0b', flexShrink: 0 }}>✓</span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 48, alignItems: 'start' }} className="reviews-layout-responsive">
            {/* Score summary */}
            <div style={{ position: 'sticky', top: 140 }}>
              <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '32px 24px', textAlign: 'center', marginBottom: 14 }}>
                <div style={{ fontSize: 64, fontWeight: 800, color: '#f59e0b', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 8 }}>{rating}</div>
                <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 8 }}>
                  {[1, 2, 3, 4, 5].map((s) => <StarRow key={s} filled={s <= Math.round(parseFloat(rating))} />)}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{reviews} verified reviews</div>
              </div>
              <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {RATING_DIST.map((r) => (
                  <div key={r.stars} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 36px', gap: 12, alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{r.stars} ★</span>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${r.pct}%`, background: '#f59e0b', borderRadius: 999 }} />
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 600, textAlign: 'right' }}>{r.pct}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {STATIC_REVIEWS.map((r, i) => (
                <div key={i} style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                    <div
                      style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#000', display: 'grid', placeItems: 'center',
                        fontWeight: 800, fontSize: 14, flexShrink: 0,
                      }}
                    >
                      {r.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{r.name}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{r.date}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 1 }}>
                      {[1, 2, 3, 4, 5].map((s) => <StarRow key={s} filled={s <= r.rating} />)}
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>{r.text}</p>
                </div>
              ))}
            </div>

            <style>{`@media (max-width: 860px) { .reviews-layout-responsive { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}

        {/* ── Contact ── */}
        {tab === 'contact' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }} className="contact-layout-responsive">
            <div>
              <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 24, color: '#fff' }}>
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
                  value: 'Mon–Fri: 7:00 AM – 9:00 PM\nWeekends: vary · Emergency 24/7',
                },
              ].filter(Boolean).map((item, idx) => {
                const it = item as { icon: React.ReactNode; label: string; value: string }
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: 16,
                      padding: '20px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div
                      style={{
                        width: 42, height: 42,
                        background: 'rgba(245,158,11,0.12)',
                        borderRadius: 11,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#f59e0b', flexShrink: 0,
                      }}
                    >
                      {it.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
                        {it.label}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {it.value}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Message form */}
            <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 32 }}>
              <h3 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8, color: '#fff' }}>Send a message</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>We&apos;ll respond within 30 minutes during business hours.</p>

              <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {['Full name', 'Phone'].map((placeholder) => (
                    <div key={placeholder}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                        {placeholder}
                      </label>
                      <input
                        type={placeholder === 'Phone' ? 'tel' : 'text'}
                        placeholder={placeholder === 'Phone' ? '+94 77 …' : placeholder}
                        style={{
                          width: '100%', boxSizing: 'border-box',
                          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                          borderRadius: 10, padding: '11px 14px', fontSize: 14,
                          color: '#fff', outline: 'none',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 10, padding: '11px 14px', fontSize: 14,
                      color: '#fff', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="How can we help?"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: 10, padding: '11px 14px', fontSize: 14,
                      color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    background: '#f59e0b', borderRadius: 12, padding: '14px 24px',
                    fontSize: 15, fontWeight: 700, color: '#000', border: 'none',
                    cursor: 'pointer', width: '100%',
                  }}
                >
                  Send Message →
                </button>
              </form>
            </div>

            <style>{`@media (max-width: 860px) { .contact-layout-responsive { grid-template-columns: 1fr !important; } }`}</style>
          </div>
        )}
      </div>
    </>
  )
}
