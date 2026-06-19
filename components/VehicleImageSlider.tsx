'use client'

import { useState } from 'react'
import Image from 'next/image'

interface VehicleImageSliderProps {
  images: string[]
  vehicleName: string
}

export default function VehicleImageSlider({ images, vehicleName }: VehicleImageSliderProps) {
  const [active, setActive] = useState(0)
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({})

  const validImages = images.filter((_, i) => !imgErrors[i])

  if (validImages.length === 0) {
    return (
      <div
        style={{
          height: 380,
          borderRadius: 18,
          overflow: 'hidden',
          background: 'linear-gradient(135deg,#1c1c1c,#131313)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
        }}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>
          <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>
          <path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2"/>
          <path d="M9 17h6"/>
        </svg>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>
          {vehicleName}
        </span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.12)' }}>No photos available</span>
      </div>
    )
  }

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length)
  const next = () => setActive((i) => (i + 1) % images.length)

  const currentHasError = imgErrors[active]
  const src = currentHasError ? images[(active + 1) % images.length] : images[active]

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

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.55) 0%, transparent 50%)' }} />

        {images.length > 1 && (
          <>
            <button onClick={prev} style={arrowStyle('left')} aria-label="Previous image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button onClick={next} style={arrowStyle('right')} aria-label="Next image">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}

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
                      }}
          >
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
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
                border: i === active ? '2px solid #dc2828' : '2px solid rgba(255,255,255,0.08)',
                padding: 0,
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.15s',
                background: '#1c1c1c',
              }}
              aria-label={`View photo ${i + 1}`}
            >
              {imgErrors[i] ? (
                <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="m3 16 5-5 4 4 4-4 5 5" />
                  </svg>
                </div>
              ) : (
                <Image
                  src={url}
                  alt={`${vehicleName} thumbnail ${i + 1}`}
                  fill
                  style={{ objectFit: 'cover', opacity: i === active ? 1 : 0.55 }}
                  sizes="72px"
                  onError={() => setImgErrors((prev) => ({ ...prev, [i]: true }))}
                />
              )}
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
    transition: 'background 0.15s',
  }
}
