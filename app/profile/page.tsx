'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import type { CustomerPublicProfile } from '@/types'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'

type CustomerUser = NonNullable<ReturnType<typeof useCustomerAuth>['user']>
type Tab = 'overview' | 'reviews'

// ---- Shared styles ----

const cardStyle: React.CSSProperties = {
  background: '#131313',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  padding: '20px 24px',
  marginBottom: 24,
}

const cardTitleStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.5)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 16,
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

// ---- Contact information (editable) ----

function ContactInfoCard({ user }: { user: CustomerUser }) {
  const [fullName, setFullName] = useState<string>(user.user_metadata?.full_name ?? '')
  const [phone,    setPhone]    = useState<string>(user.user_metadata?.phone ?? '')
  const [license,  setLicense]  = useState<string>(user.user_metadata?.license_number ?? '')
  const [nic,      setNic]      = useState<string>(user.user_metadata?.nic_number ?? '')
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState<{ ok: boolean; text: string } | null>(null)

  const handleSave = async () => {
    const normalizedLicense = license.replace(/\s/g, '').toUpperCase()
    const normalizedNic = nic.replace(/\s/g, '').toUpperCase()
    setLicense(normalizedLicense)
    setNic(normalizedNic)
    setSaving(true)
    setMsg(null)
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name:      fullName.trim(),
        phone:          phone.trim(),
        license_number: normalizedLicense,
        nic_number:     normalizedNic,
      },
    })
    setSaving(false)
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: 'Profile saved.' })
  }

  return (
    <div style={cardStyle}>
      <h2 style={cardTitleStyle}>Contact Information</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, alignItems: 'end' }}>
        <div>
          <label style={profileLabelStyle}>Email</label>
          <div style={{ ...profileInputStyle, color: 'rgba(255,255,255,0.38)', cursor: 'default' }}>{user.email}</div>
        </div>

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
          <label style={profileLabelStyle}>NIC Number</label>
          <input
            type="text"
            value={nic}
            onChange={e => setNic(e.target.value.replace(/\s/g, '').toUpperCase())}
            placeholder="e.g. 200012345678"
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
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {msg && (
        <p style={{ marginTop: 10, fontSize: 13, color: msg.ok ? '#4ade80' : '#f87171' }}>{msg.text}</p>
      )}
    </div>
  )
}

// ---- Change password ----

function ChangePasswordCard() {
  const { updatePassword } = useCustomerAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const handleSave = async () => {
    setMsg(null)
    if (password.length < 6) {
      setMsg({ ok: false, text: 'Password must be at least 6 characters.' })
      return
    }
    if (password !== confirm) {
      setMsg({ ok: false, text: 'Passwords do not match.' })
      return
    }
    setSaving(true)
    const { error } = await updatePassword(password)
    setSaving(false)
    if (error) {
      setMsg({ ok: false, text: error })
    } else {
      setPassword('')
      setConfirm('')
      setMsg({ ok: true, text: 'Password updated.' })
    }
  }

  return (
    <div style={cardStyle}>
      <h2 style={cardTitleStyle}>Change Password</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, alignItems: 'end' }}>
        <div>
          <label style={profileLabelStyle}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            style={profileInputStyle}
          />
        </div>
        <div>
          <label style={profileLabelStyle}>Confirm New Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Repeat new password"
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
              background: saving ? 'rgba(210,4,45,0.5)' : '#D2042D',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {saving ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </div>

      {msg && (
        <p style={{ marginTop: 10, fontSize: 13, color: msg.ok ? '#4ade80' : '#f87171' }}>{msg.text}</p>
      )}
    </div>
  )
}

// ---- Reviews / trust score ----

const RATING_CATEGORIES: { key: keyof CustomerPublicProfile; label: string }[] = [
  { key: 'avg_vehicle_care',        label: 'Vehicle Care' },
  { key: 'avg_payment_reliability', label: 'Payment Reliability' },
  { key: 'avg_communication',       label: 'Communication' },
  { key: 'avg_rule_compliance',     label: 'Rule Compliance' },
  { key: 'avg_punctuality',         label: 'Punctuality' },
]

const BLACKLIST_STYLES: Record<string, { bg: string; border: string; color: string; label: string }> = {
  warning:     { bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.3)',  color: '#facc15', label: 'Warning' },
  restricted:  { bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.3)', color: '#fb923c', label: 'Restricted' },
  blacklisted: { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.3)',  color: '#f87171', label: 'Blacklisted' },
}

function ReviewsTab({ profile, hasLicense }: { profile: CustomerPublicProfile | null; hasLicense: boolean }) {
  if (!hasLicense) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '24px 16px', border: '1px dashed rgba(255,255,255,0.10)', borderRadius: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.38)', marginBottom: 4 }}>Add your driving license number</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Go to the Overview tab and save your license number — reviews and trust score appear once it&apos;s linked to rental history.</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', padding: '24px 16px', border: '1px dashed rgba(255,255,255,0.10)', borderRadius: 10 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.38)', marginBottom: 4 }}>No reviews yet</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Your trust score and reviews appear after your first rental is completed and rated.</p>
        </div>
      </div>
    )
  }

  const rating = profile.global_rating != null ? Number(profile.global_rating) : null
  const bs = profile.blacklist_status ? BLACKLIST_STYLES[profile.blacklist_status] : null

  return (
    <div style={cardStyle}>
      {/* Blacklist alert */}
      {bs && (
        <div style={{ padding: '10px 14px', background: bs.bg, border: `1px solid ${bs.border}`, borderRadius: 10, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={bs.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: bs.color }}>
            Account Status: {bs.label}
          </span>
        </div>
      )}

      {/* Top stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: rating != null ? '#dc2828' : 'rgba(255,255,255,0.15)', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {rating != null ? rating.toFixed(1) : '—'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 2, margin: '6px 0 4px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={rating != null && star <= Math.round(rating) ? '#dc2828' : 'none'} stroke={rating != null && star <= Math.round(rating) ? '#dc2828' : 'rgba(255,255,255,0.15)'} strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Overall Rating</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {profile.total_rentals}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginTop: 10 }}>Completed Rentals</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: profile.total_violations > 0 ? '#f87171' : '#4ade80', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {profile.total_violations}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em', marginTop: 10 }}>Disputes</div>
        </div>
      </div>

      {/* Rating breakdown */}
      {rating != null && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>Rating Breakdown</div>
          {RATING_CATEGORIES.map(({ key, label }) => {
            const val = profile[key] as number | null
            const pct = val != null ? (Number(val) / 5) * 100 : 0
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, width: 140, flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? '#4ade80' : pct >= 40 ? '#facc15' : '#f87171', borderRadius: 3, transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)', width: 28, textAlign: 'right', flexShrink: 0 }}>
                  {val != null ? Number(val).toFixed(1) : '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---- Header ----

function ProfileHeader({ user, profile, onEdit }: { user: CustomerUser; profile: CustomerPublicProfile | null; onEdit: () => void }) {
  const displayName = profile?.display_name ?? user.user_metadata?.full_name ?? user.email ?? 'Driver'
  const since = user.created_at
    ? new Date(user.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : null

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {profile?.profile_image_url ? (
          <img
            src={profile.profile_image_url}
            alt={displayName}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.10)', flexShrink: 0, background: '#1a1a1a' }}
          />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(220,40,40,0.15)', border: '2px solid rgba(220,40,40,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 0 0-16 0"/>
            </svg>
          </div>
        )}
        <div>
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 3 }}>
            {displayName}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>
            {since ? `Customer since ${since}` : user.email}
          </p>
        </div>
      </div>

      <button
        onClick={onEdit}
        style={{
          padding: '9px 18px',
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.04)',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Edit Profile
      </button>
    </div>
  )
}

// ---- Tab bar ----

function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'reviews',  label: 'Reviews' },
  ]
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 24 }}>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          style={{
            padding: '10px 4px',
            marginRight: 28,
            background: 'none',
            border: 'none',
            borderBottom: `2px solid ${tab === t.key ? '#dc2828' : 'transparent'}`,
            color: tab === t.key ? '#dc2828' : 'rgba(255,255,255,0.5)',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ---- Main component ----

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading } = useCustomerAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [trustProfile, setTrustProfile] = useState<CustomerPublicProfile | null>(null)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading, router])

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setFetching(true)
    try {
      const { data } = await supabase.rpc('get_my_customer_public_profile')
      const profiles = (data ?? []) as CustomerPublicProfile[]
      if (profiles.length > 0) {
        const p = profiles[0]
        if (p.profile_image_url) {
          const { data: signed } = await supabase.storage
            .from('license-images')
            .createSignedUrl(p.profile_image_url, 3600)
          p.profile_image_url = signed?.signedUrl ?? null
        }
        setTrustProfile(p)
      } else {
        setTrustProfile(null)
      }
    } finally {
      setFetching(false)
    }
  }, [user])

  useEffect(() => {
    if (user) fetchProfile()
  }, [user, fetchProfile])

  if (loading || !user) return null

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <TopNav />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(32px, 4vw, 56px) 24px 64px' }}>
        <ProfileHeader user={user} profile={trustProfile} onEdit={() => setTab('overview')} />

        <TabBar tab={tab} setTab={setTab} />

        {tab === 'overview' ? (
          <>
            <ContactInfoCard user={user} />
            <ChangePasswordCard />
          </>
        ) : fetching ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'rgba(255,255,255,0.28)', paddingTop: 40, fontSize: 14 }}>
            <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#dc2828', animation: 'spin 0.8s linear infinite' }} />
            Loading reviews…
          </div>
        ) : (
          <ReviewsTab
            profile={trustProfile}
            hasLicense={!!user.user_metadata?.license_number}
          />
        )}
      </div>

      <Footer />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
