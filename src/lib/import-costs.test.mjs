import test from "node:test";
import assert from "node:assert/strict";
import { IMPORT_COST_KEYS, calculateImportCostSummary } from "./import-costs.mjs";

const blankCosts = () => Object.fromEntries(IMPORT_COST_KEYS.map((key) => [key, null]));

test("all blank costs produce zero known subtotal and show every category as unknown", () => {
  const result = calculateImportCostSummary(blankCosts(), 1, null, null);
  assert.equal(result.knownSubtotal, 0);
  assert.equal(result.enteredCount, 0);
  assert.equal(result.unknownCosts.length, 9);
  assert.equal(result.customsValue, 0);
  assert.equal(result.missingCustomsValue, 5);
  assert.equal(result.importDuty, null);
  assert.equal(result.importVat, null);
  assert.equal(result.estimatedTotal, 0);
  assert.equal(result.perItem, 0);
});

test("confirmed zero is an entered value, not an unknown cost", () => {
  const costs = blankCosts();
  costs.purchase = 0;
  const result = calculateImportCostSummary(costs, 1, 0, 0);
  assert.equal(result.enteredCount, 1);
  assert.equal(result.unknownCosts.length, 8);
  assert.equal(result.missingCustomsValue, 4);
  assert.equal(result.importDuty, 0);
  assert.equal(result.importVat, 0);
});

test("adds known costs, user-entered duty and VAT using the existing formula", () => {
  const costs = {
    purchase: 1000,
    supplier: 50,
    inland: 100,
    freight: 200,
    insurance: 20,
    customs: 100,
    port: 30,
    delivery: 40,
    other: 10
  };
  const result = calculateImportCostSummary(costs, 2, 10, 18);
  assert.equal(result.knownSubtotal, 1550);
  assert.equal(result.customsValue, 1370);
  assert.equal(result.importDuty, 137);
  assert.equal(result.importVat, 289.26);
  assert.ok(Math.abs(result.estimatedTotal - 1976.26) < 1e-9);
  assert.ok(Math.abs(result.perItem - 988.13) < 1e-9);
  assert.equal(result.unknownCosts.length, 0);
});

test("estimates duty while VAT is unavailable until both rates are entered", () => {
  const costs = blankCosts();
  costs.purchase = 1000;
  costs.freight = 100;
  const result = calculateImportCostSummary(costs, 1, 5, null);
  assert.equal(result.customsValue, 1100);
  assert.equal(result.importDuty, 55);
  assert.equal(result.importVat, null);
  assert.equal(result.estimatedTotal, 1155);
});

test("a VAT rate alone does not invent a missing duty rate", () => {
  const costs = blankCosts();
  costs.purchase = 1000;
  const result = calculateImportCostSummary(costs, 1, null, 18);
  assert.equal(result.importDuty, null);
  assert.equal(result.importVat, null);
  assert.equal(result.estimatedTotal, 1000);
});

test("a blank customs-value field is treated as unknown and counted in the warning", () => {
  const costs = blankCosts();
  costs.purchase = 1000;
  costs.freight = 100;
  const result = calculateImportCostSummary(costs, 1, 5, 18);
  assert.equal(result.missingCustomsValue, 3);
  assert.equal(result.customsValue, 1100);
  assert.equal(result.importDuty, 55);
});

test("quantity changes only the displayed average per item, not the total", () => {
  const costs = blankCosts();
  costs.purchase = 100;
  const one = calculateImportCostSummary(costs, 1, 0, 0);
  const four = calculateImportCostSummary(costs, 4, 0, 0);
  assert.equal(one.estimatedTotal, four.estimatedTotal);
  assert.equal(four.perItem, 25);
});

test("does not present a combined total when individually finite costs exceed safe money precision", () => {
  const costs = Object.fromEntries(IMPORT_COST_KEYS.map((key) => [
    key,
    Number.MAX_SAFE_INTEGER / 100
  ]));
  const result = calculateImportCostSummary(costs, 1, 100, 100);
  assert.equal(result.knownSubtotal, null);
  assert.equal(result.customsValue, null);
  assert.equal(result.estimatedTotal, null);
  assert.equal(result.totalUnavailable, true);
});

test("VAT estimate warns through its result state when excise and other taxes are blank", () => {
  const costs = blankCosts();
  costs.purchase = 1000;
  const result = calculateImportCostSummary(costs, 1, 5, 18);
  assert.equal(costs.customs, null);
  assert.equal(result.importDuty, 50);
  assert.equal(result.importVat, 189);
  assert.equal(result.estimatedTotal, 1239);
});
