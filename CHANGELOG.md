# Changelog

All notable changes to this project will be documented in this file.

**This is a live production site.** Every entry below is tagged with a risk note explaining why
the change was safe to ship, or what deploy-order/verification step was needed. New entries should
follow the same format — see the process note in `CLAUDE.md`.

## 2026-08 — Live-site session log

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
