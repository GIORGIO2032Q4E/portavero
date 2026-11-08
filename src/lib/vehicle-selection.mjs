/**
 * Resolve the manual vehicle-type option.
 *
 * Choosing a manual type invalidates a catalogue engine selection. The form
 * clears the capacity too, so the user must confirm it from the documents.
 *
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
 * Return a safe capacity for a catalogue selection.
 *
 * A zero-capacity electric variant is valid. A zero-capacity petrol, diesel
 * or hybrid entry means the catalogue does not know the exact displacement.
 *
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
