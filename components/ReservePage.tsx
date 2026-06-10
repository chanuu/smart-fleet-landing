'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { VehicleListing } from '@/types'
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircleIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  IdCardIcon,
  UsersIcon,
  FuelIcon,
  GaugeIcon,
  CreditCardIcon,
  BanknoteIcon,
  CheckIcon,
} from './Icons'

interface ReservePageProps {
  vehicle: VehicleListing
}

const STEPS = ['Trip Details', 'Add-ons', 'Driver Info', 'Review & Pay']

interface FormData {
  // Step 1
  start_date: string
  start_time: string
  return_date: string
  return_time: string
  pickup_type: 'office' | 'delivery'
  delivery_address: string
  // Step 2
  with_driver: boolean
  child_seat: boolean
  gps_nav: boolean
  // Step 3
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_license: string
  // Step 4
  payment_method: 'cash' | 'card'
  notes: string
}

const initialForm: FormData = {
  start_date: '',
  start_time: '09:00',
  return_date: '',
  return_time: '18:00',
  pickup_type: 'office',
  delivery_address: '',
  with_driver: false,
  child_seat: false,
  gps_nav: false,
  customer_name: '',
  customer_phone: '',
  customer_email: '',
  customer_license: '',
  payment_method: 'cash',
  notes: '',
}

const ADDON_DRIVER_PRICE = 2500
const ADDON_CHILD_SEAT_PRICE = 500
const ADDON_GPS_PRICE = 300

export default function ReservePage({ vehicle }: ReservePageProps) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imgError, setImgError] = useState(false)

  const displayName = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`
  const location = [vehicle.city_name, vehicle.district_name].filter(Boolean).join(', ')

  // Calculate rental days
  const rentalDays = (() => {
    if (!form.start_date || !form.return_date) return 1
    const start = new Date(form.start_date)
    const end = new Date(form.return_date)
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  })()

  const baseTotal = (vehicle.base_rate ?? 0) * rentalDays
  const driverTotal = form.with_driver ? ADDON_DRIVER_PRICE * rentalDays : 0
  const childSeatTotal = form.child_seat ? ADDON_CHILD_SEAT_PRICE * rentalDays : 0
  const gpsTotal = form.gps_nav ? ADDON_GPS_PRICE * rentalDays : 0
  const deliveryFee = form.pickup_type === 'delivery' ? 1500 : 0
  const grandTotal = baseTotal + driverTotal + childSeatTotal + gpsTotal + deliveryFee

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleBool = (field: keyof FormData) => () => {
    setForm((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!form.start_date) return 'Please select a pickup date.'
      if (!form.return_date) return 'Please select a return date.'
      if (new Date(form.return_date) < new Date(form.start_date)) return 'Return date must be after pickup date.'
      if (form.pickup_type === 'delivery' && !form.delivery_address.trim()) return 'Please enter a delivery address.'
    }
    if (step === 2) {
      if (!form.customer_name.trim()) return 'Please enter your full name.'
      if (!form.customer_phone.trim()) return 'Please enter your phone number.'
    }
    return null
  }

  const nextStep = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError(null)
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prevStep = () => {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async () => {
    setError(null)
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
        p_with_driver: form.with_driver,
        p_pickup_type: form.pickup_type,
        p_delivery_address: form.delivery_address.trim(),
        p_notes: `${form.notes.trim()}${form.child_seat ? ' | Child seat requested' : ''}${form.gps_nav ? ' | GPS navigation requested' : ''}${form.payment_method === 'card' ? ' | Preferred payment: Card' : ' | Preferred payment: Cash'}`,
      })
      if (rpcError) throw rpcError
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return <SuccessScreen vehicle={vehicle} rentalDays={rentalDays} total={grandTotal} />
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: 'clamp(24px, 4vw, 48px) 24px',
        }}
      >
        {/* Back link */}
        <Link
          href="/browse"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,0.38)',
            textDecoration: 'none',
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 28,
            transition: 'color 0.15s',
          }}
        >
          <ArrowLeftIcon size={15} />
          Back to Browse
        </Link>

        <h1
          style={{
            fontSize: 'clamp(22px, 3vw, 34px)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.02em',
            marginBottom: 28,
          }}
        >
          Reserve your vehicle
        </h1>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 36, flexWrap: 'wrap' }}>
          {STEPS.map((label, i) => (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <div
                className={
                  i === step ? 'step-pill-active' : i < step ? 'step-pill-done' : 'step-pill-inactive'
                }
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                {i < step ? <CheckIcon size={11} /> : <span>{i + 1}</span>}
                {label}
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Content: form + sidebar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 340px',
            gap: 28,
            alignItems: 'start',
          }}
          className="reserve-grid"
        >
          {/* Form panel */}
          <div
            style={{
              background: '#131313',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '32px',
            }}
          >
            {step === 0 && <Step1 form={form} set={set} setForm={setForm} />}
            {step === 1 && <Step2 form={form} toggleBool={toggleBool} rentalDays={rentalDays} />}
            {step === 2 && <Step3 form={form} set={set} />}
            {step === 3 && <Step4 form={form} setForm={setForm} vehicle={vehicle} rentalDays={rentalDays} grandTotal={grandTotal} />}

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.10)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  marginTop: 20,
                  fontSize: 13,
                  color: '#f87171',
                }}
              >
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
              {step > 0 ? (
                <button
                  onClick={prevStep}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={nextStep}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#dc2828',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 10,
                    border: 'none',
                    background: submitting ? 'rgba(220,40,40,0.5)' : '#dc2828',
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {submitting ? 'Submitting…' : 'Confirm Booking Request'}
                </button>
              )}
            </div>
          </div>

          {/* Sticky sidebar */}
          <div style={{ position: 'sticky', top: 80 }}>
            <VehicleSummaryCard
              vehicle={vehicle}
              displayName={displayName}
              location={location}
              form={form}
              rentalDays={rentalDays}
              baseTotal={baseTotal}
              driverTotal={driverTotal}
              childSeatTotal={childSeatTotal}
              gpsTotal={gpsTotal}
              deliveryFee={deliveryFee}
              grandTotal={grandTotal}
              imgError={imgError}
              onImgError={() => setImgError(true)}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .reserve-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ---- Step components ----

function Step1({
  form,
  set,
  setForm,
}: {
  form: FormData
  set: (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  setForm: React.Dispatch<React.SetStateAction<FormData>>
}) {
  return (
    <div>
      <StepHeader title="Trip Details" subtitle="When and where do you want to pick up?" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <Field label="Pickup Date *" icon={<CalendarIcon size={13} />}>
          <input
            type="date"
            value={form.start_date}
            onChange={set('start_date')}
            min={new Date().toISOString().split('T')[0]}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Pickup Time *" icon={<CalendarIcon size={13} />}>
          <input type="time" value={form.start_time} onChange={set('start_time')} required style={inputStyle} />
        </Field>
        <Field label="Return Date *" icon={<CalendarIcon size={13} />}>
          <input
            type="date"
            value={form.return_date}
            onChange={set('return_date')}
            min={form.start_date || new Date().toISOString().split('T')[0]}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Return Time *" icon={<CalendarIcon size={13} />}>
          <input type="time" value={form.return_time} onChange={set('return_time')} required style={inputStyle} />
        </Field>
      </div>

      <Field label="Pickup Location">
        <div style={{ display: 'flex', gap: 8 }}>
          {(['office', 'delivery'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, pickup_type: type }))}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: 8,
                border: `1px solid ${form.pickup_type === type ? '#dc2828' : 'rgba(255,255,255,0.10)'}`,
                background: form.pickup_type === type ? 'rgba(220,40,40,0.08)' : 'rgba(255,255,255,0.03)',
                color: form.pickup_type === type ? '#dc2828' : 'rgba(255,255,255,0.5)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {type === 'office' ? '🏢 Office Pickup' : '🚚 Delivery to Me'}
            </button>
          ))}
        </div>
      </Field>

      {form.pickup_type === 'delivery' && (
        <div style={{ marginTop: 16 }}>
          <Field label="Delivery Address *" icon={<MapPinIcon size={13} />}>
            <input
              type="text"
              value={form.delivery_address}
              onChange={set('delivery_address')}
              placeholder="Full address for delivery"
              style={inputStyle}
            />
          </Field>
        </div>
      )}
    </div>
  )
}

function Step2({
  form,
  toggleBool,
  rentalDays,
}: {
  form: FormData
  toggleBool: (f: keyof FormData) => () => void
  rentalDays: number
}) {
  const addons = [
    {
      key: 'with_driver' as keyof FormData,
      label: 'Professional Driver',
      desc: 'Experienced, licensed driver for the full duration',
      price: ADDON_DRIVER_PRICE,
      icon: '👨‍✈️',
    },
    {
      key: 'child_seat' as keyof FormData,
      label: 'Child Safety Seat',
      desc: 'Certified child seat suitable for ages 1–6',
      price: ADDON_CHILD_SEAT_PRICE,
      icon: '🪑',
    },
    {
      key: 'gps_nav' as keyof FormData,
      label: 'GPS Navigation',
      desc: 'Built-in GPS device with offline Sri Lanka maps',
      price: ADDON_GPS_PRICE,
      icon: '🧭',
    },
  ]

  return (
    <div>
      <StepHeader title="Add-ons" subtitle="Enhance your rental experience with optional extras." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {addons.map((addon) => {
          const active = form[addon.key] as boolean
          return (
            <button
              key={addon.key}
              type="button"
              onClick={toggleBool(addon.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px',
                borderRadius: 12,
                border: `1px solid ${active ? '#dc2828' : 'rgba(255,255,255,0.08)'}`,
                background: active ? 'rgba(220,40,40,0.06)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
                width: '100%',
              }}
            >
              <span style={{ fontSize: 28, flexShrink: 0 }}>{addon.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#dc2828' : '#fff', marginBottom: 3 }}>
                  {addon.label}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)' }}>{addon.desc}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#dc2828' : 'rgba(255,255,255,0.5)' }}>
                  +LKR {addon.price.toLocaleString()}/day
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
                  LKR {(addon.price * rentalDays).toLocaleString()} total
                </div>
              </div>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  border: `2px solid ${active ? '#dc2828' : 'rgba(255,255,255,0.16)'}`,
                  background: active ? '#dc2828' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.15s',
                }}
              >
                {active && <CheckIcon size={11} style={{ color: '#fff' }} />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Step3({
  form,
  set,
}: {
  form: FormData
  set: (f: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}) {
  return (
    <div>
      <StepHeader title="Driver Information" subtitle="Tell us about who will be driving the vehicle." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Full Name *" icon={<></>}>
            <input
              type="text"
              value={form.customer_name}
              onChange={set('customer_name')}
              placeholder="As on driving license"
              required
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Phone Number *" icon={<PhoneIcon size={13} />}>
          <input
            type="tel"
            value={form.customer_phone}
            onChange={set('customer_phone')}
            placeholder="+94 XX XXX XXXX"
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Email Address" icon={<MailIcon size={13} />}>
          <input
            type="email"
            value={form.customer_email}
            onChange={set('customer_email')}
            placeholder="your@email.com"
            style={inputStyle}
          />
        </Field>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Driving License Number" icon={<IdCardIcon size={13} />}>
            <input
              type="text"
              value={form.customer_license}
              onChange={set('customer_license')}
              placeholder="Sri Lanka driving license number"
              style={inputStyle}
            />
          </Field>
        </div>
      </div>
    </div>
  )
}

function Step4({
  form,
  setForm,
  vehicle,
  rentalDays,
  grandTotal,
}: {
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  vehicle: VehicleListing
  rentalDays: number
  grandTotal: number
}) {
  return (
    <div>
      <StepHeader title="Review & Pay" subtitle="Review your booking details and choose a payment method." />

      {/* Summary rows */}
      <div
        style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '16px',
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Vehicle', value: `${vehicle.brand} ${vehicle.vehicle_type ?? ''}` },
          { label: 'Pickup', value: `${form.start_date} at ${form.start_time}` },
          { label: 'Return', value: `${form.return_date} at ${form.return_time}` },
          { label: 'Duration', value: `${rentalDays} day${rentalDays !== 1 ? 's' : ''}` },
          { label: 'Location', value: form.pickup_type === 'office' ? 'Office pickup' : `Delivery: ${form.delivery_address}` },
          { label: 'Driver', value: form.with_driver ? 'Professional driver included' : 'Self-drive' },
          { label: 'Name', value: form.customer_name },
          { label: 'Phone', value: form.customer_phone },
        ].map((row) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              gap: 16,
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)', flexShrink: 0 }}>{row.label}</span>
            <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, textAlign: 'right', wordBreak: 'break-word' }}>{row.value || '—'}</span>
          </div>
        ))}
      </div>

      {/* Payment method */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Payment Method</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { value: 'cash', label: 'Cash on Pickup', icon: <BanknoteIcon size={18} /> },
            { value: 'card', label: 'Credit / Debit Card', icon: <CreditCardIcon size={18} /> },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, payment_method: opt.value as 'cash' | 'card' }))}
              style={{
                flex: 1,
                padding: '14px 12px',
                borderRadius: 10,
                border: `1px solid ${form.payment_method === opt.value ? '#dc2828' : 'rgba(255,255,255,0.10)'}`,
                background: form.payment_method === opt.value ? 'rgba(220,40,40,0.08)' : 'rgba(255,255,255,0.02)',
                color: form.payment_method === opt.value ? '#dc2828' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label style={labelStyle}>Additional Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Any special requests or instructions…"
          rows={3}
          style={{ ...inputStyle, width: '100%', resize: 'vertical', minHeight: 72 }}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          padding: '14px 16px',
          background: 'rgba(220,40,40,0.06)',
          border: '1px solid rgba(220,40,40,0.2)',
          borderRadius: 10,
          fontSize: 13,
          color: 'rgba(255,255,255,0.62)',
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: '#dc2828' }}>Estimated Total: LKR {grandTotal.toLocaleString()}</strong>
        <br />
        Submitting this form sends a booking request. The rental partner will confirm within 24 hours.
      </div>
    </div>
  )
}

// ---- Success screen ----
function SuccessScreen({
  vehicle,
  rentalDays,
  total,
}: {
  vehicle: VehicleListing
  rentalDays: number
  total: number
}) {
  const displayName = `${vehicle.brand}${vehicle.vehicle_type ? ' ' + vehicle.vehicle_type : ''}`
  return (
    <div
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: '100%',
          background: '#131313',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: '48px 36px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: 'rgba(220,40,40,0.12)',
            border: '2px solid rgba(220,40,40,0.4)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            color: '#dc2828',
          }}
        >
          <CheckCircleIcon size={40} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
          Booking Requested!
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 28 }}>
          Your request for <strong style={{ color: '#fff' }}>{displayName}</strong> ({rentalDays} day{rentalDays !== 1 ? 's' : ''}) totalling{' '}
          <strong style={{ color: '#dc2828' }}>LKR {total.toLocaleString()}</strong> has been submitted.
          The rental partner will contact you within 24 hours.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link
            href="/"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            Back to Home
          </Link>
          <Link
            href="/browse"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 10,
              background: '#dc2828',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Browse More
          </Link>
        </div>
      </div>
    </div>
  )
}

// ---- Vehicle summary sidebar ----
function VehicleSummaryCard({
  vehicle,
  displayName,
  location,
  form,
  rentalDays,
  baseTotal,
  driverTotal,
  childSeatTotal,
  gpsTotal,
  deliveryFee,
  grandTotal,
  imgError,
  onImgError,
}: {
  vehicle: VehicleListing
  displayName: string
  location: string
  form: FormData
  rentalDays: number
  baseTotal: number
  driverTotal: number
  childSeatTotal: number
  gpsTotal: number
  deliveryFee: number
  grandTotal: number
  imgError: boolean
  onImgError: () => void
}) {
  return (
    <div
      style={{
        background: '#131313',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        overflow: 'hidden',
      }}
    >
      {/* Vehicle image */}
      <div
        style={{
          height: 160,
          background: '#1c1c1c',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {vehicle.image_url && !imgError ? (
          <Image
            src={vehicle.image_url}
            alt={displayName}
            fill
            style={{ objectFit: 'cover' }}
            onError={onImgError}
            sizes="340px"
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56 }}>
            🚗
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(19,19,19,0.8) 0%, transparent 60%)' }} />
        <div style={{ position: 'absolute', bottom: 12, left: 16 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{displayName}</div>
          {location && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>📍 {location}</div>
          )}
        </div>
      </div>

      {/* Specs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {[
          { icon: <UsersIcon size={12} />, label: `${vehicle.seating_capacity ?? '—'} seats` },
          { icon: <GaugeIcon size={12} />, label: vehicle.transmission ?? '—' },
          { icon: <FuelIcon size={12} />, label: vehicle.fuel_type ?? '—' },
          { icon: <CalendarIcon size={12} />, label: `${rentalDays} day${rentalDays !== 1 ? 's' : ''}` },
        ].map((spec, i) => (
          <div
            key={i}
            style={{
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: 'rgba(255,255,255,0.5)',
              borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            }}
          >
            <span style={{ color: '#dc2828' }}>{spec.icon}</span>
            <span style={{ textTransform: 'capitalize' }}>{spec.label}</span>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
          Price Breakdown
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PriceLine
            label={`Base rate × ${rentalDays} day${rentalDays !== 1 ? 's' : ''}`}
            amount={baseTotal}
          />
          {driverTotal > 0 && <PriceLine label="Driver" amount={driverTotal} />}
          {childSeatTotal > 0 && <PriceLine label="Child Seat" amount={childSeatTotal} />}
          {gpsTotal > 0 && <PriceLine label="GPS Navigation" amount={gpsTotal} />}
          {deliveryFee > 0 && <PriceLine label="Delivery Fee" amount={deliveryFee} />}
        </div>
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            marginTop: 12,
            paddingTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Estimated Total</span>
          <span style={{ fontSize: 19, fontWeight: 800, color: '#dc2828' }}>
            LKR {grandTotal.toLocaleString()}
          </span>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.24)', marginTop: 8, lineHeight: 1.5 }}>
          Final amount confirmed by rental partner. Extra km charges may apply.
        </p>
      </div>
    </div>
  )
}

function PriceLine({ label, amount }: { label: string; amount: number }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>LKR {amount.toLocaleString()}</span>
    </div>
  )
}

function StepHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.01em' }}>{title}</h2>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>{subtitle}</p>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 5 }}>
        {icon && <span style={{ color: '#dc2828' }}>{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(255,255,255,0.38)',
  marginBottom: 6,
  letterSpacing: '0.04em',
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
