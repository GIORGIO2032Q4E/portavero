# Production QA record

**Date:** 9 November 2026  
**Environment:** https://portavero.vercel.app  
**Production commit tested:** `849b64968966f106bd57970b3cbba1471df3d0d9`  
**Production deployment:** `dpl_FJWdJWKBcLBNKpufCC7P1UkqAfbJ`  
**Automated CI run:** [GitHub Actions #42596372846](https://github.com/GIORGIO2032Q4E/portavero/actions/runs/42596372846)

This record separates checks completed against the live site from checks that remain unverified. A successful page response is not proof that every interactive feature or account workflow works.

## Passed checks

| Area | What was checked | Result |
| --- | --- | --- |
| Route availability | Home, About, How It Works, general calculator, vehicle planner, catalogue, VIN check, comparison, shipping, account, privacy policy and terms | All 12 returned HTTP 200 |
| Site metadata routes | `/robots.txt` and `/sitemap.xml` | Both returned HTTP 200 with expected content types |
| Responsive layout | Main routes at 1440 px, 390 px and 320 px viewport widths | No horizontal document/body overflow observed |
| Browser runtime | Chromium checks across the main routes | No uncaught page errors or console errors recorded |
| Keyboard navigation | Skip link receives focus on first Tab press; mobile menu opens and Escape closes it | Passed; mobile menu checked at 390 px and 320 px |
| VIN form | Submit `1HGCM82633A004352` through the live form | NHTSA technical result rendered: Honda Accord, model year 2003 |
| VIN API validation | Submit a short malformed VIN | HTTP 400 returned before an upstream decode |
| Comparison print | Generate an A4 landscape PDF using Chromium print mode | PDF generated; site header, footer and skip link hidden in print mode |
| HTTP security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS and `X-Powered-By` | Expected values present; powered-by header absent |
| Supabase service | Auth health endpoint, using the configured public key | HTTP 200 |
| Supabase anonymous access | Anonymous select on `saved_estimates`; attempted anonymous insert using a dummy user ID | Select returned no rows; insert was rejected by row-level security |
| Build and code checks | Dependency audit, ESLint, TypeScript, unit tests, Next.js production build and production-server smoke tests | All passed in the recorded CI run |

The production-server smoke test covers the 12 HTML routes above, the two metadata endpoints, baseline security headers and local rejection of an invalid VIN. The browser checks are a separate, manually run Chromium sweep. The responsive sweep measured document/body scroll widths; it did not emulate every phone model, browser or operating system.

## Not yet verified

- Account registration, sign-in, email confirmation and password recovery using a real test inbox.
- Save, list, load and delete of an estimate while signed in.
- Cross-account isolation using two separate authenticated test users. The anonymous RLS probe does not replace this test.
- Vehicle-tax results against a complete set of current official Revenue Service cases.
- Printed PDF pagination and readability on a physical printer and across other browsers.
- Manual testing of every calculator input combination and every catalogue vehicle variant.
- A full browser and device compatibility matrix.

No real user account was created or modified for this QA run. The anonymous RLS probe used a dummy user ID and was rejected. The authenticated account flows above must not be described as tested until those tests are completed.

## How to interpret this record

These checks establish a useful production baseline, not a guarantee that the application is error-free. The vehicle planner is an estimate, not a customs assessment. The VIN feature reports technical fields returned by NHTSA vPIC; it does not provide accident, title, ownership, odometer, service or auction history. Shipping offers and entered prices are not independently verified. Tax rules, fixed fee amounts and provider-submitted vehicle data must be checked against their original sources before making a purchase or import decision.
