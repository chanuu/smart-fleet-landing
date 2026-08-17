import Link from 'next/link'
import { theme } from '@/lib/companyTheme'

interface Props {
  tenantName: string
  logoUrl: string | null
  initials: string
  phone: string | null
}

/**
 * White-labeled footer for a tenant's public profile page — no platform link grid, just the
 * tenant's own branding and contact info, with a small "powered by" credit line (kept
 * transparent about which platform is hosting the page, without competing for attention with
 * the tenant's own branding above it).
 */
export default function CompanyFooter({ tenantName, logoUrl, initials, phone }: Props) {
  return (
    <footer style={{ borderTop: `1px solid ${theme.border}`, padding: '34px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- signed tenant-assets URL
            <img src={logoUrl} alt={tenantName} style={{ width: 34, height: 34, borderRadius: 9, objectFit: 'cover', background: '#fff' }} />
          ) : (
            <div style={{ width: 34, height: 34, borderRadius: 9, background: '#fff', display: 'grid', placeItems: 'center', color: theme.accent, fontWeight: 800, fontSize: 11 }}>
              {initials}
            </div>
          )}
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
            {tenantName}{phone ? ` · ${phone}` : ''}
          </span>
        </div>
        <span style={{ fontSize: 12, color: theme.textFainter }}>
          © {new Date().getFullYear()} {tenantName} · Bookings powered by{' '}
          <Link href="/" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'underline' }}>
            Rent Car Tours
          </Link>
        </span>
      </div>
    </footer>
  )
}
