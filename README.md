# Portavero

Portavero is a small web project for estimating import costs in Georgia.

Live site: https://portavero.vercel.app

## What you can do

- Add the import costs you know and see a running total.
- Keep an estimate in your browser, then print it or save it as a PDF.
- Create an account and save supported estimates when Supabase is configured.
- Compare up to three shipping quotes you enter yourself.
- Use a checklist when reviewing a shipping quote.
- Browse a curated list of common vehicle models and engine variants.
- Get a preliminary tax estimate for selected passenger-vehicle cases.

## A few limits to know about

Portavero is a planning tool. It does not book freight, track cargo or fetch live shipping prices or exchange rates. Blank cost fields are left out of the total, so the number shown may not be the final import cost.

The vehicle catalogue is limited and does not look up cars by VIN. The tax planner covers selected cases, not every possible vehicle classification or exception. Check the details with the shipping provider and the Georgian Revenue Service before relying on an estimate. The official vehicle calculator is available at [rs.ge](https://www.rs.ge/CarClearance-en).

## How it is built

- Next.js App Router
- React and TypeScript
- CSS
- Supabase Auth and Postgres for accounts and saved estimates, when configured
- Node's built-in test runner for vehicle-tax calculation tests

The vehicle-tax rules live in a separate module so they can be tested without running the page UI. The project is kept intentionally small rather than adding integrations the site does not currently provide.

## Run it locally

You need Node.js 24 and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variables

The example values are in `.env.example`. For local development, put the values in `.env.local`. Set the production values in the Vercel project.

- `NEXT_PUBLIC_SITE_URL`: base URL used for site metadata, robots.txt and the sitemap.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: public key used by the app. The legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` name is also supported.

To use saved estimates, apply `supabase/schema.sql` in the Supabase SQL Editor and configure the authentication site URL and allowed redirect URLs for your local and production domains.

Only public publishable/anon keys should be used in `NEXT_PUBLIC_*` variables. Do not put a Supabase secret or service-role key in browser-accessible variables or commit secrets to Git.

## Checks

Run these before publishing changes:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

GitHub Actions runs the dependency audit, lint, type check, tests and production build on pushes to `main` and pull requests targeting `main`.

## Project layout

- `src/app/`: pages and page layouts
- `src/components/`: shared interface components
- `src/data/vehicle-catalog.ts`: vehicle catalogue
- `src/lib/vehicle-tax.mjs`: vehicle-tax calculations
- `src/lib/vehicle-tax.test.mjs`: calculation tests
- `src/lib/auth.ts`: authentication and saved-estimate requests
- `supabase/schema.sql`: saved-estimate table and row-level security policies
- `src/app/globals.css`: shared and page-specific styles

## Deployment

The production site is hosted on Vercel and connected to this GitHub repository. After changing Supabase settings, test sign-up, sign-in, password recovery and saved-estimate access against the configured service.
