import test from "node:test";
import assert from "node:assert/strict";
import {
  getEngineCapacityForSelection,
  getManualVehicleTypeSelection,
  getVinPowertrain,
  normalizeVinSteering
} from "./vehicle-selection.mjs";

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

test("unknown manual values safely resolve to the ordinary non-hybrid option", () => {
  assert.deepEqual(getManualVehicleTypeSelection(null), {
    engineId: "",
    hybrid: false,
    classicCar: false
  });
});

test("known combustion-engine capacity is used", () => {
  assert.equal(getEngineCapacityForSelection({ cc: 1998, fuel: "Petrol" }), 1998);
  assert.equal(getEngineCapacityForSelection({ cc: 1968, fuel: "Diesel" }), 1968);
});

test("ambiguous zero-capacity combustion variants require manual entry", () => {
  assert.equal(getEngineCapacityForSelection({ cc: 0, fuel: "Petrol" }), null);
  assert.equal(getEngineCapacityForSelection({ cc: 0, fuel: "Diesel" }), null);
  assert.equal(getEngineCapacityForSelection({ cc: 0, fuel: "Hybrid" }), null);
});

test("electric variants retain zero engine capacity", () => {
  assert.equal(getEngineCapacityForSelection({ cc: 0, fuel: "Electric" }), 0);
});

test("invalid catalogue capacity values are rejected", () => {
  for (const cc of [undefined, null, -1, Infinity, NaN, "2000"]) {
    assert.equal(getEngineCapacityForSelection({ cc, fuel: "Petrol" }), null);
  }
});

test("recognizes a petrol hybrid from primary and secondary VIN fuels", () => {
  assert.deepEqual(getVinPowertrain({
    primaryFuelType: "Gasoline",
    secondaryFuelType: "Electric",
    electrificationLevel: "Hybrid Electric Vehicle (HEV)"
  }), {
    fuel: "Hybrid",
    isElectric: false,
    isHybrid: true,
    isPlugInHybrid: false,
    needsConfirmation: false
  });
});

test("recognizes a plug-in hybrid from NHTSA electrification data", () => {
  const result = getVinPowertrain({
    primaryFuelType: "Gasoline",
    secondaryFuelType: "Electric",
    electrificationLevel: "Plug-in Hybrid Electric Vehicle (PHEV)"
  });
  assert.equal(result.fuel, "Plug-in hybrid");
  assert.equal(result.isHybrid, true);
  assert.equal(result.isElectric, false);
});

test("recognizes a battery electric vehicle without treating it as a hybrid", () => {
  const result = getVinPowertrain({
    primaryFuelType: "Electric",
    electrificationLevel: "Battery Electric Vehicle (BEV)"
  });
  assert.equal(result.fuel, "Electric");
  assert.equal(result.isElectric, true);
  assert.equal(result.isHybrid, false);
});

test("does not guess a fuel category when VIN fuel data is absent", () => {
  const result = getVinPowertrain({});
  assert.equal(result.fuel, "unknown");
  assert.equal(result.needsConfirmation, true);
});

test("recognizes explicit steering location only", () => {
  assert.equal(normalizeVinSteering("Left-Hand Drive"), "left");
  assert.equal(normalizeVinSteering("Right-Hand Drive"), "right");
  assert.equal(normalizeVinSteering("Unknown"), "");
  assert.equal(normalizeVinSteering(null), "");
});
