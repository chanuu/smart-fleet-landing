'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { XIcon, FilterIcon } from './Icons'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/browse', label: 'Browse Vehicles' },
  { href: '#how-it-works', label: 'How It Works' },
]

export default function TopNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

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
            height={64}
            style={{ objectFit: 'contain', height: 64, width: 220 }}
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
          <Link
            href="/browse"
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
            Browse Fleet
          </Link>
          <Link
            href="/browse"
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              color: '#000',
              background: '#dc2828',
              transition: 'all 0.15s',
            }}
          >
            Book Now
          </Link>
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
            <Link
              href="/browse"
              onClick={() => setMobileOpen(false)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                color: 'rgba(255,255,255,0.8)',
                border: '1px solid rgba(255,255,255,0.12)',
                textAlign: 'center',
              }}
            >
              Browse Fleet
            </Link>
            <Link
              href="/browse"
              onClick={() => setMobileOpen(false)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                color: '#000',
                background: '#dc2828',
                textAlign: 'center',
              }}
            >
              Book Now
            </Link>
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
