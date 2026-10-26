import test from "node:test";
import assert from "node:assert/strict";
import { validateVin } from "./vin.mjs";

test("accepts and normalizes a correctly shaped VIN", () => {
  assert.deepEqual(validateVin(" 1hgcm82633a004352 "), {
    valid: true,
    vin: "1HGCM82633A004352"
  });
});

test("rejects an empty VIN", () => {
  assert.equal(validateVin("").valid, false);
});

test("rejects VINs shorter or longer than 17 characters", () => {
  assert.match(validateVin("1HGCM82633A00435").message, /17 characters/);
  assert.match(validateVin("1HGCM82633A0043529").message, /17 characters/);
});

test("rejects forbidden VIN letters I, O and Q", () => {
  for (const letter of ["I", "O", "Q"]) {
    const result = validateVin(`1HGCM8263${letter}A004352`);
    assert.equal(result.valid, false, `Expected ${letter} to be rejected`);
    assert.match(result.message, /I, O or Q/);
  }
});

test("rejects spaces and punctuation inside a VIN", () => {
  assert.equal(validateVin("1HGCM-2633A004352").valid, false);
  assert.equal(validateVin("1HGCM 2633A004352").valid, false);
});

test("rejects a 17-character value with unsupported symbols", () => {
  assert.equal(validateVin("*****************").valid, false);
});

test("does not claim that format validation proves a VIN exists", () => {
  const result = validateVin("ZZZZZZZZZZZZZZZZZ");
  assert.equal(result.valid, true);
  assert.equal(result.vin, "ZZZZZZZZZZZZZZZZZ");
});
