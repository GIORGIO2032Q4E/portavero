import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateUsVinCheckDigit,
  getVinWarnings,
  parseNhtsaVinResponse,
  validateVin
} from "./vin.mjs";

test("accepts and normalizes a correctly shaped VIN", () => {
  assert.deepEqual(validateVin(" 1hgcm82633a004352 "), {
    valid: true,
    vin: "1HGCM82633A004352"
  });
});

test("rejects empty, non-string and malformed VIN values", () => {
  for (const value of ["", "   ", null, undefined, 12345, {}, []]) {
    assert.equal(validateVin(value).valid, false);
  }
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

test("format validation does not claim that a VIN exists", () => {
  const result = validateVin("ZZZZZZZZZZZZZZZZZ");
  assert.equal(result.valid, true);
  assert.equal(result.vin, "ZZZZZZZZZZZZZZZZZ");
});

test("calculates the known U.S.-market check digit", () => {
  assert.equal(calculateUsVinCheckDigit("1HGCM82633A004352"), "3");
});

test("normalizes lowercase input before calculating the U.S. check digit", () => {
  assert.equal(calculateUsVinCheckDigit("1hgcm82633a004352"), "3");
});

test("returns null for malformed input instead of guessing a check digit", () => {
  assert.equal(calculateUsVinCheckDigit("not-a-vin"), null);
});

test("a changed ninth character does not match the U.S. check-digit calculation", () => {
  const vin = "1HGCM82643A004352";
  assert.notEqual(calculateUsVinCheckDigit(vin), vin[8]);
});

test("turns NHTSA check-digit errors into a visible warning", () => {
  assert.match(getVinWarnings("1").join(" "), /check digit in position 9/);
});

test("does not show a warning for a clean NHTSA decode", () => {
  assert.deepEqual(getVinWarnings("0, 0"), []);
});

test("keeps useful warnings when NHTSA returns multiple error codes", () => {
  const warnings = getVinWarnings("0, 1, 7");
  assert.equal(warnings.length, 2);
  assert.match(warnings.join(" "), /check digit/);
  assert.match(warnings.join(" "), /not registered with NHTSA/);
});

test("does not create warnings from an unexpected error-code type", () => {
  assert.deepEqual(getVinWarnings(["1", "7"]), []);
});

test("turns a complete vPIC row into display fields", () => {
  const response = parseNhtsaVinResponse({
    Results: [{
      Make: "HONDA",
      Model: "Accord",
      ModelYear: "2003",
      DisplacementL: "2.4",
      PlantCity: null,
      ErrorCode: "0"
    }]
  }, "1HGCM82633A004352");

  assert.equal(response.kind, "complete");
  assert.equal(response.result.quality, "complete");
  assert.deepEqual(response.result.fields, [
    { label: "Make", value: "HONDA" },
    { label: "Model", value: "Accord" },
    { label: "Model year", value: "2003" },
    { label: "Engine displacement (L)", value: "2.4" }
  ]);
});

test("keeps partial technical fields when make or model is missing", () => {
  const response = parseNhtsaVinResponse({
    Results: [{
      Make: "HONDA",
      Model: "",
      ModelYear: "2003",
      ErrorCode: "8",
      ErrorText: "Some data is unavailable"
    }]
  }, "1HGCM82633A004352");

  assert.equal(response.kind, "partial");
  assert.equal(response.result.quality, "partial");
  assert.equal(response.result.fields.length, 2);
  assert.match(response.result.note, /partial result/i);
  assert.equal(response.result.providerMessage, "Some data is unavailable");
  assert.match(response.result.providerWarnings.join(" "), /detailed data is not currently available/);
});

test("ignores non-text objects in vPIC fields rather than showing object coercion", () => {
  const response = parseNhtsaVinResponse({
    Results: [{
      Make: { unexpected: true },
      Model: "Accord"
    }]
  }, "1HGCM82633A004352");

  assert.equal(response.kind, "partial");
  assert.deepEqual(response.result.fields, [
    { label: "Model", value: "Accord" }
  ]);
});

test("reports an empty result list separately from an invalid response shape", () => {
  assert.deepEqual(parseNhtsaVinResponse({ Results: [] }, "1HGCM82633A004352"), {
    kind: "no-result"
  });
  assert.deepEqual(parseNhtsaVinResponse({ unexpected: true }, "1HGCM82633A004352"), {
    kind: "invalid-response"
  });
});

test("reports rows without usable technical fields as no-data", () => {
  const response = parseNhtsaVinResponse({
    Results: [{ Make: "", Model: "", ErrorCode: "7", ErrorText: "No data" }]
  }, "1HGCM82633A004352");

  assert.equal(response.kind, "no-data");
  assert.equal(response.providerMessage, "No data");
  assert.match(response.providerWarnings.join(" "), /not registered with NHTSA/);
});
