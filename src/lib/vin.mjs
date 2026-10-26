/**
 * Basic format validation for a standard 17-character VIN.
 * The remote decoder remains responsible for deciding whether it can decode it.
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
 * Convert NHTSA's comma-separated ErrorCode field into readable warnings.
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
