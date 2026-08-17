'use client'

import { useState } from 'react'
import { theme, monoLabel } from '@/lib/companyTheme'

interface Props {
  src: string | null
  alt: string
  label: string
  labelSize?: number
}

/** Vehicle photo that falls back to the same striped placeholder pattern as CompanyVehicleCard
 * when there's no image, or the URL fails to load (e.g. a stale storage path). */
export default function CompanyImageWithFallback({ src, alt, label, labelSize = 11 }: Props) {
  const [error, setError] = useState(false)
  const show = src && !error

  if (!show) {
    return (
      <div
        style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.045) 0 2px, transparent 2px 11px)',
        }}
      >
        <span style={{ ...monoLabel, fontSize: labelSize, color: theme.textFainter, textAlign: 'center', padding: '0 8px' }}>{label}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}
