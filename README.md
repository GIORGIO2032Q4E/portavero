# Portavero

Portavero is a small web project for planning a vehicle or general-goods import into Georgia. I built it to bring the main cost estimates and a few useful vehicle checks into one place.

Live site: https://portavero.vercel.app

## What works in the current version

- **General import calculator:** enter purchase, supplier, inland transport, freight, insurance, tax, port, delivery and other costs. It shows the known subtotal and can calculate duty and VAT amounts from rates you enter yourself. It supports USD, EUR, GBP, GEL and JPY.
- **Vehicle import estimator:** choose a supported vehicle from the curated catalogue or enter the relevant details manually. The estimator calculates vehicle excise and import duty using the rules in the project, adds the standard GEL 480 fee amount currently encoded in the calculator, and shows warnings for unsupported or restricted cases.
- **Vehicle catalogue:** search the included makes, models and common engine variants. This is a starter list, not a complete vehicle database.
- **VIN decoder:** submit a 17-character VIN to NHTSA vPIC and view the technical fields that source returns, such as make, model, model year and engine details.
- **Vehicle comparison:** save up to four vehicle candidates from the vehicle estimator and compare their entered details, costs and warnings. The list is stored in the current browser.
- **Shipping quote comparison:** compare up to three shipping offers that you enter, including their currency, estimated transit days and whether insurance is marked as included. Prices are ranked only against other quotes in the same currency.
- **Saved estimates:** the general calculator can keep up to ten estimates in browser storage. When Supabase is configured, a signed-in user can also save estimates to their account and manage the cloud copies from the account page.
- **Print / PDF:** use the browser print dialog to print an estimate or save it as a PDF.

## Important limitations

Portavero is a planning tool, not a booking or customs service. It does not contact carriers, book transport, track shipments, fetch live freight prices or convert currencies using live exchange rates. Shipping quotes are entered by the user, are not verified by Portavero and are not saved after leaving the shipping page.

The general calculator does not look up tariff rates or decide which duty or VAT rate applies. You must enter the rates and costs yourself using the correct tariff code, origin and destination rules. Unknown cost fields are kept separate from entered amounts, so a displayed subtotal is not a guaranteed final landed cost.

The vehicle tax estimator covers the cases represented by its current rules and inputs. It is not an official tax assessment and cannot cover every vehicle classification, exception or transitional situation. The vehicle catalogue is limited, and a catalogue engine variant is not confirmation of the exact vehicle. Check the vehicle documents and confirm the result with the [Georgian Revenue Service vehicle calculator](https://www.rs.ge/CarClearance-en) before buying or shipping. The vehicle tax page links to the legal and Revenue Service sources used by the project.

VIN decoding is a technical lookup through the U.S. NHTSA vPIC service. Availability varies, especially for vehicles not built for the U.S. market. It does **not** search accident, title, ownership, odometer, service or auction records, and it does not retrieve original auction photos. A missing history result must not be treated as a clean history. In the vehicle comparison tool, a VIN is recorded for reference only and is not decoded automatically; any history notes are user-entered and unverified.

Browser-saved estimates and vehicle candidates stay in that browser and are not shared across devices. Optional account features need a working Supabase project and database setup. In this version, the Supabase session is stored in browser localStorage rather than an HttpOnly cookie, so avoid signing in on a shared or untrusted device.

## Built with

- Next.js App Router
- React and TypeScript
- CSS
- Supabase Auth and the Supabase REST API for optional accounts and saved estimates
- NHTSA vPIC API for VIN technical decoding
- Node.js built-in test runner for calculation, validation and saved-data tests

The project keeps its calculation and validation helpers in small modules under `src/lib`, separate from the page components.

## Run locally

Use Node.js 24 and npm.

```bash
npm ci
```

Copy `.env.example` to `.env.local`, then start the development server:

```bash
npm run dev
```

Open http://localhost:3000.

The site can run without Supabase credentials, but account sign-up, sign-in, password recovery and cloud estimate storage will not be available.

## Supabase setup

Set these variables in `.env.local` for local development and in the Vercel project for deployment:

- `NEXT_PUBLIC_SITE_URL`: the site base URL, such as `http://localhost:3000` locally.
- `NEXT_PUBLIC_SUPABASE_URL`: your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the public publishable key. The older `NEXT_PUBLIC_SUPABASE_ANON_KEY` variable name is also supported.

To enable saved estimates in an account, run `supabase/schema.sql` in the Supabase SQL Editor and configure the Auth site URL and allowed redirect URLs for your local and production domains. The SQL file enables row-level security and limits each signed-in user to their own estimates.

Only public publishable/anon keys belong in `NEXT_PUBLIC_*` variables. Never put a Supabase secret or service-role key in browser-accessible variables or commit credentials to Git.

## Checks

Run the same checks used by GitHub Actions:

```bash
npm ci
npm audit --audit-level=moderate
npm run lint
npm run typecheck
npm test
npm run build
```

The tests use Node's built-in test runner. They cover vehicle-tax calculations, VIN format and warning handling, numeric input validation, import-cost arithmetic, vehicle-import totals and saved comparison data.

GitHub Actions runs the dependency audit, lint, TypeScript check, tests and production build on pushes to `main` and pull requests targeting `main`.

## Project structure

- `src/app/`: pages, route handlers and page layouts
- `src/app/api/vin-check/`: server route that calls NHTSA vPIC
- `src/components/`: shared interface components
- `src/data/vehicle-catalog.ts`: curated vehicle catalogue
- `src/lib/`: import calculations, vehicle-tax rules, VIN validation, auth requests and local saved-data helpers
- `supabase/schema.sql`: saved-estimate table, constraints and row-level security policies
- `.github/workflows/ci.yml`: GitHub Actions validation workflow
- `.env.example`: local environment-variable template

## Deployment

The GitHub repository is connected to Vercel. Changes merged into `main` trigger the production deployment. The public site is https://portavero.vercel.app.
