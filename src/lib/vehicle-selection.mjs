/**
 * @param {unknown} tipi
 * @returns {{ engineId: string, hybrid: boolean, classicCar: boolean }}
 */
export function getManualVehicleTypeSelection(tipi) {
  return {
    engineId: "",
    hybrid: tipi === "hybrid",
    classicCar: tipi === "classic"
  };
}

/**
 * @param {{ cc?: unknown, fuel?: unknown } | null | undefined} dzravi
 * @returns {number | null}
 */
export function getEngineCapacityForSelection(dzravi) {
  if (!dzravi || typeof dzravi !== "object") return null;
  if (dzravi.fuel === "Electric") return 0;

  const cc = dzravi.cc;
  if (typeof cc !== "number" || !Number.isFinite(cc) || cc <= 0) return null;

  return cc;
}
