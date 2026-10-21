# Portavero

Portavero is an independent web project for planning the costs of bringing goods and passenger vehicles into Georgia.

**Live demo:** https://portavero.vercel.app

## The problem

An import budget can include a purchase price, freight, insurance, customs charges, port fees and local delivery. Some amounts are known early, while others need confirmation from a seller, carrier or government authority. Portavero helps keep those figures together without silently treating missing costs as free.

## What it does

- Add known import costs and see a subtotal, with missing amounts kept visible.
- Save an estimate in the current browser and print it or save it as a PDF.
- Create an account and save supported estimates to Supabase when the service is configured.
- Compare up to three shipping quotes entered by the user, grouped by currency.
- Review a short checklist before accepting a shipping quote.
- Search a curated list of common vehicle makes, models and engine variants.
- Produce a preliminary passenger-vehicle tax estimate for selected cases.

## Implementation

- **Next.js App Router** provides the page structure and production build.
- **React, TypeScript and CSS** power the interface without a large component framework.
- Vehicle-tax calculations live in a small standalone module, separate from the page UI. Node's built-in test runner covers common calculation cases.
- **Supabase Auth and Postgres** support accounts and saved estimates when configured. The SQL schema enables row-level security so saved records are scoped to their owner.
- The interface distinguishes user-entered amounts, calculated totals and costs that still need verification.

The project is intentionally small. It favors readable code and explicit limitations over adding integrations that cannot yet be verified.

## Important limitations

Portavero is a planning aid, not a freight-booking service, a customs broker or a government service.

- Shipping quotes, exchange rates and cargo tracking are not fetched automatically.
- The vehicle catalogue is a starter list, not a complete database, and it does not identify vehicles by VIN.
- Vehicle-tax results cover selected cases only and may not include every classification, fee, exception or transitional rule.
- Blank cost fields are excluded from the subtotal, so the displayed amount is not necessarily the final import cost.

Confirm provider charges and vehicle-specific tax treatment before making a purchase or shipping a vehicle. The [Georgian Revenue Service vehicle calculator](https://www.rs.ge/CarClearance-en) is the authoritative place to check a specific vehicle.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/` | Website pages, layouts and page-specific UI |
| `src/components/` | Shared navigation and form components |
| `src/data/vehicle-catalog.ts` | Curated vehicle and engine list |
| `src/lib/vehicle-tax.mjs` | Vehicle-tax calculation rules |
| `src/lib/vehicle-tax.test.mjs` | Tests for the vehicle-tax rules |
| `src/lib/auth.ts` | Supabase authentication and saved-estimate requests |
| `supabase/schema.sql` | Saved-estimate table, index and row-level access policies |
| `src/app/globals.css` | Site-wide and page-specific styles |

## Run locally

Requirements: Node.js 24 and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment setup

Set these values in `.env.local` for local development and in the Vercel project for production:

- `NEXT_PUBLIC_SITE_URL`: the base URL used by page metadata, `robots.txt` and the sitemap.
- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the Supabase publishable key. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` name is also supported.

To enable saved estimates, apply `supabase/schema.sql` in the Supabase SQL Editor and configure the authentication site URL and allowed redirect URLs for the local and production domains.

Only a publishable/anon key belongs in a `NEXT_PUBLIC_*` variable. Never expose a Supabase secret or service-role key in browser-accessible variables or commit secrets to source control.

## Quality checks

Run these commands before publishing changes:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

GitHub Actions runs dependency auditing, linting, TypeScript checks, the unit tests and a production build for pushes to `main` and pull requests.

## Deployment

The production site is hosted on Vercel and connected to this repository. After changing Supabase settings, verify sign-up, sign-in, password recovery and saved-estimate access against the configured service.
