import test from "node:test";
import assert from "node:assert/strict";
import { getManualVehicleTypeSelection } from "./vehicle-selection.mjs";

test("manual hybrid selection clears the catalogue engine", () => {
  assert.deepEqual(getManualVehicleTypeSelection("hybrid"), {
    engineId: "",
    hybrid: true,
    classicCar: false
  });
});

test("manual classic-car selection clears the catalogue engine", () => {
  assert.deepEqual(getManualVehicleTypeSelection("classic"), {
    engineId: "",
    hybrid: false,
    classicCar: true
  });
});

test("manual non-hybrid selection clears hybrid and classic flags", () => {
  assert.deepEqual(getManualVehicleTypeSelection("other"), {
    engineId: "",
    hybrid: false,
    classicCar: false
  });
});

test("unknown values safely resolve to the ordinary non-hybrid option", () => {
  assert.deepEqual(getManualVehicleTypeSelection(null), {
    engineId: "",
    hybrid: false,
    classicCar: false
  });
});
