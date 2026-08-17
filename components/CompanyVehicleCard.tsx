'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { VehicleListing } from '@/types'
import { theme, monoLabel } from '@/lib/companyTheme'

interface Props {
  vehicle: VehicleListing
}

/**
 * Fleet card for the tenant-branded company profile page only — mirrors VehicleCard.tsx's data
 * fields/links (same reserve/detail routes), just restyled to match the company page's design
 * language. VehicleCard.tsx itself is shared with /browse and the homepage, so it's left
 * untouched — this is a page-scoped visual variant, not a replacement.
 */
export default function CompanyVehicleCard({ vehicle }: Props) {
  const [imgError, setImgError] = useState(false)
  const hasImage = !imgError && !!vehicle.image_url

  const displayName = `${vehicle.brand}${vehicle.model_name ? ' ' + vehicle.model_name : ''}`
  const priceLabel = vehicle.rental_type === 'monthly' ? '/mo' : '/day'
  const priceValue = vehicle.base_rate ? `LKR ${vehicle.base_rate.toLocaleString()}` : 'Contact'

  const transmissionLabel = vehicle.transmission === 'auto' ? 'Auto' : vehicle.transmission === 'manual' ? 'Manual' : vehicle.transmission ?? '—'
  const fuelLabel = vehicle.fuel_type === 'petrol' ? 'Petrol' : vehicle.fuel_type === 'diesel' ? 'Diesel' : vehicle.fuel_type ?? '—'

  return (
    <article
      className="company-vehicle-card"
      style={{ display: 'flex', flexDirection: 'column', border: `1px solid ${theme.border}`, borderRadius: 16, background: theme.card, overflow: 'hidden' }}
    >
      <Link href={`/vehicles/${vehicle.vehicle_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ position: 'relative', height: 196, background: theme.cardAlt, overflow: 'hidden' }}>
          {hasImage ? (
            <img
              src={vehicle.image_url!}
              alt={displayName}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 11px)',
              }}
            >
              <span style={{ ...monoLabel, fontSize: 10, color: theme.textFainter }}>{displayName}</span>
            </div>
          )}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 7 }}>
            {vehicle.vehicle_type && (
              <span style={{ padding: '5px 9px', borderRadius: 6, background: 'rgba(8,8,10,0.8)', border: `1px solid ${theme.borderStrong}`, ...monoLabel, fontSize: 9.5, color: 'rgba(255,255,255,0.85)' }}>
                {vehicle.vehicle_type}
              </span>
            )}
            <span style={{ padding: '5px 9px', borderRadius: 6, background: theme.accentSoftBg, border: `1px solid ${theme.accentSoftBorder}`, ...monoLabel, fontSize: 9.5 }}>
              Verified
            </span>
          </div>
        </div>

        <div style={{ padding: '16px 18px 0', display: 'flex', flexDirection: 'column', gap: 5 }}>
          <span style={{ fontSize: 16.5, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>{displayName}</span>
          {vehicle.city_name && (
            <span style={{ fontSize: 12, fontWeight: 500, color: theme.textFaint }}>{vehicle.city_name} · pickup or delivery</span>
          )}
        </div>

        <div
          style={{
            margin: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            background: theme.border, border: `1px solid ${theme.border}`, borderRadius: 10, overflow: 'hidden',
          }}
        >
          <span style={{ background: theme.cardAlt, padding: '10px 12px', fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.62)' }}>{vehicle.seating_capacity ?? '—'} seats</span>
          <span style={{ background: theme.cardAlt, padding: '10px 12px', fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.62)' }}>{transmissionLabel}</span>
          <span style={{ background: theme.cardAlt, padding: '10px 12px', fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.62)' }}>{fuelLabel}</span>
          <span style={{ background: theme.cardAlt, padding: '10px 12px', fontSize: 11.5, fontWeight: 500, color: 'rgba(255,255,255,0.62)' }}>
            {vehicle.base_kilometers ? `${vehicle.base_kilometers.toLocaleString()} km base` : 'Unlimited km'}
          </span>
        </div>
      </Link>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', borderTop: `1px solid ${theme.border}` }}>
        <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.02em', color: theme.accent }}>
          {priceValue}
          <span style={{ fontSize: 11.5, fontWeight: 500, color: theme.textFainter }}> {priceLabel}</span>
        </span>
        <Link
          href={`/reserve/${vehicle.vehicle_id}`}
          style={{ padding: '10px 17px', borderRadius: 9, background: theme.accent, fontSize: 12.5, fontWeight: 700, color: '#fff', textDecoration: 'none' }}
        >
          Book Now
        </Link>
      </div>
    </article>
  )
}
