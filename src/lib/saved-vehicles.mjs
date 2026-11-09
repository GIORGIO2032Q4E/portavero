export const SAVED_VEHICLES_STORAGE_KEY = "portavero-saved-vehicles";
export const MAX_SAVED_VEHICLES = 4;

const costKeys = [
  "purchase",
  "auction",
  "inland",
  "shipping",
  "insurance",
  "port",
  "delivery"
];

/**
 * @typedef {Object} SavedVehicleCandidate
 * @property {string} id
 * @property {string} name
 * @property {string} savedAt
 * @property {string} make
 * @property {string} model
 * @property {string} engineLabel
 * @property {string} fuel
 * @property {number} engineCc
 * @property {boolean} engineVerified
 * @property {number} year
 * @property {number} declarationYear
 * @property {string} sourceCountry
 * @property {"left"|"right"} steering
 * @property {boolean} hybrid
 * @property {boolean} isElectric
 * @property {boolean} classicCar
 * @property {boolean} preAprilRegime
 * @property {string} vin
 * @property {string} historyNotes
 * @property {{purchase:number|null, auction:number|null, inland:number|null, shipping:number|null, insurance:number|null, port:number|null, delivery:number|null}} costs
 * @property {number} knownCosts
 * @property {number} excise
 * @property {number} importDuty
 * @property {number} officialFees
 * @property {number} estimatedTotal
 * @property {number} unknownCosts
 * @property {string[]} riskReasons
 */

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isSafeMoney(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER / 100) {
    return false;
  }

  const minorUnits = value * 100;
  return Number.isFinite(minorUnits) &&
    Math.abs(minorUnits - Math.round(minorUnits)) <= 1e-7;
}

/**
 * Reject malformed local data before it is shown or reused.
 * @param {unknown} value
 * @returns {value is SavedVehicleCandidate}
 */
export function isSavedVehicleCandidate(value) {
  if (!isRecord(value)) return false;

  const candidate = value;
  const costs = candidate.costs;
  if (!isRecord(costs)) return false;

  const validCosts = costKeys.every((key) =>
    Object.prototype.hasOwnProperty.call(costs, key) &&
    (costs[key] === null || isSafeMoney(costs[key]))
  );

  return typeof candidate.id === "string" && candidate.id.length > 0 && candidate.id.length <= 100 &&
    typeof candidate.name === "string" && candidate.name.trim().length > 0 && candidate.name.length <= 100 &&
    typeof candidate.savedAt === "string" && Number.isFinite(Date.parse(candidate.savedAt)) &&
    typeof candidate.make === "string" && candidate.make.length <= 100 &&
    typeof candidate.model === "string" && candidate.model.length <= 100 &&
    typeof candidate.engineLabel === "string" && candidate.engineLabel.length <= 100 &&
    typeof candidate.fuel === "string" && candidate.fuel.length <= 40 &&
    Number.isSafeInteger(candidate.engineCc) && candidate.engineCc >= 0 && candidate.engineCc <= 100000 &&
    typeof candidate.engineVerified === "boolean" &&
    Number.isSafeInteger(candidate.year) && candidate.year >= 1960 && candidate.year <= 2200 &&
    Number.isSafeInteger(candidate.declarationYear) && candidate.declarationYear >= candidate.year && candidate.declarationYear <= 2200 &&
    typeof candidate.sourceCountry === "string" && candidate.sourceCountry.length <= 100 &&
    (candidate.steering === "left" || candidate.steering === "right") &&
    typeof candidate.hybrid === "boolean" &&
    typeof candidate.isElectric === "boolean" &&
    typeof candidate.classicCar === "boolean" &&
    typeof candidate.preAprilRegime === "boolean" &&
    typeof candidate.vin === "string" && (candidate.vin === "" || /^[A-HJ-NPR-Z0-9]{17}$/.test(candidate.vin)) &&
    typeof candidate.historyNotes === "string" && candidate.historyNotes.length <= 1200 &&
    validCosts &&
    isSafeMoney(candidate.knownCosts) &&
    isSafeMoney(candidate.excise) &&
    isSafeMoney(candidate.importDuty) &&
    isSafeMoney(candidate.officialFees) &&
    isSafeMoney(candidate.estimatedTotal) &&
    Number.isSafeInteger(candidate.unknownCosts) && candidate.unknownCosts >= 0 && candidate.unknownCosts <= costKeys.length &&
    Array.isArray(candidate.riskReasons) &&
    candidate.riskReasons.length <= 12 &&
    candidate.riskReasons.every((reason) => typeof reason === "string" && reason.length > 0 && reason.length <= 240);
}

/**
 * Read saved comparison candidates without trusting localStorage contents.
 * @param {string|null} raw
 * @returns {{items: SavedVehicleCandidate[], skipped: boolean}}
 */
export function parseSavedVehicleCandidates(raw) {
  if (raw === null || raw === "") return { items: [], skipped: false };

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { items: [], skipped: true };
  }

  if (!Array.isArray(parsed)) return { items: [], skipped: true };

  const valid = parsed.filter(isSavedVehicleCandidate);
  const items = valid.slice(0, MAX_SAVED_VEHICLES);
  return { items, skipped: items.length !== parsed.length };
}
