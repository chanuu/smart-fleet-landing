import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/my-bookings', '/login'],
      },
    ],
    sitemap: 'https://www.rentcartours.com/sitemap.xml',
  }
}
