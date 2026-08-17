# Changelog

All notable changes to this project will be documented in this file.

**This is a live production site.** Every entry below is tagged with a risk note explaining why
the change was safe to ship, or what deploy-order/verification step was needed. New entries should
follow the same format — see the process note in `CLAUDE.md`.

## 2026-08 — Live-site session log

### Company profile: two-column hero, fleet header rate note, SEO metadata (2026-08-18)
- Hero rebuilt to match the design sample's two-column layout: left (badge/title/description/
  amenity pills/CTAs/stats, all real data as before), right (a "Most booked" featured-vehicle
  panel + 3 thumbnails — first vehicle with a photo, real name/specs/price, linking to
  `/vehicles/[id]`). New `CompanyImageWithFallback.tsx` gives these hero images the same
  graceful placeholder-pattern fallback `CompanyVehicleCard` already had for a missing/broken
  photo, instead of a broken-image icon.
- Fleet tab header now also shows a real rate note ("Rates include N km per day. Extra km billed
  at LKR X...") derived from the fleet's own rate-plan data, and the heading uses the fleet's
  total count instead of the filtered count (matches the sample; stays stable as filters change).
- **SEO**: `generateMetadata` for this route now sets `alternates.canonical`, an explicit
  `robots: { index: true, follow: true }`, and Open Graph/Twitter card tags — it was previously
  title/description only. The page was already reachable (listed in `sitemap.xml`, not blocked
  by `robots.txt`), so this makes the existing indexability more explicit/robust (canonical URL,
  social preview cards) rather than fixing a page that wasn't indexable before.
- **Risk:** none — presentation + metadata only, same page, no new data dependencies beyond
  fields already fetched.

### Company profile page restyled to match design sample (2026-08-17)
- Full visual reskin of `/companies/[tenantId]` to match a provided design sample: Archivo
  (headings/body) + JetBrains Mono (uppercase mono labels) via `next/font/google`, scoped to
  this page only (`lib/companyTheme.ts` — fonts applied via CSS variables on the page's root
  `<main>`, so the rest of the site stays on Inter). New dark palette (`#08080a` background,
  `#0d0d10` cards, `#e11d2e` accent red) replacing the previous `#0a0a0a`/`#131313`/`#dc2828`
  set, pill-shaped buttons/badges/filter-chips, and a redesigned hero (verified-operator badge,
  stat tiles, message/call CTAs) — all driven by the same real data as before (vehicle counts,
  years active, categories, contact info).
- New `CompanyVehicleCard.tsx` — a page-scoped fleet-card variant restyled to match, used only
  in the Fleet tab. Left `VehicleCard.tsx` itself untouched since it's shared with `/browse` and
  the homepage — restyling it would have reskinned the whole site, not just this page.
- `CompanyTopNav.tsx` and `CompanyFooter.tsx` (from the earlier white-label change) recolored to
  match; `CompanyProfileClient.tsx`'s sticky tab bar offset adjusted (`top: 66`) since the nav is
  now a bit taller than the old fixed 64px shell.
- **Risk:** none — presentation only, this one page's components only; all existing behavior
  (tab switching, fleet filtering, booking links, sign-in/my-bookings, contact form, WhatsApp/
  Google-review links) is unchanged, verified via screenshots of all four tabs before and after.

### Rental partner cards open profile in a new tab (2026-08-17)
- Homepage "Rental Partners" cards (`PartnersSection.tsx`) now open `/companies/[tenantId]` in a
  new tab (`target="_blank" rel="noopener noreferrer"`) instead of navigating away — makes more
  sense now that the profile page is white-labeled to look like the tenant's own site, so
  visitors don't lose their place on rentcartours.com.
- **Risk:** none — link behavior only.

### Company profile page white-labeled (2026-08-17)
- `/companies/[tenantId]` now uses new `CompanyTopNav`/`CompanyFooter` components instead of the
  platform-wide `TopNav`/`Footer` — no Rent Car Tours logo, no marketplace nav links
  (Home/Browse Vehicles), and the breadcrumb ("Home / Rental Partners / …") is removed. The nav
  shows the tenant's own logo/name (linking to their own profile page) instead, so the page reads
  as the tenant's own site. Sign-in/My Bookings/account menu are kept working as before (bookings
  still run through the shared rentcartours.com customer account system) — `CompanyTopNav` is a
  trimmed copy of `TopNav` with the platform branding swapped for the tenant's. Footer keeps a
  small "Bookings powered by Rent Car Tours" credit line rather than removing platform attribution
  entirely.
- **Risk:** none — presentation only, this one page's layout only; no other pages, no RPCs, no
  auth logic changed. `CompanyProfileClient`'s internal sticky tab bar (`top: 72`) still lines up
  correctly since the new nav is the same 64px height as the one it replaced.

### Fixed wrong "Expected Return" date (2026-08-16)
- `/invoice/[rentalId]` was showing today's date as "Expected Return" for any rental that hasn't
  been closed yet — it was reading `end_date`, which is just a same-as-start-date placeholder
  until the rental closes. Now reads `expected_return_date`/`expected_return_time` (backed by
  the updated `get_public_rental_receipt` RPC — see `smart-fleet`'s `CHANGELOG.md`) for any
  rental still active/pending; closed rentals still correctly show the real `end_date`.
- **Risk:** none — display-only fix.
- **Deploy order:** requires the updated RPC migration (from `smart-fleet`) applied first.

### Invoice page redesign: company branding, KM breakdown, fixed 0 total (2026-08-16)
- `/invoice/[rentalId]` redesigned as a proper invoice: company logo (signed URL from the
  `tenant-assets` bucket, same resolution pattern as `app/companies/[tenantId]/page.tsx`),
  address and phone in the header, included/driven/extra kilometers, a clean line-item
  breakdown for closed rentals, and an always-visible "Rate plan details" note stating the
  included KM allowance and the extra-km rate (not just when an overage was actually incurred).
- Fixed the total showing `LKR 0.00` for any rental that hadn't been closed yet (the common case,
  since this link goes out on `rental_created`, before there's a final total) — now shows a
  clearly labeled "Estimated Total" from the rate plan, plus advance payment and total paid,
  which are tracked live regardless of whether the rental has closed.
- Backed by the updated `get_public_rental_receipt` RPC — see `smart-fleet`'s `CHANGELOG.md`.
- **Risk:** none — same page/route, only content and the backing RPC's shape changed.
- **Deploy order:** requires the updated RPC migration (from `smart-fleet`) applied first.

### Public rental receipt page (2026-08-16)
- New page `/invoice/[rentalId]` — a public, no-login receipt (vehicle, dates, charge
  breakdown, total, amount paid, balance due) for a single rental. Powered by a new
  `SECURITY DEFINER` RPC `get_public_rental_receipt(uuid)` (migration lives in the `smart-fleet`
  repo, shared Supabase project — see that repo's `CHANGELOG.md`), granted to `anon`. The admin
  app now texts this link to customers on rental-created/rental-closed SMS.
- **Risk:** low — new page and RPC only, nothing existing touched. The RPC exposes rental
  amounts/dates/vehicle/customer-name to anyone holding the link (the link itself, an unguessable
  uuid, is the access control — no NIC/license/other-customer/other-tenant data is exposed).
- **Deploy order:** requires the `get_public_rental_receipt` migration (from `smart-fleet`) to be
  applied to the shared Supabase project before this page will resolve real data — visiting the
  page before that returns a 404 (RPC not found), not an error page.

### Signup success screen shows entered email (2026-08-06)
- Signup on `/login` no longer shows a small green banner and silently flips back to the sign-in
  tab. It now replaces the form with a dedicated "check your email" card that names the exact
  address just registered, warns sign-in won't work until confirmed, suggests checking spam, and
  offers a "Resend verification email" action plus a "Go to Sign In" button (no auto-redirect).
  Matching change made in `smart-fleet`'s `RegisterForm.tsx` — see that repo's `CHANGELOG.md`.
- **Risk:** none — presentation only, reuses the existing `resendConfirmationEmail` context method,
  no new network calls or schema changes.

### Resend email verification (2026-08-06)
- Login form now detects the "Email not confirmed" sign-in error and shows a "Resend verification
  email" button. See `smart-fleet` `CHANGELOG.md` for the matching admin-app change.
- **Risk:** none — additive only.

## 2026-07 — Live-site session log

### Password reset + change password for customers (2026-07-29)
- Added `/forgot-password` and `/reset-password` pages, plus a "Forgot password?" link on the
  sign-in tab of `/login`. Added a "Change Password" card to `/my-bookings` for logged-in
  customers. `CustomerAuthContext` gained `resetPasswordForEmail` and `updatePassword` methods.
- Matching feature added on the admin app (`smart-fleet`) for tenant owners/staff — see that
  repo's `CHANGELOG.md`.
- **Risk:** none — purely additive pages/context methods, no schema changes, existing
  `signIn`/`signUp` untouched.
- **Action required:** add `https://rentcartours.com/reset-password` to Supabase Dashboard →
  Authentication → URL Configuration → Redirect URLs, otherwise Supabase falls back to the
  default Site URL instead of honoring `emailRedirectTo` (same gotcha noted for the earlier
  signup-confirmation redirect fix).

### Vehicle cards: company name + image-first sort (2026-07-26)
- Each vehicle card now shows the rental company name (`tenant_name`, joined server-side in the
  admin app's public RPCs). Vehicles with no photo now sort to the end of both the homepage
  featured list and browse/search results.
- **Risk:** none — additive field on `VehicleListing`, sort only changes display order.

### Trust lookup / customer profile fixes (2026-07)
- No landing-page-side changes; see the admin app's `CHANGELOG.md` for the cross-tenant NIC/phone
  lookup fix (`customer_public_profiles`).

### Login page: rental-company callout redesigned (2026-07-22)
- Replaced two dim, easy-to-miss text links ("Staff Login" / "List Your Fleet") with a bordered
  callout card, renamed to "Rent A Car Login" / "Register Your Company".
- **Risk:** none — presentation only, same destination URLs.

### Email verification redirects fixed per app (2026-07-19 to 2026-07-22)
- Customer signup (`CustomerAuthContext.signUp`) redirects to `https://rentcartours.com/login`.
- Admin/tenant signup (in `smart-fleet` repo) redirects to `https://app.rentcartours.com/login`.
- **Risk:** requires both URLs to be present in Supabase Dashboard → Authentication → Redirect
  URLs allowlist, otherwise Supabase silently falls back to the default Site URL instead of
  honoring `emailRedirectTo`. Flagged explicitly at the time — confirm both are still listed if
  email confirmation redirects ever misbehave.

### Landing page hero images now platform-managed (2026-07-19/20)
- Hero background slideshow images moved from a hardcoded array (`lib/data.ts`) to a
  `platform_hero_images` table + `get_hero_images()` RPC, managed from the admin app's
  Platform Admin → Hero Images tab. Falls back to the original hardcoded defaults if the RPC
  returns nothing.
- Images later moved from admin-entered external URLs (prone to link rot) to Supabase Storage
  uploads (`platform-assets` bucket) — see `smart-fleet` `CHANGELOG.md` for the bucket-public-flag
  bug that was caught and fixed shortly after.
- **Risk:** none — additive RPC with graceful fallback; `Hero.tsx` resolves both old
  (`http...`) and new (storage-path) values correctly.

### Delivery fee + booking add-ons made tenant-configurable (2026-06/07)
- `ReservePage.tsx` booking form now reads delivery fee tiers and add-on pricing per-tenant
  instead of using hardcoded values (Rs 1500 flat delivery fee, fixed driver/child-seat/GPS
  add-ons). Add-ons UI kept visually identical; data source changed from tenant JSON to a proper
  `tenant_addons` table (see admin app changelog).
- **Risk:** low — falls back to sensible defaults if a tenant hasn't configured anything.

### Booking form cleanup
- Removed the (never-integrated) Cash/Card payment method selector from the booking form.
- Added NIC number field to signup and booking forms, contact-number search fix on the admin
  side (see `smart-fleet` `CHANGELOG.md`).
- Booking success screen no longer shows two low-context "Browse More"/"Back to Home" buttons —
  now prompts signup with a clear CTA, and omits the "totalling LKR 0" line when a vehicle has no
  rate plan attached yet.

### Security/perf audit fixes
- Landing-page items from the full-site audit: HTTPS-only staff/admin links, iOS scroll/viewport
  fixes on the booking and login/signup forms, maintenance-status vehicles excluded from public
  listings and direct-booking URLs.
- **Risk:** low — all additive filters/CSS fixes, no data model changes on this side.

## [Unreleased]
