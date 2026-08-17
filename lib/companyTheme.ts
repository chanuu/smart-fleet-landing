import type { CSSProperties } from 'react'
import { Archivo, JetBrains_Mono } from 'next/font/google'

// Fonts + color tokens for the tenant-branded company profile page only. Scoped by applying
// `archivo.variable` + `jetbrainsMono.variable` to the page's root <main> — next/font defines
// the CSS custom properties on that element, so they cascade to its children without touching
// the rest of the site (which stays on Inter).
export const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
})

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const fontSans = 'var(--font-archivo), -apple-system, sans-serif'
export const fontMono = "var(--font-jetbrains-mono), 'JetBrains Mono', monospace"

export const theme = {
  bg: '#08080a',
  bgAlt: '#0a0a0c',
  card: '#0d0d10',
  cardAlt: '#101014',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.14)',
  accent: '#e11d2e',
  accentHover: '#ff2b3c',
  accentText: '#ff5d69',
  accentSoftBg: 'rgba(225,29,46,0.14)',
  accentSoftBorder: 'rgba(225,29,46,0.34)',
  textMuted: 'rgba(255,255,255,0.58)',
  textFaint: 'rgba(255,255,255,0.4)',
  textFainter: 'rgba(255,255,255,0.28)',
} as const

export const monoLabel: CSSProperties = {
  fontFamily: fontMono,
  fontWeight: 600,
  fontSize: 10.5,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: theme.accentText,
}
