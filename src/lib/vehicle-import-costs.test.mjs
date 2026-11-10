import test from "node:test";
import assert from "node:assert/strict";
import { STANDARD_VEHICLE_FEES_GEL, VEHICLE_IMPORT_COST_KEYS, summarizeVehicleImportCosts } from "./vehicle-import-costs.mjs";

const blankCosts = () => Object.fromEntries(VEHICLE_IMPORT_COST_KEYS.map((key) => [key, null]));

test("uses the shared Revenue Service fee snapshot when no fee amount is supplied", () => {
  assert.equal(STANDARD_VEHICLE_FEES_GEL, 480);
  const result = summarizeVehicleImportCosts(blankCosts(), 0, 0);
  assert.equal(result.total, STANDARD_VEHICLE_FEES_GEL);
});

test("blank optional expenses do not count as zero-confirmed entries", () => {
  const result = summarizeVehicleImportCosts(blankCosts(), 3000, 130, 480);
  assert.equal(result.knownCosts, 0);
  assert.equal(result.unknownCosts.length, 7);
  assert.equal(result.total, 3610);
});

test("adds entered costs, taxes supplied by the existing module, and official fees once", () => {
  const costs = {
    purchase: 10000,
    auction: 750,
    inland: 250,
    shipping: 1800,
    insurance: 200,
    port: 300,
    delivery: 150
  };
  const result = summarizeVehicleImportCosts(costs, 3000, 130, 480);
  assert.equal(result.knownCosts, 13450);
  assert.equal(result.unknownCosts.length, 0);
  assert.equal(result.total, 17060);
});

test("confirmed zero amounts are included and not marked unknown", () => {
  const costs = { ...blankCosts(), purchase: 0, shipping: 0 };
  const result = summarizeVehicleImportCosts(costs, 0, 0, 480);
  assert.equal(result.knownCosts, 0);
  assert.equal(result.unknownCosts.length, 5);
  assert.equal(result.total, 480);
});

test("invalid or non-finite expense values prevent a total from being presented", () => {
  for (const value of [-1, Infinity, NaN, "25"]) {
    const result = summarizeVehicleImportCosts({ ...blankCosts(), purchase: value }, 0, 0, 480);
    assert.deepEqual(result.invalidCosts, ["purchase"]);
    assert.equal(result.total, null);
  }
});

test("decimal GEL expenses are counted without changing the tax inputs", () => {
  const result = summarizeVehicleImportCosts({ ...blankCosts(), purchase: 100.25 }, 1.5, 0.05, 480);
  assert.equal(result.knownCosts, 100.25);
  assert.equal(result.total, 581.8);
});

test("a rejected field keeps the total invalid after its value is cleared from calculation", () => {
  const result = summarizeVehicleImportCosts(blankCosts(), 3000, 130, 480, true);
  assert.equal(result.unknownCosts.length, 7);
  assert.equal(result.invalidAmounts, true);
  assert.equal(result.total, null);
});

test("invalid tax amounts and overflowing totals are not presented as valid", () => {
  const invalidTax = summarizeVehicleImportCosts(blankCosts(), Infinity, 0, 480);
  assert.equal(invalidTax.invalidTaxAmounts, true);
  assert.equal(invalidTax.total, null);

  const overflow = summarizeVehicleImportCosts(
    { ...blankCosts(), purchase: Number.MAX_VALUE },
    0,
    0,
    480
  );
  assert.equal(overflow.total, null);
});


test("rejects GEL expenses with more than two decimal places", () => {
  const result = summarizeVehicleImportCosts(
    { ...blankCosts(), purchase: 12.345 },
    0,
    0,
    480
  );
  assert.deepEqual(result.invalidCosts, ["purchase"]);
  assert.equal(result.total, null);
});
