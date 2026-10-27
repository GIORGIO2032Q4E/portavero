import test from "node:test";
import assert from "node:assert/strict";
import { parseNonNegativeNumber } from "./number-input.mjs";

test("empty values remain blank rather than becoming zero", () => {
  assert.deepEqual(parseNonNegativeNumber(""), { value: null, error: null });
});

test("accepts zero and positive amounts at cent precision", () => {
  assert.deepEqual(parseNonNegativeNumber("0"), { value: 0, error: null });
  assert.deepEqual(parseNonNegativeNumber("128.45"), { value: 128.45, error: null });
});

test("rejects negative amounts instead of treating them as valid costs", () => {
  assert.match(parseNonNegativeNumber("-1.25").error, /negative/);
});

test("rejects more decimal places than the selected currency step allows", () => {
  assert.match(parseNonNegativeNumber("10.001").error, /decimal places/);
});

test("whole-number fields reject fractions", () => {
  assert.match(parseNonNegativeNumber("2.5", { step: 1 }).error, /whole number/);
  assert.deepEqual(parseNonNegativeNumber("3", { step: 1 }), { value: 3, error: null });
});

test("JPY-style whole-unit fields do not accept fractional currency units", () => {
  assert.match(parseNonNegativeNumber("25.5", { step: 1 }).error, /whole number/);
});

test("enforces an explicit maximum such as the 100 percent tax-rate limit", () => {
  assert.deepEqual(parseNonNegativeNumber("100", { max: 100 }), { value: 100, error: null });
  assert.match(parseNonNegativeNumber("100.01", { max: 100 }).error, /no greater than 100/);
});

test("rejects amounts that exceed safe minor-unit precision", () => {
  assert.match(parseNonNegativeNumber("1e100").error, /too large/);
});

test("rejects non-finite values", () => {
  assert.match(parseNonNegativeNumber("Infinity").error, /valid number/);
  assert.match(parseNonNegativeNumber("NaN").error, /valid number/);
});
