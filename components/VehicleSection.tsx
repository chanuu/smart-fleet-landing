'use client'

import { useState } from 'react'
import type { VehicleListing } from '@/types'
import { VEHICLE_TYPES } from '@/lib/data'
import VehicleCard from './VehicleCard'
import Link from 'next/link'

interface VehicleSectionProps {
  vehicles: VehicleListing[]
}

const ALL_LABEL = 'All'

export default function VehicleSection({ vehicles }: VehicleSectionProps) {
  const [activeType, setActiveType] = useState(ALL_LABEL)

  const types = [ALL_LABEL, ...VEHICLE_TYPES.filter((t) => vehicles.some((v) => v.vehicle_type === t))]

  const filtered =
    activeType === ALL_LABEL ? vehicles : vehicles.filter((v) => v.vehicle_type === activeType)

  const displayed = filtered.slice(0, 9)

  return (
    <section
      id="vehicles"
      style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: 'clamp(48px, 8vw, 96px) 24px',
      }}
    >
      {/* Heading */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#f59e0b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          Explore Fleet
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            Every vehicle,
            <br />
            <span style={{ color: 'rgba(255,255,255,0.38)' }}>every road.</span>
          </h2>
          <Link
            href="/browse"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#f59e0b',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              borderBottom: '1px solid rgba(245,158,11,0.3)',
              paddingBottom: 2,
            }}
          >
            View all vehicles →
          </Link>
        </div>
      </div>

      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginBottom: 32,
        }}
      >
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            style={{
              padding: '7px 16px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: `1px solid ${activeType === type ? '#f59e0b' : 'rgba(255,255,255,0.10)'}`,
              background: activeType === type ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
              color: activeType === type ? '#f59e0b' : 'rgba(255,255,255,0.62)',
              transition: 'all 0.15s',
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Vehicle grid */}
      {displayed.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px 0',
            color: 'rgba(255,255,255,0.38)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚗</div>
          <p style={{ fontSize: 16 }}>No vehicles available in this category yet.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {displayed.map((vehicle) => (
            <VehicleCard
              key={vehicle.vehicle_id}
              vehicle={vehicle}
            />
          ))}
        </div>
      )}

      {/* View more */}
      {filtered.length > 9 && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link
            href="/browse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 28px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            View all {filtered.length} vehicles →
          </Link>
        </div>
      )}

    </section>
  )
}
