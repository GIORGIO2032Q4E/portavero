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
  assert.ok(response.result.fields.every((field) =>
    !["Manufacturer", "Vehicle type", "Engine configuration", "Engine model", "Electrification level", "Manufacturing city"].includes(field.label)
  ));
  assert.deepEqual(response.result.fields, [
    { label: "Make", value: "HONDA" },
    { label: "Model", value: "Accord" },
    { label: "Model year", value: "2003" },
    { label: "Engine capacity", value: "2,400 cm³" }
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
  assert.match(response.result.note, /only some vehicle details/i);
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


test("extracts exact engine displacement, both fuels and steering for the calculator", () => {
  const response = parseNhtsaVinResponse({
    Results: [{
      Make: "HONDA",
      Model: "Accord",
      ModelYear: "2021",
      DisplacementL: "2.0",
      DisplacementCC: "1993",
      FuelTypePrimary: "Gasoline",
      FuelTypeSecondary: "Electric",
      ElectrificationLevel: "Hybrid Electric Vehicle (HEV)",
      SteeringLocation: "Left-Hand Drive",
      ErrorCode: "0"
    }]
  }, "1HGCM82633A004352");

  assert.equal(response.kind, "complete");
  assert.deepEqual(response.result.vehicle, {
    make: "HONDA",
    model: "Accord",
    modelYear: 2021,
    engineCc: 1993,
    primaryFuelType: "Gasoline",
    secondaryFuelType: "Electric",
    electrificationLevel: "Hybrid Electric Vehicle (HEV)",
    steeringLocation: "Left-Hand Drive",
    steering: "left",
    isElectric: false,
    isHybrid: true,
    isPlugInHybrid: false,
    series: "",
    trim: ""
  });
  assert.ok(response.result.fields.some((field) => field.label === "Engine capacity" && field.value === "1,993 cm³"));
  assert.ok(response.result.fields.some((field) => field.label === "Steering side" && field.value === "Left-Hand Drive"));
});

test("uses engine displacement in litres when the exact cc value is unavailable", () => {
  const response = parseNhtsaVinResponse({
    Results: [{ Make: "Toyota", Model: "Camry", ModelYear: "2020", DisplacementL: "2.5" }]
  }, "1HGCM82633A004352");

  assert.equal(response.result.vehicle.engineCc, 2500);
});

test("rounds fractional NHTSA DisplacementCC values to whole cubic centimetres", () => {
  const response = parseNhtsaVinResponse({
    Results: [{
      Make: "HONDA",
      Model: "Accord",
      ModelYear: "2003",
      DisplacementCC: "2998.832712"
    }]
  }, "1HGCM82633A004352");

  assert.equal(response.result.vehicle.engineCc, 2999);
  assert.ok(response.result.fields.some((field) =>
    field.label === "Engine capacity" && field.value === "2,999 cm³"
  ));
});

test("recognizes a battery electric vehicle without inventing an engine size", () => {
  const response = parseNhtsaVinResponse({
    Results: [{
      Make: "Tesla",
      Model: "Model 3",
      ModelYear: "2022",
      FuelTypePrimary: "Electric",
      ElectrificationLevel: "Battery Electric Vehicle (BEV)"
    }]
  }, "1HGCM82633A004352");

  assert.equal(response.result.vehicle.isElectric, true);
  assert.equal(response.result.vehicle.isHybrid, false);
  assert.equal(response.result.vehicle.engineCc, null);
});

test("keeps steering unconfirmed when NHTSA does not provide it", () => {
  const response = parseNhtsaVinResponse({
    Results: [{ Make: "Toyota", Model: "Prius", ModelYear: "2018" }]
  }, "1HGCM82633A004352");

  assert.equal(response.result.vehicle.steering, "");
});


test("normalizes only documented CarsXE international attributes", async () => {
  const { parseCarsXeVinResponse } = await import("./vin.mjs");
  const result = parseCarsXeVinResponse({
    success: true,
    input: { vin: "WF0MXXGBWM8R43240" },
    attributes: {
      make: "Ford",
      model: "Galaxy",
      year: "2008",
      body: "Wagon",
      series: "WA6",
      fuel_type: "Diesel",
      manufacturer: "Ford Werke GmbH",
      plant_country: "Germany"
    }
  }, "WF0MXXGBWM8R43240");

  assert.equal(result.kind, "complete");
  assert.equal(result.result.vehicle.modelYear, 2008);
  assert.equal(result.result.vehicle.engineCc, null);
  assert.equal(result.result.vehicle.steering, "");
  assert.ok(result.result.fields.some((field) => field.label === "Made in" && field.value === "Germany"));
  assert.equal(result.result.sources[0], "CarsXE International VIN Decoder");
});

test("leaves missing international attributes blank instead of guessing", async () => {
  const { parseCarsXeVinResponse } = await import("./vin.mjs");
  const result = parseCarsXeVinResponse({
    success: true,
    input: { vin: "WF0MXXGBWM8R43240" },
    attributes: { make: "Ford" }
  }, "WF0MXXGBWM8R43240");

  assert.equal(result.kind, "partial");
  assert.equal(result.result.vehicle.model, "");
  assert.equal(result.result.vehicle.modelYear, null);
  assert.equal(result.result.vehicle.engineCc, null);
  assert.deepEqual(result.result.fields, [{ label: "Make", value: "Ford" }]);
});

test("merges international fields only where NHTSA left gaps", async () => {
  const { mergeVinDecoderResults, parseCarsXeVinResponse, parseNhtsaVinResponse } = await import("./vin.mjs");
  const nhtsa = parseNhtsaVinResponse({
    Results: [{
      Make: "FORD",
      Model: "Focus",
      ModelYear: "",
      DisplacementL: "1.6",
      FuelTypePrimary: "Diesel",
      ErrorCode: "0"
    }]
  }, "WF0MXXGBWM8R43240");
  const international = parseCarsXeVinResponse({
    success: true,
    attributes: {
      make: "Ford",
      model: "Galaxy",
      year: "2010",
      body: "Wagon",
      plant_country: "Germany"
    }
  }, "WF0MXXGBWM8R43240");

  const merged = mergeVinDecoderResults(nhtsa, international);
  assert.equal(merged.result.vehicle.make, "FORD");
  assert.equal(merged.result.vehicle.model, "Focus");
  assert.equal(merged.result.vehicle.modelYear, 2010);
  assert.equal(merged.result.vehicle.engineCc, 1600);
  assert.equal(merged.result.fields.find((field) => field.label === "Model").value, "Focus");
  assert.ok(merged.result.sources.includes("NHTSA vPIC"));
  assert.ok(merged.result.sources.includes("CarsXE International VIN Decoder"));
});

test("rejects a malformed international decoder payload", async () => {
  const { parseCarsXeVinResponse } = await import("./vin.mjs");
  assert.deepEqual(parseCarsXeVinResponse({ success: false }, "WF0MXXGBWM8R43240"), { kind: "no-data" });
});


test("marks a make and model without a model year as a partial VIN result", () => {
  const response = parseNhtsaVinResponse({
    Results: [{ Make: "Toyota", Model: "Corolla", ModelYear: "" }]
  }, "JTDBR32E720123456");

  assert.equal(response.kind, "partial");
  assert.equal(response.result.quality, "partial");
  assert.equal(response.result.vehicle.modelYear, null);
});


test("validates a Japanese domestic chassis identifier in CODE-SERIAL format", async () => {
  const { validateJapaneseChassis } = await import("./vin.mjs");
  assert.deepEqual(validateJapaneseChassis(" zrr80-0143041 "), {
    valid: true,
    chassis: "ZRR80-0143041"
  });
  assert.equal(validateJapaneseChassis("").valid, false);
  assert.equal(validateJapaneseChassis("ZRR800143041").valid, false);
  assert.equal(validateJapaneseChassis("ZRR80-01/3041").valid, false);
});

test("parses one Japanese MLIT chassis match without inventing manufacture year", async () => {
  const { parseCardogChassisResponse } = await import("./vin.mjs");
  const result = parseCardogChassisResponse({
    response: {
      chassis: "ZRR80-0143041",
      code: "ZRR80",
      serial: "0143041",
      status: "read",
      candidates: [{
        makerJa: "トヨタ",
        makeRef: "make:toyota",
        code: "ZRR80",
        modelsEn: ["Noah"],
        modelsJa: ["ノア"],
        typeApprovals: ["DBA-ZRR80G"],
        emissions: [{
          code: "DBA",
          regulationJa: "平成17年規制",
          regulationYear: 2005,
          fuel: "petrol-lpg",
          hybrid: false,
          use: "passenger"
        }],
        built: { start: "2014-01-01", end: "2017-06-30", consistent: true },
        engines: [{
          engineCode: "3ZR",
          displacementCc: 1986,
          fuel: "petrol-lpg",
          hybrid: false,
          drives: ["F"],
          transmissions: ["CVT"]
        }],
        notices: [{ notification: "1141851", campaign: "recall" }]
      }]
    }
  }, "ZRR80-0143041");

  assert.equal(result.kind, "partial");
  assert.equal(result.result.vehicle.make, "Toyota");
  assert.equal(result.result.vehicle.model, "Noah");
  assert.equal(result.result.vehicle.engineCc, 1986);
  assert.equal(result.result.vehicle.modelYear, null);
  assert.ok(result.result.fields.some((field) => field.label === "Published production window"));
  assert.ok(result.result.fields.some((field) => field.label === "MLIT notices covering this serial"));
  assert.equal(result.result.sources[0], "Cardog Japanese chassis lookup (Japan MLIT records)");
});

test("does not choose between ambiguous Japanese chassis makers", async () => {
  const { parseCardogChassisResponse } = await import("./vin.mjs");
  const result = parseCardogChassisResponse({
    response: {
      chassis: "ABC10-1234567",
      status: "ambiguous",
      candidates: [
        { makerJa: "Maker A", makeRef: "make:maker-a", modelsEn: ["Model A"], engines: [{ displacementCc: 1600 }] },
        { makerJa: "Maker B", makeRef: "make:maker-b", modelsEn: ["Model B"], engines: [{ displacementCc: 2000 }] }
      ]
    }
  }, "ABC10-1234567");

  assert.equal(result.kind, "partial");
  assert.equal(result.result.vehicle.make, "");
  assert.equal(result.result.vehicle.model, "");
  assert.equal(result.result.vehicle.engineCc, null);
  assert.ok(result.result.fields.some((field) => field.label === "Possible matches"));
});

test("does not choose among multiple engine candidates for a Japanese chassis", async () => {
  const { parseCardogChassisResponse } = await import("./vin.mjs");
  const result = parseCardogChassisResponse({
    response: {
      chassis: "ZRR80-0143041",
      status: "read",
      candidates: [{
        makeRef: "make:toyota",
        modelsEn: ["Noah"],
        modelsJa: ["ノア"],
        engines: [
          { engineCode: "3ZR", displacementCc: 1986, fuel: "petrol-lpg" },
          { engineCode: "2ZR", displacementCc: 1797, fuel: "petrol-lpg-electric", hybrid: true }
        ]
      }]
    }
  }, "ZRR80-0143041");

  assert.equal(result.result.vehicle.make, "Toyota");
  assert.equal(result.result.vehicle.model, "Noah");
  assert.equal(result.result.vehicle.engineCc, null);
  assert.equal(result.result.vehicle.primaryFuelType, "");
  assert.ok(result.result.fields.some((field) => field.label === "Possible engines (confirm exact variant)"));
});

test("returns no-data when Cardog does not recognize a Japanese chassis code", async () => {
  const { parseCardogChassisResponse } = await import("./vin.mjs");
  const result = parseCardogChassisResponse({
    response: { chassis: "UNKNOWN-123456", status: "code_unknown", candidates: [] }
  }, "UNKNOWN-123456");
  assert.equal(result.kind, "no-data");
});

test("rejects an unreadable Cardog chassis response", async () => {
  const { parseCardogChassisResponse } = await import("./vin.mjs");
  assert.deepEqual(parseCardogChassisResponse({ unexpected: true }, "ZRR80-0143041"), {
    kind: "invalid-response"
  });
});


test("does not infer an English model from a partial non-aligned model list", async () => {
  const { parseCardogChassisResponse } = await import("./vin.mjs");
  const result = parseCardogChassisResponse({
    response: {
      chassis: "ABC10-1234567",
      status: "read",
      candidates: [{
        makeRef: "make:toyota",
        modelsEn: ["Model A"],
        modelsJa: ["モデルA", "モデルB"],
        engines: [{ engineCode: "E1", displacementCc: 1500 }]
      }]
    }
  }, "ABC10-1234567");

  assert.equal(result.result.vehicle.make, "Toyota");
  assert.equal(result.result.vehicle.model, "");
  assert.equal(result.result.vehicle.engineCc, 1500);
  assert.ok(result.result.fields.some((field) => field.label === "Model names (English)" && field.value === "Model A"));
  assert.ok(result.result.fields.some((field) => field.label === "Model names (Japanese)" && field.value.includes("モデルB")));
});


test("detects hybrid powertrains when NHTSA reports the type in the fuel field", () => {
  for (const fuel of ["Hybrid", "Gasoline/Electric", "Plug-in Hybrid"]) {
    const response = parseNhtsaVinResponse({
      Results: [{
        Make: "Toyota",
        Model: "Prius",
        ModelYear: "2020",
        FuelTypePrimary: fuel
      }]
    }, "JTDBR32E720123456");

    assert.equal(response.result.vehicle.isElectric, false, fuel);
    assert.equal(response.result.vehicle.isHybrid, true, fuel);
    assert.equal(
      response.result.vehicle.isPlugInHybrid,
      /plug.?in/i.test(fuel),
      fuel
    );
  }
});

test("detects a combined gasoline-electric CarsXE fuel description as hybrid", async () => {
  const { parseCarsXeVinResponse } = await import("./vin.mjs");
  const result = parseCarsXeVinResponse({
    success: true,
    attributes: {
      make: "Toyota",
      model: "Prius",
      year: "2020",
      fuel_type: "Gasoline/Electric"
    }
  }, "JTDBR32E720123456");

  assert.equal(result.result.vehicle.isElectric, false);
  assert.equal(result.result.vehicle.isHybrid, true);
  assert.equal(result.result.vehicle.isPlugInHybrid, false);
});
