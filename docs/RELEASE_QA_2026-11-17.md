# Release QA: 17 November 2026

## Release identity

- Production commit: `c357164ccf2e6d1534813f64c29663410f1b8a03`
- GitHub Actions run: [CI #316](https://github.com/GIORGIO2032Q4E/portavero/actions/runs/44074412290)
- Vercel deployment: [Production deployment](https://vercel.com/xokebi/portavero/F6HbQuLmVb1yVDCJM9kgfW6Zy7so)
- Production deployment state: Ready
- Custom domain `portavero.vercel.app`: reassigned to this deployment

## Automated checks

All checks passed on the merged release commit:

- Dependency audit: 0 vulnerabilities
- ESLint: passed
- TypeScript type-check: passed
- Unit tests: 113 passed, 0 failed
- Documentation consistency: passed
- Production build: passed
- Production smoke tests: passed
  - 10 pages
  - 2 redirects
  - 2 metadata routes
  - Security headers
  - VIN input validation

The dependency audit initially caught a moderate Next.js advisory affecting the previously locked version. Next.js and its lockfile entries were updated to 16.4.6 before merge. The final audit reported zero vulnerabilities.

## Code changes in this release

- Hybrid and plug-in hybrid detection now considers all NHTSA fuel and electrification fields.
- Combined gasoline/electric descriptions from CarsXE are classified as hybrid rather than fully electric.
- Regression tests cover NHTSA values `Hybrid`, `Gasoline/Electric`, and `Plug-in Hybrid`, plus combined CarsXE fuel descriptions.
- Next.js updated from 16.4.2 to 16.4.6.

## Still requires manual verification

These checks are not represented as completed by the automated pipeline:

- Interactive browser testing of VIN lookup and VIN-to-planner hand-off against the live production UI.
- Responsive, keyboard, zoom and print/PDF checks in real browsers.
- Live external-provider edge cases, including rate limits, partial responses and optional CarsXE/Cardog configurations.
- Authenticated Supabase sign-up, sign-in, password reset, saved legacy estimate operations and cross-account isolation.
- Tax edge cases and transitional eligibility against the exact documents for an individual vehicle.

The current vehicle-import planner does not save estimates to an account. The legacy account area remains separate. The tax estimator covers selected passenger-car cases and is not an official customs assessment.

This record distinguishes automated release checks from manual browser and provider tests. It does not claim that the outstanding manual checks were performed.
