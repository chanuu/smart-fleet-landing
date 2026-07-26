# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ This is a LIVE production site

This is the public marketplace at **rentcartours.com**, paired with the admin app
(`smart-fleet` — app.rentcartours.com) against a **shared Supabase project**. Real customers
browse and book real vehicles here. Before making any change:

1. **Explain the risk before proceeding** — state plainly whether a change is additive/safe or
   could affect existing bookings, customer accounts, or the public RPCs the admin app also relies on.
2. **Prefer additive DB migrations** (these live in the `smart-fleet` repo's `supabase/migrations/`,
   since both apps share one Supabase project). Use `ADD COLUMN IF NOT EXISTS`,
   `CREATE OR REPLACE FUNCTION` with an unchanged signature. Never drop a column/table/function
   without explicit confirmation.
3. **Check every caller before changing a shared RPC.** Grep both this repo and `smart-fleet` (the
   admin app) — several public RPCs (`get_public_vehicle_listings`, `get_public_tenant`, etc.) are
   called from both.
4. **Note deploy order** when a migration and app-code change depend on each other.
5. **Log the change** in `CHANGELOG.md` (this repo) with a one-line risk note.

## Commands

```bash
npm run dev     # Start dev server (Next.js, Turbopack)
npm run build   # Type-check + production build
npm run start   # Run production build
npm run lint    # ESLint
```

## Environment

Requires `.env.local` (or `.env`) with:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

`lib/supabase.ts` falls back to a placeholder URL if these are missing — no hard failure, so a
misconfigured env silently breaks all data fetching rather than erroring loudly at startup.

## Architecture Overview

**Stack:** Next.js (App Router) + TypeScript + Supabase (shared with the admin app) + inline styles
(no Tailwind/CSS modules — components use `style={{...}}` objects directly).

### Relationship to the admin app (`smart-fleet`)

This app is **anonymous/customer-facing only** — it never reads tenant-scoped tables directly.
All data comes through `SECURITY DEFINER` public RPCs defined in the admin app's migrations:

- `get_public_vehicle_listings()` / `get_public_tenant_vehicles(tenant_id)` — vehicle browsing
- `get_public_tenant(tenant_id)` / `get_public_tenants()` — company profile pages
- `get_public_tenant_addons(tenant_id)` — per-tenant booking add-ons
- `submit_public_booking_request(...)` — booking form submission → lands in `public_booking_requests`
  for the tenant to confirm in the admin app
- `get_hero_images()` — platform-admin-managed homepage hero slideshow
- `get_my_booking_requests()` / `get_my_rentals()` / `get_my_customer_public_profile()` — logged-in
  customer's own booking history and trust score (My Bookings page)

### Two separate account systems, one Supabase Auth

Customers signing up here (`contexts/CustomerAuthContext.tsx`) get a plain Supabase Auth user with
**no** `tenants` or `tenant_users` row — this is what the admin app's `resolveSession()` checks to
deny them admin access if they ever try to log into app.rentcartours.com. Do not conflate this
signup flow with the admin app's tenant-owner signup.

### Directory Layout

```
app/                      # Next.js App Router pages
  page.tsx                 # Homepage — hero, featured vehicles, partners
  browse/                  # Search/filter all vehicles
  vehicles/[vehicleId]/     # Vehicle detail page
  reserve/[vehicleId]/      # Multi-step booking form (ReservePage.tsx)
  companies/[tenantId]/     # Company/tenant public profile page
  login/                    # Customer sign in/up
  my-bookings/              # Logged-in customer's bookings + trust score
components/                # Shared UI (VehicleCard, Hero, TopNav, ReservePage, …)
contexts/
  CustomerAuthContext.tsx   # Customer auth state (separate from admin app's AuthContext)
types/index.ts             # Shared interfaces mirroring RPC return shapes
lib/supabase.ts            # Supabase client singleton
```

### Notable patterns

- **Image resolution**: vehicle/tenant logo images are private-bucket storage paths resolved to
  signed/public URLs at fetch time in server components (`createSignedUrl` for tenant logos,
  `getPublicUrl` for vehicle images and platform-assets like hero images).
- **`resolveUrl` pattern for hero images**: old seed rows store a full external URL (Unsplash);
  new platform-admin uploads store a storage object path — check `value.startsWith('http')` before
  deciding whether to resolve via `getPublicUrl`.
- **De-prioritizing imageless listings**: vehicles without a photo are sorted to the end both in
  the RPC's `ORDER BY` and again client-side as a safety net (`app/page.tsx`, `app/browse/page.tsx`).
