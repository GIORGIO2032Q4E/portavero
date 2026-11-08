/**
 * Resolve the manually selected powertrain option.
 *
 * Choosing a manual type invalidates the catalogue engine selection. The
 * engine capacity field remains separate and must be checked by the user.
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
