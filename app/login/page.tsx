'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'

type Tab = 'signin' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, signIn, signUp } = useCustomerAuth()

  const [tab, setTab]           = useState<Tab>('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) router.replace('/my-bookings')
  }, [user, loading, router])

  const reset = () => { setError(null); setSuccess(null) }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    reset()

    if (tab === 'signup' && password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    if (tab === 'signin') {
      const { error } = await signIn(email, password)
      if (error) { setError(error); setSubmitting(false); return }
      router.push('/my-bookings')
    } else {
      const { error } = await signUp(email, password)
      if (error) { setError(error); setSubmitting(false); return }
      setSuccess('Account created! Check your email to confirm, then sign in.')
      setTab('signin')
    }
    setSubmitting(false)
  }

  if (loading) return null

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Minimal header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Rent Car Tours" width={160} height={60} style={{ objectFit: 'contain', width: 160, height: 60 }} />
        </Link>
      </header>

      {/* Form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6, textAlign: 'center' }}>
            {tab === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', textAlign: 'center', marginBottom: 28 }}>
            {tab === 'signin' ? 'Sign in to view your booking history.' : 'Track your bookings and reservations.'}
          </p>

          {/* Tab switcher */}
          <div
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              padding: 4,
              marginBottom: 24,
            }}
          >
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTab(t); reset() }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: 7,
                  border: 'none',
                  background: tab === t ? '#dc2828' : 'transparent',
                  color: tab === t ? '#fff' : 'rgba(255,255,255,0.38)',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  style={inputStyle}
                />
              </div>
              {tab === 'signup' && (
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat your password"
                    required
                    style={inputStyle}
                  />
                </div>
              )}
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#f87171' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, fontSize: 13, color: '#4ade80' }}>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                marginTop: 20,
                padding: '13px',
                borderRadius: 10,
                border: 'none',
                background: submitting ? 'rgba(220,40,40,0.5)' : '#dc2828',
                color: '#fff',
                fontSize: 15,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {submitting ? 'Please wait…' : tab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
            <Link href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}>← Back to home</Link>
            <a href="http://app.rentcartours.com/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}>Staff Login →</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.38)',
  marginBottom: 6,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  padding: '11px 14px',
  fontSize: 14,
  color: '#fff',
  colorScheme: 'dark',
  boxSizing: 'border-box',
}
