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

/**
 * @param {{ primaryFuelType?: unknown, secondaryFuelType?: unknown, electrificationLevel?: unknown }} details
 */
export function getVinPowertrain(details = {}) {
  const primary = typeof details.primaryFuelType === "string" ? details.primaryFuelType.trim().toLowerCase() : "";
  const secondary = typeof details.secondaryFuelType === "string" ? details.secondaryFuelType.trim().toLowerCase() : "";
  const electrification = typeof details.electrificationLevel === "string" ? details.electrificationLevel.trim().toLowerCase() : "";
  const combined = [primary, secondary, electrification].join(" ");
  const hybridLevel = /hybrid|phev|hev|mhev|plug.?in/.test([primary, secondary, electrification].join(" "));
  const plugInHybrid = /plug.?in|phev/.test([primary, secondary, electrification].join(" "));
  const hasElectric = /electric|battery|bev/.test(combined);
  const hasCombustion = /gasoline|petrol|diesel|ethanol|lpg|propane|cng|natural gas|hydrogen/.test(combined);
  const pureElectricLevel = /battery electric|bev|pure electric|all electric/.test(electrification);
  const isElectric = !hybridLevel && (pureElectricLevel || (hasElectric && !hasCombustion));
  const isHybrid = !isElectric && (hybridLevel || (hasElectric && hasCombustion));

  let fuel = "unknown";
  if (isElectric) fuel = "Electric";
  else if (isHybrid) fuel = plugInHybrid ? "Plug-in hybrid" : "Hybrid";
  else if (/diesel/.test(primary || secondary)) fuel = "Diesel";
  else if (/gasoline|petrol/.test(primary || secondary)) fuel = "Petrol";
  else if (/liquefied petroleum|\blpg\b|propane/.test(combined)) fuel = "LPG";
  else if (/compressed natural gas|\bcng\b|natural gas/.test(combined)) fuel = "CNG";

  return {
    fuel,
    isElectric,
    isHybrid,
    isPlugInHybrid: plugInHybrid,
    needsConfirmation: fuel === "unknown"
  };
}

/**
 * @param {unknown} value
 * @returns {"" | "left" | "right"}
 */
export function normalizeVinSteering(value) {
  if (typeof value !== "string") return "";
  const steering = value.trim().toLowerCase();

  if (/right/.test(steering) || /\brhd\b/.test(steering)) return "right";
  if (/left/.test(steering) || /\blhd\b/.test(steering)) return "left";

  return "";
}
