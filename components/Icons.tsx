import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

const icon = (paths: React.ReactNode, viewBox = '0 0 24 24') =>
  function Icon({ size = 20, className, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...rest}
      >
        {paths}
      </svg>
    )
  }

export const SearchIcon = icon(
  <>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </>
)

export const MapPinIcon = icon(
  <>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </>
)

export const ChevronDownIcon = icon(
  <path d="m6 9 6 6 6-6" />
)

export const ChevronRightIcon = icon(
  <path d="m9 18 6-6-6-6" />
)

export const ChevronLeftIcon = icon(
  <path d="m15 18-6-6 6-6" />
)

export const HeartIcon = icon(
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
)

export const CarIcon = icon(
  <>
    <path d="M14 16H9m10 0h3v-3.15a2 2 0 0 0-1.588-1.948l-2.094-.522A2 2 0 0 1 17 8.46V8a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v.46a2 2 0 0 1-1.318 1.872l-2.094.522A2 2 0 0 0 2 12.85V16h3" />
    <circle cx="6.5" cy="16.5" r="2.5" />
    <circle cx="16.5" cy="16.5" r="2.5" />
  </>
)

export const UsersIcon = icon(
  <>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
)

export const GaugeIcon = icon(
  <>
    <path d="m12 14 4-4" />
    <path d="M3.34 19a10 10 0 1 1 17.32 0" />
  </>
)

export const FuelIcon = icon(
  <>
    <path d="M3 22V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    <path d="M3 14h12" />
    <path d="M15 7h1a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L19 6" />
  </>
)

export const SettingsIcon = icon(
  <>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </>
)

export const StarIcon = icon(
  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
)

export const CheckIcon = icon(
  <path d="M20 6 9 17l-5-5" />
)

export const CheckCircleIcon = icon(
  <>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </>
)

export const ClockIcon = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </>
)

export const CalendarIcon = icon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </>
)

export const PhoneIcon = icon(
  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.88 11.5 19.79 19.79 0 0 1 1.8 2.88 2 2 0 0 1 3.79.69h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.4a16 16 0 0 0 5.42 5.42l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.18 14l.74 2.92z" />
)

export const MailIcon = icon(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </>
)

export const IdCardIcon = icon(
  <>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M8 11h1.5a2 2 0 1 0 0-4H8v8" />
    <path d="M14 9h4" />
    <path d="M14 13h4" />
  </>
)

export const ArrowLeftIcon = icon(
  <>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </>
)

export const ArrowRightIcon = icon(
  <>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </>
)

export const FilterIcon = icon(
  <>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </>
)

export const XIcon = icon(
  <>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </>
)

export const ShieldCheckIcon = icon(
  <>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </>
)

export const ZapIcon = icon(
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
)

export const TruckIcon = icon(
  <>
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </>
)

export const CompassIcon = icon(
  <>
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </>
)

export const SlidersIcon = icon(
  <>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </>
)

export const CreditCardIcon = icon(
  <>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </>
)

export const BanknoteIcon = icon(
  <>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="2" />
    <path d="M6 12h.01M18 12h.01" />
  </>
)
