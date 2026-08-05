'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'

export default function ForgotPasswordPage() {
  const { resetPasswordForEmail } = useCustomerAuth()
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error } = await resetPasswordForEmail(email.trim())
    setSubmitting(false)
    if (error) { setError(error); return }
    // Always show success, regardless of whether the email exists,
    // to avoid leaking which emails are registered.
    setSent(true)
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
          {sent ? (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 10, textAlign: 'center' }}>
                Check your email
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>
                If an account exists for <strong style={{ color: '#fff' }}>{email}</strong>, we&apos;ve sent a password
                reset link. It expires in 1 hour.
              </p>
              <div style={{ textAlign: 'center' }}>
                <Link href="/login" style={{ fontSize: 13, color: '#D2042D', fontWeight: 600, textDecoration: 'none' }}>← Back to sign in</Link>
              </div>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 6, textAlign: 'center' }}>
                Forgot password?
              </h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)', textAlign: 'center', marginBottom: 28 }}>
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  style={inputStyle}
                />

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
                  {submitting ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Link href="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}>← Back to sign in</Link>
              </div>
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
