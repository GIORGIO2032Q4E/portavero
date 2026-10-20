# Portavero

Portavero is a personal project for planning the costs of importing goods and vehicles into Georgia.

The calculators organize amounts you enter yourself. They do not provide carrier quotes or replace an official customs assessment.

## Current features

- Add known import costs and calculate a subtotal.
- Save estimates in the current browser and print them or save them as a PDF.
- Create an account and save estimates to Supabase when the project is configured.
- Compare up to three shipping quotes entered by you, grouped by currency.
- Review a checklist of questions to ask a shipping provider.
- Browse a curated list of common vehicle models and engine variants.
- Get a preliminary estimate for selected passenger-vehicle taxes.

## Current limits

- Shipping quotes, exchange rates and cargo tracking are not fetched automatically.
- The vehicle list is not a complete database and does not identify a vehicle by VIN.
- Tax estimates do not cover every vehicle classification, fee or transitional rule.
- Blank costs are excluded from the displayed subtotal.
- The figures are for planning. Confirm quotes and tax treatment with providers and the Georgian Revenue Service before making a purchase or shipping a vehicle.

Use the [official Revenue Service vehicle calculator](https://www.rs.ge/CarClearance-en) to check a specific vehicle.

## Where the code lives

- `src/app/`: website pages and page-specific UI.
- `src/components/SiteHeader.tsx`: the shared site navigation.
- `src/data/vehicle-catalog.ts`: the curated vehicle and engine list.
- `src/lib/vehicle-tax.mjs`: the vehicle-tax estimate calculations.
- `src/lib/vehicle-tax.test.mjs`: tests for the tax calculations.
- `src/lib/auth.ts`: Supabase sign-in and saved-estimate requests.
- `supabase/schema.sql`: saved-estimate table and row-level access rules.
- `src/app/globals.css`: the site's styles.

A useful starting point when learning the project is to follow one feature from its page in `src/app/` to any helper it imports in `src/lib/` or data it imports from `src/data/`.

## Run locally

Requirements: Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_SITE_URL`: base URL used for metadata and sitemap links.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Supabase publishable key. The older `NEXT_PUBLIC_SUPABASE_ANON_KEY` name is also supported.

Apply `supabase/schema.sql` in the Supabase SQL Editor to create the saved-estimates table and its Row Level Security policies. Add the environment variables to Vercel and redeploy after changing them. Configure Supabase Authentication's site URL and allowed redirect URLs for local development and the deployed site.

Only the publishable/anon key belongs in browser-accessible environment variables. Never put a Supabase secret or service-role key in `NEXT_PUBLIC_*` variables or commit secrets to the repository.

## Checks

Run these before proposing a change:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The CI workflow runs these checks on pull requests and pushes to `main`, and also checks for high-severity dependency vulnerabilities.

## Stack

- Next.js
- React
- TypeScript
- CSS
- Supabase Authentication and database

## Deployment

The production site is hosted on Vercel. Keep credentials out of source control and verify sign-up, sign-in, password recovery and saved-estimate access after changing the Supabase configuration.
