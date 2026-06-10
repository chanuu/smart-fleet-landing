'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { VehicleListing } from '@/types'
import { XIcon, CheckCircleIcon, CalendarIcon, PhoneIcon, MailIcon, IdCardIcon, MapPinIcon } from './Icons'

interface BookingModalProps {
  vehicle: VehicleListing
  onClose: () => void
}

interface FormState {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_license: string
  start_date: string
  start_time: string
  return_date: string
  return_time: string
  pickup_type: 'office' | 'delivery'
  delivery_address: string
  notes: string
}

const initialForm: FormState = {
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  customer_license: '',
  start_date: '',
  start_time: '09:00',
  return_date: '',
  return_time: '18:00',
  pickup_type: 'office',
  delivery_address: '',
  notes: '',
}

export default function BookingModal({ vehicle, onClose }: BookingModalProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayName = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.customer_name.trim() || !form.customer_phone.trim() || !form.start_date || !form.return_date) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const { error: rpcError } = await supabase.rpc('submit_public_booking_request', {
        p_vehicle_id: vehicle.vehicle_id,
        p_customer_name: form.customer_name.trim(),
        p_customer_phone: form.customer_phone.trim(),
        p_customer_email: form.customer_email.trim(),
        p_customer_license: form.customer_license.trim(),
        p_start_date: form.start_date,
        p_start_time: form.start_time,
        p_return_date: form.return_date,
        p_return_time: form.return_time,
        p_with_driver: false,
        p_pickup_type: form.pickup_type,
        p_delivery_address: form.delivery_address.trim(),
        p_notes: form.notes.trim(),
      })

      if (rpcError) throw rpcError
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 0 0',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#131313',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: 580,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '0 0 32px 0',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            position: 'sticky',
            top: 0,
            background: '#131313',
            zIndex: 1,
          }}
        >
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Quick Booking Request</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{displayName} · {vehicle.district_name}</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 8,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
            }}
          >
            <XIcon size={16} />
          </button>
        </div>

        {success ? (
          <SuccessScreen onClose={onClose} />
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {/* Vehicle summary */}
            <div
              style={{
                background: 'rgba(220,40,40,0.06)',
                border: '1px solid rgba(220,40,40,0.2)',
                borderRadius: 12,
                padding: '14px 16px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{displayName}</div>
                {vehicle.registration_number && (
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', marginTop: 2 }}>{vehicle.registration_number}</div>
                )}
              </div>
              {vehicle.base_rate && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color: '#dc2828' }}>
                    LKR {vehicle.base_rate.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>
                    per {vehicle.rental_type === 'monthly' ? 'month' : 'day'}
                  </div>
                </div>
              )}
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <Field label="Pickup Date *" icon={<CalendarIcon size={14} />}>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={set('start_date')}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                />
              </Field>
              <Field label="Pickup Time *" icon={<CalendarIcon size={14} />}>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={set('start_time')}
                  required
                  style={inputStyle}
                />
              </Field>
              <Field label="Return Date *" icon={<CalendarIcon size={14} />}>
                <input
                  type="date"
                  value={form.return_date}
                  onChange={set('return_date')}
                  required
                  min={form.start_date || new Date().toISOString().split('T')[0]}
                  style={inputStyle}
                />
              </Field>
              <Field label="Return Time *" icon={<CalendarIcon size={14} />}>
                <input
                  type="time"
                  value={form.return_time}
                  onChange={set('return_time')}
                  required
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Pickup type */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Pickup Type</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['office', 'delivery'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, pickup_type: type }))}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: 8,
                      border: `1px solid ${form.pickup_type === type ? '#dc2828' : 'rgba(255,255,255,0.10)'}`,
                      background: form.pickup_type === type ? 'rgba(220,40,40,0.08)' : 'rgba(255,255,255,0.03)',
                      color: form.pickup_type === type ? '#dc2828' : 'rgba(255,255,255,0.62)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textTransform: 'capitalize',
                    }}
                  >
                    {type === 'office' ? 'Pick up at office' : 'Delivery to me'}
                  </button>
                ))}
              </div>
            </div>

            {form.pickup_type === 'delivery' && (
              <div style={{ marginBottom: 16 }}>
                <Field label="Delivery Address" icon={<MapPinIcon size={14} />}>
                  <input
                    type="text"
                    value={form.delivery_address}
                    onChange={set('delivery_address')}
                    placeholder="Enter full delivery address"
                    style={inputStyle}
                  />
                </Field>
              </div>
            )}

            {/* Contact info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <Field label="Full Name *" icon={<></>}>
                <input
                  type="text"
                  value={form.customer_name}
                  onChange={set('customer_name')}
                  placeholder="Your full name"
                  required
                  style={inputStyle}
                />
              </Field>
              <Field label="Phone Number *" icon={<PhoneIcon size={14} />}>
                <input
                  type="tel"
                  value={form.customer_phone}
                  onChange={set('customer_phone')}
                  placeholder="+94 XX XXX XXXX"
                  required
                  style={inputStyle}
                />
              </Field>
              <Field label="Email Address" icon={<MailIcon size={14} />}>
                <input
                  type="email"
                  value={form.customer_email}
                  onChange={set('customer_email')}
                  placeholder="your@email.com"
                  style={inputStyle}
                />
              </Field>
              <Field label="License Number" icon={<IdCardIcon size={14} />}>
                <input
                  type="text"
                  value={form.customer_license}
                  onChange={set('customer_license')}
                  placeholder="Driving license no."
                  style={inputStyle}
                />
              </Field>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Additional Notes</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                placeholder="Any special requirements or requests..."
                rows={3}
                style={{
                  ...inputStyle,
                  width: '100%',
                  resize: 'vertical',
                  minHeight: 72,
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginBottom: 16,
                  fontSize: 13,
                  color: '#f87171',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                background: submitting ? 'rgba(220,40,40,0.5)' : '#dc2828',
                border: 'none',
                borderRadius: 10,
                padding: '14px',
                fontSize: 15,
                fontWeight: 700,
                color: '#000',
                cursor: submitting ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s',
              }}
            >
              {submitting ? 'Submitting…' : 'Submit Booking Request'}
            </button>

            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 12 }}>
              The rental partner will contact you within 24 hours to confirm.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

function SuccessScreen({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <div
        style={{
          width: 72,
          height: 72,
          background: 'rgba(220,40,40,0.12)',
          border: '2px solid rgba(220,40,40,0.4)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#dc2828',
        }}
      >
        <CheckCircleIcon size={36} />
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
        Request Submitted!
      </h3>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto 28px' }}>
        Your booking request has been sent. The rental partner will contact you within 24 hours to confirm your reservation.
      </p>
      <button
        onClick={onClose}
        style={{
          background: '#dc2828',
          border: 'none',
          borderRadius: 10,
          padding: '12px 36px',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        Done
      </button>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ color: '#dc2828' }}>{icon}</span>
        {label}
      </label>
      {children}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(255,255,255,0.38)',
  marginBottom: 6,
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.10)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  color: '#fff',
  colorScheme: 'dark',
}
