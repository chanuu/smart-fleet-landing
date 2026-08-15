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
  total_kilometers: number | null
  total_days: number | null
  base_amount: number | null
  extra_amount: number | null
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
  tenant_name: string
  tenant_phone: string | null
}

async function getReceipt(rentalId: string): Promise<RentalReceipt | null> {
  const { data, error } = await supabase.rpc('get_public_rental_receipt', { p_rental_id: rentalId })
  if (error || !data || data.length === 0) return null
  return data[0] as RentalReceipt
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Your Receipt — Rent Car Tours' }
}

const money = (n: number | null) => `LKR ${(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const PAYMENT_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  paid: { label: 'Paid', color: '#4ade80' },
  partial: { label: 'Partially Paid', color: '#facc15' },
  unpaid: { label: 'Unpaid', color: '#f87171' },
  overpaid: { label: 'Overpaid', color: '#4ade80' },
}

export default async function RentalReceiptPage({ params }: { params: Promise<{ rentalId: string }> }) {
  const { rentalId } = await params
  const receipt = await getReceipt(rentalId)
  if (!receipt) notFound()

  const status = PAYMENT_STATUS_LABEL[receipt.payment_status] ?? { label: receipt.payment_status, color: 'rgba(255,255,255,0.6)' }
  const balanceDue = Math.max((receipt.grand_total ?? receipt.subtotal ?? 0) - receipt.total_paid, 0)

  const rows: [string, string][] = [
    ['Base amount', money(receipt.base_amount)],
    ...(receipt.extra_amount ? [['Extra charges (km/hours)', money(receipt.extra_amount)] as [string, string]] : []),
    ...(receipt.extra_charges_total ? [['Additional charges', money(receipt.extra_charges_total)] as [string, string]] : []),
    ...(receipt.discount_amount ? [['Discount', `- ${money(receipt.discount_amount)}`] as [string, string]] : []),
  ]

  return (
    <main style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <TopNav />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
                {receipt.tenant_name}
              </p>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                Rental Receipt
              </h1>
            </div>
            <span
              style={{
                fontSize: 12, fontWeight: 700, color: status.color,
                background: 'rgba(255,255,255,0.05)', border: `1px solid ${status.color}33`,
                borderRadius: 999, padding: '4px 12px',
              }}
            >
              {status.label}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, fontSize: 13.5 }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Customer</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>{receipt.customer_name}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Vehicle</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>{receipt.vehicle_brand} ({receipt.vehicle_registration})</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Pickup</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>{receipt.start_date}{receipt.start_time ? ` ${receipt.start_time.slice(0, 5)}` : ''}</p>
            </div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{receipt.status === 'completed' ? 'Return' : 'Expected Return'}</p>
              <p style={{ color: '#fff', fontWeight: 600 }}>{receipt.end_date}{receipt.end_time ? ` ${receipt.end_time.slice(0, 5)}` : ''}</p>
            </div>
            {receipt.rate_plan_name && (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Rate Plan</p>
                <p style={{ color: '#fff', fontWeight: 600 }}>{receipt.rate_plan_name}</p>
              </div>
            )}
            {receipt.total_days !== null && (
              <div>
                <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Duration</p>
                <p style={{ color: '#fff', fontWeight: 600 }}>{receipt.total_days} day{receipt.total_days === 1 ? '' : 's'}</p>
              </div>
            )}
          </div>

          {rows.length > 0 && receipt.status === 'completed' && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16, marginBottom: 16 }}>
              {rows.map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
              <span>Total</span>
              <span>{money(receipt.grand_total ?? receipt.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>
              <span>Paid</span>
              <span>{money(receipt.total_paid)}</span>
            </div>
            {balanceDue > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, color: '#facc15', fontWeight: 700 }}>
                <span>Balance Due</span>
                <span>{money(balanceDue)}</span>
              </div>
            )}
          </div>

          {receipt.tenant_phone && (
            <p style={{ marginTop: 24, fontSize: 12.5, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
              Questions about this receipt? Contact {receipt.tenant_name} at {receipt.tenant_phone}.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
