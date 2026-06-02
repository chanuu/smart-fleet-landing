'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { HERO_IMAGES, PROVINCES, VEHICLE_TYPES, STATS } from '@/lib/data'
import { SearchIcon, ChevronDownIcon, MapPinIcon } from './Icons'

export default function Hero() {
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const districts = selectedProvince ? PROVINCES[selectedProvince] ?? [] : []

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [nextSlide])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedDistrict) params.set('district', selectedDistrict)
    else if (selectedProvince) params.set('province', selectedProvince)
    if (selectedType) params.set('type', selectedType)
    router.push(`/browse?${params.toString()}`)
  }

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 640, overflow: 'hidden' }}>
      {/* Slides */}
      {HERO_IMAGES.map((img, i) => (
        <div
          key={img}
          className={`hero-slide${i === activeSlide ? ' active' : ''}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.95) 100%)',
        }}
      />

      {/* Amber radial glow */}
      <div
        className="amber-radial-glow"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(245,158,11,0.12)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 999,
            padding: '6px 16px',
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Sri Lanka&apos;s Premier Rental Marketplace
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(28px, 4.5vw, 52px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#fff',
            maxWidth: 700,
            marginBottom: 20,
          }}
        >
          Drive Anywhere
          <br />
          <span style={{ color: '#f59e0b' }}>Across Sri Lanka</span>
        </h1>

        {/* Sub-headline */}
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 19px)',
            color: 'rgba(255,255,255,0.62)',
            maxWidth: 560,
            lineHeight: 1.6,
            marginBottom: 44,
          }}
        >
          Browse 2,400+ verified vehicles from trusted partners in every district.
          Book instantly, drive confidently.
        </p>

        {/* Search bar */}
        <div
          style={{
            width: '100%',
            maxWidth: 760,
            background: 'rgba(19,19,19,0.9)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 16,
            backdropFilter: 'blur(16px)',
            padding: '6px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: 4,
            marginBottom: 48,
          }}
          className="search-grid"
        >
          {/* Province */}
          <div style={{ position: 'relative' }}>
            <MapPinIcon
              size={15}
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#f59e0b',
                pointerEvents: 'none',
              }}
            />
            <select
              value={selectedProvince}
              onChange={(e) => {
                setSelectedProvince(e.target.value)
                setSelectedDistrict('')
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '12px 36px 12px 32px',
                fontSize: 14,
                color: selectedProvince ? '#fff' : 'rgba(255,255,255,0.38)',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              <option value="" style={{ background: '#131313' }}>Province</option>
              {Object.keys(PROVINCES).map((p) => (
                <option key={p} value={p} style={{ background: '#131313' }}>{p}</option>
              ))}
            </select>
            <ChevronDownIcon
              size={14}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.38)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* District */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={districts.length === 0}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '12px 36px 12px 14px',
                fontSize: 14,
                color: selectedDistrict ? '#fff' : 'rgba(255,255,255,0.38)',
                cursor: districts.length > 0 ? 'pointer' : 'not-allowed',
                appearance: 'none',
                opacity: districts.length === 0 ? 0.5 : 1,
              }}
            >
              <option value="" style={{ background: '#131313' }}>District</option>
              {districts.map((d) => (
                <option key={d} value={d} style={{ background: '#131313' }}>{d}</option>
              ))}
            </select>
            <ChevronDownIcon
              size={14}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.38)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Vehicle Type */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: '12px 36px 12px 14px',
                fontSize: 14,
                color: selectedType ? '#fff' : 'rgba(255,255,255,0.38)',
                cursor: 'pointer',
                appearance: 'none',
              }}
            >
              <option value="" style={{ background: '#131313' }}>Vehicle Type</option>
              {VEHICLE_TYPES.map((t) => (
                <option key={t} value={t} style={{ background: '#131313' }}>{t}</option>
              ))}
            </select>
            <ChevronDownIcon
              size={14}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.38)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            style={{
              background: '#f59e0b',
              border: 'none',
              borderRadius: 10,
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 700,
              fontSize: 14,
              color: '#000',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s',
            }}
          >
            <SearchIcon size={16} />
            Search
          </button>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 'clamp(24px, 5vw, 60px)',
            alignItems: 'center',
          }}
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ textAlign: 'center', display: 'flex', alignItems: 'center', gap: i === STATS.length - 1 ? 0 : 0 }}>
              <div>
                <div style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', fontWeight: 500, marginTop: 2 }}>
                  {stat.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.12)', marginLeft: 'clamp(24px, 5vw, 60px)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div
        style={{
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 6,
          zIndex: 10,
        }}
      >
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`slider-dot${i === activeSlide ? ' active' : ''}`}
            style={{ border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev/next arrows */}
      <button
        onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
        style={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        aria-label="Previous slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        aria-label="Next slide"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <style>{`
        @media (max-width: 640px) {
          .search-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .search-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
