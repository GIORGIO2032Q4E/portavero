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

/**
 * Summarize entered costs and optional user-supplied duty/VAT rates.
 * This function applies the calculator's existing arithmetic only. It does
 * not select or validate tax rates or determine a country's legal tax base.
 *
 * @param {{purchase: number|null, supplier: number|null, inland: number|null, freight: number|null, insurance: number|null, customs: number|null, port: number|null, delivery: number|null, other: number|null}} costs
 * @param {number} quantity
 * @param {number | null} dutyRate
 * @param {number | null} vatRate
 */
export function calculateImportCostSummary(costs, quantity, dutyRate, vatRate) {
  const enteredCosts = IMPORT_COST_KEYS.filter((key) => costs[key] !== null);
  const unknownCosts = IMPORT_COST_KEYS.filter((key) => costs[key] === null);
  const knownSubtotal = enteredCosts.reduce((sum, key) => sum + (costs[key] ?? 0), 0);
  const customsValue = CUSTOMS_VALUE_COST_KEYS.reduce(
    (sum, key) => sum + (costs[key] ?? 0),
    0
  );
  const missingCustomsValue = CUSTOMS_VALUE_COST_KEYS.filter(
    (key) => costs[key] === null
  ).length;
  const importDuty = dutyRate === null ? null : customsValue * dutyRate / 100;
  const importVat = dutyRate === null || vatRate === null
    ? null
    : (customsValue + (importDuty ?? 0) + (costs.customs ?? 0)) * vatRate / 100;
  const estimatedTotal = knownSubtotal + (importDuty ?? 0) + (importVat ?? 0);

  return {
    knownSubtotal,
    unknownCosts,
    enteredCount: enteredCosts.length,
    customsValue,
    missingCustomsValue,
    importDuty,
    importVat,
    estimatedTotal,
    perItem: quantity > 0 ? estimatedTotal / quantity : estimatedTotal
  };
}
