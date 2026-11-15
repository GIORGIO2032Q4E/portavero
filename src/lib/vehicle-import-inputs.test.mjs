import test from "node:test";
import assert from "node:assert/strict";
import { getVehicleAge, hasValidManufactureYear } from "./vehicle-import-inputs.mjs";

test("year validation does not treat a blank manufacture year as a real year", () => {
  assert.equal(getVehicleAge(null, 2026), null);
  assert.equal(hasValidManufactureYear(null, 2026), false);
});

test("calculates age from an explicitly supplied manufacture year", () => {
  assert.equal(getVehicleAge(2020, 2026), 6);
  assert.equal(hasValidManufactureYear(2020, 2026), true);
});

test("rejects a manufacture year after the declaration year", () => {
  assert.equal(getVehicleAge(2027, 2026), null);
  assert.equal(hasValidManufactureYear(2027, 2026), false);
});
