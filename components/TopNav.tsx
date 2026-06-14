'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { XIcon, FilterIcon } from './Icons'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse Vehicles' },
  { href: '#how-it-works', label: 'How It Works' },
]

export default function TopNav() {
  const pathname   = usePathname()
  const router     = useRouter()
  const { user, loading, signOut } = useCustomerAuth()
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10,10,10,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 24px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <Image
            src="/logo.png"
            alt="RentCar Tours"
            width={220}
            height={84}
            style={{ objectFit: 'contain', height: 84, width: 220 }}
            priority
          />
        </Link>

        {/* Center nav links - hidden on small screens */}
        <div
          className="hidden-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
                color:
                  pathname === link.href
                    ? '#dc2828'
                    : 'rgba(255,255,255,0.62)',
                background:
                  pathname === link.href
                    ? 'rgba(220,40,40,0.08)'
                    : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right CTAs */}
        <div
          className="hidden-mobile"
          style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}
        >
          {!loading && !user && (
            <>
              <Link
                href="/login"
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: 'rgba(255,255,255,0.62)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                Sign In
              </Link>
              <Link
                href="/browse"
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: '#fff',
                  background: '#dc2828',
                  transition: 'all 0.15s',
                }}
              >
                Book Now
              </Link>
            </>
          )}

          {!loading && user && (
            <>
              <Link
                href="/my-bookings"
                style={{
                  padding: '8px 18px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: pathname === '/my-bookings' ? '#dc2828' : 'rgba(255,255,255,0.62)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: pathname === '/my-bookings' ? 'rgba(220,40,40,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                My Bookings
              </Link>

              {/* User avatar / dropdown */}
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#dc2828',
                    border: 'none',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={user.email ?? ''}
                >
                  {(user.email ?? 'U')[0].toUpperCase()}
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 44,
                      right: 0,
                      background: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.10)',
                      borderRadius: 10,
                      minWidth: 200,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      overflow: 'hidden',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Signed in as</p>
                      <p style={{ fontSize: 13, color: '#fff', fontWeight: 600, wordBreak: 'break-all' }}>{user.email}</p>
                    </div>
                    <Link
                      href="/my-bookings"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '11px 16px', fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      My Bookings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '11px 16px', fontSize: 14, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="show-mobile"
          onClick={() => setMobileOpen((v) => !v)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 6,
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <XIcon size={22} /> : <FilterIcon size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: '#131313',
            padding: '12px 24px 20px',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '10px 0',
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                color: pathname === link.href ? '#dc2828' : 'rgba(255,255,255,0.8)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {user ? (
              <>
                <Link
                  href="/my-bookings"
                  onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut() }}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#f87171', background: 'none', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer' }}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' }}
                >
                  Sign In
                </Link>
                <Link
                  href="/browse"
                  onClick={() => setMobileOpen(false)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none', color: '#fff', background: '#dc2828', textAlign: 'center' }}
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hidden-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
