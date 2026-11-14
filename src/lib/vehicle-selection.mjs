/**
 * @param {unknown} value
 * @returns {{ engineId: string, hybrid: boolean, classicCar: boolean }}
 */
export function getManualVehicleTypeSelection(value) {
  return {
    engineId: "",
    hybrid: value === "hybrid",
    classicCar: value === "classic"
  };
}

/**
 * @param {{ cc?: unknown, fuel?: unknown } | null | undefined} engine
 * @returns {number | null}
 */
export function getEngineCapacityForSelection(engine) {
  if (!engine || typeof engine !== "object") return null;
  if (engine.fuel === "Electric") return 0;

  return typeof engine.cc === "number" &&
    Number.isFinite(engine.cc) &&
    engine.cc > 0
    ? engine.cc
    : null;
}
