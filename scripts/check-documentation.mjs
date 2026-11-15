import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [readme, manualQa, privacy, terms, account, home, vinPage, planner] = await Promise.all([
  readFile(new URL("../README.md", import.meta.url), "utf8"),
  readFile(new URL("../docs/MANUAL_QA.md", import.meta.url), "utf8"),
  readFile(new URL("../src/app/privacy-policy/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/terms/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/account/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/vin-check/page.tsx", import.meta.url), "utf8"),
  readFile(new URL("../src/app/vehicle-import/page.tsx", import.meta.url), "utf8")
]);

assert.match(readme, /student-built project about one practical part of buying a car/i);
assert.match(readme, /VIN lookup/i);
assert.match(readme, /vehicle-import planner/i);
assert.match(readme, /does not retrieve live freight prices/i);
assert.match(readme, /GEL 480/i);
assert.match(readme, /does not save estimates to an account/i);
assert.match(readme, /npm run check:docs/);
assert.match(readme, /docs\/MANUAL_QA\.md/);
assert.match(readme, /NHTSA vPIC/i);
assert.doesNotMatch(readme, /General import calculator \|/i);
assert.doesNotMatch(readme, /Vehicle comparison \|/i);
assert.doesNotMatch(readme, /Shipping quote comparison \|/i);

assert.match(manualQa, /VIN-to-import hand-off/i);
assert.match(manualQa, /Tax rules and calculation boundaries/i);
assert.match(manualQa, /320 px/i);
assert.match(manualQa, /Release checks/i);
assert.doesNotMatch(manualQa, /^## 1\. General import calculator$/m);
assert.doesNotMatch(manualQa, /^## 4\. Vehicle comparison$/m);

assert.match(privacy, /November 15, 2026/);
assert.match(privacy, /VIN is therefore shared with NHTSA/);
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
assert.match(planner, /Known costs so far/i);

console.log("Documentation consistency checks passed.");
