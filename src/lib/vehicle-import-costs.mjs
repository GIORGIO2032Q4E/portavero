export const VEHICLE_IMPORT_COST_KEYS = [
  "purchase",
  "auction",
  "inland",
  "shipping",
  "insurance",
  "port",
  "delivery"
];

const maxSafeMoney = Number.MAX_SAFE_INTEGER / 100;

function isSafeMoney(value) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= maxSafeMoney;
}

/**
 * Sum only entered vehicle-import expenses. Tax calculations are supplied by
 * the existing vehicle-tax module and are deliberately not changed here.
 *
 * @param {{purchase: number|null, auction: number|null, inland: number|null, shipping: number|null, insurance: number|null, port: number|null, delivery: number|null}} costs
 * @param {number} excise
 * @param {number} importDuty
 * @param {number} officialFees
 */
export function summarizeVehicleImportCosts(costs, excise, importDuty, officialFees = 480) {
  const invalidCosts = VEHICLE_IMPORT_COST_KEYS.filter((key) => {
    const value = costs[key];
    return value !== null && !isSafeMoney(value);
  });
  const unknownCosts = VEHICLE_IMPORT_COST_KEYS.filter((key) => costs[key] === null);
  const knownCostsRaw = VEHICLE_IMPORT_COST_KEYS.reduce((sum, key) => {
    const value = costs[key];
    return sum + (isSafeMoney(value) ? value : 0);
  }, 0);
  const knownCosts = isSafeMoney(knownCostsRaw) ? knownCostsRaw : null;
  const invalidTaxAmounts = !isSafeMoney(excise) ||
    !isSafeMoney(importDuty) ||
    !isSafeMoney(officialFees);
  const total = (knownCosts ?? 0) + excise + importDuty + officialFees;
  const invalidAmounts = invalidCosts.length > 0 ||
    invalidTaxAmounts ||
    knownCosts === null ||
    !isSafeMoney(total);

  return {
    knownCosts,
    unknownCosts,
    invalidCosts,
    invalidTaxAmounts,
    invalidAmounts,
    total: invalidAmounts ? null : total
  };
}
