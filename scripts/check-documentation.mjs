import assert from "node:assert/strict";
import { Console } from "node:console";
import { readFile } from "node:fs/promises";
import process from "node:process";
import { URL } from "node:url";

const output = new Console(process.stdout, process.stderr);

const [readme, manualQa, privacy, terms, account, home, vinPage, planner, vercelConfig, siteHeader, authClient, passwordResetRoute] = await Promise.all([
  readFile(new URL("../README.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/MANUAL_QA.md", import.meta.url), "utf8"),
  readFile(new URL("../src/app/privacy-policy/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/terms/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/vin-check/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/vehicle-import/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../vercel.json", import.meta.url), "utf8"),
  readFile(new URL("../src/components/SiteHeader.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/lib/auth.ts", import.meta.url), "utf8"),
  readFile(new URL("../src/app/api/account/password-reset/route.ts", import.meta.url), "utf8")
]);

assert.match(readme, /student-built project about one practical part of buying a car/i);
assert.match(readme, /vehicle identification/i);
assert.match(readme, /vehicle-import planner/i);
assert.match(readme, /retrieve live freight prices/i);
assert.match(readme, /GEL 480/i);
assert.match(readme, /does not save estimates to an account/i);
assert.match(readme, /npm run check:docs/);
assert.match(readme, /docs\/MANUAL_QA\.md/);
assert.match(readme, /NHTSA vPIC/i);
assert.match(readme, /CarsXE International VIN Decoder/i);
assert.match(readme, /CARSXE_API_KEY/i);
assert.match(readme, /Cardog Japanese chassis lookup/i);
assert.match(readme, /CARDOG_API_KEY/i);
assert.match(readme, /Automatic Vercel deployments are restricted to `main`/);
assert.match(vercelConfig, /"\*\*": false/);
assert.match(vercelConfig, /"main": true/);
assert.match(readme, /frame\/chassis number/i);
assert.match(planner, /useState<number \| null>\(null\)/);
assert.match(planner, /hasValidManufactureYear\(year, declarationYear\)/);
assert.match(vinPage, /Japanese domestic frame\/chassis number/i);
assert.match(vinPage, /Cardog/i);
assert.match(vinPage, /identifierType/);
assert.match(vinPage, /internationalProviderConfigured/);
assert.match(vinPage, /identifier-status/);
assert.match(vinPage, /Use these details in the import estimate/);
assert.doesNotMatch(vinPage, /NHTSA vPIC|CarsXE|Cardog Japanese chassis lookup/);
assert.match(siteHeader, /href: "\/account", label: "Sign in"/);
assert.doesNotMatch(siteHeader, /Create account|mode=signup/);
assert.match(account, /New to Portavero\? Create an account/);
assert.match(account, /mode === "signup"/);
assert.match(authClient, /\/api\/account\/password-reset/);
assert.match(passwordResetRoute, /SUPABASE_SECRET_KEY/);
assert.match(passwordResetRoute, /auth\/v1\/admin\/users/);
assert.match(passwordResetRoute, /auth\/v1\/recover/);
assert.match(passwordResetRoute, /user_not_found/);
assert.match(passwordResetRoute, /rateLimited|isRateLimited/);
assert.doesNotMatch(readme, /General import calculator \|/i);
assert.doesNotMatch(readme, /Vehicle comparison \|/i);
assert.doesNotMatch(readme, /Shipping quote comparison \|/i);

assert.match(manualQa, /VIN-to-import hand-off/i);
assert.match(manualQa, /Tax rules and calculation boundaries/i);
assert.match(manualQa, /320 px/i);
assert.match(manualQa, /Release checks/i);
assert.match(manualQa, /feature-branch pushes do not create Vercel deployments/);
assert.doesNotMatch(manualQa, /^## 1\. General import calculator$/m);
assert.doesNotMatch(manualQa, /^## 4\. Vehicle comparison$/m);

assert.match(privacy, /November 15, 2026/);
assert.match(privacy, /technical specifications/);
assert.match(privacy, /CarsXE International VIN Decoder/);
assert.match(privacy, /Cardog/);
assert.match(privacy, /CARDOG_API_KEY/);
assert.match(privacy, /current vehicle-import planner does not save estimates to an account/i);

assert.match(terms, /November 15, 2026/);
assert.match(terms, /not a live fee lookup/i);
assert.match(terms, /does not save estimates to that account area/i);

assert.doesNotMatch(account, /function handleLoad/);
assert.doesNotMatch(account, />Load<\/button>/);
assert.match(account, /cannot be loaded into the current planner/i);
assert.match(account, /href="\/vehicle-import"/);

assert.match(home, /Check a car's VIN/i);
assert.match(vinPage, /vehicle details/i);
assert.match(planner, /Known total so far/i);

output.log("Documentation consistency checks passed.");
