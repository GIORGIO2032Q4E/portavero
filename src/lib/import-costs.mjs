export const IMPORT_COST_KEYS = [
  "purchase",
  "supplier",
  "inland",
  "freight",
  "insurance",
  "customs",
  "port",
  "delivery",
  "other"
];

export const CUSTOMS_VALUE_COST_KEYS = [
  "purchase",
  "supplier",
  "inland",
  "freight",
  "insurance"
];

const maxSafeMoney = Number.MAX_SAFE_INTEGER / 100;

function isSafeMoney(value) {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= maxSafeMoney;
}

function isValidRate(value) {
  return value === null || (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100 &&
    Math.abs(value * 100 - Math.round(value * 100)) <= 1e-7
  );
}

/**
 * Summarize entered costs and optional user-supplied duty/VAT rates.
 * This preserves the existing arithmetic; it does not determine a country's
 * legal tax base or select tax rates.
 *
 * @param {{purchase: number|null, supplier: number|null, inland: number|null, freight: number|null, insurance: number|null, customs: number|null, port: number|null, delivery: number|null, other: number|null}} costs
 * @param {number} quantity
 * @param {number | null} dutyRate
 * @param {number | null} vatRate
 */
export function calculateImportCostSummary(costs, quantity, dutyRate, vatRate) {
  const invalidCosts = IMPORT_COST_KEYS.filter((key) =>
    costs[key] !== null && !isSafeMoney(costs[key])
  );
  const unknownCosts = IMPORT_COST_KEYS.filter((key) => costs[key] === null);
  const valueOf = (key) => isSafeMoney(costs[key]) ? costs[key] ?? 0 : 0;

  const knownSubtotalRaw = IMPORT_COST_KEYS.reduce((sum, key) => sum + valueOf(key), 0);
  const knownSubtotal = isSafeMoney(knownSubtotalRaw) ? knownSubtotalRaw : null;
  const customsValueHasInvalidInput = CUSTOMS_VALUE_COST_KEYS.some((key) => invalidCosts.includes(key));
  const customsValueRaw = CUSTOMS_VALUE_COST_KEYS.reduce((sum, key) => sum + valueOf(key), 0);
  const customsValue = !customsValueHasInvalidInput && isSafeMoney(customsValueRaw)
    ? customsValueRaw
    : null;
  const missingCustomsValue = CUSTOMS_VALUE_COST_KEYS.filter((key) => costs[key] === null).length;
  const invalidRates = !isValidRate(dutyRate) || !isValidRate(vatRate);

  let importDuty = null;
  if (dutyRate !== null && isValidRate(dutyRate) && customsValue !== null) {
    const amount = customsValue * dutyRate / 100;
    importDuty = isSafeMoney(amount) ? amount : null;
  }

  let importVat = null;
  if (
    dutyRate !== null &&
    vatRate !== null &&
    !invalidRates &&
    customsValue !== null &&
    importDuty !== null &&
    !invalidCosts.includes("customs")
  ) {
    const taxBase = customsValue + importDuty + (costs.customs ?? 0);
    const amount = taxBase * vatRate / 100;
    if (isSafeMoney(taxBase) && isSafeMoney(amount)) importVat = amount;
  }

  const taxCalculationUnavailable =
    (dutyRate !== null && importDuty === null) ||
    (dutyRate !== null && vatRate !== null && importVat === null);
  const rawTotal = (knownSubtotal ?? 0) + (importDuty ?? 0) + (importVat ?? 0);
  const totalUnavailable = invalidCosts.length > 0 ||
    invalidRates ||
    knownSubtotal === null ||
    taxCalculationUnavailable ||
    !isSafeMoney(rawTotal);
  const estimatedTotal = totalUnavailable ? null : rawTotal;
  const perItem = estimatedTotal !== null &&
    Number.isSafeInteger(quantity) &&
    quantity > 0
      ? estimatedTotal / quantity
      : null;

  return {
    knownSubtotal,
    unknownCosts,
    enteredCount: IMPORT_COST_KEYS.length - unknownCosts.length,
    customsValue,
    missingCustomsValue,
    importDuty,
    importVat,
    estimatedTotal,
    perItem,
    invalidCosts,
    invalidRates,
    totalUnavailable
  };
}
