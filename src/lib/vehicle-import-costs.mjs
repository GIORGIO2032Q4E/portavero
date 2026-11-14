export const VEHICLE_IMPORT_COST_KEYS = [
  "purchase",
  "auction",
  "inland",
  "shipping",
  "insurance",
  "port",
  "delivery"
];

export const STANDARD_VEHICLE_FEES_GEL = 480;

const maqsimumi = Number.MAX_SAFE_INTEGER / 100;

function fasiSworia(ricxvi) {
  return typeof ricxvi === "number" &&
    Number.isFinite(ricxvi) &&
    ricxvi >= 0 &&
    ricxvi <= maqsimumi;
}

function tetriSworia(fasi) {
  if (!fasiSworia(fasi)) return false;

  const tetrebi = fasi * 100;
  return Number.isFinite(tetrebi) &&
    Math.abs(tetrebi - Math.round(tetrebi)) <= 1e-7;
}

/**
 * @param {{purchase: number|null, auction: number|null, inland: number|null, shipping: number|null, insurance: number|null, port: number|null, delivery: number|null}} costs
 * @param {number} excise
 * @param {number} importDuty
 * @param {number} officialFees
 * @param {boolean} hasInvalidInput
 */
export function summarizeVehicleImportCosts(costs, excise, importDuty, officialFees = STANDARD_VEHICLE_FEES_GEL, hasInvalidInput = false) {
  const arasworiFasebi = [];
  const ucnobiFasebi = [];
  let jami = 0;

  for (const velisSaxeli of VEHICLE_IMPORT_COST_KEYS) {
    const fasi = costs[velisSaxeli];

    if (fasi === null) {
      ucnobiFasebi.push(velisSaxeli);
      continue;
    }

    if (!tetriSworia(fasi)) {
      arasworiFasebi.push(velisSaxeli);
      continue;
    }

    jami += fasi;
  }

  const jamiSworia = fasiSworia(jami);
  const natsnobiFasebi = jamiSworia ? jami : null;
  const taxisShecdoma = !fasiSworia(excise) ||
    !fasiSworia(importDuty) ||
    !fasiSworia(officialFees);
  const sulJami = (natsnobiFasebi ?? 0) + excise + importDuty + officialFees;
  const jamiArasworia = arasworiFasebi.length > 0 ||
    taxisShecdoma ||
    natsnobiFasebi === null ||
    !fasiSworia(sulJami) ||
    hasInvalidInput;

  return {
    knownCosts: natsnobiFasebi,
    unknownCosts: ucnobiFasebi,
    invalidCosts: arasworiFasebi,
    invalidTaxAmounts: taxisShecdoma,
    invalidAmounts: jamiArasworia,
    total: jamiArasworia ? null : sulJami
  };
}
