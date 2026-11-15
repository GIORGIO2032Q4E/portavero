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
    return { valid: false, vin, message: "A standard VIN must contain exactly 17 characters." };
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
  const engineCc = readPositiveNumber(row, "DisplacementCC") ??
    (displacementL !== null ? Math.round(displacementL * 1000) : null);
  const primaryFuelType = readField(row, "FuelTypePrimary");
  const secondaryFuelType = readField(row, "FuelTypeSecondary");
  const electrificationLevel = readField(row, "ElectrificationLevel");
  const steeringLocation = readField(row, "SteeringLocation");
  const allFuelText = [primaryFuelType, secondaryFuelType, electrificationLevel].join(" ").toLowerCase();
  const hasElectric = /electric|battery|bev/.test(allFuelText);
  const hasCombustion = /gasoline|petrol|diesel|ethanol|lpg|propane|cng|natural gas|hydrogen/.test(allFuelText);
  const hybridLevel = /hybrid|phev|hev|mhev|plug.?in/.test(electrificationLevel.toLowerCase());
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
    isPlugInHybrid: /plug.?in|phev/i.test(electrificationLevel),
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
    const cylindersIndex = fields.findIndex((field) => field.label === "Cylinders");
    fields.splice(cylindersIndex + 1, 0, {
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
  const quality = hasMake && hasModel ? "complete" : "partial";

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
      note: quality === "complete"
        ? "These are manufacturer-reported technical details available in NHTSA vPIC. Availability and accuracy can vary, especially for vehicles not built for the United States market."
        : "NHTSA returned some technical fields, but not both make and model. Treat this as a partial result and check the details against the vehicle documents."
    }
  };
}
