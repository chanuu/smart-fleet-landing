'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useCustomerAuth } from '@/contexts/CustomerAuthContext'
import { supabase } from '@/lib/supabase'
import { theme, monoLabel } from '@/lib/companyTheme'

interface Props {
  tenantId: string
  tenantName: string
  logoUrl: string | null
  initials: string
}

/**
 * White-labeled nav for a tenant's public profile page — same shell/height as the platform
 * TopNav (so CompanyProfileClient's `top: 72` sticky tab offset still lines up), but branded
 * to the tenant instead of Rent Car Tours: no platform logo/menu, logo+name link to the
 * tenant's own profile instead of the marketplace homepage. Auth stays wired in since bookings
 * still run through the shared customer account system.
 */
export default function CompanyTopNav({ tenantId, tenantName, logoUrl, initials }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useCustomerAuth()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
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

  useEffect(() => {
    if (!user) { setAvatarUrl(null); return }
    let cancelled = false
    supabase.rpc('get_my_customer_public_profile').then(async ({ data }) => {
      if (cancelled) return
      const profile = (data as { profile_image_url: string | null }[] | null)?.[0]
      if (!profile?.profile_image_url) return
      const { data: signed } = await supabase.storage
        .from('license-images')
        .createSignedUrl(profile.profile_image_url, 3600)
      if (!cancelled && signed?.signedUrl) setAvatarUrl(signed.signedUrl)
    })
    return () => { cancelled = true }
  }, [user])

  const handleSignOut = async () => {
    await signOut()
    router.push(`/companies/${tenantId}`)
  }

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${theme.border}`,
        background: 'rgba(8,8,10,0.86)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '14px 24px',
          minHeight: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        {/* Tenant branding */}
        <Link
          href={`/companies/${tenantId}`}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0, minWidth: 0 }}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- signed tenant-assets URL
            <img src={logoUrl} alt={tenantName} style={{ width: 38, height: 38, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: '#fff' }} />
          ) : (
            <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', display: 'grid', placeItems: 'center', color: theme.accent, fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em', flexShrink: 0 }}>
              {initials}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tenantName}
            </span>
            <span style={{ ...monoLabel, fontSize: 10, color: theme.textFaint }}>Verified partner</span>
          </div>
        </Link>

        {/* Right CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {!loading && !user && (
            <Link
              href="/login"
              style={{
                padding: '9px 16px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                color: '#fff',
                border: `1px solid ${theme.borderStrong}`,
                background: 'transparent',
                transition: 'all 0.15s',
              }}
            >
              Sign In
            </Link>
          )}

          {!loading && user && (
            <>
              <Link
                href="/my-bookings"
                className="hidden-mobile"
                style={{
                  padding: '9px 16px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: pathname === '/my-bookings' ? theme.accentText : '#fff',
                  border: `1px solid ${pathname === '/my-bookings' ? theme.accentSoftBorder : theme.borderStrong}`,
                  background: pathname === '/my-bookings' ? theme.accentSoftBg : 'transparent',
                  transition: 'all 0.15s',
                }}
              >
                My Bookings
              </Link>

              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: avatarUrl ? '#1a1a1a' : theme.accent,
                    border: avatarUrl ? `2px solid ${theme.borderStrong}` : 'none',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    overflow: 'hidden',
                  }}
                  title={user.email ?? ''}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- signed storage URL
                    <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    (user.email ?? 'U')[0].toUpperCase()
                  )}
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 44,
                      right: 0,
                      background: theme.card,
                      border: `1px solid ${theme.borderStrong}`,
                      borderRadius: 10,
                      minWidth: 200,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      overflow: 'hidden',
                      zIndex: 100,
                    }}
                  >
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${theme.border}` }}>
                      <p style={{ fontSize: 11, color: theme.textFainter, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Signed in as</p>
                      <p style={{ fontSize: 13, color: '#fff', fontWeight: 600, wordBreak: 'break-all' }}>{user.email}</p>
                    </div>
                    <Link
                      href="/my-bookings"
                      onClick={() => setUserMenuOpen(false)}
                      style={{ display: 'block', padding: '11px 16px', fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', borderBottom: `1px solid ${theme.border}` }}
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
      </div>

      <style>{`
        @media (max-width: 767px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
