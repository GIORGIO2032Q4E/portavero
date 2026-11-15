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
