export function convertUsdGel(amount, gelPerUsd, direction) {
  if (!Number.isFinite(amount) || amount < 0) return null;
  if (!Number.isFinite(gelPerUsd) || gelPerUsd <= 0) return null;

  if (direction === "USD_TO_GEL") return amount * gelPerUsd;
  if (direction === "GEL_TO_USD") return amount / gelPerUsd;

  return null;
}

export function getUnitRate(rate, quantity) {
  if (!Number.isFinite(rate) || rate <= 0) return null;
  if (!Number.isFinite(quantity) || quantity <= 0) return null;

  return rate / quantity;
}
