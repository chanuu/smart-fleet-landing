'use client'

import { useState } from 'react'
import Image from 'next/image'

interface VehicleImageSliderProps {
  images: string[]       // resolved public URLs
  vehicleName: string
}

export default function VehicleImageSlider({ images, vehicleName }: VehicleImageSliderProps) {
  const [active, setActive] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const next = () => setActive((i) => (i + 1) % images.length)

  const src = imgErrors[active]
    ? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&auto=format&fit=crop&q=80'
    : images[active]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Main image */}
      <div
        style={{
          position: 'relative',
          height: 380,
          borderRadius: 18,
          overflow: 'hidden',
          background: 'linear-gradient(135deg,#1c1c1c,#131313)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Image
          key={active}
          src={src}
          alt={`${vehicleName} — photo ${active + 1}`}
          fill
          style={{ objectFit: 'cover', transition: 'opacity 0.3s' }}
          priority={active === 0}
          sizes="(max-width: 768px) 100vw, 700px"
          onError={() => setImgErrors((prev) => ({ ...prev, [active]: true }))}
        />

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.55) 0%, transparent 50%)' }} />

        {/* Prev / Next — only show when more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              style={arrowStyle('left')}
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              style={arrowStyle('right')}
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Counter badge */}
        {images.length > 1 && (
          <div
            style={{
              position: 'absolute', bottom: 14, right: 14,
              background: 'rgba(10,10,10,0.75)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.8)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip — only when 2+ images */}
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: 72,
                height: 52,
                borderRadius: 10,
                overflow: 'hidden',
                border: i === active
                  ? '2px solid #dc2828'
                  : '2px solid rgba(255,255,255,0.08)',
                padding: 0,
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.15s',
                background: '#1c1c1c',
              }}
              aria-label={`View photo ${i + 1}`}
            >
              <Image
                src={imgErrors[i]
                  ? 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&auto=format&fit=crop&q=60'
                  : url}
                alt={`${vehicleName} thumbnail ${i + 1}`}
                fill
                style={{ objectFit: 'cover', opacity: i === active ? 1 : 0.55 }}
                sizes="72px"
                onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function arrowStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: 14,
    transform: 'translateY(-50%)',
    zIndex: 10,
    background: 'rgba(10,10,10,0.7)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'background 0.15s',
  }
}
