'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import type { VehicleListing } from '@/types'
import { ALL_DISTRICTS, VEHICLE_TYPES } from '@/lib/data'
import VehicleCard from './VehicleCard'
import { SearchIcon, SlidersIcon, XIcon } from './Icons'

interface BrowsePageProps {
  vehicles: VehicleListing[]
}

const TRANSMISSION_OPTIONS = ['auto', 'manual']
const FUEL_OPTIONS = ['petrol', 'diesel']
const SEAT_OPTIONS = [2, 4, 5, 7, 8, 12, 20]

export default function BrowsePage({ vehicles }: BrowsePageProps) {
  const searchParams = useSearchParams()
  const [search, setSearch] = useState('')
  const [filterDistrict, setFilterDistrict] = useState(searchParams.get('district') ?? '')
  const [filterType, setFilterType] = useState(searchParams.get('type') ?? '')
  const [filterTransmission, setFilterTransmission] = useState('')
  const [filterFuel, setFilterFuel] = useState('')
  const [filterSeats, setFilterSeats] = useState<number | null>(null)
  const [maxPrice, setMaxPrice] = useState(50000)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Compute max possible price from data
  const dataMaxPrice = Math.max(50000, ...vehicles.map((v) => v.base_rate ?? 0))

  const filterVehicles = useCallback(() => {
    return vehicles.filter((v) => {
      if (search) {
        const q = search.toLowerCase()
        const matches =
          v.brand.toLowerCase().includes(q) ||
          (v.vehicle_type?.toLowerCase().includes(q) ?? false) ||
          (v.district_name?.toLowerCase().includes(q) ?? false) ||
          (v.registration_number.toLowerCase().includes(q))
        if (!matches) return false
      }
      if (filterDistrict && v.district_name !== filterDistrict) return false
      if (filterType && v.vehicle_type !== filterType) return false
      if (filterTransmission && v.transmission !== filterTransmission) return false
      if (filterFuel && v.fuel_type !== filterFuel) return false
      if (filterSeats && (v.seating_capacity ?? 0) < filterSeats) return false
      if (v.base_rate && v.base_rate > maxPrice) return false
      return true
    })
  }, [vehicles, search, filterDistrict, filterType, filterTransmission, filterFuel, filterSeats, maxPrice])

  const [filtered, setFiltered] = useState<VehicleListing[]>(() => filterVehicles())

  useEffect(() => {
    setFiltered(filterVehicles())
  }, [filterVehicles])

  const clearFilters = () => {
    setFilterDistrict('')
    setFilterType('')
    setFilterTransmission('')
    setFilterFuel('')
    setFilterSeats(null)
    setMaxPrice(dataMaxPrice)
    setSearch('')
  }

  const activeFilterCount = [
    filterDistrict,
    filterType,
    filterTransmission,
    filterFuel,
    filterSeats ? String(filterSeats) : '',
  ].filter(Boolean).length

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* District */}
      <FilterGroup label="District">
        <select
          value={filterDistrict}
          onChange={(e) => setFilterDistrict(e.target.value)}
          style={selectStyle}
        >
          <option value="" style={{ background: '#131313' }}>All Districts</option>
          {ALL_DISTRICTS.map((d) => (
            <option key={d} value={d} style={{ background: '#131313' }}>{d}</option>
          ))}
        </select>
      </FilterGroup>

      {/* Vehicle Type */}
      <FilterGroup label="Vehicle Type">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {VEHICLE_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? '' : t)}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${filterType === t ? '#f59e0b' : 'rgba(255,255,255,0.10)'}`,
                background: filterType === t ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: filterType === t ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Transmission */}
      <FilterGroup label="Transmission">
        <div style={{ display: 'flex', gap: 8 }}>
          {TRANSMISSION_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setFilterTransmission(filterTransmission === t ? '' : t)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${filterTransmission === t ? '#f59e0b' : 'rgba(255,255,255,0.10)'}`,
                background: filterTransmission === t ? 'rgba(245,158,11,0.10)' : 'transparent',
                color: filterTransmission === t ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Fuel Type */}
      <FilterGroup label="Fuel Type">
        <div style={{ display: 'flex', gap: 8 }}>
          {FUEL_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilterFuel(filterFuel === f ? '' : f)}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${filterFuel === f ? '#f59e0b' : 'rgba(255,255,255,0.10)'}`,
                background: filterFuel === f ? 'rgba(245,158,11,0.10)' : 'transparent',
                color: filterFuel === f ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                textTransform: 'capitalize',
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Min seats */}
      <FilterGroup label="Min. Seats">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SEAT_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeats(filterSeats === s ? null : s)}
              style={{
                padding: '5px 12px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                border: `1px solid ${filterSeats === s ? '#f59e0b' : 'rgba(255,255,255,0.10)'}`,
                background: filterSeats === s ? 'rgba(245,158,11,0.10)' : 'transparent',
                color: filterSeats === s ? '#f59e0b' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.15s',
              }}
            >
              {s}+
            </button>
          ))}
        </div>
      </FilterGroup>

      {/* Price range */}
      <FilterGroup label={`Max Price: LKR ${maxPrice.toLocaleString()}`}>
        <input
          type="range"
          min={0}
          max={dataMaxPrice}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 4 }}>
          <span>LKR 0</span>
          <span>LKR {dataMaxPrice.toLocaleString()}</span>
        </div>
      </FilterGroup>

      {/* Clear */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          style={{
            padding: '10px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.08)',
            color: '#f87171',
            transition: 'all 0.15s',
          }}
        >
          Clear all filters ({activeFilterCount})
        </button>
      )}
    </div>
  )

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Browse header */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          background: '#131313',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '32px 24px',
          }}
        >
          <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 20 }}>
            Browse Fleet
            {filterDistrict && (
              <span style={{ color: '#f59e0b' }}> — {filterDistrict}</span>
            )}
          </h1>

          {/* Search input */}
          <div style={{ position: 'relative', maxWidth: 480 }}>
            <SearchIcon
              size={16}
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.28)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by brand, type, district…"
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 10,
                padding: '11px 14px 11px 40px',
                fontSize: 14,
                color: '#fff',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.38)',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <XIcon size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '32px 24px',
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 32,
          alignItems: 'start',
        }}
        className="browse-grid"
      >
        {/* Desktop sidebar */}
        <aside
          className="desktop-sidebar"
          style={{
            background: '#131313',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            padding: '24px',
            position: 'sticky',
            top: 80,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Filters</h2>
            {activeFilterCount > 0 && (
              <span
                style={{
                  background: '#f59e0b',
                  borderRadius: 999,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#000',
                }}
              >
                {activeFilterCount}
              </span>
            )}
          </div>
          <SidebarContent />
        </aside>

        {/* Main content */}
        <div>
          {/* Mobile filter button + results count */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.38)' }}>
              <span style={{ color: '#fff', fontWeight: 700 }}>{filtered.length}</span> vehicles found
            </p>
            <button
              className="mobile-filter-btn"
              onClick={() => setSidebarOpen(true)}
              style={{
                display: 'none',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: 'rgba(255,255,255,0.8)',
                cursor: 'pointer',
              }}
            >
              <SlidersIcon size={14} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '80px 0',
                color: 'rgba(255,255,255,0.38)',
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.62)', marginBottom: 8 }}>
                No vehicles match your filters
              </h3>
              <p style={{ fontSize: 14, marginBottom: 20 }}>Try adjusting your search criteria.</p>
              <button
                onClick={clearFilters}
                style={{
                  padding: '10px 24px',
                  background: '#f59e0b',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#000',
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 20,
              }}
            >
              {filtered.map((vehicle) => (
                <VehicleCard
                  key={vehicle.vehicle_id}
                  vehicle={vehicle}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 80,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#131313',
              borderRadius: '20px 20px 0 0',
              padding: '24px',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>Filters</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                <XIcon size={16} />
              </button>
            </div>
            <SidebarContent />
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                width: '100%',
                marginTop: 24,
                padding: '13px',
                background: '#f59e0b',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                color: '#000',
                cursor: 'pointer',
              }}
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .browse-grid { grid-template-columns: 1fr !important; }
          .desktop-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 700,
          color: 'rgba(255,255,255,0.28)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  padding: '9px 12px',
  fontSize: 13,
  color: '#fff',
  appearance: 'none',
  cursor: 'pointer',
}
