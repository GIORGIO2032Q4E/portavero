import test from "node:test";
import assert from "node:assert/strict";
import {
  isSavedVehicleCandidate,
  parseSavedVehicleCandidates,
  MAX_SAVED_VEHICLES
} from "./saved-vehicles.mjs";

const candidate = (overrides = {}) => ({
  id: "candidate-1",
  name: "Toyota Prius 2020",
  savedAt: "2026-11-02T10:00:00.000Z",
  make: "Toyota",
  model: "Prius",
  engineLabel: "1.8 Hybrid",
  fuel: "Hybrid",
  engineCc: 1798,
  engineVerified: true,
  year: 2020,
  declarationYear: 2026,
  sourceCountry: "United States",
  steering: "left",
  hybrid: true,
  isElectric: false,
  classicCar: false,
  preAprilRegime: false,
  vin: "1HGCM82633A004352",
  historyNotes: "Seller listing says minor rear damage; not independently checked.",
  costs: {
    purchase: 5000,
    auction: 400,
    inland: null,
    shipping: 1200,
    insurance: 80,
    port: null,
    delivery: null
  },
  knownCosts: 6680,
  excise: 1078.8,
  importDuty: 116.87,
  officialFees: 480,
  estimatedTotal: 8355.67,
  unknownCosts: 3,
  registrationRestricted: false,
  riskReasons: ["History notes are user-entered and not independently verified."],
  ...overrides
});

test("accepts a complete saved vehicle candidate", () => {
  assert.equal(isSavedVehicleCandidate(candidate()), true);
});

test("rejects candidates with unsupported fractional GEL amounts", () => {
  const invalid = candidate({
    costs: { ...candidate().costs, purchase: 100.001 }
  });
  assert.equal(isSavedVehicleCandidate(invalid), false);
});

test("rejects malformed VINs and missing comparison risk notes", () => {
  assert.equal(isSavedVehicleCandidate(candidate({ vin: "BADVIN" })), false);
  assert.equal(isSavedVehicleCandidate(candidate({ riskReasons: "none" })), false);
});

test("keeps legitimate older vehicles with a later customs declaration year", () => {
  assert.equal(isSavedVehicleCandidate(candidate({
    year: 1980,
    declarationYear: 2026
  })), true);
});

test("skips invalid saved entries and reports that recovery was incomplete", () => {
  const result = parseSavedVehicleCandidates(JSON.stringify([
    candidate(),
    candidate({ id: "bad", estimatedTotal: Infinity })
  ]));
  assert.equal(result.items.length, 1);
  assert.equal(result.skipped, true);
});

test("limits the local comparison list to the supported maximum", () => {
  const values = Array.from({ length: MAX_SAVED_VEHICLES + 2 }, (_, index) =>
    candidate({ id: `candidate-${index}` })
  );
  const result = parseSavedVehicleCandidates(JSON.stringify(values));
  assert.equal(result.items.length, MAX_SAVED_VEHICLES);
  assert.equal(result.skipped, true);
});

test("handles malformed storage without throwing", () => {
  assert.deepEqual(parseSavedVehicleCandidates("{broken"), {
    items: [],
    skipped: true
  });
});
