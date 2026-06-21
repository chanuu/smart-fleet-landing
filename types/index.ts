export interface VehicleListing {
  vehicle_id: string
  registration_number: string
  brand: string
  model_name: string | null
  vehicle_type: string | null
  transmission: string | null
  seating_capacity: number | null
  fuel_type: string | null
  district_name: string | null
  city_name: string | null
  rate_plan_name: string | null
  rental_type: string | null
  base_rate: number | null
  base_kilometers: number | null
  extra_rate_per_km: number | null
  image_path: string | null
  // resolved at fetch time
  image_url?: string | null
}

export interface BookingFormData {
  customer_name: string
  customer_phone: string
  customer_email: string
  customer_license: string
  start_date: string
  start_time: string
  return_date: string
  return_time: string
  with_driver: boolean
  pickup_type: 'office' | 'delivery'
  delivery_address: string
  notes: string
}

export interface DistrictGroup {
  district: string
  vehicle_count: number
  vehicle_types: string[]
}

export interface TenantListing {
  tenant_id: string
  name: string
  logo_url: string | null
  phone: string | null
  district_name: string | null
  vehicle_count: number
  vehicle_types: string[] | null
  joined_at: string
}

export interface PublicProfile {
  about?: string
  tagline?: string
  whatsapp?: string
  opening_hours_weekday?: string
  opening_hours_saturday?: string
  opening_hours_sunday?: string
  emergency_contact?: string
  min_driver_age?: string
  cancellation_hours?: string
  policy_1?: string
  policy_2?: string
  policy_3?: string
  policy_4?: string
  google_review_url?: string
}

export interface TenantDetail extends TenantListing {
  email: string | null
  address: string | null
  public_profile: PublicProfile | null
}

export interface CustomerPublicProfile {
  display_name: string | null
  license_number: string | null
  profile_image_url: string | null
  global_rating: number | null
  total_rentals: number
  total_violations: number
  avg_vehicle_care: number | null
  avg_payment_reliability: number | null
  avg_communication: number | null
  avg_rule_compliance: number | null
  avg_punctuality: number | null
  blacklist_status: 'warning' | 'restricted' | 'blacklisted' | null
}
