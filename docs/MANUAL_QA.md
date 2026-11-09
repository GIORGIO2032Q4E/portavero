# Manual QA checklist

This document is a repeatable checklist for checking Portavero in a browser. It is a test plan, not a claim that every scenario has already been run. Record the browser, device, date and result when performing a check.

## Test record

| Field | Value |
| --- | --- |
| Date |  |
| Tester |  |
| Browser and version |  |
| Operating system / device |  |
| Commit tested |  |
| Environment (local / preview / production) |  |

For each case, record **Pass**, **Fail**, **Blocked** or **Not run**, and include a short note or screenshot reference. Do not enter real passwords, personal documents or payment details while testing.

## 1. General import calculator

- [ ] Open `/calculator`. Confirm the page loads without a console or visible runtime error.
- [ ] Leave all cost fields blank. Confirm blank values are shown as not entered and that the known-cost subtotal is zero rather than a populated estimate.
- [ ] Enter a purchase price and freight amount in USD. Confirm the known-cost subtotal is their sum.
- [ ] Enter a duty rate only. Confirm duty is calculated from the entered customs-value categories and VAT/GST remains unavailable until both rates are present.
- [ ] Enter both duty and VAT/GST rates. Check the displayed breakdown against a hand calculation using the formula documented in `src/lib/import-costs.mjs`.
- [ ] Leave one customs-value category blank. Confirm the page identifies the missing category and warns that the customs value may be understated.
- [ ] Enter a confirmed zero. Confirm it is treated as entered, not as a missing value.
- [ ] Enter a negative value, too many decimal places or an unusually large value. Confirm the field rejects it and the combined total is not presented as valid.
- [ ] Change currency. Confirm the calculator explains that entered amounts are cleared rather than relabelled.
- [ ] Save an estimate, reload the page, load it, edit it and save the change. Confirm local browser storage reflects the change.
- [ ] Delete a saved estimate and confirm it is removed.
- [ ] Print or save the result as PDF. Check that the summary and breakdown are readable and that form controls are not printed.

## 2. Vehicle import planner and catalogue

- [ ] Open `/vehicle-import` with a fresh browser session. Confirm no 2,000 cm³ capacity or tax estimate is silently assumed before a vehicle is selected or a capacity entered.
- [ ] Choose a make and model with a single known catalogue variant. Select the engine and confirm its capacity and fuel type appear.
- [ ] Change the make after selecting an engine. Confirm the old model, engine, capacity and hybrid/classic flags are cleared.
- [ ] Change the model after selecting an engine. Confirm the old engine selection and capacity are cleared.
- [ ] Choose a catalogue entry whose engine capacity varies by year or market. Confirm the planner requires manual capacity entry and does not calculate from a guessed default.
- [ ] Enter a valid whole-number capacity from the vehicle's documents. Confirm the estimate becomes available.
- [ ] Change the manual vehicle type to Hybrid, Non-hybrid and Classic. Confirm the catalogue engine selection and capacity are cleared, then enter a capacity and confirm the selected type remains set.
- [ ] Select an electric catalogue variant. Confirm the capacity field is treated as electric and the displayed estimate is clearly marked as limited and subject to official verification.
- [ ] Try an invalid or blank engine capacity. Confirm the page does not present it as a valid estimate.
- [ ] Check vehicle age at the supported boundary years, including ages 6 and 7. Compare the displayed rate with the source code and current official material.
- [ ] For a current-regime vehicle older than 6 years, confirm the page shows the GEL 4.50/cm³ base excise band and does not describe age alone as a general registration ban. Check emissions, vehicle category and registration requirements separately.
- [ ] Check left-hand-drive hybrid and right-hand-drive/converted cases. Confirm the correct warning and estimate are displayed for the selected inputs.
- [ ] Check a classic-car selection at 30 and 31 years. Confirm the age threshold and legal-classification warning are visible.
- [ ] Select the previous regime. Confirm the page explains that transitional eligibility must be independently established from the required documents.
- [ ] Enter purchase, auction, transport, shipping, insurance, port and delivery costs. Confirm the subtotal adds entered amounts once and identifies blank categories.
- [ ] Confirm the result includes the listed GEL 480 fee snapshot once. Verify the current fee schedule with the Revenue Service before treating it as current.
- [ ] Save a candidate for comparison. Confirm the saved record contains the selected vehicle and cost information.
- [ ] Print or save the vehicle estimate as PDF. Check that the selected details, warnings and cost breakdown are readable.

## 3. VIN decoder

Use a test VIN only. A correctly shaped VIN is not proof that a vehicle exists.

- [ ] Open `/vin-check`. Confirm the form explains the difference between technical data and vehicle history.
- [ ] Submit an empty value, a short value, a long value and a value containing I, O or Q. Confirm local validation blocks each invalid value.
- [ ] Submit a known test VIN. Confirm the route returns available technical fields and displays the NHTSA vPIC source link.
- [ ] Select U.S. market for the known U.S. test VIN. Confirm the local position-nine check-digit result matches; change one character in position nine and confirm it warns but still allows the NHTSA request.
- [ ] Leave the market as "Not sure / another market" for a non-U.S. VIN. Confirm the U.S. check-digit formula is not applied and the VIN is still submitted for decoding.
- [ ] Use a provider response with some technical fields but no make/model. Confirm the page shows it as partial data instead of discarding it as a total failure.
- [ ] Edit the VIN after a result is shown. Confirm the old result and error are cleared. Confirm the VIN input cannot change while a request is in progress.
- [ ] Test malformed upstream JSON, an empty Results array, a rate-limit response and a timeout. Confirm each produces a distinct, readable error.
- [ ] Check a VIN with an NHTSA warning, where available. Confirm the warning is visible and the page does not suppress it.
- [ ] Test a VIN that the provider cannot decode. Confirm the page reports that no usable technical result was returned.
- [ ] Simulate or test an unavailable provider/network. Confirm a clear error appears and no vehicle-history result is invented.
- [ ] Confirm the page does not call a missing history record “clean” and does not display accident, title, ownership, odometer, service or auction data as if retrieved.

## 4. Vehicle comparison

- [ ] Save one candidate from the vehicle planner. Confirm it appears on `/compare`.
- [ ] Save a second candidate with different costs and specifications. Confirm both appear side by side.
- [ ] Save up to four candidates. Confirm the limit is enforced and the page explains how to remove an item.
- [ ] Remove one candidate. Confirm the remaining candidates stay in the list.
- [ ] Clear the list. Confirm it becomes empty.
- [ ] Reload the page. Confirm browser-saved candidates remain available in the same browser.
- [ ] Enter a VIN and history note in a candidate. Confirm the page labels them as recorded or user-entered, not verified history.
- [ ] Test malformed stored data in a disposable browser profile or test harness. Confirm invalid entries are skipped without crashing the comparison page.
- [ ] Load a legacy comparison entry containing the retired `registrationRestricted` field. Confirm it remains readable and the old age-ban flag is not shown as a current restriction.
- [ ] Confirm candidates do not appear on another browser/device or automatically sync to an account.
- [ ] Print or save the comparison as PDF with one to four candidates. Check that the landscape table fits the page, column headings repeat when it spans multiple pages, long notes remain readable and controls are excluded.

## 5. Shipping checklist and quote comparison

- [ ] Open `/shipping`. Confirm the page labels the tool as a checklist and manual comparison, not live market data.
- [ ] Enter two valid quotes in the same currency. Confirm the lower entered price is identified.
- [ ] Enter quotes in different currencies. Confirm they are not ranked against each other.
- [ ] Enter an optional transit-day value with a fraction or negative number. Confirm it is flagged as invalid.
- [ ] Toggle insurance included. Confirm the status is reflected in the comparison.
- [ ] Reload or navigate away and return. Confirm the manual quotes are not represented as saved.
- [ ] Confirm no provider is contacted and no freight rate is fetched by the tool.

## 6. Account and saved estimates (requires a configured Supabase test project)

Do not perform these tests against production user accounts or real user data.

- [ ] Confirm the account page clearly reports when Supabase is not configured.
- [ ] In a test Supabase project, create a test account and sign in.
- [ ] Save a new general estimate while signed in. Confirm a cloud record appears in the account page.
- [ ] Sign out and sign in again. Confirm the account can list its own saved estimate.
- [ ] Load a cloud estimate into the general calculator and confirm the data is copied into local browser storage.
- [ ] Delete the cloud estimate and confirm it is removed from the account list.
- [ ] Test password reset using a test mailbox and the configured redirect URL.
- [ ] Check Supabase row-level security with two separate test users. Confirm one user cannot read, update or delete the other user's estimate.
- [ ] Confirm browser sign-out clears the local session. Remember that the current prototype stores the session in localStorage rather than an HttpOnly cookie.

If Supabase is paused, missing schema or unavailable, mark the scenario **Blocked**. Do not claim the test passed because the UI loaded.

## 7. Accessibility, responsive layout and browser checks

- [ ] Navigate the primary pages using only the keyboard. Check visible focus, logical tab order and Escape behavior for the mobile navigation.
- [ ] Confirm every form control has a visible label and validation errors are announced or associated with their fields.
- [ ] Check the main pages at approximately 320 px, 390 px, tablet width and desktop width. Look for horizontal overflow, clipped buttons and overlapping content.
- [ ] Use browser zoom at 200%. Confirm main content remains usable.
- [ ] Confirm the skip link moves focus to the main content.
- [ ] Check the main routes in a second modern browser if available.
- [ ] Check the browser console and network panel for unhandled errors or failed requests during the main user journeys.

## 8. Release checks

- [ ] Run `npm ci`.
- [ ] Run `npm audit --audit-level=moderate`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Check the GitHub Actions result for the exact commit being released.
- [ ] Check the Vercel deployment state and the production routes after deployment.
- [ ] Review the README, privacy page and terms page against the code that is actually deployed.

## Notes and defects

| Test case | Result | Notes / evidence | Follow-up |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
