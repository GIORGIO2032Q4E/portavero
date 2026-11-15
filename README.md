# Portavero

[![CI](https://github.com/GIORGIO2032Q4E/portavero/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/GIORGIO2032Q4E/portavero/actions/workflows/ci.yml)

Portavero is a student-built project about one practical part of buying a car from abroad: understanding what it may cost to bring that car into Georgia.

The main workflow starts with a vehicle identification number (VIN). Portavero checks NHTSA vPIC and can use an optional international VIN decoder when configured, carries the fields actually returned into a vehicle-import planner, and lets the user add purchase, auction, transport, shipping and other known costs. The planner then shows a preliminary estimate for selected passenger-car tax cases.

It is a planning tool, not a vehicle-history report, shipping quote, customs broker or official tax assessment.

- **Live website:** https://portavero.vercel.app
- **Source code:** https://github.com/GIORGIO2032Q4E/portavero
- **Stack:** Next.js App Router, React, TypeScript, JavaScript modules and CSS
- **Runtime:** Node.js 24

## Main workflow

1. **Enter a VIN.** The server route validates the 17-character format and requests available technical data from NHTSA vPIC. If the result has important gaps and the optional international provider is configured, it makes a fallback request to CarsXE.
2. **Review the result.** The lookup may return complete or partial details. Check the result against the actual vehicle and its documents.
3. **Continue to the import planner.** Available make, model, model year, engine, fuel and steering details are passed to the planner when the source supplies them. Missing or uncertain values must be checked or entered manually.
4. **Add the costs you know.** Enter the purchase price, auction fees, inland transport, international shipping, insurance, port charges and local delivery in GEL. Convert foreign-currency quotes yourself using a rate you have checked.
5. **Review the estimate.** The planner separates entered costs, selected tax calculations, the stored standard-fee amount and cost categories that are still unknown.

A blank cost is not treated as free. The displayed total is only as complete as the details and rules available for the vehicle.

## What the current version includes

| Area | Current behaviour | Important limitation |
| --- | --- | --- |
| VIN lookup | Validates VIN format, requests technical data from NHTSA vPIC and can supplement missing fields with CarsXE's international VIN decoder when a server-side API key is configured. | Coverage varies by source, manufacturer and market. Japanese domestic frame/chassis numbers are not standard 17-character VINs. It is not a history check. |
| Vehicle-import planner | Carries over available VIN details, accepts corrections and calculates selected passenger-car tax cases alongside user-entered costs. | It does not cover every classification, exception or transitional case. It is not an official customs assessment. |
| Vehicle catalogue | Provides a searchable list of common makes, models and engine variants used to help identify a vehicle. | It is a curated reference, not a complete global database or proof of the engine fitted to a specific car. |
| Shipping guide | Helps users review a carrier's route, inclusions, exclusions, timing and additional charges. The quote comparison uses values entered by the user. | It does not contact carriers, retrieve live freight prices or verify a provider's offer. |
| About and How it works | Explains the reason for the project, the workflow, calculation scope and data limitations. | These pages explain the implementation; they do not replace official guidance. |
| Legacy account area | Preserves access to account authentication and older general-import estimates where the Supabase project is configured. | The current vehicle-import planner does not save estimates to an account. Old general-import estimates are not compatible with the current planner. Sessions are stored in browser storage, not HttpOnly cookies. |

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Project overview and entry to the VIN workflow |
| `/vin-check` | VIN input and technical-data lookup |
| `/vehicle-import` | Vehicle details, selected tax estimates and import-cost planning |
| `/vehicles` | Searchable vehicle and engine reference list |
| `/shipping` | Shipping checklist and manual quote comparison |
| `/how-it-works` | VIN hand-off, cost inputs and tax-estimate explanation |
| `/about` | Project purpose and implementation summary |
| `/privacy-policy` | Data handling and external services |
| `/terms` | Scope and limitations |
| `/account` | Legacy authentication and older saved estimates; not part of the current main workflow |

The former `/calculator` and `/compare` paths redirect to `/vehicle-import` for compatibility. The USD/GEL converter has been removed.

## Technical structure

The application uses the Next.js App Router. Page components collect input and present results. Reusable VIN parsing, provider merging, validation and calculation logic lives in JavaScript modules so it can be tested with Node's built-in test runner.

~~~text
src/
  app/
    api/vin-check/       Server route for NHTSA plus optional international VIN fallback
    vin-check/           VIN form and technical-data result
    vehicle-import/      Main vehicle import planner
    vehicles/            Searchable vehicle catalogue
    shipping/            Shipping checklist and quote comparison
    about/               Project purpose
    how-it-works/        Workflow and calculation explanation
    privacy-policy/      Data handling disclosure
    terms/               Scope and limitations
    account/             Legacy Supabase account area
    page.tsx             Home page
    layout.tsx           Site shell, navigation and footer
  components/
    NumberField.tsx      Shared numeric input and validation UI
    SiteHeader.tsx       Primary site navigation
  data/
    vehicle-catalog.ts   Curated vehicle and engine reference data
  lib/
    vin.mjs              VIN validation, NHTSA/CarsXE parsing and safe field merging
    vehicle-tax.mjs      Selected Georgian passenger-car tax rules
    vehicle-import-costs.mjs
                         Import-cost validation and totals
    vehicle-selection.mjs
                         Manual and VIN-derived vehicle selection
    number-input.mjs    Numeric input parsing and bounds
    auth.ts              Legacy Supabase authentication and estimates
supabase/
  schema.sql              Legacy saved-estimate table and row policies
docs/
  MANUAL_QA.md             Current manual test plan
  RELEASE_QA_2026-11-09.md Earlier dated production QA record
scripts/
  smoke-test.mjs           Production-server route and API smoke tests
  check-documentation.mjs  Documentation scope consistency checks
.github/
  workflows/ci.yml         Dependency audit, lint, types, tests and build
~~~

## VIN data: what it can and cannot tell you

The VIN endpoint calls the NHTSA vPIC `DecodeVinValuesExtended` service from a server-side route. When NHTSA leaves key identity or specification fields blank, the route can request additional fields from the CarsXE International VIN Decoder. CarsXE is optional and is only called when the private server-side `CARSXE_API_KEY` environment variable is configured. The route applies timeouts, caches the international response for up to 24 hours and keeps the provider key off the client.

The sources may provide fields such as make, model, model year, body style, engine capacity, fuel type, plant country and steering location. Each source returns only the fields it knows. The merge keeps NHTSA values where present and supplements only missing fields. CarsXE's documented international response does not guarantee engine capacity or steering, so those remain blank unless a provider actually returns them. The planner asks the user to confirm or enter information that no source returned.

The lookup does **not** retrieve accident, title, ownership, odometer, service or auction history. It does not return original auction photographs. A valid-looking 17-character string is not proof that a vehicle exists, and a missing history result must never be interpreted as a clean history.

Sources: [NHTSA vPIC](https://vpic.nhtsa.dot.gov/api/) and, when configured, [CarsXE International VIN Decoder](https://docs.carsxe.com/docs/products/international-vin-decoder). A submitted VIN is sent to NHTSA and is also sent to CarsXE when the optional fallback is used. See the Privacy Policy.

## Georgian vehicle-tax estimate

The vehicle-tax module covers selected passenger-car cases intended for vehicles classified under HS 8703. The current implementation includes:

- A base excise rate of GEL 1.50 per cm³ for cars aged 0–6 years and GEL 4.50 per cm³ for cars older than 6 years.
- Selected adjustments for right-hand-drive or converted vehicles and qualifying left-hand-drive hybrids aged 0–6 years.
- A limited electric-vehicle treatment.
- A GEL 1.00 per cm³ rate for vehicles over 30 years old only when the vehicle legally qualifies as a classic car.
- An import-duty calculation based on engine capacity and vehicle age.
- A manually selectable previous regime for cases the user believes meet the transitional conditions. Selecting it does not prove eligibility.

The age used by the implementation is the declaration year minus the manufacture year. The planner does not determine tariff classification, confirm legal eligibility, or cover every exemption, special vehicle category or transitional case. The separate sports-car excise treatment is not calculated.

The planner also adds **GEL 480** as a stored snapshot of seven standard charges listed by the Revenue Service when the amount was reviewed. It is not a live fee lookup and may become outdated.

**Source review recorded in the code: 9 November 2026.** The relevant references are the [Tax Code of Georgia](https://www.matsne.gov.ge/en/document/view/1043717), the [Revenue Service Auto/Moto Levy Calculator](https://www.rs.ge/CarClearance-en), the [Revenue Service notice on the 2 April 2026 changes](https://voice.rs.ge/Default.aspx?id=3874) and the [Ministry announcement of 12 March 2026](https://mepa.gov.ge/Ge/News/Details/26330).

These are the rules currently encoded in the project, not a binding interpretation of law. Tax law, transitional conditions, fees, vehicle eligibility and registration requirements can change. Confirm the exact vehicle and current charges with the Revenue Service before bidding, buying or shipping.

## Data, privacy and security notes

- The vehicle planner performs its arithmetic in the browser. The costs entered for a calculation are not sent to an external service just to calculate the displayed total.
- A VIN submitted to the checker is sent from the Portavero server route to NHTSA vPIC. If `CARSXE_API_KEY` is configured and the NHTSA result has important gaps or fails, the VIN may also be sent to CarsXE for international decoding.
- Shipping quotes are entered by the user. Portavero does not send them to shipping companies.
- The current planner does not save estimates to a user account. The account page relates to older saved estimates.
- The legacy account feature uses Supabase when configured. Its session is held in browser storage rather than an HttpOnly cookie. Do not use it on shared or untrusted devices or store sensitive data in estimate names.
- The project uses Vercel for hosting. Hosting providers may process request and security information under their own terms.

The [Privacy Policy](/privacy-policy) describes the current data flow. Do not enter passwords, payment details, identity documents or other sensitive information into vehicle notes or estimate names.

## Run the project locally

### Requirements

- Node.js 24
- npm
- Git

Clone the repository and install the locked dependencies:

~~~bash
git clone https://github.com/GIORGIO2032Q4E/portavero.git
cd portavero
npm ci
~~~

Copy the example environment file:

~~~powershell
Copy-Item .env.example .env.local
~~~

On macOS or Linux, use `cp .env.example .env.local`.

Start the development server:

~~~bash
npm run dev
~~~

Open http://localhost:3000.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used for metadata and the sitemap |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional legacy account connection |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Optional legacy account connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Legacy alternative to the publishable-key variable |
| `CARSXE_API_KEY` | Optional private key for international VIN fallback. Keep it server-side; never prefix it with `NEXT_PUBLIC_`. |

The site can be used without Supabase credentials. The legacy account functions will be unavailable until Supabase is configured. Only public Supabase keys belong in `NEXT_PUBLIC_*` variables. Never expose a service-role key in browser code or commit secrets to Git.

### Optional legacy Supabase setup

1. Create a Supabase project.
2. Add the project URL and public publishable key to `.env.local` and the Vercel environment variables.
3. Run `supabase/schema.sql` in the Supabase SQL Editor.
4. Set the Supabase Auth site URL and allowed redirect URLs for local development and the deployed site.
5. Test account ownership rules using two separate test accounts before relying on the legacy account area.

This setup only applies to the older saved-estimate feature. It does not enable cloud saving for the current vehicle-import planner.

## Tests and release checks

Run the same checks used by GitHub Actions:

~~~bash
npm ci
npm audit --audit-level=moderate
npm run lint
npm run typecheck
npm test
npm run check:docs
npm run build
npm run test:smoke
~~~

The automated checks cover calculation boundaries, numeric validation, VIN format and response parsing, vehicle selection and import-cost totals. The smoke test starts the compiled production server and checks the main routes, legacy redirects, removed converter routes, metadata endpoints, baseline security headers and local rejection of a malformed VIN.

The checks do **not** replace a real browser walkthrough. They do not prove that every catalogue option matches every vehicle, that a customs assessment is correct, that NHTSA has details for a specific non-U.S. VIN, or that account email and authenticated data flows work. Use [the manual QA plan](docs/MANUAL_QA.md) for browser checks and record actual results in a dated release QA file. A checklist is a test plan, not evidence that a test passed.

An earlier manual production check is recorded in [the 9 November 2026 QA record](docs/RELEASE_QA_2026-11-09.md). Its results apply to the commit and deployment named in that document, not automatically to later releases.

## Deployment

The repository is connected to Vercel. Pull requests receive preview deployments and merges to `main` trigger production deployment at https://portavero.vercel.app.

A deployment marked READY confirms that Vercel completed the deployment process. It does not replace the browser and calculation checks described above.

## Known limitations

1. VIN coverage depends on the decoder sources, manufacturer and market. The CarsXE international fallback is inactive unless a private API key is configured, and its coverage also varies.
2. Some Japanese domestic-market vehicles use a frame/chassis number rather than a standard 17-character VIN. Those numbers are not decoded by this tool and need manual identification from the vehicle documents or manufacturer.
3. The vehicle and engine catalogue is curated and incomplete. Confirm engine size from the car's documents.
4. Tax calculations cover selected passenger-car cases and do not confirm classification or transitional eligibility.
5. The GEL 480 standard-fee amount is a stored snapshot, not live data.
6. Shipping prices and exchange rates must be checked and entered by the user.
7. The current planner does not save an estimate to a user account. The account area is retained for legacy estimates.
8. The account session implementation uses browser storage rather than an HttpOnly cookie.
9. Browser-level and authenticated account testing must be repeated against the exact release before those flows can be described as verified.

The project is intentionally focused. The priority is to make the VIN data, assumptions, cost breakdown and limitations reliable and understandable before adding more services.

## License

There is no license file in this repository. Public visibility does not itself grant permission to reuse or redistribute the source code.
