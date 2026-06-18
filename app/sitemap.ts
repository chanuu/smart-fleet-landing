import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const SITE_URL = 'https://www.rentcartours.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/browse`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ]

  const { data: vehicles } = await supabase.rpc('get_public_vehicle_listings')
  const vehiclePages: MetadataRoute.Sitemap = (vehicles ?? []).map((v: { vehicle_id: string }) => ({
    url: `${SITE_URL}/vehicles/${v.vehicle_id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const { data: tenants } = await supabase.rpc('get_public_tenants')
  const companyPages: MetadataRoute.Sitemap = (tenants ?? []).map((t: { tenant_id: string }) => ({
    url: `${SITE_URL}/companies/${t.tenant_id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...companyPages, ...vehiclePages]
}
