import Link from 'next/link'

const FOOTER_LINKS = {
  Explore: [
    { label: 'Browse Vehicles', href: '/browse' },
    { label: 'Book a Vehicle', href: '/browse' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '/browse' },
  ],
  Company: [
    { label: 'About DriveLanka', href: '#' },
    { label: 'Partner with Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        background: '#0a0a0a',
        borderTop: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(40px, 6vw, 72px) 24px 32px',
        }}
      >
        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px 32px',
            marginBottom: 48,
          }}
        >
          {/* Brand col */}
          <div style={{ gridColumn: 'span 1' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: '#f59e0b',
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: 18,
                  color: '#000',
                }}
              >
                D
              </div>
              <span style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>
                Drive<span style={{ color: '#f59e0b' }}>Lanka</span>
              </span>
            </Link>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', lineHeight: 1.7, maxWidth: 240 }}>
              Sri Lanka&apos;s premier vehicle rental marketplace. Connect with verified partners across every district.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {['FB', 'IG', 'TW'].map((s) => (
                <a
                  key={s}
                  href="#"
                  style={{
                    width: 34,
                    height: 34,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.38)',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                {title}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.5)',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.24)' }}>
              © {new Date().getFullYear()} DriveLanka. All rights reserved.
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.24)' }}>
              Made with care in Sri Lanka 🇱🇰
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
