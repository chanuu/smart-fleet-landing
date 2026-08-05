'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { updatePassword } = useCustomerAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)

  // Supabase parses the recovery token from the URL and establishes a
  // temporary session automatically; wait for that before allowing submit.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(!!session)
    })
  }, [])

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error } = await updatePassword(password)
    setSubmitting(false)
    if (error) { setError(error); return }
    setSuccess(true)
    setTimeout(() => router.push('/my-bookings'), 2000)
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Rent Car Tours" width={160} height={60} style={{ objectFit: 'contain', width: 160, height: 60 }} />
        </Link>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {success ? (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10, textAlign: 'center' }}>
                Password updated
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.6 }}>
                Your password has been reset. Taking you to your bookings…
              </p>
            </>
          ) : !ready ? (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10, textAlign: 'center' }}>
                Verifying link…
              </h1>
              <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.6 }}>
                If this takes more than a few seconds, your reset link may have expired.{' '}
                <Link href="/forgot-password" style={{ color: '#D2042D', fontWeight: 600 }}>Request a new one</Link>.
              </p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6, textAlign: 'center' }}>
                Set a new password
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', textAlign: 'center', marginBottom: 28 }}>
                Choose a new password for your account.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={labelStyle}>New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Confirm Password</label>
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Repeat new password"
                      required
                      style={inputStyle}
                    />
                  </div>
                </div>

                {error && (
                  <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, fontSize: 13, color: '#f87171' }}>
                    {error}
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
                    background: submitting ? 'rgba(210,4,45,0.5)' : '#D2042D',
                    color: '#fff',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </>
          )}
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
  fontSize: 16,
  color: '#fff',
  colorScheme: 'dark',
  boxSizing: 'border-box',
}
