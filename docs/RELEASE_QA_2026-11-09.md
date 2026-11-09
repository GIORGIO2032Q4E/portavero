# Production QA record

**Date:** 9 November 2026  
**Environment:** https://portavero.vercel.app  
**Production commit tested:** `bfb52fc122b8cab30ded55c65a566f0e38c42e89`  
**Production deployment:** `dpl_5Hva4AbTBQzyZfooDN6t9fSwinhA`  
**Automated CI run:** [GitHub Actions #42594952000](https://github.com/GIORGIO2032Q4E/portavero/actions/runs/42594952000)

This is a record of checks actually run against the live deployment. It is not a claim that every feature or account journey has been fully verified.

## Passed checks

| Area | What was checked | Result |
| --- | --- | --- |
| Route availability | Home, About, How It Works, general calculator, vehicle planner, catalogue, VIN check, comparison, shipping, account, privacy policy and terms | All 12 returned HTTP 200 |
| Site metadata routes | `/robots.txt` and `/sitemap.xml` | Both returned HTTP 200 with the expected content types |
| Responsive layout | Main routes at 1440 px, 390 px and 320 px viewport widths | No horizontal document/body overflow observed |
| Browser runtime | Chromium checks across the main routes | No uncaught page errors or console errors recorded |
| Keyboard navigation | Skip link receives focus on the first Tab press; mobile menu opens and Escape closes it | Passed at 390 px viewport |
| VIN form | Submit `1HGCM82633A004352` through the live form | NHTSA technical result rendered in the page: Honda Accord, model year 2003 |
| VIN API validation | Submit a short malformed VIN | HTTP 400 returned before an upstream decode |
| Comparison print | Generate an A4 landscape PDF using Chromium print mode | PDF generated; site header, footer and skip link hidden in print mode |
| HTTP security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS and `X-Powered-By` | Expected values present; powered-by header absent |
| Supabase service | Auth health endpoint, using the configured public key | HTTP 200 |
| Supabase anonymous access | Anonymous select on `saved_estimates`; attempted anonymous insert using a dummy user ID | Select returned no rows; insert was rejected by row-level security |
| Dependency/security checks | CI dependency audit | No reported npm vulnerabilities in the recorded run |
| Build and code checks | Dependency audit, ESLint, TypeScript, unit tests, Next.js production build and production-server smoke tests | All passed in the recorded CI run |

The responsive sweep measured the document and body scroll widths at each viewport. It did not emulate every phone model, browser or operating system.

## Not yet verified

- Account registration, sign-in, email confirmation and password recovery using a real test inbox.
- Save, load and delete of an estimate while signed in.
- Cross-account isolation using two separate authenticated test users. The anonymous probe does not replace that test.
- Vehicle-tax results against a complete set of current official Revenue Service cases.
- Printed PDF pagination and readability on a physical printer and across other browsers.
- Manual testing of every calculator input combination and every catalogue vehicle variant.

No real user account was created or modified for this QA run. The anonymous RLS probe used a dummy user ID and was rejected.

## How to interpret this record

The production route, browser, VIN and service checks establish a useful baseline. They do not turn the prototype into a customs authority, vehicle-history service or commercial import platform. Tax rules, fixed fee amounts, provider-entered shipping offers and manufacturer-submitted VIN fields must still be checked against their original sources.
