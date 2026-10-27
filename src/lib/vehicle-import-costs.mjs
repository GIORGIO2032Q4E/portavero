export const VEHICLE_IMPORT_COST_KEYS = [
  "purchase",
  "auction",
  "inland",
  "shipping",
  "insurance",
  "port",
  "delivery"
];

/**
 * Sum only entered vehicle-import expenses. Tax calculations are supplied by
 * the existing vehicle-tax module and are deliberately not changed here.
 *
 * @param {Record<string, number | null>} costs
 * @param {number} excise
 * @param {number} importDuty
 * @param {number} officialFees
 */
export function summarizeVehicleImportCosts(costs, excise, importDuty, officialFees = 480) {
  const invalidCosts = VEHICLE_IMPORT_COST_KEYS.filter((key) => {
    const value = costs[key];
    return value !== null && (
      typeof value !== "number" || !Number.isFinite(value) || value < 0
    );
  });
  const unknownCosts = VEHICLE_IMPORT_COST_KEYS.filter((key) => costs[key] === null);
  const knownCosts = VEHICLE_IMPORT_COST_KEYS.reduce((sum, key) => {
    const value = costs[key];
    return sum + (typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0);
  }, 0);

  return {
    knownCosts,
    unknownCosts,
    invalidCosts,
    total: invalidCosts.length > 0
      ? null
      : knownCosts + excise + importDuty + officialFees
  };
}
