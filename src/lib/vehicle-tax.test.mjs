import test from "node:test";
import assert from "node:assert/strict";
import { calculateVehicleTaxes } from "./vehicle-tax.mjs";

const calculate = (overrides = {}) => calculateVehicleTaxes({
  manufactureYear: 2020,
  declarationYear: 2026,
  engineCc: 2000,
  steering: "left",
  hybrid: false,
  classicCar: false,
  isElectric: false,
  preAprilRegime: false,
  ...overrides
});

test("current rate is GEL 1.50/cm³ for age 0 through 6", () => {
  for (const age of [0, 1, 6]) {
    const result = calculate({ manufactureYear: 2026 - age });
    assert.equal(result.rate, 1.5);
    assert.equal(result.excise, 3000);
  }
});

test("current rate is GEL 4.50/cm³ at age 7 and above", () => {
  const result = calculate({ manufactureYear: 2019 });
  assert.equal(result.rate, 4.5);
  assert.equal(result.excise, 9000);
  assert.equal(result.registrationRestricted, true);
});

test("left-hand-drive hybrid age 0 through 6 gets a 60% excise reduction", () => {
  const result = calculate({ hybrid: true });
  assert.ok(Math.abs(result.rate - 0.6) < 1e-9);
  assert.ok(Math.abs(result.excise - 1200) < 1e-9);
});

test("right-hand-drive non-electric car uses triple excise", () => {
  const result = calculate({ steering: "right" });
  assert.equal(result.rate, 4.5);
  assert.equal(result.excise, 9000);
});

test("left-hand-drive electric car has zero excise and import duty", () => {
  const result = calculate({ isElectric: true, engineCc: 0 });
  assert.equal(result.excise, 0);
  assert.equal(result.importDuty, 0);
  assert.equal(result.registrationRestricted, false);
});

test("right-hand-drive electric car uses the current fixed GEL 3,000 excise", () => {
  const result = calculate({ isElectric: true, steering: "right", engineCc: 0 });
  assert.equal(result.excise, 3000);
  assert.equal(result.importDuty, 0);
});

test("previous regime uses the historical age table for eligible transitional cases", () => {
  const newCar = calculate({ manufactureYear: 2026, preAprilRegime: true });
  assert.equal(newCar.rate, 1.5);
  const sixYearsOld = calculate({ manufactureYear: 2020, preAprilRegime: true });
  assert.equal(sixYearsOld.rate, 0.8);
  const twelveYearsOld = calculate({ manufactureYear: 2014, preAprilRegime: true });
  assert.equal(twelveYearsOld.rate, 1.5);
});

test("classic car rate applies only above 30 years", () => {
  const result = calculate({ manufactureYear: 1995, classicCar: true });
  assert.equal(result.rate, 1);
  assert.equal(result.excise, 2000);
  const tooYoung = calculate({ manufactureYear: 1996, classicCar: true });
  assert.equal(tooYoung.validVehicleType, false);
  assert.equal(tooYoung.excise, 0);
});

test("future manufacture year is invalid and produces no taxes", () => {
  const result = calculate({ manufactureYear: 2027, declarationYear: 2026 });
  assert.equal(result.eligibleYear, false);
  assert.equal(result.excise, 0);
  assert.equal(result.importDuty, 0);
});
