import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import TopNav from '@/components/TopNav'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

interface RentalReceipt {
  rental_id: string
  status: string
  start_date: string
  end_date: string
  start_time: string | null
  end_time: string | null
  booked_days: number | null
  total_kilometers: number | null
  total_days: number | null
  base_amount: number | null
  extra_km_amount: number | null
  extra_hours_amount: number | null
  discount_amount: number | null
  extra_charges_total: number | null
  advance_payment: number | null
  subtotal: number | null
  grand_total: number | null
  total_paid: number
  payment_status: string
  customer_name: string
  vehicle_brand: string
  vehicle_registration: string
  rate_plan_name: string | null
  rate_plan_base_rate: number | null
  rate_plan_rental_type: string | null
  included_kilometers: number | null
  extra_rate_per_km: number | null
  tenant_name: string
  tenant_phone: string | null
  tenant_address: string | null
  tenant_logo_path: string | null
}

async function getReceipt(rentalId: string): Promise<{ receipt: RentalReceipt; logoUrl: string | null } | null> {
  const { data, error } = await supabase.rpc('get_public_rental_receipt', { p_rental_id: rentalId })
  if (error || !data || data.length === 0) return null
  const receipt = data[0] as RentalReceipt

  let logoUrl: string | null = null
  if (receipt.tenant_logo_path) {
    const { data: signed } = await supabase.storage
      .from('tenant-assets')
      .createSignedUrl(receipt.tenant_logo_path, 86400)
    logoUrl = signed?.signedUrl ?? null
  }

  return { receipt, logoUrl }
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Your Invoice — Rent Car Tours' }
}

const money = (n: number | null | undefined) =>
  `LKR ${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const PAYMENT_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  paid: { label: 'Paid', color: '#4ade80' },
  partial: { label: 'Partially Paid', color: '#facc15' },
  unpaid: { label: 'Unpaid', color: '#f87171' },
  overpaid: { label: 'Overpaid', color: '#4ade80' },
}

export default async function RentalReceiptPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const { rentalId } = await params
  const result = await getReceipt(rentalId)
  if (!result) notFound()
  const { receipt, logoUrl } = result

  const isFinal = receipt.status === 'completed'
  const status = PAYMENT_STATUS_LABEL[receipt.payment_status] ?? { label: receipt.payment_status, color: 'rgba(255,255,255,0.6)' }

  // Final invoices have a settled grand_total/subtotal from closing the rental. Before that,
  // there's nothing to show but 0 — so estimate from the rate plan instead, clearly labeled.
  const days = receipt.total_days ?? receipt.booked_days ?? 1
  const estimatedTotal = (receipt.rate_plan_base_rate ?? 0) * days
  const displayTotal = isFinal ? (receipt.grand_total ?? receipt.subtotal ?? 0) : estimatedTotal

  const totalPaid = receipt.total_paid ?? 0
  const balanceDue = Math.max(displayTotal - totalPaid, 0)

  const includedKm = receipt.included_kilometers
  const drivenKm = receipt.total_kilometers
  const extraKm = includedKm != null && drivenKm != null ? Math.max(drivenKm - includedKm, 0) : null

  const lineItems: [string, string][] = isFinal
    ? [
        ['Base amount', money(receipt.base_amount)],
        ...(receipt.extra_km_amount ? [['Extra kilometers', money(receipt.extra_km_amount)] as [string, string]] : []),
        ...(receipt.extra_hours_amount ? [['Extra hours', money(receipt.extra_hours_amount)] as [string, string]] : []),
        ...(receipt.extra_charges_total ? [['Additional charges', money(receipt.extra_charges_total)] as [string, string]] : []),
        ...(receipt.discount_amount ? [['Discount', `- ${money(receipt.discount_amount)}`] as [string, string]] : []),
      ]
    : [
        [`${receipt.rate_plan_name ?? 'Rate'} × ${days} day${days === 1 ? '' : 's'}`, money(estimatedTotal)],
      ]

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <TopNav />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 36, color: '#1a1a1a' }}>
          {/* Company header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, borderBottom: '2px solid #f0f0f0', paddingBottom: 20, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- signed storage URL, matches app/companies/[tenantId]/page.tsx
                <img src={logoUrl} alt={receipt.tenant_name} style={{ borderRadius: 10, objectFit: 'cover', width: 56, height: 56 }} />
              ) : (
                <div style={{ width: 56, height: 56, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 20, color: '#9ca3af' }}>
                  {receipt.tenant_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#111' }}>{receipt.tenant_name}</p>
                {receipt.tenant_address && <p style={{ fontSize: 12.5, color: '#6b7280', marginTop: 2 }}>{receipt.tenant_address}</p>}
                {receipt.tenant_phone && <p style={{ fontSize: 12.5, color: '#6b7280' }}>{receipt.tenant_phone}</p>}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                {isFinal ? 'Invoice' : 'Estimated Invoice'}
              </p>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>#{receipt.rental_id.slice(0, 8).toUpperCase()}</p>
              <span
                style={{
                  display: 'inline-block', marginTop: 8, fontSize: 11.5, fontWeight: 700, color: status.color,
                  background: '#f9fafb', border: `1px solid ${status.color}55`, borderRadius: 999, padding: '3px 10px',
                }}
              >
                {status.label}
              </span>
            </div>
          </div>

          {!isFinal && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: 12.5, color: '#92400e' }}>
              This rental hasn&apos;t been closed yet — the total below is an estimate based on
              your rate plan and will be finalized (including any extra km/hours) when the vehicle is returned.
            </div>
          )}

          {/* Trip details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, fontSize: 13.5 }}>
            <div>
              <p style={{ color: '#9ca3af', marginBottom: 2 }}>Customer</p>
              <p style={{ color: '#111', fontWeight: 600 }}>{receipt.customer_name}</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af', marginBottom: 2 }}>Vehicle</p>
              <p style={{ color: '#111', fontWeight: 600 }}>{receipt.vehicle_brand} ({receipt.vehicle_registration})</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af', marginBottom: 2 }}>Pickup</p>
              <p style={{ color: '#111', fontWeight: 600 }}>{receipt.start_date}{receipt.start_time ? ` ${receipt.start_time.slice(0, 5)}` : ''}</p>
            </div>
            <div>
              <p style={{ color: '#9ca3af', marginBottom: 2 }}>{isFinal ? 'Return' : 'Expected Return'}</p>
              <p style={{ color: '#111', fontWeight: 600 }}>{receipt.end_date}{receipt.end_time ? ` ${receipt.end_time.slice(0, 5)}` : ''}</p>
            </div>
            {receipt.rate_plan_name && (
              <div>
                <p style={{ color: '#9ca3af', marginBottom: 2 }}>Rate Plan</p>
                <p style={{ color: '#111', fontWeight: 600 }}>{receipt.rate_plan_name}</p>
              </div>
            )}
            {includedKm != null && (
              <div>
                <p style={{ color: '#9ca3af', marginBottom: 2 }}>Included Kilometers</p>
                <p style={{ color: '#111', fontWeight: 600 }}>
                  {includedKm.toLocaleString()} km
                  {drivenKm != null && ` — ${drivenKm.toLocaleString()} km driven`}
                </p>
              </div>
            )}
            {extraKm != null && extraKm > 0 && (
              <div>
                <p style={{ color: '#9ca3af', marginBottom: 2 }}>Extra Kilometers</p>
                <p style={{ color: '#dc2626', fontWeight: 600 }}>
                  {extraKm.toLocaleString()} km{receipt.extra_rate_per_km ? ` × Rs ${receipt.extra_rate_per_km}/km` : ''}
                </p>
              </div>
            )}
          </div>

          {/* Line items */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, marginBottom: 16 }}>
            {lineItems.map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#4b5563', marginBottom: 8 }}>
                <span>{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#111', marginBottom: 8 }}>
              <span>{isFinal ? 'Total' : 'Estimated Total'}</span>
              <span>{money(displayTotal)}</span>
            </div>
            {receipt.advance_payment != null && receipt.advance_payment > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#4b5563', marginBottom: 4 }}>
                <span>Advance Paid</span>
                <span>{money(receipt.advance_payment)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#4b5563', marginBottom: 4 }}>
              <span>Total Paid</span>
              <span>{money(totalPaid)}</span>
            </div>
            {balanceDue > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#b45309', fontWeight: 700, marginTop: 8 }}>
                <span>Balance Due</span>
                <span>{money(balanceDue)}</span>
              </div>
            )}
          </div>

          {receipt.tenant_phone && (
            <p style={{ marginTop: 28, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
              Questions about this invoice? Contact {receipt.tenant_name} at {receipt.tenant_phone}.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
