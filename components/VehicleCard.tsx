'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { VehicleListing } from '@/types'
import { HeartIcon, UsersIcon, GaugeIcon, FuelIcon, MapPinIcon, ShieldCheckIcon } from './Icons'
import { DEFAULT_VEHICLE_IMAGES } from '@/lib/data'

function pickDefaultImage(vehicleId: string): string {
  // Deterministic pick so the same vehicle always shows the same default photo
  let hash = 0
  for (let i = 0; i < vehicleId.length; i++) {
    hash = (hash * 31 + vehicleId.charCodeAt(i)) >>> 0
  }
  return DEFAULT_VEHICLE_IMAGES[hash % DEFAULT_VEHICLE_IMAGES.length]
}

interface VehicleCardProps {
  vehicle: VehicleListing
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [favorited, setFavorited] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Use signed URL first; fall back to a deterministic default Unsplash photo
  const imageSrc = (!imgError && vehicle.image_url)
    ? vehicle.image_url
    : pickDefaultImage(vehicle.vehicle_id)

  const displayName = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`
  const priceLabel = vehicle.rental_type === 'monthly' ? '/mo' : '/day'
  const priceValue = vehicle.base_rate ? `LKR ${vehicle.base_rate.toLocaleString()}` : 'Contact'
  const location = [vehicle.city_name, vehicle.district_name].filter(Boolean).join(', ')

  const transmissionLabel =
    vehicle.transmission === 'auto'
      ? 'Auto'
      : vehicle.transmission === 'manual'
      ? 'Manual'
      : vehicle.transmission ?? '—'

  const fuelLabel =
    vehicle.fuel_type === 'petrol'
      ? 'Petrol'
      : vehicle.fuel_type === 'diesel'
      ? 'Diesel'
      : vehicle.fuel_type ?? '—'

  return (
    <Link
      href={`/vehicles/${vehicle.vehicle_id}`}
      className="card-hover"
      style={{
        background: '#131313',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
      }}
    >
      {/* Image area */}
      <div
        style={{
          position: 'relative',
          height: 180,
          background: 'linear-gradient(135deg, #1c1c1c 0%, #131313 100%)',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <Image
          src={imageSrc}
          alt={displayName}
          fill
          style={{ objectFit: 'cover' }}
          onError={() => setImgError(true)}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dark gradient overlay on image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(19,19,19,0.6) 0%, transparent 50%)',
          }}
        />

        {/* Badges */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            display: 'flex',
            gap: 6,
          }}
        >
          {vehicle.vehicle_type && (
            <span
              style={{
                background: 'rgba(10,10,10,0.75)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6,
                padding: '3px 10px',
                fontSize: 11,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {vehicle.vehicle_type}
            </span>
          )}
          <span
            style={{
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.4)',
              borderRadius: 6,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 600,
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backdropFilter: 'blur(8px)',
            }}
          >
            <ShieldCheckIcon size={10} />
            Verified
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); setFavorited((v) => !v) }}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(10,10,10,0.7)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: favorited ? '#f59e0b' : 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(8px)',
            transition: 'color 0.15s',
          }}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon
            size={16}
            style={{ fill: favorited ? '#f59e0b' : 'none' }}
          />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        {/* Name & location */}
        <div>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 4,
              letterSpacing: '-0.01em',
            }}
          >
            {displayName}
          </h3>
          {location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.38)', fontSize: 12 }}>
              <MapPinIcon size={11} />
              {location}
            </div>
          )}
        </div>

        {/* Specs grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px 12px',
            padding: '12px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <SpecItem icon={<UsersIcon size={12} />} label={`${vehicle.seating_capacity ?? '—'} Seats`} />
          <SpecItem icon={<GaugeIcon size={12} />} label={transmissionLabel} />
          <SpecItem icon={<FuelIcon size={12} />} label={fuelLabel} />
          {vehicle.base_kilometers && (
            <SpecItem icon={<GaugeIcon size={12} />} label={`${vehicle.base_kilometers.toLocaleString()} km base`} />
          )}
        </div>

        {/* Price + Book */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'auto',
          }}
        >
          <div>
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#f59e0b',
                letterSpacing: '-0.02em',
              }}
            >
              {priceValue}
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginLeft: 3 }}>
              {priceLabel}
            </span>
          </div>

          <Link
            href={`/reserve/${vehicle.vehicle_id}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#f59e0b',
              borderRadius: 8,
              padding: '9px 18px',
              fontSize: 13,
              fontWeight: 700,
              color: '#000',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background 0.15s',
            }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </Link>
  )
}

function SpecItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.62)', fontSize: 12 }}>
      <span style={{ color: '#f59e0b', flexShrink: 0 }}>{icon}</span>
      {label}
    </div>
  )
}
