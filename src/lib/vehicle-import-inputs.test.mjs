import test from "node:test";
import assert from "node:assert/strict";
import { getEngineCapacityForVin, getVehicleAge, hasValidManufactureYear, normalizeEngineCapacityCc } from "./vehicle-import-inputs.mjs";

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


test("normalizes VIN engine capacity to whole cubic centimetres", () => {
  assert.equal(normalizeEngineCapacityCc(2998.832712), 2999);
  assert.equal(normalizeEngineCapacityCc(1496), 1496);
});

test("does not convert missing, non-finite, zero, negative or implausible engine capacities", () => {
  for (const value of [null, undefined, NaN, Infinity, 0, -1, 100001, "2998"]) {
    assert.equal(normalizeEngineCapacityCc(value), null);
  }
});

test("prefers a matched catalogue engine capacity over a rounded VIN figure", () => {
  assert.equal(getEngineCapacityForVin(2998.832712, 2997), 2997);
  assert.equal(getEngineCapacityForVin(2998.832712, null), 2999);
  assert.equal(getEngineCapacityForVin(2998.832712, 0), 2999);
});


test("does not infer engine capacity from the catalogue when VIN data omits displacement", () => {
  assert.equal(getEngineCapacityForVin(null, 2997), null);
  assert.equal(getEngineCapacityForVin(0, 2997), null);
  assert.equal(getEngineCapacityForVin("2998", 2997), null);
});
