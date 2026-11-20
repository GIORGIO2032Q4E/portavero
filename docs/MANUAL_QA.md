# Manual QA plan

This is a repeatable test plan for the current Portavero car-import workflow. It is not a record of completed tests. Mark each case **Pass**, **Fail**, **Blocked** or **Not run**, and record evidence for any result claimed as passed.

Do not use real passwords, payment information, identity documents or private vehicle records during testing.

## Test record

| Field | Value |
| --- | --- |
| Date and time | |
| Tester | |
| Commit SHA | |
| Environment (local / preview / production) | |
| Browser and version | |
| Operating system and device | |
| Viewport size(s) | |

## 1. Home page and navigation

- [ ] Open `/`. Confirm the page explains the VIN-to-import-estimate workflow without promising vehicle-history data or live shipping prices.
- [ ] Follow the primary action. Confirm it opens `/vin-check`.
- [ ] Open the mobile navigation. Confirm the menu opens and closes, including with Escape.
- [ ] Use the keyboard to reach all visible navigation links and the primary action. Confirm focus is visible.
- [ ] Follow About, How it works, Vehicle catalogue, Shipping, Privacy and Terms links. Confirm each route loads and its wording matches the current car-focused product.
- [ ] Open `/calculator` and `/compare` directly. Confirm both compatibility routes redirect to `/vehicle-import`.
- [ ] Confirm the removed currency-converter page and exchange-rate API return 404.

## 2. VIN validation and lookup

Use public test VINs only. A correctly shaped VIN is not proof that a vehicle exists.

- [ ] Open `/vin-check`. Confirm the form explains that it looks up technical specifications, not vehicle history.
- [ ] Submit an empty value, a short value, a long value and values containing I, O or Q. Confirm local validation blocks each malformed value.
- [ ] Submit a known test VIN such as `1HGCM82633A004352`. Confirm the page shows only fields returned by the provider and identifies the data source.
- [ ] Confirm a partially decoded response is presented as partial data, not as a complete vehicle specification.
- [ ] Confirm provider warnings appear in readable language and are not hidden by a generic success message.
- [ ] With `CARSXE_API_KEY` configured in a local test environment, use a non-U.S. test VIN supported by CarsXE. Confirm the international provider is called only when the NHTSA result has important gaps or fails.
- [ ] Confirm international data fills only missing NHTSA fields and never overwrites an existing NHTSA value.
- [ ] Confirm an unavailable or invalid CarsXE response leaves usable NHTSA data visible and does not expose the API key or provider diagnostics.
- [ ] Without `CARSXE_API_KEY`, confirm the checker clearly identifies that international fallback is not configured when displaying a VIN result.
- [ ] Edit the VIN after a result. Confirm the old result and error are cleared before the next lookup.
- [ ] Confirm the input cannot be submitted repeatedly while a lookup is in progress.
- [ ] Test an invalid JSON response, empty result, provider no-data response, rate-limit response, upstream server error and request timeout using a mock or controlled test.
- [ ] Confirm each upstream failure produces a useful message and does not expose raw provider diagnostics.
- [ ] For a U.S.-market test VIN, check the position-nine result. Confirm the check-digit message is advisory and does not claim global validity.
- [ ] For a non-U.S. or unknown-market VIN, confirm the U.S. check-digit formula is not treated as a universal rule.
- [ ] Confirm the page never labels absent history as clean and never invents accident, title, mileage, ownership, service, auction or photo data.
- [ ] Select Japanese domestic frame/chassis number and confirm the U.S. check-digit selector is hidden and the correct CODE-SERIAL help text is shown.
- [ ] Test a public example such as `ZRR80-0143041` with `CARDOG_API_KEY` configured. Confirm the Cardog source is identified and only fields present in its response are shown.
- [ ] Confirm an ambiguous chassis response lists candidates and does not select one model or engine automatically.
- [ ] Confirm a single engine candidate may pass its reported displacement to the planner, while multiple engine candidates leave the calculator capacity blank.
- [ ] Confirm a published production window is displayed as a window and never copied into the manufacture-year field.
- [ ] Without `CARDOG_API_KEY`, confirm a clear not-configured message appears and no external chassis lookup is attempted.
- [ ] Test malformed chassis identifiers, provider no-match, credit-limit, rate-limit, timeout and invalid-response cases.

## 3. VIN-to-import hand-off

- [ ] Decode a test VIN with make, model and year available. Continue to the planner and confirm those values arrive in the corresponding fields.
- [ ] When engine capacity is returned, confirm the value is passed as cm³ and is visible for review before relying on it.
- [ ] When fuel/electrification fields are returned, confirm the planner applies the mapped value only when the source data is clear.
- [ ] When steering side is returned, confirm it is passed through. When it is missing or unclear, confirm the planner requires the user to choose it.
- [ ] Use a VIN with missing make, model, year or engine data. Confirm missing values remain missing and are not replaced with guessed defaults.
- [ ] Confirm a decoded make/model that does not match the local catalogue remains reviewable and does not silently select an unrelated vehicle.
- [ ] Confirm Japanese frame/chassis numbers are handled through the separate identifier option, not sent to the standard VIN endpoints.
- [ ] Change every auto-filled value to match a vehicle document. Confirm the user's correction is retained and the tax estimate responds to the corrected input.
- [ ] Confirm VIN information is presented as provider-supplied technical data, not as proof that the physical vehicle matches the decoded record.
- [ ] For a Japanese chassis result, confirm the hand-off does not include a fabricated VIN or manufacture year. Only a unique make/model/engine result may be passed on; uncertain data remains for manual confirmation.

## 4. Vehicle-import planner inputs

- [ ] Open `/vehicle-import` with a clean session. Confirm the manufacture year is blank, no arbitrary year is assumed and no tax estimate or final total is shown until a valid year is entered.
- [ ] Pass a VIN with no model year to the planner. Confirm the manufacture-year field remains blank and must be completed manually.
- [ ] Select a make, model and single-capacity engine variant. Confirm the selected capacity and fuel details appear.
- [ ] Change the make after selecting a model and engine. Confirm dependent model, engine, capacity and relevant vehicle-type selections reset.
- [ ] Change the model after selecting an engine. Confirm the old engine selection and capacity are cleared.
- [ ] Select a catalogue entry with varying capacity across years or markets. Confirm the user must enter the documented engine capacity instead of receiving a guessed value.
- [ ] Enter a valid whole-number engine capacity from a vehicle document. Confirm the planner can calculate the supported estimate.
- [ ] Try blank, negative, fractional, excessively large and malformed monetary/capacity inputs. Confirm invalid values do not enter totals.
- [ ] Confirm a confirmed zero amount differs from an empty field.
- [ ] Confirm the planner requires a steering selection where it affects the selected tax case.
- [ ] Confirm uncertain fuel data requires confirmation and is not silently treated as non-hybrid.
- [ ] Confirm an unknown or unsupported vehicle configuration is not presented as a verified tax result.

## 5. Tax rules and calculation boundaries

Compare expected results with the exact current implementation and official source material. Do not treat this checklist as proof that a legal rule is current.

- [ ] Check the age calculation at declaration year minus manufacture year, including ages 0, 6 and 7.
- [ ] For the current regime, confirm the base excise rate boundary between age 6 and age 7.
- [ ] Check right-hand-drive or converted vehicle adjustment.
- [ ] Check the left-hand-drive hybrid reduction only for the age range supported by the implementation.
- [ ] Check electric-vehicle cases, including the right-hand-drive/converted case.
- [ ] Check classic-car treatment at 30 and 31 years and confirm the legal-classification warning is visible.
- [ ] Check import duty against the implementation formula for a conventional passenger car.
- [ ] Select the previous regime. Confirm the interface says this is only for eligible transitional cases and the user must independently check the documents.
- [ ] Confirm the previous regime is not selected automatically from the vehicle's age or origin.
- [ ] Confirm the planner identifies its selected tax scope and directs users to the Revenue Service for exact classification and assessment.
- [ ] Confirm GEL 480 in listed standard fees is included once, and the page identifies the amount as a stored snapshot rather than a live lookup.
- [ ] For a declaration year in the future, confirm the page warns that tax rules and fees may change before that year.
- [ ] Confirm unsupported classifications and exceptions are not silently treated as covered.

## 6. Import-cost inputs and total

- [ ] Enter purchase price, auction fees, inland transport, international shipping, insurance, port charges and local delivery.
- [ ] Confirm each entered cost appears in the correct line and is counted only once.
- [ ] Leave one or more costs blank. Confirm the page identifies the unknown categories and does not call them free.
- [ ] Enter a confirmed zero. Confirm it is counted as an entered amount.
- [ ] Enter a negative amount, more than two decimal places or an amount outside the safe range. Confirm the invalid field is identified and the overall total is withheld.
- [ ] Check the known-cost subtotal with a hand calculation.
- [ ] Check the displayed tax and fee lines with a hand calculation based on the selected inputs.
- [ ] Confirm the final label distinguishes known user-entered costs and selected estimates from a guaranteed final landed cost.
- [ ] Confirm foreign-currency amounts are not silently converted. The user must enter a checked GEL equivalent.
- [ ] Confirm that broker charges, storage, repair costs, special handling or other unentered items are not implied to be included.
- [ ] Print or save the planner as PDF. Check selected vehicle details, tax notes, known costs, unknown categories and disclaimers for readability.

## 7. Vehicle catalogue and shipping guide

- [ ] Search the vehicle catalogue by make, model, engine label and fuel type.
- [ ] Confirm the result count changes with the search and an empty search result has a usable recovery action.
- [ ] Confirm catalogue entries are described as common variants, not a complete or VIN-verified global database.
- [ ] Follow the action from a catalogue entry to the vehicle-import planner.
- [ ] Open `/shipping`. Confirm the page describes a checklist and manual quote comparison, not live market rates.
- [ ] Compare two quotes in the same currency. Confirm the comparison uses the amounts entered.
- [ ] Enter quotes in different currencies. Confirm they are not ranked as directly comparable.
- [ ] Test invalid transit-day values and insurance toggles.
- [ ] Navigate away and return. Confirm temporary quotes are not represented as saved or verified.

## 8. Legacy account area (optional; requires a configured test Supabase project)

The account page is retained for older saved estimates. The current vehicle-import planner does not save estimates to this account area.

- [ ] Without Supabase configuration, confirm the page explains that account functions are not configured.
- [ ] Use a dedicated test project and test mailbox. Do not use a real user's account.
- [ ] Test account creation, email confirmation, sign-in and sign-out.
- [ ] Submit a password reset for a non-existent email and confirm a clear not-found error is shown and no email is sent.
- [ ] Submit a password reset for an existing test account and confirm the reset email reaches its mailbox, the link opens the new-password form and the password can be changed.
- [ ] Confirm password reset fails clearly when the private server key or email provider is not configured.
- [ ] Confirm older saved records can be listed and deleted.
- [ ] Confirm the interface does not imply old general-import records can be loaded into the current vehicle planner.
- [ ] Check row-level security with two separate test users. Confirm one user cannot read, update or delete the other user's records.
- [ ] Confirm failure to reach Supabase is clearly reported and does not look like a successful save.
- [ ] Remember that the current session implementation uses browser storage rather than an HttpOnly cookie.

Mark tests **Blocked** when the test project, database schema, email delivery or required test account is unavailable. A loaded account page alone does not prove that an account flow passed.

## 9. Responsive, accessibility and browser checks

- [ ] Test the home page, VIN form, vehicle planner, catalogue and shipping guide at 320 px, 390 px, tablet and desktop widths.
- [ ] Confirm there is no horizontal overflow, clipped button, overlapped text or inaccessible input.
- [ ] Navigate the main workflow with keyboard only. Confirm focus order is logical and visible.
- [ ] Confirm the skip link moves focus to the main content.
- [ ] Confirm every field has a visible label and important errors are announced or associated with the field.
- [ ] Check at 200% browser zoom.
- [ ] Check a second modern browser if available.
- [ ] Inspect the browser console and network panel during VIN lookup and planner use for unhandled errors or unexpected requests.

## 10. Release checks

Run the repository checks on the exact candidate commit:

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

- [ ] Confirm the GitHub Actions run belongs to the exact release commit and every required job passed.
- [ ] Confirm GitHub Actions validates the pull request, including lint, types, unit tests, docs, build and smoke tests.
- [ ] Confirm feature-branch pushes do not create Vercel deployments; automatic Vercel deployment is reserved for `main`.
- [ ] After merge, confirm the Vercel production deployment is for the same `main` commit and is marked READY.
- [ ] Open the production site and verify the main workflow in a browser.
- [ ] Check the converter routes remain removed and legacy redirects work.
- [ ] Review the README, privacy policy, terms and manual QA plan against the actual deployed feature set.
- [ ] Add a dated release record. Separate automated test results from manual browser checks and list anything not run or blocked.

## Results and defects

| Test case | Result | Evidence / notes | Follow-up |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |
