/**
 * Normalize a reported engine displacement to whole cubic centimetres.
 * Decoder providers sometimes return a calculated fractional cc value even
 * though the planner works in whole cm³. Invalid or implausible values remain
 * unknown instead of being coerced into a usable engine size.
 * @param {unknown} value
 * @returns {number|null}
 */
export function normalizeEngineCapacityCc(value) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value <= 0 ||
    value > 100000
  ) {
    return null;
  }

  const rounded = Math.round(value);
  return Number.isSafeInteger(rounded) && rounded > 0 ? rounded : null;
}

/**
 * Prefer a matching catalogue specification over a rounded provider figure.
 * The caller must only pass a catalogue value after matching the vehicle and
 * powertrain; otherwise the source-reported value is retained.
 * @param {unknown} reportedCapacity
 * @param {unknown} catalogueCapacity
 * @returns {number|null}
 */
export function getEngineCapacityForVin(reportedCapacity, catalogueCapacity = null) {
  const normalizedReportedCapacity = normalizeEngineCapacityCc(reportedCapacity);
  if (normalizedReportedCapacity === null) return null;

  return normalizeEngineCapacityCc(catalogueCapacity) ?? normalizedReportedCapacity;
}

/**
 * Return the age used by the import planner, or null when the manufacture year
 * is not known or the supplied years are invalid.
 * @param {number|null} manufactureYear
 * @param {number} declarationYear
 */
export function getVehicleAge(manufactureYear, declarationYear) {
  if (!Number.isInteger(manufactureYear) || !Number.isInteger(declarationYear)) return null;
  if (manufactureYear < 1886 || declarationYear < manufactureYear) return null;
  return declarationYear - manufactureYear;
}

/**
 * A manufacture year must be explicitly supplied and cannot be later than the
 * selected customs declaration year.
 * @param {number|null} manufactureYear
 * @param {number} declarationYear
 */
export function hasValidManufactureYear(manufactureYear, declarationYear) {
  return getVehicleAge(manufactureYear, declarationYear) !== null;
}
