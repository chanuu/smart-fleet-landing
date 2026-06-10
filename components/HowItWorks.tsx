import { SearchIcon, CheckCircleIcon, CarIcon } from './Icons'

const STEPS = [
  {
    number: '01',
    icon: <SearchIcon size={28} />,
    title: 'Search & Filter',
    description:
      'Browse thousands of vehicles across every district in Sri Lanka. Filter by type, price, transmission and more to find your perfect match.',
  },
  {
    number: '02',
    icon: <CheckCircleIcon size={28} />,
    title: 'Send Request',
    description:
      'Submit a booking request in under 2 minutes. No account needed. The rental partner reviews and confirms within 24 hours.',
  },
  {
    number: '03',
    icon: <CarIcon size={28} />,
    title: 'Drive Away',
    description:
      'Pick up your vehicle at the office or get it delivered to your door. Drive with confidence — every partner is verified by DriveLanka.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: '#131313',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(48px, 8vw, 96px) 24px',
        }}
      >
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#dc2828', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Simple Process
          </p>
          <h2
            style={{
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 16,
            }}
          >
            How It Works
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', maxWidth: 440, margin: '0 auto' }}>
            Renting a vehicle in Sri Lanka has never been easier. Three simple steps and you&apos;re on the road.
          </p>
        </div>

        {/* Steps grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.number}
              style={{
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '36px 32px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Large step number background */}
              <div
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 20,
                  fontSize: 72,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.03)',
                  lineHeight: 1,
                  userSelect: 'none',
                  letterSpacing: '-0.04em',
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  background: 'rgba(220,40,40,0.1)',
                  border: '1px solid rgba(220,40,40,0.25)',
                  borderRadius: 14,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2828',
                  marginBottom: 20,
                }}
              >
                {step.icon}
              </div>

              {/* Step number pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(220,40,40,0.12)',
                  border: '1px solid rgba(220,40,40,0.25)',
                  borderRadius: 6,
                  padding: '3px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#dc2828',
                  letterSpacing: '0.05em',
                  marginBottom: 12,
                }}
              >
                STEP {step.number}
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10, letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
