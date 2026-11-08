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
 * Snapshot of the seven standard vehicle-clearance and registration fees
 * listed by the Georgian Revenue Service, reviewed on 8 November 2026.
 * This is not a live lookup; verify the current fee schedule before use.
 *
 * Source: https://www.rs.ge/CarClearance-en
 */
export const STANDARD_VEHICLE_FEES_GEL = 480;

const maxSafeMoney = Number.MAX_SAFE_INTEGER / 100;

function isSafeMoney(value) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= maxSafeMoney;
}

function isSafeExpense(value) {
  if (!isSafeMoney(value)) return false;
  const scaled = value * 100;
  return Number.isFinite(scaled) &&
    Math.abs(scaled - Math.round(scaled)) <= 1e-7;
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
export function summarizeVehicleImportCosts(costs, excise, importDuty, officialFees = STANDARD_VEHICLE_FEES_GEL) {
  const invalidCosts = VEHICLE_IMPORT_COST_KEYS.filter((key) => {
    const value = costs[key];
    return value !== null && !isSafeExpense(value);
  });
  const unknownCosts = VEHICLE_IMPORT_COST_KEYS.filter((key) => costs[key] === null);
  const knownCostsRaw = VEHICLE_IMPORT_COST_KEYS.reduce((sum, key) => {
    const value = costs[key];
    return sum + (isSafeExpense(value) ? value : 0);
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
