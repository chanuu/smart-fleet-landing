'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'

// ---- Profile card ----

function ProfileCard({ user }: { user: NonNullable<ReturnType<typeof useCustomerAuth>['user']> }) {
  const [fullName, setFullName] = useState<string>(user.user_metadata?.full_name ?? '')
  const [phone,    setPhone]    = useState<string>(user.user_metadata?.phone ?? '')
  const [license,  setLicense]  = useState<string>(user.user_metadata?.license_number ?? '')
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState<{ ok: boolean; text: string } | null>(null)

  const handleSave = async () => {
    const normalizedLicense = license.replace(/\s/g, '').toUpperCase()
    setLicense(normalizedLicense)
    setSaving(true)
    setMsg(null)
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name:      fullName.trim(),
        phone:          phone.trim(),
        license_number: normalizedLicense,
      },
    })
    setSaving(false)
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: 'Profile saved.' })
  }

  return (
    <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px', marginBottom: 36 }}>
      <h2 style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16 }}>
        My Profile
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, alignItems: 'end' }}>
        {/* Email — read-only */}
        <div>
          <label style={profileLabelStyle}>Email</label>
          <div style={{ ...profileInputStyle, color: 'rgba(255,255,255,0.38)', cursor: 'default' }}>{user.email}</div>
        </div>

        {/* Full name */}
        <div>
          <label style={profileLabelStyle}>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="As on driving license"
            style={profileInputStyle}
          />
        </div>

        {/* Contact number */}
        <div>
          <label style={profileLabelStyle}>Contact No.</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="+94 XX XXX XXXX"
            style={profileInputStyle}
          />
        </div>

        {/* License number */}
        <div>
          <label style={profileLabelStyle}>Driving License No.</label>
          <input
            type="text"
            value={license}
            onChange={e => setLicense(e.target.value.replace(/\s/g, '').toUpperCase())}
            placeholder="e.g. B1234567"
            style={profileInputStyle}
          />
        </div>

        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: saving ? 'rgba(220,40,40,0.5)' : '#dc2828',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </div>
      </div>

      {msg && (
        <p style={{ marginTop: 10, fontSize: 13, color: msg.ok ? '#4ade80' : '#f87171' }}>{msg.text}</p>
      )}
    </div>
  )
}

const profileLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.28)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 6,
}

const profileInputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  color: '#fff',
  colorScheme: 'dark',
  boxSizing: 'border-box',
}

// ---- Types ----

interface BookingRequest {
  id: string
  vehicle_id: string
  customer_name: string
  start_date: string
  start_time: string
  return_date: string
  return_time: string
  with_driver: boolean
  pickup_type: string
  delivery_address: string | null
  notes: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  created_at: string
  vehicle_brand: string | null
  vehicle_registration: string | null
}

interface RentalRecord {
  id: string
  status: 'pending' | 'active' | 'completed' | 'cancelled'
  start_date: string
  start_time: string | null
  expected_return_date: string | null
  expected_return_time: string | null
  booked_days: number | null
  with_driver: boolean
  booking_note: string | null
  created_at: string | null
  vehicle_brand: string | null
  vehicle_registration: string | null
  vehicle_type: string | null
}

// ---- Helpers ----

function fmtDate(d: string | null | undefined) {
  if (!d) return '—'
  try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
  catch { return d }
}

function fmtTime(t: string | null | undefined) {
  if (!t) return ''
  try {
    const [h, m] = t.split(':')
    const d = new Date(); d.setHours(+h, +m)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } catch { return t }
}

// ---- Status badge ----

const INQUIRY_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(234,179,8,0.12)',  color: '#facc15', label: 'Pending Review' },
  confirmed: { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', label: 'Confirmed' },
  rejected:  { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', label: 'Declined' },
}

const RENTAL_STATUS: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(234,179,8,0.12)',  color: '#facc15', label: 'Booking Pending' },
  active:    { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', label: 'Active Rental' },
  completed: { bg: 'rgba(34,197,94,0.12)',  color: '#4ade80', label: 'Completed' },
  cancelled: { bg: 'rgba(239,68,68,0.12)',  color: '#f87171', label: 'Cancelled' },
}

function StatusBadge({ map, status }: { map: typeof INQUIRY_STATUS; status: string }) {
  const s = map[status] ?? { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', label: status }
  return (
    <span style={{ padding: '3px 10px', borderRadius: 999, background: s.bg, color: s.color, fontSize: 11, fontWeight: 700 }}>
      {s.label}
    </span>
  )
}

// ---- Card ----

function BookingCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#131313', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px 24px' }}>
      {children}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

// ---- Main component ----

export default function MyBookingsPage() {
  const router = useRouter()
  const { user, loading } = useCustomerAuth()

  const [inquiries, setInquiries]   = useState<BookingRequest[]>([])
  const [rentals,   setRentals]     = useState<RentalRecord[]>([])
  const [fetching,  setFetching]    = useState(true)
  const [fetchErr,  setFetchErr]    = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  const fetchData = useCallback(async () => {
    if (!user) return
    setFetching(true)
    setFetchErr(null)
    try {
      const [reqResult, rentResult] = await Promise.all([
        supabase.rpc('get_my_booking_requests'),
        supabase.rpc('get_my_rentals'),
      ])

      if (reqResult.error) throw new Error(`Inquiries: ${reqResult.error.message}`)
      if (rentResult.error) throw new Error(`Rentals: ${rentResult.error.message}`)

      setInquiries((reqResult.data ?? []) as BookingRequest[])
      setRentals((rentResult.data ?? []) as RentalRecord[])
    } catch (err) {
      setFetchErr(err instanceof Error ? err.message : 'Failed to load bookings.')
    } finally {
      setFetching(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchData()
  }, [user, fetchData])

  if (loading || !user) return null

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <TopNav />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px, 4vw, 56px) 24px 64px' }}>
        {/* Page header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6 }}>
            My Bookings
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>
            <button onClick={fetchData} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.38)', cursor: 'pointer', fontSize: 14, padding: 0 }}>↻ Refresh</button>
          </p>
        </div>

        {/* Profile */}
        <ProfileCard user={user} />

        {fetching ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'rgba(255,255,255,0.28)', paddingTop: 80, fontSize: 14 }}>
            <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#dc2828', animation: 'spin 0.8s linear infinite' }} />
            Loading your bookings…
          </div>
        ) : fetchErr ? (
          <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, fontSize: 13, color: '#f87171' }}>
            {fetchErr}
          </div>
        ) : (
          <>
            {/* ---- Booking Inquiries ---- */}
            <Section title="Booking Inquiries" subtitle="Requests you submitted from the website">
              {inquiries.length === 0 ? (
                <EmptyState message="No booking requests found." hint="Submit a booking from any vehicle listing and it will appear here." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {inquiries.map((inq) => (
                    <BookingCard key={inq.id}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
                            {inq.vehicle_brand ?? 'Vehicle'}{inq.vehicle_registration ? ` · ${inq.vehicle_registration}` : ''}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                            Submitted {fmtDate(inq.created_at)}
                          </div>
                        </div>
                        <StatusBadge map={INQUIRY_STATUS} status={inq.status} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px 20px' }}>
                        <InfoRow label="Pickup"   value={`${fmtDate(inq.start_date)} ${fmtTime(inq.start_time)}`} />
                        <InfoRow label="Return"   value={`${fmtDate(inq.return_date)} ${fmtTime(inq.return_time)}`} />
                        <InfoRow label="Location" value={inq.pickup_type === 'delivery' ? `Delivery${inq.delivery_address ? ` — ${inq.delivery_address}` : ''}` : 'Office pickup'} />
                        {inq.with_driver && <InfoRow label="Driver" value="Professional driver requested" />}
                        {inq.notes && <InfoRow label="Notes" value={inq.notes} />}
                      </div>

                      {inq.status === 'confirmed' && (
                        <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, fontSize: 12, color: '#4ade80' }}>
                          ✓ Confirmed — the rental company will contact you shortly to finalise the booking.
                        </div>
                      )}
                      {inq.status === 'pending' && (
                        <div style={{ marginTop: 14, padding: '8px 12px', background: 'rgba(234,179,8,0.06)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 8, fontSize: 12, color: '#facc15' }}>
                          ⏳ Awaiting review — the rental company will get back to you within 24 hours.
                        </div>
                      )}
                    </BookingCard>
                  ))}
                </div>
              )}
            </Section>

            {/* ---- Rental History ---- */}
            <Section title="Rental History" subtitle="Bookings created and managed by the rental company">
              {rentals.length === 0 ? (
                <EmptyState message="No rental records yet." hint="Once the rental company confirms your inquiry and starts the rental, it will appear here." />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {rentals.map((r) => (
                    <BookingCard key={r.id}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
                            {[r.vehicle_brand, r.vehicle_type].filter(Boolean).join(' ')}{r.vehicle_registration ? ` · ${r.vehicle_registration}` : ''}
                          </div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)' }}>
                            {r.booked_days ? `${r.booked_days} day${r.booked_days !== 1 ? 's' : ''}` : ''}
                            {r.created_at ? ` · Booked ${fmtDate(r.created_at)}` : ''}
                          </div>
                        </div>
                        <StatusBadge map={RENTAL_STATUS} status={r.status} />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px 20px' }}>
                        <InfoRow label="Start"  value={`${fmtDate(r.start_date)}${r.start_time ? ' ' + fmtTime(r.start_time) : ''}`} />
                        <InfoRow label="Return" value={r.expected_return_date ? `${fmtDate(r.expected_return_date)}${r.expected_return_time ? ' ' + fmtTime(r.expected_return_time) : ''}` : undefined} />
                        {r.with_driver && <InfoRow label="Driver" value="Included" />}
                        {r.booking_note && <InfoRow label="Note" value={r.booking_note} />}
                      </div>
                    </BookingCard>
                  ))}
                </div>
              )}
            </Section>
          </>
        )}
      </div>

      <Footer />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{title}</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.28)' }}>{subtitle}</p>
      </div>
      {children}
    </div>
  )
}

function EmptyState({ message, hint }: { message: string; hint: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 24px', border: '1px dashed rgba(255,255,255,0.10)', borderRadius: 14 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.38)', marginBottom: 6 }}>{message}</p>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>{hint}</p>
    </div>
  )
}
