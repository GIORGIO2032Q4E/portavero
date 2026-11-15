import test from "node:test";
import assert from "node:assert/strict";
import { convertUsdGel, getUnitRate } from "./currency.mjs";

test("converts USD to GEL using the official rate", () => {
  assert.equal(convertUsdGel(100, 2.5, "USD_TO_GEL"), 250);
});

test("converts GEL to USD using the inverse rate", () => {
  assert.equal(convertUsdGel(250, 2.5, "GEL_TO_USD"), 100);
});

test("supports zero without treating it as missing", () => {
  assert.equal(convertUsdGel(0, 2.5, "USD_TO_GEL"), 0);
});

test("rejects negative and non-finite amounts", () => {
  assert.equal(convertUsdGel(-1, 2.5, "USD_TO_GEL"), null);
  assert.equal(convertUsdGel(Number.NaN, 2.5, "USD_TO_GEL"), null);
  assert.equal(convertUsdGel(Infinity, 2.5, "GEL_TO_USD"), null);
});

test("rejects invalid rates and directions", () => {
  assert.equal(convertUsdGel(10, 0, "USD_TO_GEL"), null);
  assert.equal(convertUsdGel(10, 2.5, "OTHER"), null);
});

test("normalizes rates quoted for multiple units", () => {
  assert.equal(getUnitRate(2.5, 1), 2.5);
  assert.equal(getUnitRate(25, 10), 2.5);
});

test("rejects invalid rate quantities", () => {
  assert.equal(getUnitRate(2.5, 0), null);
  assert.equal(getUnitRate(-1, 1), null);
});
