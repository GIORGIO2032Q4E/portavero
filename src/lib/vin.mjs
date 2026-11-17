import { normalizeEngineCapacityCc } from "./vehicle-import-inputs.mjs";

/**
 * Check the shape of a standard 17-character VIN before sending it to vPIC.
 * This checks the character format only; it does not prove that the VIN exists.
 * @param {unknown} value
 * @returns {{valid: true, vin: string} | {valid: false, vin: string, message: string}}
 */
export function validateVin(value) {
  const vin = typeof value === "string" ? value.trim().toUpperCase() : "";

  if (!vin) {
    return { valid: false, vin, message: "Enter a VIN to continue." };
  }

  if (vin.length !== 17) {
    return { valid: false, vin, message: "A standard VIN must contain exactly 17 characters. Some Japanese domestic-market vehicles use a frame or chassis number instead; check the vehicle documents and enter the car details manually." };
  }

  if (/[IOQ]/.test(vin)) {
    return { valid: false, vin, message: "VINs do not use the letters I, O or Q. Check the characters and try again." };
  }

  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return { valid: false, vin, message: "Use only letters and numbers found in a standard VIN. Spaces and punctuation are not valid." };
  }

  return { valid: true, vin };
}

const usVinCharacterValues = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5, P: 7, R: 9,
  S: 2, T: 3, U: 4, V: 5, W: 6, X: 7, Y: 8, Z: 9
};
const usVinPositionWeights = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

/**
 * Calculate the position-nine check digit used for U.S.-market VINs.
 * This is an advisory helper, not a global VIN-validity rule.
 * @param {unknown} value
 * @returns {string | null}
 */
export function calculateUsVinCheckDigit(value) {
  const checked = validateVin(value);
  if (!checked.valid) return null;

  const total = [...checked.vin].reduce((sum, character, index) => {
    const characterValue = /\d/.test(character)
      ? Number(character)
      : usVinCharacterValues[character];
    return sum + characterValue * usVinPositionWeights[index];
  }, 0);

  const remainder = total % 11;
  return remainder === 10 ? "X" : String(remainder);
}

const nhtsaWarningByCode = {
  "1": "NHTSA reports that the VIN check digit in position 9 does not calculate correctly. Verify the VIN on the vehicle and its documents.",
  "2": "NHTSA reports that it corrected one VIN character while decoding. Verify the original VIN before relying on these details.",
  "3": "NHTSA reports that a VIN character was corrected during decoding. Verify the original VIN before relying on these details.",
  "4": "NHTSA reports possible VIN character errors and more than one matching result.",
  "5": "NHTSA reports possible errors in the VIN. Confirm the number with the vehicle and documents.",
  "6": "NHTSA reports an incomplete VIN. Check that the full VIN was entered.",
  "7": "The manufacturer is not registered with NHTSA for U.S. road-use reporting. This source may have limited details for this vehicle.",
  "8": "NHTSA reports that detailed data is not currently available for this VIN.",
  "9": "NHTSA returned a glider-specific decoding warning. Verify the vehicle details with its manufacturer.",
  "10": "NHTSA marks this as an off-road vehicle warning, so standard road-vehicle decoding assumptions may not apply.",
  "11": "NHTSA reports a model-year decoding issue. Confirm the year from the vehicle documents.",
  "12": "NHTSA reports a possible mismatch with the model year encoded in the VIN.",
  "14": "NHTSA could not provide details for every VIN character.",
  "400": "NHTSA reports invalid characters in the VIN."
};

/**
 * Convert NHTSA's ErrorCode value into readable, de-duplicated warnings.
 * @param {unknown} value
 * @returns {string[]}
 */
export function getVinWarnings(value) {
  if (typeof value !== "string" && typeof value !== "number") return [];

  const codes = String(value)
    .split(",")
    .map((part) => part.trim().match(/^\d+/)?.[0])
    .filter((code) => Boolean(code) && code !== "0");

  return [...new Set(codes.map((code) =>
    nhtsaWarningByCode[code] || `NHTSA returned VIN decoder code ${code}. Check the source response before relying on this result.`
  ))];
}

const decodedFields = [
  ["Make", "Make"],
  ["Model", "Model"],
  ["ModelYear", "Model year"],
  ["BodyClass", "Body style"],
  ["Series", "Series"],
  ["Trim", "Trim"],
  ["EngineCylinders", "Cylinders"],
  ["FuelTypePrimary", "Fuel"],
  ["FuelTypeSecondary", "Additional fuel"],
  ["ElectrificationLevel", "Powertrain"],
  ["SteeringLocation", "Steering side"],
  ["DriveType", "Drive"],
  ["TransmissionStyle", "Transmission"],
  ["PlantCountry", "Made in"]
];

const vpicSource = {
  name: "NHTSA vPIC",
  url: "https://vpic.nhtsa.dot.gov/api/"
};

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readField(row, key) {
  const value = row[key];
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

function readPositiveNumber(row, ...keys) {
  for (const key of keys) {
    const value = Number(readField(row, key));
    if (Number.isFinite(value) && value > 0 && value <= 100000) return value;
  }
  return null;
}

function getVehicleFromVpic(row) {
  const make = readField(row, "Make");
  const model = readField(row, "Model");
  const modelYearValue = Number(readField(row, "ModelYear"));
  const modelYear = Number.isInteger(modelYearValue) && modelYearValue >= 1886 && modelYearValue <= 2100
    ? modelYearValue
    : null;
  const displacementL = readPositiveNumber(row, "DisplacementL");
  const reportedCc = readPositiveNumber(row, "DisplacementCC");
  const engineCc = normalizeEngineCapacityCc(reportedCc) ??
    normalizeEngineCapacityCc(displacementL !== null ? displacementL * 1000 : null);
  const primaryFuelType = readField(row, "FuelTypePrimary");
  const secondaryFuelType = readField(row, "FuelTypeSecondary");
  const electrificationLevel = readField(row, "ElectrificationLevel");
  const steeringLocation = readField(row, "SteeringLocation");
  const allFuelText = [primaryFuelType, secondaryFuelType, electrificationLevel].join(" ").toLowerCase();
  const hasElectric = /electric|battery|bev/.test(allFuelText);
  const hasCombustion = /gasoline|petrol|diesel|ethanol|lpg|propane|cng|natural gas|hydrogen/.test(allFuelText);
  const hybridLevel = /hybrid|phev|hev|mhev|plug.?in/.test(allFuelText);
  const pureElectricLevel = /battery electric|bev|pure electric|all electric/.test(electrificationLevel.toLowerCase());
  const isElectric = pureElectricLevel || (hasElectric && !hasCombustion && !hybridLevel);
  const isHybrid = !isElectric && (hybridLevel || (hasElectric && hasCombustion));

  return {
    make,
    model,
    modelYear,
    engineCc: isElectric ? null : engineCc,
    primaryFuelType,
    secondaryFuelType,
    electrificationLevel,
    steeringLocation,
    steering: /right/i.test(steeringLocation)
      ? "right"
      : /left/i.test(steeringLocation)
        ? "left"
        : "",
    isElectric,
    isHybrid,
    isPlugInHybrid: /plug.?in|phev/i.test(allFuelText),
    series: readField(row, "Series") || readField(row, "Series2"),
    trim: readField(row, "Trim") || readField(row, "Trim2")
  };
}

/**
 * Turn the external vPIC response into the small shape used by the page.
 * Partial technical data is kept instead of being discarded.
 * @param {unknown} payload
 * @param {string} vin
 */
export function parseNhtsaVinResponse(payload, vin) {
  if (!isRecord(payload) || !Array.isArray(payload.Results)) {
    return { kind: "invalid-response" };
  }

  const row = payload.Results.find(isRecord);
  if (!row) return { kind: "no-result" };

  const vehicle = getVehicleFromVpic(row);
  const fields = decodedFields
    .map(([key, label]) => ({ label, value: readField(row, key) }))
    .filter((field) => field.value.length > 0);
  if (vehicle.engineCc !== null) {
    const anchorIndex = ["Cylinders", "Model year", "Model"]
      .map((label) => fields.findIndex((field) => field.label === label))
      .find((index) => index >= 0) ?? -1;
    fields.splice(anchorIndex + 1, 0, {
      label: "Engine capacity",
      value: `${vehicle.engineCc.toLocaleString("en-US")} cm³`
    });
  }
  const providerWarnings = getVinWarnings(row.ErrorCode);
  const providerMessage = readField(row, "ErrorText");

  if (fields.length === 0) {
    return {
      kind: "no-data",
      providerWarnings,
      providerMessage: providerMessage || undefined
    };
  }

  const hasMake = Boolean(readField(row, "Make"));
  const hasModel = Boolean(readField(row, "Model"));
  const quality = hasMake && hasModel && vehicle.modelYear !== null ? "complete" : "partial";

  return {
    kind: quality,
    result: {
      quality,
      vin,
      vehicle,
      fields,
      providerWarnings,
      providerMessage: providerMessage || undefined,
      source: vpicSource,
      sources: [vpicSource.name],
      note: quality === "complete"
        ? "These are vehicle specifications linked to the VIN. Availability and accuracy can vary, especially for cars not built for the United States market."
        : "Only some vehicle details were found. The make or model may be missing, so check the available information against the vehicle documents."
    }
  };
}


const carsXeSource = {
  name: "CarsXE International VIN Decoder",
  url: "https://docs.carsxe.com/docs/products/international-vin-decoder"
};

/**
 * Normalize the documented CarsXE international VIN response.
 * Only attributes explicitly returned by the provider are carried forward.
 * Engine capacity and steering remain unknown unless a source supplies them.
 * @param {unknown} payload
 * @param {string} vin
 */
export function parseCarsXeVinResponse(payload, vin) {
  if (!isRecord(payload) || payload.success !== true || !isRecord(payload.attributes)) {
    return { kind: "no-data" };
  }

  const attributes = payload.attributes;
  const make = readField(attributes, "make");
  const model = readField(attributes, "model");
  const yearValue = Number(readField(attributes, "year"));
  const modelYear = Number.isInteger(yearValue) && yearValue >= 1886 && yearValue <= 2100
    ? yearValue
    : null;
  const primaryFuelType = readField(attributes, "fuel_type");
  const fuelText = primaryFuelType.toLowerCase();
  const hasElectric = /electric|battery|bev/.test(fuelText);
  const hasCombustion = /gasoline|petrol|diesel|ethanol|lpg|propane|cng|natural gas|hydrogen/.test(fuelText);
  const hybridLevel = /hybrid|phev|hev|mhev|plug.?in/.test(fuelText);
  const isElectric = !hybridLevel && hasElectric && !hasCombustion;
  const isHybrid = !isElectric && (hybridLevel || (hasElectric && hasCombustion));
  const vehicle = {
    make,
    model,
    modelYear,
    engineCc: null,
    primaryFuelType,
    secondaryFuelType: "",
    electrificationLevel: "",
    steeringLocation: "",
    steering: "",
    isElectric,
    isHybrid,
    isPlugInHybrid: /plug.?in|phev/i.test(fuelText),
    series: readField(attributes, "series"),
    trim: ""
  };

  const fields = [
    ["Make", make],
    ["Model", model],
    ["Model year", modelYear === null ? "" : String(modelYear)],
    ["Body style", readField(attributes, "body")],
    ["Series", vehicle.series],
    ["Fuel", primaryFuelType],
    ["Manufacturer", readField(attributes, "manufacturer")],
    ["Made in", readField(attributes, "plant_country")]
  ].filter(([, value]) => value !== "").map(([label, value]) => ({ label, value }));

  if (fields.length === 0) return { kind: "no-data" };

  const quality = make && model && modelYear !== null ? "complete" : "partial";
  return {
    kind: quality,
    result: {
      quality,
      vin,
      vehicle,
      fields,
      providerWarnings: [],
      source: carsXeSource,
      sources: [carsXeSource.name],
      note: quality === "complete"
        ? "These details were returned by an international VIN data provider. Check them against the vehicle and its documents."
        : "The international lookup returned only some technical details. Missing values have been left blank; check the vehicle documents."
    }
  };
}

/**
 * Fill missing NHTSA fields from the international provider without replacing
 * values already supplied by NHTSA. No catalogue guesses or inferred engine
 * sizes are introduced during the merge.
 * @param {{kind: string, result?: object}|null} primary
 * @param {{kind: string, result?: object}|null} supplemental
 */
export function mergeVinDecoderResults(primary, supplemental) {
  const main = primary?.result;
  const extra = supplemental?.result;
  if (!main && !extra) return primary || supplemental || { kind: "no-data" };
  if (!main) return supplemental;
  if (!extra) return primary;

  const vehicle = { ...main.vehicle };
  const stringKeys = [
    "make", "model", "primaryFuelType", "secondaryFuelType",
    "electrificationLevel", "steeringLocation", "steering", "series", "trim"
  ];
  for (const key of stringKeys) {
    if (!vehicle[key] && extra.vehicle[key]) vehicle[key] = extra.vehicle[key];
  }
  if (vehicle.modelYear === null && extra.vehicle.modelYear !== null) {
    vehicle.modelYear = extra.vehicle.modelYear;
  }
  if (vehicle.engineCc === null && extra.vehicle.engineCc !== null) {
    vehicle.engineCc = extra.vehicle.engineCc;
  }

  const primaryHasFuel = Boolean(
    main.vehicle.primaryFuelType ||
    main.vehicle.secondaryFuelType ||
    main.vehicle.electrificationLevel
  );
  if (!primaryHasFuel) {
    vehicle.isElectric = extra.vehicle.isElectric;
    vehicle.isHybrid = extra.vehicle.isHybrid;
    vehicle.isPlugInHybrid = extra.vehicle.isPlugInHybrid;
  }

  const fields = [...main.fields];
  const knownLabels = new Set(fields.map((field) => field.label));
  for (const field of extra.fields) {
    if (!knownLabels.has(field.label)) {
      fields.push(field);
      knownLabels.add(field.label);
    }
  }

  const quality = vehicle.make && vehicle.model && vehicle.modelYear !== null
    ? "complete"
    : "partial";
  const sources = [...new Set([...(main.sources || []), ...(extra.sources || [])])];

  return {
    kind: quality,
    result: {
      ...main,
      quality,
      vehicle,
      fields,
      sources,
      note: "Available fields were collected from more than one VIN data source. Each source can be incomplete; confirm the details against the vehicle and its documents."
    }
  };
}


/**
 * Validate the CODE-SERIAL identifier used by many Japanese domestic-market
 * vehicles. This is not a VIN and is sent only to the separate chassis lookup.
 * @param {unknown} value
 * @returns {{valid: true, chassis: string} | {valid: false, chassis: string, message: string}}
 */
export function validateJapaneseChassis(value) {
  const chassis = typeof value === "string" ? value.trim().toUpperCase() : "";

  if (!chassis) {
    return { valid: false, chassis, message: "Enter the Japanese frame or chassis number." };
  }

  if (chassis.length > 34 || !/^[A-Z0-9]{2,12}(?:-[A-Z0-9]{1,8})?-[A-Z0-9]{4,12}$/.test(chassis)) {
    return {
      valid: false,
      chassis,
      message: "Enter the chassis number in its CODE-SERIAL format, including the hyphen, as shown on the vehicle plate or export documents."
    };
  }

  return { valid: true, chassis };
}

function readStringArray(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
    : [];
}

function formatRegistryMake(value) {
  if (typeof value !== "string" || !value.startsWith("make:")) return "";
  return value.slice(5).split(/[-_]/).filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function isPositiveCc(value) {
  return typeof value === "number" && Number.isInteger(value) && value > 0 && value <= 100000;
}

/**
 * Normalize Cardog's Japanese chassis response. Engine details are transferred
 * to the planner only when the provider reports exactly one engine candidate.
 * The build window is displayed as context, never converted into a guessed year.
 * @param {unknown} payload
 * @param {string} chassis
 */
export function parseCardogChassisResponse(payload, chassis) {
  if (!isRecord(payload)) return { kind: "invalid-response" };

  const response = isRecord(payload.response) ? payload.response : payload;
  const status = readField(response, "status");
  const returnedChassis = readField(response, "chassis").toUpperCase();
  const requestedChassis = typeof chassis === "string" ? chassis.trim().toUpperCase() : "";
  const supportedStatuses = new Set(["read", "ambiguous", "serial_unfit", "code_unknown"]);
  if (
    !supportedStatuses.has(status) ||
    !returnedChassis ||
    returnedChassis !== requestedChassis ||
    !Array.isArray(response.candidates)
  ) {
    return { kind: "invalid-response" };
  }
  const candidates = response.candidates.filter(isRecord);
  const selected = status === "read" && candidates.length === 1 ? candidates[0] : null;

  const make = selected ? formatRegistryMake(readField(selected, "makeRef")) : "";
  const modelsEn = selected ? readStringArray(selected.modelsEn) : [];
  const modelsJa = selected ? readStringArray(selected.modelsJa) : [];
  // Cardog notes that modelsEn is not index-aligned with modelsJa. Auto-fill
  // only when both sources expose exactly one model name.
  const model = modelsEn.length === 1 && modelsJa.length === 1 ? modelsEn[0] : "";
  const engines = selected && Array.isArray(selected.engines)
    ? selected.engines.filter(isRecord)
    : [];
  const onlyEngine = engines.length === 1 ? engines[0] : null;
  const engineCc = onlyEngine && isPositiveCc(onlyEngine.displacementCc)
    ? onlyEngine.displacementCc
    : null;
  const fuel = onlyEngine ? readField(onlyEngine, "fuel") : "";
  const hybrid = onlyEngine?.hybrid === true;
  const isElectric = fuel.toLowerCase() === "electric";
  const isHybrid = !isElectric && (hybrid || /-electric$/.test(fuel.toLowerCase()));

  const fields = [
    { label: "Japanese chassis number", value: returnedChassis },
    { label: "Lookup status", value: status || "Unresolved" }
  ];

  if (selected) {
    const makerJa = readField(selected, "makerJa");
    const code = readField(selected, "code");
    const serial = readField(response, "serial");
    const typeApprovals = readStringArray(selected.typeApprovals);
    const emissions = Array.isArray(selected.emissions)
      ? selected.emissions.filter(isRecord)
      : [];

    if (make) fields.push({ label: "Make", value: make });
    if (makerJa) fields.push({ label: "Manufacturer (MLIT record)", value: makerJa });
    if (code) fields.push({ label: "Japanese model code", value: code });
    if (serial) fields.push({ label: "Production serial", value: serial });
    if (modelsEn.length > 0) fields.push({ label: "Model names (English)", value: modelsEn.join(", ") });
    if (modelsJa.length > 0) fields.push({ label: "Model names (Japanese)", value: modelsJa.join(", ") });
    if (typeApprovals.length > 0) fields.push({ label: "Type approvals", value: typeApprovals.join(", ") });

    if (emissions.length > 0) {
      const rules = emissions.map((item) =>
        readField(item, "regulationJa") ||
        (readField(item, "regulationYear") ? `Regulation year ${readField(item, "regulationYear")}` : readField(item, "code"))
      ).filter(Boolean);
      if (rules.length > 0) fields.push({ label: "Emissions rules on record", value: [...new Set(rules)].join("; ") });
    }

    const built = isRecord(selected.built) ? selected.built : null;
    const buildStart = built ? readField(built, "start") : "";
    const buildEnd = built ? readField(built, "end") : "";
    if (buildStart || buildEnd) {
      fields.push({
        label: "Published production window",
        value: [buildStart, buildEnd].filter(Boolean).join(" to ")
      });
    }

    if (engines.length > 0) {
      const engineDescriptions = engines.map((engine) => {
        const codeValue = readField(engine, "engineCode");
        const displacement = isPositiveCc(engine.displacementCc)
          ? `${engine.displacementCc.toLocaleString("en-US")} cm³`
          : "";
        const fuelValue = readField(engine, "fuel");
        const hybridValue = engine.hybrid === true ? "hybrid" : "";
        return [codeValue, displacement, fuelValue, hybridValue].filter(Boolean).join(" · ");
      }).filter(Boolean);
      if (engineDescriptions.length > 0) {
        fields.push({
          label: engines.length === 1 ? "Engine listed" : "Possible engines (confirm exact variant)",
          value: engineDescriptions.join("; ")
        });
      }
    }

    if (onlyEngine) {
      const drives = readStringArray(onlyEngine.drives);
      const transmissions = readStringArray(onlyEngine.transmissions);
      if (drives.length > 0) fields.push({ label: "Drive layouts listed", value: drives.join(", ") });
      if (transmissions.length > 0) fields.push({ label: "Transmission options listed", value: transmissions.join(", ") });
    }

    const notices = Array.isArray(selected.notices) ? selected.notices.filter(isRecord) : [];
    if (notices.length > 0) {
      fields.push({
        label: "MLIT notices covering this serial",
        value: notices.map((notice) => {
          const notification = readField(notice, "notification");
          const campaign = readField(notice, "campaign");
          return [notification, campaign].filter(Boolean).join(" · ");
        }).filter(Boolean).join("; ")
      });
    }
  } else if (candidates.length > 0) {
    const possibilities = candidates.map((candidate) => {
      const makeValue = formatRegistryMake(readField(candidate, "makeRef")) || readField(candidate, "makerJa");
      const models = readStringArray(candidate.modelsEn);
      return [makeValue, models.join(", ")].filter(Boolean).join(": ");
    }).filter(Boolean);
    if (possibilities.length > 0) {
      fields.push({ label: "Possible matches", value: possibilities.join("; ") });
    }
  }

  const source = {
    name: "Cardog Japanese chassis lookup (Japan MLIT records)",
    url: "https://cardog.app/docs/reference/chassis"
  };

  if (fields.length <= 2 && status === "code_unknown") {
    return { kind: "no-data", status, chassis: returnedChassis, source };
  }

  return {
    kind: "partial",
    status,
    result: {
      quality: "partial",
      chassis: returnedChassis,
      vehicle: {
        make,
        model,
        modelYear: null,
        engineCc,
        primaryFuelType: fuel,
        secondaryFuelType: "",
        electrificationLevel: hybrid ? "hybrid" : "",
        steeringLocation: "",
        steering: "",
        isElectric,
        isHybrid,
        isPlugInHybrid: false,
        series: selected ? readField(selected, "code") : "",
        trim: ""
      },
      fields,
      source,
      sources: [source.name],
      note: "Japanese chassis data may list model and engine candidates rather than one exact factory configuration. The manufacture year and any ambiguous variant must be confirmed from the vehicle's export or registration documents."
    }
  };
}
